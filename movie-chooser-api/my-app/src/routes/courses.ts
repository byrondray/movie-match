import { Hono } from 'hono';

const courses = new Hono().get('/', (c) => {
  return c.json({ message: 'Welcome to the course' });
});

export default courses;
