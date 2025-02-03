// docs: https://orm.drizzle.team/docs/sql-schema-declaration
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './user';

export const friends = sqliteTable('friends', {
  id: text('id').primaryKey().notNull(),
  friendId: text('friend_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: text('created_at').default(sql`(current_timestamp)`),
});

export type Friend = typeof friends.$inferSelect;
export type FriendInsert = typeof friends.$inferInsert;
