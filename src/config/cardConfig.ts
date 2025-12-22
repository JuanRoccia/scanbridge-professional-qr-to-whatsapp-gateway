export interface CardConfig {
  name: string;
  title: string;
  company: string;
  email: string;
  website: string;
  messageTemplate: string;
}
export const cardConfig: CardConfig = {
  name: import.meta.env.VITE_CARD_NAME || "Alex Rivera",
  title: import.meta.env.VITE_CARD_TITLE || "Solutions Architect",
  company: import.meta.env.VITE_CARD_COMPANY || "ScanBridge Tech",
  email: import.meta.env.VITE_CARD_EMAIL || "hola@scanbridge.io",
  website: import.meta.env.VITE_CARD_WEBSITE || "https://scanbridge.io",
  messageTemplate: import.meta.env.VITE_CARD_MESSAGE_TEMPLATE || "¡Hola! Acabo de escanear tu QR. Aquí tienes mi tarjeta digital:\n\n*Nombre:* {name}\n*Cargo:* {title}\n*Empresa:* {company}\n*Web:* {website}\n\n¡Sigamos en contacto!",
};
export function validateCardConfig(config: CardConfig): string[] {
  const errors: string[] = [];
  if (!config.name) errors.push("Falta el nombre (VITE_CARD_NAME)");
  if (!config.title) errors.push("Falta el cargo (VITE_CARD_TITLE)");
  if (!config.company) errors.push("Falta la empresa (VITE_CARD_COMPANY)");
  if (!config.email) errors.push("Falta el email (VITE_CARD_EMAIL)");
  if (!config.website) errors.push("Falta la web (VITE_CARD_WEBSITE)");
  return errors;
}
// Dev-only check
if (import.meta.env.DEV) {
  const validationErrors = validateCardConfig(cardConfig);
  if (validationErrors.length > 0) {
    console.warn("ScanBridge Config Warning:", validationErrors.join(", "));
  }
}