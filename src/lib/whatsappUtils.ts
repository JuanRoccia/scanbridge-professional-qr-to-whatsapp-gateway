import { CardConfig } from "@/config/cardConfig";
export interface PartialCard {
  name?: string;
  company?: string;
  title?: string;
  website?: string;
  messageTemplate?: string;
}
/**
 * Sanitizes a phone number by preserving the '+' prefix
 * while removing all other non-numeric characters and spaces.
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return "";
  const trimmed = phone.trim();
  const plusPrefix = trimmed.startsWith('+') ? '+' : '';
  const digits = trimmed.replace(/\D/g, "");
  return `${plusPrefix}${digits}`;
}
/**
 * Validates if the sanitized string contains between 8 and 15 digits.
 */
export function isValidPhoneNumber(phone: string | undefined | null): boolean {
  if (!phone) return false;
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
}
/**
 * Generates a WhatsApp deep link with a pre-filled message.
 * Supports both standard CardConfig and partial Card objects.
 */
export function generateWhatsAppLink(phoneNumber: string, config: CardConfig | PartialCard): string {
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  if (!isValidPhoneNumber(cleanPhone)) {
    console.error("WhatsApp Redirection Error: Invalid phone number format", phoneNumber);
    throw new Error("Formato de número telefónico inválido.");
  }
  const template = config.messageTemplate || "¡Hola! Un gusto saludarte.";
  // Replace all placeholders using global regex
  let message = template
    .replace(/{name}/g, config.name || "Alex")
    .replace(/{title}/g, config.title || "")
    .replace(/{company}/g, config.company || "")
    .replace(/{website}/g, config.website || "");
  const encodedMessage = encodeURIComponent(message);
  const finalUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  try {
    new URL(finalUrl); // Just a safety check
    return finalUrl;
  } catch (e) {
    console.error("WhatsApp Redirection Error: Malformed URL produced", finalUrl);
    return `https://wa.me/${cleanPhone}`; // Fallback without message
  }
}