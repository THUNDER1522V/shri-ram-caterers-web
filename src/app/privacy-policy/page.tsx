import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/siteConfig";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Privacy policy and data governance practices for ${siteConfig.name}.`,
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-20 md:py-32 text-foreground">
      <Container className="max-w-4xl">
        <div className="mb-10">
          <Button asChild variant="outline" size="sm" className="gap-2 border-[#C6A15B]/40 text-[#C6A15B] hover:bg-[#C6A15B]/10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-3 text-[#C6A15B]">
          <ShieldCheck className="h-8 w-8" />
          <span className="font-heading text-sm uppercase tracking-widest">Legal & Governance</span>
        </div>

        <h1 className="mt-4 font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#E8D6A8]">
          Privacy Policy
        </h1>

        <p className="mt-2 text-xs text-muted-foreground">
          Last Updated: October 2026 &bull; {siteConfig.legalName}
        </p>

        <div className="mt-12 space-y-10 font-body text-base leading-relaxed text-[#DCD6CA]">
          <section className="space-y-3">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5EFE0]">
              1. Information We Collect
            </h2>
            <p>
              {siteConfig.name} values your privacy. We collect only the information you voluntarily provide when initiating communication with us through WhatsApp or telephone inquiries, such as your name, event date, guest capacity, and catering preferences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5EFE0]">
              2. Direct Communications & WhatsApp
            </h2>
            <p>
              Inquiries submitted through our direct WhatsApp link or phone calls are processed directly between you and our senior catering directors. We do not sell, rent, or trade your personal or event details to third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5EFE0]">
              3. Cookies and Analytics Notice
            </h2>
            <p>
              Our website is designed with a privacy-first approach. We do not currently deploy tracking cookies or third-party marketing trackers. If analytics or measurement technologies are introduced in the future, clear opt-in consent and settings will be provided.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5EFE0]">
              4. Data Retention & Security
            </h2>
            <p>
              All event specifications and consultation records are stored securely with restricted access, used strictly for coordinating catering logistics, menu sampling, and bespoke celebration planning.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5EFE0]">
              5. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or wish to modify any information previously shared, please contact us at:
            </p>
            <div className="rounded-lg border border-border bg-[#141414] p-5 text-sm space-y-1">
              <p className="font-semibold text-[#E8D6A8]">{siteConfig.legalName}</p>
              <p>{siteConfig.contact.address.street}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state} - {siteConfig.contact.address.postalCode}</p>
              <p>Email: <a href={siteConfig.links.email} className="text-[#C6A15B] underline">{siteConfig.contact.email}</a></p>
              <p>Phone: <a href={siteConfig.links.phone} className="text-[#C6A15B] underline">{siteConfig.contact.phoneFormatted}</a></p>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
