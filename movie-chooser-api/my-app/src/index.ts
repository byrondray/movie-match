import { serve } from 'bun';
import app from './app';
import { z } from 'zod';

const port = z.number().parse(parseInt(process.env.PORT || '3000'));

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running at http://localhost:${port}`);
