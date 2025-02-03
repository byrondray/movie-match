import { Hono } from 'hono';
import genres from './routes/genres';
import friends from './routes/friends';
import auth from './routes/auth';

const app = new Hono();

app.get('/', (c) => {
  return c.json('Hello Hono!');
});

const apiRoutes = app
  .basePath('/api')
  .route('/genres', genres)
  .route('/friends', friends)
  .route('/', auth);

export type ApiRoutes = typeof apiRoutes;

export default app;
