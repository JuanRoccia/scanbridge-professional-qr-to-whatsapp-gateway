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
      // Soft limit: 10 cards per owner
      const list = await c.env.CARDS_KV.list({ prefix: 'card:' });
      let count = 0;
      for (const key of list.keys) {
        if (key.metadata && (key.metadata as any).ownerId === ownerId) {
          count++;
        }
      }
      if (count >= 10) {
        return c.json({ success: false, error: 'Límite de 10 tarjetas alcanzado' }, 403);
      }
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
  // List cards for an owner with robust pagination/scanning
  app.get('/api/cards', async (c) => {
    const ownerId = c.req.query('ownerId');
    if (!ownerId) {
      return c.json({ success: false, error: 'ownerId is required' }, 400);
    }
    const cards: Card[] = [];
    let cursor: string | undefined = undefined;
    let complete = false;
    // Scan all keys because ownerId is in metadata
    while (!complete) {
      const list: KVNamespaceListResult<unknown> = await c.env.CARDS_KV.list({ 
        prefix: 'card:',
        cursor 
      });
      for (const key of list.keys) {
        if (key.metadata && (key.metadata as any).ownerId === ownerId) {
          const val = await c.env.CARDS_KV.get(key.name);
          if (val) cards.push(JSON.parse(val));
        }
      }
      if (list.list_complete) {
        complete = true;
      } else {
        cursor = list.cursor;
      }
    }
    return c.json({
      success: true,
      data: cards.sort((a, b) => b.createdAt - a.createdAt)
    });
  });
  // Secure delete a card
  app.delete('/api/cards/:id', async (c) => {
    const id = c.req.param('id');
    const ownerId = c.req.query('ownerId');
    if (!ownerId) {
      return c.json({ success: false, error: 'No autorizado' }, 401);
    }
    // Verify ownership before delete
    const data = await c.env.CARDS_KV.get(`card:${id}`);
    if (data) {
      const card: Card = JSON.parse(data);
      if (card.ownerId !== ownerId) {
        return c.json({ success: false, error: 'No tienes permiso para eliminar esta tarjeta' }, 403);
      }
    }
    await c.env.CARDS_KV.delete(`card:${id}`);
    return c.json({ success: true });
  });
}