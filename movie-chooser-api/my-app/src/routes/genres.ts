import { Hono } from 'hono';
import { getDB } from '../db/client';
import { genres as genreSchmea } from '../db/schema/genres';
import { and, eq } from 'drizzle-orm';
import { userGenres } from '../db/schema/userGenres';

const db = getDB();

const genres = new Hono()
  .get('/all', async (c) => {
    const results = await db.select({ genreSchmea }).from(genreSchmea);

    if (!results || results.length === 0) {
      return c.json({ data: null, error: 'No genres found' }, 404);
    }

    return c.json({ data: results, error: null });
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');

    const results = await db
      .select({ genreSchmea })
      .from(genreSchmea)
      .where(eq(genreSchmea.id, id));

    if (!results || results.length === 0) {
      return c.json({ data: null, error: 'Genre not found' }, 404);
    }

    return c.json({ data: results[0], error: null });
  })
  .get('/search/:genre', async (c) => {
    const genre = c.req.param('genre');

    const results = await db
      .select({ genreSchmea })
      .from(genreSchmea)
      .where(eq(genreSchmea.genre, genre));

    if (!results || results.length === 0) {
      return c.json({ data: null, error: 'Genre not found' }, 404);
    }

    return c.json({ data: results[0], error: null });
  })
  .get('/:userId', async (c) => {
    const userId = c.req.param('userId');

    const results = await db
      .select({ genreSchmea })
      .from(userGenres)
      .innerJoin(genreSchmea, eq(genreSchmea.id, userGenres.id))
      .where(eq(userGenres.user, userId));

    if (!results || results.length === 0) {
      return c.json({ data: null, error: 'No genres found' }, 404);
    }

    return c.json({ data: results, error: null });
  })
  .post('/add', async (c) => {
    try {
      const rawBody = await c.req.text();

      const body = JSON.parse(rawBody);

      if (!body || !body.userId || !body.genreId) {
        return c.json({ error: 'userId and genreId are required' }, 400);
      }

      const { userId, genreId } = body;

      const existingGenre = await db
        .select()
        .from(userGenres)
        .where(and(eq(userGenres.user, userId), eq(userGenres.genre, genreId)));

      if (existingGenre.length > 0) {
        return c.json({ error: 'Genre already exists' }, 400);
      }

      await db
        .insert(userGenres)
        .values({ id: crypto.randomUUID(), user: userId, genre: genreId });

      return c.json({ success: true, message: 'Genre added successfully' });
    } catch (error) {
      console.error('Error adding genre:', error);

      if (error instanceof SyntaxError) {
        return c.json({ error: 'Invalid JSON payload' }, 400);
      }
    }
  })
  .post('/remove', async (c) => {
    try {
      const rawBody = await c.req.text();

      const body = JSON.parse(rawBody);

      if (!body || !body.userId || !body.genreId) {
        return c.json({ error: 'userId and genreId are required' }, 400);
      }

      const { userId, genreId } = body;

      const existingGenre = await db
        .select()
        .from(userGenres)
        .where(and(eq(userGenres.user, userId), eq(userGenres.genre, genreId)));

      if (existingGenre.length === 0) {
        return c.json({ error: 'Genre not found' }, 400);
      }

      await db
        .delete(userGenres)
        .where(and(eq(userGenres.user, userId), eq(userGenres.genre, genreId)));

      return c.json({ success: true, message: 'Genre removed successfully' });
    } catch (error) {
      console.error('Error removing genre:', error);

      if (error instanceof SyntaxError) {
        return c.json({ error: 'Invalid JSON payload' }, 400);
      }
    }
  });

export default genres;
