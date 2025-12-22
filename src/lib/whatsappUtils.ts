import { CardConfig } from "@/config/cardConfig";
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
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
}
/**
 * Detects the country name based on international prefixes.
 */
export function getPhoneInfo(phone: string): string {
  if (!phone) return "Desconocido";
  const clean = phone.replace(/\D/g, "");
  if (!clean) return "Desconocido";
  if (clean.startsWith('54')) return "Argentina";
  if (clean.startsWith('52')) return "M��xico";
  if (clean.startsWith('34')) return "España";
  if (clean.startsWith('1')) return "EE.UU. / Canadá";
  if (clean.startsWith('55')) return "Brasil";
  if (clean.startsWith('57')) return "Colombia";
  if (clean.startsWith('51')) return "Perú";
  if (clean.startsWith('56')) return "Chile";
  return "Internacional";
}
/**
 * Generates a WhatsApp deep link with a pre-filled message.
 */
export function generateWhatsAppLink(phoneNumber: string, config: CardConfig): string {
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  if (!isValidPhoneNumber(cleanPhone)) {
    throw new Error("Formato de número telefónico inválido.");
  }
  // Replace all placeholders using global regex
  let message = config.messageTemplate
    .replace(/{name}/g, config.name || "")
    .replace(/{title}/g, config.title || "")
    .replace(/{company}/g, config.company || "")
    .replace(/{website}/g, config.website || "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}