export { cn } from "@/lib/utils";

/**
 * Format a raw phone string into a tel: link
 */
export function formatTelLink(phoneRaw: string): string {
  return `tel:${phoneRaw.startsWith("+") ? phoneRaw : `+${phoneRaw}`}`;
}

/**
 * Generate a WhatsApp click-to-chat URL with a prefilled message
 */
export function formatWhatsAppLink(phoneRaw: string, message: string): string {
  const cleanPhone = phoneRaw.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
