import { CardConfig } from "@/config/cardConfig";
/**
 * Sanitizes a phone number by removing non-numeric characters.
 * Ensures it's in a format WhatsApp expects (digits only).
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}
/**
 * Generates a WhatsApp deep link with a pre-filled message.
 */
export function generateWhatsAppLink(phoneNumber: string, config: CardConfig): string {
  const cleanPhone = sanitizePhoneNumber(phoneNumber);
  let message = config.messageTemplate
    .replace("{name}", config.name)
    .replace("{title}", config.title)
    .replace("{company}", config.company)
    .replace("{website}", config.website);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}