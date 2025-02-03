import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { movieSessions } from './movieSession';
import { users } from './user';
import { movies } from './movies';

export const movieSelections = sqliteTable('movie_selections', {
  id: integer('id').primaryKey(),
  session_id: integer('session_id')
    .notNull()
    .references(() => movieSessions.id, { onDelete: 'cascade' }),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  movie_id: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
});
