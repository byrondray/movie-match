import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const movies = sqliteTable('movies', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  poster_url: text('poster_url'),
});
