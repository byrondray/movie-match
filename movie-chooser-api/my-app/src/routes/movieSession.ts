import { Hono } from 'hono';
import { getDB } from '../db/client';
import { movieSessions } from '../db/schema/movieSession';
import { movieSessionUsers } from '../db/schema/movieSessionUsers';
import { movieSelections } from '../db/schema/movieSelection';
import { movies } from '../db/schema/movies';
import { eq, inArray } from 'drizzle-orm';
import { genres } from '../db/schema/genres';
import { users } from '../db/schema/user';

const db = getDB();

const movieSessionsRoutes = new Hono()

  .post('/create', async (c) => {
    const { created_by } = await c.req.json();

    if (!created_by) {
      return c.json({ error: 'User ID is required' }, 400);
    }

    const session = await db.insert(movieSessions).values({
      created_by,
    });

    return c.json({ data: session, error: null });
  })

  .post('/:sessionId/participants', async (c) => {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const { user_id } = await c.req.json();

    if (!user_id) {
      return c.json({ error: 'User ID is required' }, 400);
    }

    const participant = await db.insert(movieSessionUsers).values({
      session_id: sessionId,
      user_id,
    });

    return c.json({ data: participant, error: null });
  })

  .post('/:sessionId/selections', async (c) => {
    const sessionId = parseInt(c.req.param('sessionId'), 10);
    const { user_id, movie_id } = await c.req.json();

    if (!user_id || !movie_id) {
      return c.json({ error: 'User ID and Movie ID are required' }, 400);
    }

    const selection = await db.insert(movieSelections).values({
      session_id: sessionId,
      user_id,
      movie_id,
    });

    return c.json({ data: selection, error: null });
  })

  .get('/:sessionId', async (c) => {
    const sessionId = parseInt(c.req.param('sessionId'), 10);

    const participants = await db
      .select()
      .from(movieSessionUsers)
      .where(eq(movieSessionUsers.session_id, sessionId));

    const selections = await db
      .select({ movies, users })
      .from(movieSelections)
      .innerJoin(movies, eq(movies.id, movieSelections.movie_id))
      .innerJoin(users, eq(users.id, movieSelections.user_id))
      .where(eq(movieSelections.session_id, sessionId));

    const moviesData = await db
      .select()
      .from(movies)
      .innerJoin(genres, eq(genres.id, movies.genre))
      .where(
        inArray(
          movies.id,
          selections.map((selection) => selection.movies.id)
        )
      );

    return c.json({ participants, selections: moviesData, error: null });
  });

export default movieSessionsRoutes;
