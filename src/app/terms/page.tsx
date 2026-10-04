import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/siteConfig";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: `Terms of Service | ${siteConfig.name}`,
  description: `Terms and conditions for booking catering and banquet services with ${siteConfig.name}.`,
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
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
          <FileText className="h-8 w-8" />
          <span className="font-heading text-sm uppercase tracking-widest">Service Agreement</span>
        </div>

        <h1 className="mt-4 font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#E8D6A8]">
          Terms of Service
        </h1>

        <p className="mt-2 text-xs text-muted-foreground">
          Last Updated: October 2026 &bull; {siteConfig.legalName}
        </p>

        <div className="mt-12 space-y-10 font-body text-base leading-relaxed text-[#DCD6CA]">
          <section className="space-y-3">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5EFE0]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing this website or engaging {siteConfig.name} for catering and event hospitality services, you agree to comply with and be bound by the terms and conditions outlined herein.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5EFE0]">
              2. Event Reservations & Booking Confirmation
            </h2>
            <p>
              All event dates, menu proposals, and guest minimums are subject to formal written confirmation and mutual agreement via an official booking contract. Inquiries initiated via WhatsApp or phone do not constitute a confirmed event hold until standard reservation procedures are fulfilled.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5EFE0]">
              3. Menu Tastings & Customization
            </h2>
            <p>
              Private tasting sessions are coordinated for shortlisted wedding and corporate events. Custom regional recipes and special dietary accommodations must be finalized within the timeframes specified in your catering agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5EFE0]">
              4. Food Safety & Hygiene Standards
            </h2>
            <p>
              {siteConfig.name} maintains strict culinary hygiene, commercial refrigeration, and food safety protocols in accordance with applicable regional health standards and pure-vegetarian preparation traditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#F5EFE0]">
              5. Governing Law & Inquiries
            </h2>
            <p>
              These terms are governed by the laws applicable in New Delhi, India. For legal inquiries or contractual clarifications, please reach out to:
            </p>
            <div className="rounded-lg border border-border bg-[#141414] p-5 text-sm space-y-1">
              <p className="font-semibold text-[#E8D6A8]">{siteConfig.legalName}</p>
              <p>Email: <a href={siteConfig.links.email} className="text-[#C6A15B] underline">{siteConfig.contact.email}</a></p>
              <p>Phone: <a href={siteConfig.links.phone} className="text-[#C6A15B] underline">{siteConfig.contact.phoneFormatted}</a></p>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
