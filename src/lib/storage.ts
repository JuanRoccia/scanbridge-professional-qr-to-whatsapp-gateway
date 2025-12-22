import { v4 as uuidv4 } from 'uuid';
export interface Card {
  id: string;
  name: string;
  company: string;
  imageData: string; // base64
  createdAt: number;
}
const STORAGE_PREFIX = 'card_';
const MAX_CARDS = 10;
export const saveCard = (data: Omit<Card, 'id' | 'createdAt'>): Card => {
  const cards = listCards();
  if (cards.length >= MAX_CARDS) {
    throw new Error(`Límite de ${MAX_CARDS} tarjetas alcanzado. Borra una para continuar.`);
  }
  const newCard: Card = {
    ...data,
    id: uuidv4(),
    createdAt: Date.now(),
  };
  localStorage.setItem(`${STORAGE_PREFIX}${newCard.id}`, JSON.stringify(newCard));
  return newCard;
};
export const getCard = (id: string): Card | null => {
  const item = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
  if (!item) return null;
  try {
    return JSON.parse(item) as Card;
  } catch (e) {
    console.error("Error parsing card data", e);
    return null;
  }
};
export const listCards = (): Card[] => {
  const cards: Card[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          cards.push(JSON.parse(item));
        } catch (e) {
          console.error("Error parsing card list item", e);
        }
      }
    }
  }
  return cards.sort((a, b) => b.createdAt - a.createdAt);
};
export const deleteCard = (id: string): void => {
  localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
};
/**
 * Returns the most recently created card to be used as the primary sharing card.
 */
export const getPrimaryCard = (): Card | null => {
  const all = listCards();
  return all.length > 0 ? all[0] : null;
};