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

export default function Home() {
  return (
    <ComingSoonProvider>
      <main className="relative">
        <Nav />
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Global />
        <Pricing />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </ComingSoonProvider>
  );
}
