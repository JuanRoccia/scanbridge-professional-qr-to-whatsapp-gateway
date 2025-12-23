import { Hono } from "hono";
import { Env } from './core-utils';
import { v4 as uuidv4 } from 'uuid';
interface Card {
  id: string;
  name: string;
  company: string;
  imageData: string;
  ownerId: string;
  createdAt: number;
}
// Extend Env to include KV binding
interface Bindings extends Env {
  CARDS_KV: KVNamespace;
}
export function userRoutes(app: Hono<{ Bindings: Bindings }>) {
  // Create a new card
  app.post('/api/cards', async (c) => {
    try {
      const body = await c.req.json();
      const { name, company, imageData, ownerId } = body;
      if (!imageData || !ownerId) {
        return c.json({ success: false, error: 'Missing required fields' }, 400);
      }
      // Simple size validation (roughly 1MB limit for KV values)
      if (imageData.length > 1.2 * 1024 * 1024) {
        return c.json({ success: false, error: 'Imagen demasiado grande (máximo 1MB)' }, 413);
      }
      const id = uuidv4();
      const newCard: Card = {
        id,
        name: name || 'Sin nombre',
        company: company || 'Empresa',
        imageData,
        ownerId,
        createdAt: Date.now()
      };
      await c.env.CARDS_KV.put(`card:${id}`, JSON.stringify(newCard), {
        metadata: { ownerId }
      });
      return c.json({ success: true, data: newCard });
    } catch (e) {
      console.error('POST /api/cards error:', e);
      return c.json({ success: false, error: 'Internal Server Error' }, 500);
    }
  });
  // Get a specific card
  app.get('/api/cards/:id', async (c) => {
    const id = c.req.param('id');
    const data = await c.env.CARDS_KV.get(`card:${id}`);
    if (!data) {
      return c.json({ success: false, error: 'Tarjeta no encontrada' }, 404);
    }
    return c.json({ success: true, data: JSON.parse(data) });
  });
  // List cards for an owner
  app.get('/api/cards', async (c) => {
    const ownerId = c.req.query('ownerId');
    if (!ownerId) {
      return c.json({ success: false, error: 'ownerId is required' }, 400);
    }
    // KV list doesn't filter by metadata values easily, so we prefix or fetch all
    // For this bridge, we list all card keys and filter (Small scale optimization)
    const list = await c.env.CARDS_KV.list({ prefix: 'card:' });
    const cards: Card[] = [];
    for (const key of list.keys) {
      if (key.metadata && (key.metadata as any).ownerId === ownerId) {
        const val = await c.env.CARDS_KV.get(key.name);
        if (val) cards.push(JSON.parse(val));
      }
    }
    return c.json({ 
      success: true, 
      data: cards.sort((a, b) => b.createdAt - a.createdAt) 
    });
  });
  // Delete a card
  app.delete('/api/cards/:id', async (c) => {
    const id = c.req.param('id');
    await c.env.CARDS_KV.delete(`card:${id}`);
    return c.json({ success: true });
  });
}