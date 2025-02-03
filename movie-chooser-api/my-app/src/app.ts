import { Hono } from 'hono';
import courses from './routes/courses';
import auth from './routes/auth';

const app = new Hono();

app.get('/', (c) => {
  return c.json('Hello Hono!');
});

const apiRoutes = app
  .basePath('/api')
  .route('/courses', courses)
  .route('/', auth);

export type ApiRoutes = typeof apiRoutes;

export default app;
