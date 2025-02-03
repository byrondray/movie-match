import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const genres = sqliteTable('genres', {
  id: text('id').primaryKey().notNull(),
  genre: text('genre').notNull(),
});

export type Genres = typeof genres.$inferSelect;
export type GenresInsert = typeof genres.$inferInsert;
