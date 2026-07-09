/**
 * Toss Payments server-side API helpers. SERVER ONLY.
 *
 * Auth: HTTP Basic with `{secretKey}:` base64-encoded (password empty).
 * Docs: https://docs.tosspayments.com/reference
 */

const TOSS_API_BASE = "https://api.tosspayments.com/v1";

export type TossPayment = {
  paymentKey: string;
  orderId: string;
  orderName: string;
  status:
    | "READY"
    | "IN_PROGRESS"
    | "WAITING_FOR_DEPOSIT"
    | "DONE"
    | "CANCELED"
    | "PARTIAL_CANCELED"
    | "ABORTED"
    | "EXPIRED";
  totalAmount: number;
  method: string | null;
  approvedAt: string | null;
  requestedAt: string;
  currency: string;
  [key: string]: unknown;
};

export type TossError = {
  code: string;
  message: string;
};

export type TossConfirmResult =
  | { ok: true; payment: TossPayment }
  | { ok: false; error: TossError; status: number };

function getSecretKey(): string {
  const key = process.env.TOSS_SECRET_KEY;
  if (!key) {
    throw new Error(
      "TOSS_SECRET_KEY is not configured. " +
        "토스페이먼츠 개발자센터 → API 키의 시크릿 키를 환경변수로 등록하세요."
    );
  }
  return key;
}

function authHeader(): string {
  return `Basic ${Buffer.from(`${getSecretKey()}:`).toString("base64")}`;
}

/**
 * 결제 승인 — 위젯에서 성공 리다이렉트로 받은 paymentKey/orderId/amount를
 * 토스에 최종 승인 요청. 이 호출이 성공해야 실제로 돈이 결제됨.
 */
export async function confirmTossPayment(params: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<TossConfirmResult> {
  const res = await fetch(`${TOSS_API_BASE}/payments/confirm`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    // 결제 승인은 절대 캐시되면 안 됨
    cache: "no-store",
  });

  const body = await res.json();
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: {
        code: typeof body?.code === "string" ? body.code : "UNKNOWN",
        message:
          typeof body?.message === "string" ? body.message : "결제 승인에 실패했습니다.",
      },
    };
  }
  return { ok: true, payment: body as TossPayment };
}
