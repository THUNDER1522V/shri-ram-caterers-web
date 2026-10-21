"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { siteSettings } from "@/content/settings";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { useScroll } from "@/hooks/use-scroll";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>("hero");
  const isScrolled = useScroll(30);
  const lenis = useLenis();

  const navItems = siteSettings.navigation;

  // Active section tracker using IntersectionObserver
  React.useEffect(() => {
    const sectionIds = [
      "hero",
      "celebrations",
      "legacy",
      "cuisine",
      "live-counters",
      "gallery",
      "reviews",
      "testimonials",
      "process",
      "faq",
      "contact",
    ];

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      setActiveSection(targetId);
      lenis?.scrollTo(href, { offset: -80 });
      closeMenu();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-[#C6A15B]/30 bg-[#0B0B0B]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          : "border-b border-transparent bg-[#0B0B0B]/70 backdrop-blur-sm"
      )}
    >
      <Container>
        <div className="flex h-20 items-center justify-between">
          
          {/* Brand Logo */}
          <Link
            href="/"
            aria-label={`${siteSettings.brand.name} Homepage`}
            className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
            onClick={closeMenu}
          >
            <div className="relative flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt={`${siteSettings.brand.name} Logo`}
                width={130}
                height={58}
                className="h-11 sm:h-12 w-auto object-contain drop-shadow-md"
                priority
              />
            </div>
          </Link>

          {/* Desktop & Tablet Navigation with Luxury Active Indicator */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center space-x-1 lg:flex xl:space-x-2"
          >
            {navItems.map((item) => {
              const targetId = item.href.replace("#", "");
              const isActive = activeSection === targetId;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className={cn(
                    "relative px-3 py-1.5 font-body text-xs xl:text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-[#E8D6A8] font-semibold"
                      : "text-[#E8D6A8]/70 hover:text-[#E8D6A8]"
                  )}
                >
                  {item.title}

                  {/* Luxury Active Gold Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-x-2 -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent shadow-[0_0_8px_rgba(198,161,91,0.8)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Direct Action CTAs */}
          <div className="hidden items-center space-x-3 sm:flex">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border border-[#C6A15B]/40 bg-black/40 text-[#E8D6A8] hover:border-[#C6A15B] hover:bg-[#C6A15B]/15 text-xs xl:text-sm h-9"
            >
              <a
                href={`tel:${siteSettings.contact.phoneRaw}`}
                aria-label={`Call ${siteSettings.brand.name}`}
                className="inline-flex items-center space-x-1.5"
              >
                <Phone className="h-3.5 w-3.5 text-[#C6A15B]" aria-hidden="true" />
                <span>Call Us</span>
              </a>
            </Button>

            <Button
              asChild
              size="sm"
              className="bg-[#C6A15B] text-[#0B0B0B] font-semibold hover:bg-[#D4B06A] shadow-[0_2px_12px_rgba(198,161,91,0.3)] text-xs xl:text-sm h-9"
            >
              <a
                href={siteSettings.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Enquire on WhatsApp"
                className="inline-flex items-center space-x-1.5"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </Button>
          </div>

          {/* Mobile & Tablet Hamburger Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl p-2.5 text-[#E8D6A8] lg:hidden border border-[#C6A15B]/30 bg-black/50 hover:bg-[#C6A15B]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close main navigation" : "Open main navigation"}
          >
            {isOpen ? <X className="h-5 w-5 text-[#C6A15B]" /> : <Menu className="h-5 w-5 text-[#C6A15B]" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-[#C6A15B]/20 py-6 lg:hidden bg-[#0B0B0B]/95 backdrop-blur-xl"
            >
              <nav aria-label="Mobile Navigation" className="flex flex-col space-y-3">
                {navItems.map((item) => {
                  const targetId = item.href.replace("#", "");
                  const isActive = activeSection === targetId;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleAnchorClick(e, item.href)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg font-body text-base transition-colors",
                        isActive
                          ? "bg-[#C6A15B]/15 text-[#E8D6A8] font-semibold border-l-2 border-[#C6A15B]"
                          : "text-[#E8D6A8]/75 hover:bg-white/5 hover:text-[#E8D6A8]"
                      )}
                    >
                      <span>{item.title}</span>
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#C6A15B]" />}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-6 flex flex-col space-y-3 border-t border-[#C6A15B]/20 pt-6">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center border-[#C6A15B]/40 bg-black/40 text-[#E8D6A8] h-11"
                >
                  <a
                    href={`tel:${siteSettings.contact.phoneRaw}`}
                    aria-label={`Call ${siteSettings.brand.name}`}
                    className="inline-flex items-center space-x-2"
                  >
                    <Phone className="h-4 w-4 text-[#C6A15B]" aria-hidden="true" />
                    <span>Call {siteSettings.contact.phoneFormatted}</span>
                  </a>
                </Button>

                <Button
                  asChild
                  className="w-full justify-center bg-[#C6A15B] text-black font-semibold h-11"
                >
                  <a
                    href={siteSettings.socials.whatsapp}
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
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}

export default Navbar;
