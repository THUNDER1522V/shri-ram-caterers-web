import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names with Tailwind CSS class conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a telephone string for clean tel: links.
 */
export function formatPhoneLink(phone: string): string {
  return phone.replace(/[^0-9+]/g, "");
}

/**
 * Encodes a message for WhatsApp direct message link.
 */
export function getWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const baseUrl = `https://wa.me/${cleanPhone}`;
  if (!message) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
