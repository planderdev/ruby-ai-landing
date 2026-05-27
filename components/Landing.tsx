import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Global } from "@/components/Global";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { ComingSoonProvider } from "@/components/ComingSoon";
import { StructuredData } from "@/components/StructuredData";
import { HtmlLang } from "@/components/HtmlLang";
import { dictionaries, type Locale } from "@/lib/i18n";

export function Landing({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];
  return (
    <ComingSoonProvider dict={dict.comingSoon}>
      <HtmlLang locale={locale} />
      <StructuredData locale={locale} />
      <main className="relative">
        <Nav dict={dict.nav} locale={locale} />
        <Hero dict={dict.hero} />
        <SocialProof dict={dict.socialProof} />
        <Features dict={dict.features} />
        <HowItWorks dict={dict.howItWorks} />
        <Global dict={dict.global} />
        <Pricing dict={dict.pricing} />
        <FAQ dict={dict.faq} />
        <CTA dict={dict.cta} />
        <Footer dict={dict.footer} locale={locale} />
      </main>
    </ComingSoonProvider>
  );
}
