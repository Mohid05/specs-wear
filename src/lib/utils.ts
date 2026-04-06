import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a phone number for WhatsApp's wa.me API.
 * Specifically handles Pakistan numbers (prepending 92, removing leading 0).
 */
export function formatWhatsAppNumber(phone: string): string {
  // Remove all non-digits
  let cleaned = (phone || "").replace(/\D/g, "");
  
  // If it starts with 0 (e.g. 03001234567), replace leading 0 with 92
  if (cleaned.startsWith("0")) {
    cleaned = "92" + cleaned.slice(1);
  }
  
  // If it's a 10-digit number starting with 3 (e.g. 3001234567), prepend 92
  if (cleaned.length === 10 && cleaned.startsWith("3")) {
    cleaned = "92" + cleaned;
  }
  
  return cleaned;
}
