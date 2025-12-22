export interface CardConfig {
  name: string;
  title: string;
  company: string;
  email: string;
  website: string;
  messageTemplate: string;
}
export const cardConfig: CardConfig = {
  name: "Alex Rivera",
  title: "Senior Solutions Architect",
  company: "ScanBridge Tech",
  email: "alex@scanbridge.io",
  website: "https://scanbridge.io",
  messageTemplate: "Hi! I just scanned your QR code at the event. Here is my digital business card:\n\n*Name:* {name}\n*Title:* {title}\n*Company:* {company}\n*Website:* {website}\n\nLet's connect!",
};