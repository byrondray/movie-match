import { Hono } from 'hono';
import genres from './routes/genres';
import friends from './routes/friends';
import auth from './routes/auth';
import movies from './routes/movies';
import movieSessionsRoutes from './routes/movieSession';

const app = new Hono();

app.get('/', (c) => {
  return c.json('Hello Hono!');
});

const apiRoutes = app
  .basePath('/api')
  .route('/genres', genres)
  .route('/friends', friends)
  .route('/movies', movies)
  .route('/movieSessions', movieSessionsRoutes)
  .route('/', auth);

export type ApiRoutes = typeof apiRoutes;

export default app;
