"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { siteSettings } from "@/content/settings";
import { cn } from "@/lib/utils";

interface FloatingWhatsAppProps {
  href?: string;
  className?: string;
  label?: string;
}

export function FloatingWhatsApp({
  href = siteSettings.socials.whatsapp,
  className,
  label = "Chat with our Catering Directors",
}: FloatingWhatsAppProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Show button after initial render and slight scroll / delay
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      aria-label="WhatsApp Assistance"
      className={cn(
        "fixed bottom-6 right-6 z-40 transition-all duration-500",
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
        className
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_24px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_32px_rgba(37,211,102,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]"
      >
        {/* Subtle Pulse Ring */}
        <span
          className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none"
          aria-hidden="true"
        />

        {/* WhatsApp Icon */}
        <MessageCircle className="h-7 w-7 transition-transform group-hover:scale-105" />

        {/* Tooltip on hover for desktop */}
        <span
          role="tooltip"
          className="absolute right-16 hidden sm:block whitespace-nowrap rounded-lg bg-[#0B0B0B]/90 border border-[#C6A15B]/30 px-3 py-1.5 font-body text-xs font-medium text-[#E8D6A8] opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
        >
          {label}
        </span>
      </a>
    </aside>
  );
}
