import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/common/container";
import { siteConfig } from "@/config/site";
import { navigationConfig } from "@/config/navigation";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-ivory-300/60 pt-16 pb-12">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-heading text-2xl font-bold tracking-tight text-foreground"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-muted-foreground">
              [Luxury wedding catering and bespoke celebration dining experiences crafted with royal hospitality, authentic taste, and meticulous management.]
            </p>

            <div className="mt-6 space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gold-600 shrink-0" aria-hidden="true" />
                <span>[Main Office: New Delhi, India &bull; Serving Nationwide]</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gold-600 shrink-0" aria-hidden="true" />
                <span>{siteConfig.contact.phoneFormatted}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gold-600 shrink-0" aria-hidden="true" />
                <span>{siteConfig.contact.email}</span>
              </p>
            </div>
          </div>

          {/* Nav Columns */}
          {navigationConfig.footerNav.map((col, idx) => (
            <div key={idx} className="flex flex-col space-y-4">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sub-Footer */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>
            &copy; {currentYear} {siteConfig.legalName}. [All Rights Reserved.]
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link href="#contact" className="hover:text-foreground transition-colors">
              [Privacy Policy]
            </Link>
            <Link href="#contact" className="hover:text-foreground transition-colors">
              [Terms of Service]
            </Link>
            <Link href="#contact" className="hover:text-foreground transition-colors">
              [Food Safety & Hygiene Standards]
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
