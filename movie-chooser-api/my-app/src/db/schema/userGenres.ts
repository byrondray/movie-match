import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user';
import { genres } from './genres';

export const userGenres = sqliteTable('userGenres', {
  id: text('id').primaryKey().notNull(),
  genre: text('genre')
    .references(() => genres.id, { onDelete: 'cascade' })
    .notNull(),
  user: text('user')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export type UserGenres = typeof userGenres.$inferSelect;
export type UserGenresInsert = typeof userGenres.$inferInsert;
