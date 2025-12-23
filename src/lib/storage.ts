import { v4 as uuidv4 } from 'uuid';
export interface Card {
  id: string;
  name: string;
  company: string;
  imageData: string;
  ownerId?: string;
  createdAt: number;
}
const CLIENT_ID_KEY = 'sb_client_identity';
const PRIMARY_CARD_KEY = 'sb_primary_card_id';
/**
 * Ensures the browser has a persistent unique ID for linking KV records.
 */
export const getClientId = (): string => {
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
};
/**
 * Stores the ID of the card the user wants to share via bridge.
 */
export const setLocalPrimaryCardId = (id: string): void => {
  localStorage.setItem(PRIMARY_CARD_KEY, id);
};
export const getLocalPrimaryCardId = (): string | null => {
  return localStorage.getItem(PRIMARY_CARD_KEY);
};
// Deprecated local storage methods (Keeping stubs for compatibility if needed during migration)
export const listCards = (): Card[] => [];
export const getCard = (id: string): Card | null => null;
export const saveCard = (data: any): any => ({ id: 'migration' });
export const deleteCard = (id: string): void => {};
export const getPrimaryCard = (): Card | null => null;