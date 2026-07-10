"use server";

import { getAnthropic, AI_MODEL } from "@/lib/ai/client";
import { buildSystemBlocks, fetchCatalog } from "@/lib/ai/system";
import { createClient } from "@/lib/supabase/server";

// ---------- Helpers ---------------------------------------------------------

type AIResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function ensureAuth(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };
  return { ok: true };
}

/**
 * Run a Claude call with prompt-caching system + JSON-schema output.
 *
 * 모든 실패 지점(API 키 누락, 카탈로그 로드, 네트워크, 파싱)을 try 안에서
 * 처리해 {ok:false}로 반환 — 액션이 throw하면 Next.js가 에러 페이지로
 * 보내버리므로 절대 밖으로 던지지 않는다.
 */
async function callAI<T>(opts: {
  userPrompt: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<AIResult<T>> {
  try {
    const client = getAnthropic();
    const catalog = await fetchCatalog();
    const response = await client.messages.create({
      model: AI_MODEL,
      max_tokens: opts.maxTokens ?? 2048,
      thinking: { type: "adaptive" },
      system: buildSystemBlocks(catalog),
      output_config: {
        format: {
          type: "json_schema",
          schema: opts.schema,
        },
      },
      messages: [{ role: "user", content: opts.userPrompt }],
    });

    // Extract first text block — output_config.format constrains it to valid JSON
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { ok: false, error: "AI가 응답을 생성하지 못했습니다." };
    }
    const parsed = JSON.parse(textBlock.text) as T;
    return { ok: true, data: parsed };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `AI 호출 실패: ${msg}` };
  }
}

// ---------- Step 1: Title suggestions ---------------------------------------

export type TitleSuggestion = { titles: string[] };

export async function suggestTitles(input: {
  industryBrief: string;
  businessName: string;
}): Promise<AIResult<TitleSuggestion>> {
  const auth = await ensureAuth();
  if (!auth.ok) return auth;

  if (!input.industryBrief?.trim() || !input.businessName?.trim()) {
    return { ok: false, error: "업종 설명과 상호명이 필요합니다." };
  }

  return callAI<TitleSuggestion>({    userPrompt: `다음 정보로 인플루언서가 클릭하고 싶어할 만한 캠페인 제목 3개를 만들어주세요.

상호명: ${input.businessName}
업종 설명: ${input.industryBrief}

각 제목은:
- 25~40자 사이
- 구체적인 제품/서비스나 혜택을 암시
- 같은 톤이 반복되지 않게 다양하게 (예: 1번은 매력 어필 / 2번은 혜택 강조 / 3번은 호기심 유발)`,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        titles: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: { type: "string" },
        },
      },
      required: ["titles"],
    },
  });
}

// ---------- Step 2: Promotion + category + channels + missions --------------

export type PromotionSuggestion = {
  promotion_type_id: string;
  category_id: string;
  channel_type_ids: string[];
  missions: { channel_type_id: string; description: string }[];
};

export async function suggestPromotionAndChannels(input: {
  industryBrief: string;
  businessName: string;
}): Promise<AIResult<PromotionSuggestion>> {
  const auth = await ensureAuth();
  if (!auth.ok) return auth;
  if (!input.industryBrief?.trim()) return { ok: false, error: "업종 설명이 필요합니다." };

  return callAI<PromotionSuggestion>({    userPrompt: `상호명: ${input.businessName}
업종 설명: ${input.industryBrief}

위 정보를 보고:
1. 가장 어울리는 promotion_type_id 1개 선택
2. 가장 어울리는 category_id 1개 선택
3. 이 업종에 가장 효과적인 channel_type_ids 2~3개 선택 (예: 인스타+블로그)
4. 선택한 각 채널마다 인플루언서가 수행할 미션 1개씩 작성 (60~150자, 채널 특성 반영)

미션 작성 시 주의:
- 각 채널의 콘텐츠 형식을 활용 (인스타→릴스/피드, 블로그→상세후기, 유튜브→영상 등)
- 해시태그·키워드·언급해야 할 핵심 포인트를 구체적으로
- 너무 많은 요구사항은 금지 (1~3개의 명확한 액션만)`,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        promotion_type_id: { type: "string" },
        category_id: { type: "string" },
        channel_type_ids: {
          type: "array",
          minItems: 1,
          maxItems: 4,
          items: { type: "string" },
        },
        missions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              channel_type_id: { type: "string" },
              description: { type: "string" },
            },
            required: ["channel_type_id", "description"],
          },
        },
      },
      required: ["promotion_type_id", "category_id", "channel_type_ids", "missions"],
    },
  });
}

// ---------- Step 4: Keywords + recruit count -------------------------------

export type RecruitSuggestion = {
  recruit_count: number;
  keywords: string[];
};

export async function suggestRecruitAndKeywords(input: {
  industryBrief: string;
  businessName: string;
}): Promise<AIResult<RecruitSuggestion>> {
  const auth = await ensureAuth();
  if (!auth.ok) return auth;
  if (!input.industryBrief?.trim()) return { ok: false, error: "업종 설명이 필요합니다." };

  return callAI<RecruitSuggestion>({    userPrompt: `상호명: ${input.businessName}
업종 설명: ${input.industryBrief}

위 정보를 보고:
1. 이 업종/캠페인 규모에 적정한 모집 인원 (recruit_count) 추천 (보통 5~30명, 고가 제품일수록 적게)
2. 콘텐츠 발행 시 포함될 키워드/해시태그 5~8개 (공백 없는 단어, # 없이)
   - 업종/제품의 본질을 나타내는 단어
   - 검색에 잡히는 트렌디한 단어 1~2개
   - 지역명이 포함되면 좋을 경우 지역 키워드 1개`,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recruit_count: { type: "integer", minimum: 1, maximum: 100 },
        keywords: {
          type: "array",
          minItems: 5,
          maxItems: 8,
          items: { type: "string" },
        },
      },
      required: ["recruit_count", "keywords"],
    },
  });
}

// ---------- Step 5: Offerings + points -------------------------------------

export type OfferingSuggestion = {
  offerings: { title: string; description: string; estimated_value: number }[];
  point_amount: number;
};

export async function suggestOfferingsAndPoints(input: {
  industryBrief: string;
  businessName: string;
}): Promise<AIResult<OfferingSuggestion>> {
  const auth = await ensureAuth();
  if (!auth.ok) return auth;
  if (!input.industryBrief?.trim()) return { ok: false, error: "업종 설명이 필요합니다." };

  return callAI<OfferingSuggestion>({    userPrompt: `상호명: ${input.businessName}
업종 설명: ${input.industryBrief}

위 정보를 보고:
1. 인플루언서에게 제공할 항목(offerings) 1~3개 추천 (제품/서비스/식사권 등)
   - 각 항목: title (간결), description (선택, 활용법·특징), estimated_value (KRW)
2. 활동 포인트 추천 (point_amount, KRW) — 업종 평균 + 제공물 가치 고려, 보통 10,000~100,000원

값은 한국 마켓의 일반 시세를 반영합니다.`,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offerings: {
          type: "array",
          minItems: 1,
          maxItems: 4,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              estimated_value: { type: "integer", minimum: 0 },
            },
            required: ["title", "description", "estimated_value"],
          },
        },
        point_amount: { type: "integer", minimum: 0 },
      },
      required: ["offerings", "point_amount"],
    },
  });
}

// ---------- Super action: AI에게 전부 맡기기 ---------------------------------

export type FullDraftSuggestion = {
  title: string;
  promotion_type_id: string;
  category_id: string;
  channel_type_ids: string[];
  missions: { channel_type_id: string; description: string }[];
  recruit_count: number;
  keywords: string[];
  offerings: { title: string; description: string; estimated_value: number }[];
  point_amount: number;
};

export async function suggestEverything(input: {
  industryBrief: string;
  businessName: string;
}): Promise<AIResult<FullDraftSuggestion>> {
  const auth = await ensureAuth();
  if (!auth.ok) return auth;
  if (!input.industryBrief?.trim() || !input.businessName?.trim()) {
    return { ok: false, error: "업종 설명과 상호명이 필요합니다." };
  }

  return callAI<FullDraftSuggestion>({    maxTokens: 4096,
    userPrompt: `상호명: ${input.businessName}
업종 설명: ${input.industryBrief}

위 정보만으로 캠페인을 처음부터 끝까지 자동으로 채워주세요.

작성 항목:
- title: 매력적인 캠페인 제목 (25~40자)
- promotion_type_id: 가장 어울리는 홍보 유형
- category_id: 가장 어울리는 카테고리
- channel_type_ids: 가장 효과적인 채널 2~3개
- missions: 선택한 채널별 미션 (각 60~150자)
- recruit_count: 적정 모집 인원
- keywords: 5~8개 핵심 키워드
- offerings: 제공 내역 1~3개 (각 title + description + estimated_value KRW)
- point_amount: 활동 포인트 (KRW)

광고주가 손대지 않아도 바로 발행 가능할 정도로 디테일을 채워주세요.`,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        promotion_type_id: { type: "string" },
        category_id: { type: "string" },
        channel_type_ids: {
          type: "array",
          minItems: 1,
          maxItems: 4,
          items: { type: "string" },
        },
        missions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              channel_type_id: { type: "string" },
              description: { type: "string" },
            },
            required: ["channel_type_id", "description"],
          },
        },
        recruit_count: { type: "integer", minimum: 1, maximum: 100 },
        keywords: {
          type: "array",
          minItems: 5,
          maxItems: 8,
          items: { type: "string" },
        },
        offerings: {
          type: "array",
          minItems: 1,
          maxItems: 4,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              estimated_value: { type: "integer", minimum: 0 },
            },
            required: ["title", "description", "estimated_value"],
          },
        },
        point_amount: { type: "integer", minimum: 0 },
      },
      required: [
        "title",
        "promotion_type_id",
        "category_id",
        "channel_type_ids",
        "missions",
        "recruit_count",
        "keywords",
        "offerings",
        "point_amount",
      ],
    },
  });
}
