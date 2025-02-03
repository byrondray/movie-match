import { Hono } from 'hono';
import { getDB } from '../db/client';
import { genres as genreSchmea } from '../db/schema/genres';
import { eq } from 'drizzle-orm';
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
  });

export default genres;
