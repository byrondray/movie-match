import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { movieSessions } from './movieSession';
import { users } from './user';

export const movieSessionUsers = sqliteTable('movie_session_users', {
  id: integer('id').primaryKey(),
  session_id: integer('session_id')
    .notNull()
    .references(() => movieSessions.id, { onDelete: 'cascade' }),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});
