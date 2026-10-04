"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { navigationConfig } from "@/config/navigation";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { useScroll } from "@/hooks/use-scroll";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const isScrolled = useScroll(40);
  const lenis = useLenis();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      lenis?.scrollTo(href, { offset: -80 });
      closeMenu();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "border-[#D4A84B] bg-[#0B0B0B]/85 backdrop-blur-md"
          : "border-transparent bg-[#0B0B0B]"
      )}
      style={{
        transitionProperty: "background-color, backdrop-filter, border-color",
      }}
    >
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Brand Identity */}
          <Link
            href="/"
            aria-label="Shri Ram Caterers Homepage"
            className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={closeMenu}
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gold/20 text-gold font-heading font-bold">
              SRC
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center space-x-8 md:flex"
          >
            {navigationConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className="font-body text-sm font-medium text-ivory/80 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden items-center space-x-3 lg:flex">
            <Button asChild variant="outline" size="sm">
              <a
                href={siteConfig.links.phone}
                aria-label={`Call ${siteConfig.name}`}
                className="inline-flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>Call Us</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-gold text-gold hover:bg-gold/10">
              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Enquire on WhatsApp"
                className="inline-flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Enquire on WhatsApp</span>
              </a>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-btn p-2 text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close main menu" : "Open main menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-border py-6 md:hidden"
          >
            <nav
              aria-label="Mobile Navigation"
              className="flex flex-col space-y-4"
            >
              {navigationConfig.mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="font-body text-base font-medium text-foreground transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col space-y-3 border-t border-border pt-6">
              <Button asChild variant="outline" className="w-full justify-center">
                <a
                  href={siteConfig.links.phone}
                  aria-label={`Call ${siteConfig.name}`}
                  className="inline-flex items-center space-x-2"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>Call Us</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-center border-gold text-gold hover:bg-gold/10">
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Enquire on WhatsApp"
                  className="inline-flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
