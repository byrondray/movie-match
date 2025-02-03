import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { users } from './user';

export const movieSessions = sqliteTable('movie_sessions', {
  id: integer('id').primaryKey(),
  created_by: integer('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  created_at: text('created_at').default(new Date().toISOString()),
});
