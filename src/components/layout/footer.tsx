"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/common/container";
import { siteSettings } from "@/content/settings";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Star, ShieldCheck } from "lucide-react";
import { ClientPetals } from "@/components/common/client-petals";

export function Footer() {
  const { brand, contact, socials, footer } = siteSettings;

  return (
    <footer className="relative overflow-hidden border-t border-[#C6A15B]/30 bg-[#090708] pt-20 pb-12 text-[#E8D6A8]">
      {/* Ambient golden petals */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <ClientPetals petalCount={4} dustCount={2} sectionId="footer" />
      </div>

      <Container className="relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          
          {/* Brand & Identity Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link
              href="/"
              aria-label={`${brand.name} Home`}
              className="flex items-center space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
            >
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt={`${brand.name} Logo`}
                  width={140}
                  height={60}
                  className="h-12 w-auto object-contain drop-shadow-md"
                />
              </div>
            </Link>

            <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-[#E8D6A8]/75">
              {brand.description}
            </p>

            {/* Social & Review Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C6A15B]/30 bg-[#C6A15B]/10 text-[#C6A15B] transition-all hover:bg-[#C6A15B] hover:text-[#0B0B0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                aria-label="Connect on WhatsApp"
              >
                <MessageCircle className="h-4.5 w-4.5" />
              </a>

              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C6A15B]/30 bg-[#C6A15B]/10 text-[#C6A15B] transition-all hover:bg-[#C6A15B] hover:text-[#0B0B0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-4.5 w-4.5" />
              </a>

              <a
                href={socials.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-3.5 text-xs font-semibold text-[#E8D6A8] transition-all hover:bg-[#C6A15B] hover:text-[#0B0B0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                aria-label="View Google Reviews"
              >
                <Star className="h-3.5 w-3.5 fill-[#C6A15B] text-[#C6A15B]" />
                <span>Google 4.8★ Reviews</span>
              </a>
            </div>

            {/* FSSAI & Hygiene Seal */}
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#C6A15B]/20 bg-[#120B0C] p-3 text-xs text-[#E8D6A8]/80">
              <ShieldCheck className="h-4 w-4 text-[#C6A15B] shrink-0" />
              <span>100% Pure Vegetarian &bull; FSSAI Registered</span>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#C6A15B]">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {footer.quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-[#E8D6A8]/70 transition-colors hover:text-[#E8D6A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#C6A15B]">
              Celebration Services
            </h3>
            <ul className="space-y-2.5">
              {footer.servicesLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-[#E8D6A8]/70 transition-colors hover:text-[#E8D6A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Location Column (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#C6A15B]">
              Contact & Location
            </h3>
            
            <div className="space-y-3.5 text-xs sm:text-sm text-[#E8D6A8]/75">
              <p className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#C6A15B] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{contact.address.full}</span>
              </p>

              <p>
                <a
                  href={`tel:${contact.phoneRaw}`}
                  className="flex items-center gap-2.5 hover:text-[#C6A15B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                  aria-label={`Call ${brand.name} at ${contact.phoneFormatted}`}
                >
                  <Phone className="h-4 w-4 text-[#C6A15B] shrink-0" aria-hidden="true" />
                  <span>{contact.phoneFormatted}</span>
                </a>
              </p>

              <p>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2.5 hover:text-[#C6A15B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
                  aria-label={`Email ${brand.name} at ${contact.email}`}
                >
                  <Mail className="h-4 w-4 text-[#C6A15B] shrink-0" aria-hidden="true" />
                  <span>{contact.email}</span>
                </a>
              </p>

              <p className="border-t border-[#C6A15B]/15 pt-3 text-xs text-[#E8D6A8]/60">
                Operating Hours: {contact.openingHours}
              </p>
            </div>
          </div>

        </div>

        {/* Sub-Footer: Legal & Copyright */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-[#C6A15B]/20 pt-8 text-xs text-[#E8D6A8]/60 md:flex-row gap-4">
          <p>{footer.copyright}</p>

          <div className="flex flex-wrap items-center gap-6">
            {footer.legalLinks.map((legal, lIdx) => (
              <Link
                key={lIdx}
                href={legal.href}
                className="hover:text-[#E8D6A8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
              >
                {legal.title}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
