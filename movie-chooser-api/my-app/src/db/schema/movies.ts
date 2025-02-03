import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { genres } from './genres';

export const movies = sqliteTable('movies', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  poster_url: text('poster_url'),
  genre: text('genre')
    .references(() => genres.id, { onDelete: 'cascade' })
    .notNull(),
});
