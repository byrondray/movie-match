import { Hono } from 'hono';
import { movies as movieSchema } from '../db/schema/movies';
import { getDB } from '../db/client';
import { eq } from 'drizzle-orm';
import { genres } from '../db/schema/genres';

const db = getDB();

const movies = new Hono()
  .get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'), 10);

    const results = await db
      .select({ movieSchema, genres })
      .from(movieSchema)
      .innerJoin(genres, eq(genres.id, movieSchema.genre))
      .where(eq(movieSchema.id, id));

    if (!results || results.length === 0) {
      return c.json({ data: null, error: 'Movie not found' }, 404);
    }

    return c.json({ data: results[0], error: null });
  })
  .post('/add', async (c) => {
    try {
      const rawBody = await c.req.text();

      const body = JSON.parse(rawBody);

      if (!body || !body.title || !body.genre || !body.releaseDate) {
        return c.json(
          { error: 'title, genre, and releaseDate are required' },
          400
        );
      }

      const { title, genre, releaseDate } = body;

      const existingMovie = await db
        .select()
        .from(movieSchema)
        .where(eq(movieSchema.title, title));

      if (existingMovie.length > 0) {
        return c.json({ error: 'Movie already exists' }, 400);
      }

      await db.insert(movieSchema).values({ title, genre });

      return c.json({ success: true, message: 'Movie added successfully' });
    } catch (error) {
      console.error('Error adding movie:', error);

      if (error instanceof SyntaxError) {
        return c.json({ error: 'Invalid JSON payload' }, 400);
      }
    }
  });

export default movies;
