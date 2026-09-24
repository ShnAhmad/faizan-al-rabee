import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const inquiries=sqliteTable('inquiries',{id:text('id').primaryKey(),reference:text('reference').notNull(),payload:text('payload').notNull(),createdAt:integer('created_at').notNull()});
