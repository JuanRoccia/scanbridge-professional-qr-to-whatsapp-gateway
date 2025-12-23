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
      // Soft limit: 10 cards per owner - full scan with pagination
      console.log(`POST /api/cards: counting cards for ownerId ${ownerId}`);
      let count = 0;
      let cursor: string | undefined = undefined;
      let complete = false;
      while (!complete) {
        const list: KVNamespaceListResult<unknown> = await c.env.CARDS_KV.list({ prefix: 'card:', cursor });
        for (const key of list.keys) {
          if (key.metadata && (key.metadata as any).ownerId === ownerId) {
            count++;
          }
        }
        if (list.list_complete) {
          complete = true;
        } else {
          cursor = list.cursor;
        }
      }
      console.log(`POST /api/cards: found ${count} cards for ownerId ${ownerId}`);
      if (count >= 10) {
        return c.json({ success: false, error: 'Límite de 10 tarjetas alcanzado' }, 403);
      }
      if (imageData.length > 2097152) {
        return c.json({ success: false, error: 'Imagen demasiado grande (máximo 2MB)' }, 413);
      }
      console.log(`POST /api/cards: ownerId ${ownerId}, imageData.length ${imageData.length}, generating id`);
      let id = uuidv4();
      // Defensive UUID collision check
      let collision = true;
      let attempts = 0;
      while (collision && attempts < 5) {
        const existing = await c.env.CARDS_KV.get(`card:${id}`);
        if (!existing) {
          collision = false;
        } else {
          id = uuidv4();
          attempts++;
          console.log(`POST /api/cards: UUID collision, attempt ${attempts}, new id ${id}`);
        }
      }
      console.log(`POST /api/cards: final id ${id}`);
      const newCard: Card = {
        id,
        name: name || 'Sin nombre',
        company: company || 'Empresa',
        imageData,
        ownerId,
        createdAt: Date.now()
      };
      console.log(`POST /api/cards: putting card:${id}`);
      await c.env.CARDS_KV.put(`card:${id}`, JSON.stringify(newCard), {
        metadata: { ownerId }
      });
      console.log(`POST /api/cards: KV.put success for card:${id}`);
      
      // Verify put worked
      const verify = await c.env.CARDS_KV.get(`card:${id}`);
      if (verify) {
        console.log(`POST /api/cards: verified card:${id} exists, length ${verify.length}`);
      } else {
        console.error(`POST /api/cards: verification failed for card:${id}`);
      }
      
      return c.json({ success: true, data: newCard });
    } catch (e) {
      console.error('POST /api/cards error:', e);
      return c.json({ success: false, error: 'Internal Server Error' }, 500);
    }
  });
  // Get a specific card
  app.get('/api/cards/:id', async (c) => {
    try {
      const id = c.req.param('id');
      console.log(`GET /api/cards/${id}: fetching`);
      const data = await c.env.CARDS_KV.get(`card:${id}`);
      console.log(`GET /api/cards/${id}: KV.get result ${data ? 'found' : 'null'}`);
      if (!data) {
        return c.json({ success: false, error: 'Tarjeta no encontrada' }, 404);
      }
      return c.json({ success: true, data: JSON.parse(data) });
    } catch (e) {
      console.error(`GET /api/cards/:id error:`, e);
      return c.json({ success: false, error: 'Internal Server Error' }, 500);
    }
  });
  // List cards for an owner with robust pagination/scanning
  app.get('/api/cards', async (c) => {
    try {
      const ownerId = c.req.query('ownerId');
      console.log(`GET /api/cards: scanning for ownerId ${ownerId}`);
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
      console.log(`GET /api/cards: scan complete for ownerId ${ownerId}, found ${cards.length} cards`);
      return c.json({
        success: true,
        data: cards.sort((a, b) => b.createdAt - a.createdAt)
      });
    } catch (e) {
      console.error('GET /api/cards error:', e);
      return c.json({ success: false, error: 'Internal Server Error' }, 500);
    }
  });
  // Secure delete a card
  app.delete('/api/cards/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const ownerId = c.req.query('ownerId');
      console.log(`DELETE /api/cards/${id}: ownerId ${ownerId}`);
      if (!ownerId) {
        return c.json({ success: false, error: 'No autorizado' }, 401);
      }
      // Verify ownership before delete
      const data = await c.env.CARDS_KV.get(`card:${id}`);
      if (data) {
        const card: Card = JSON.parse(data);
        console.log(`DELETE /api/cards/${id}: ownership check ${card.ownerId === ownerId ? 'PASS' : 'FAIL'}`);
        if (card.ownerId !== ownerId) {
          return c.json({ success: false, error: 'No tienes permiso para eliminar esta tarjeta' }, 403);
        }
      } else {
        console.log(`DELETE /api/cards/${id}: card not found`);
      }
      await c.env.CARDS_KV.delete(`card:${id}`);
      console.log(`DELETE /api/cards/${id}: success`);
      return c.json({ success: true });
    } catch (e) {
      console.error('DELETE /api/cards/:id error:', e);
      return c.json({ success: false, error: 'Internal Server Error' }, 500);
    }
  });
}