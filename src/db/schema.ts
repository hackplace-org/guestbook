import { sql, type InferInsertModel } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const signatures = sqliteTable("signatures", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	time: integer("time", { mode: "timestamp_ms" }).default(
		sql`CURRENT_TIMESTAMP`
	),
	author: text("author").notNull(),
	message: text("message").notNull(),
});

export const insertSignatureSchema = createInsertSchema(signatures, {
	author: z.string().min(1).max(50),
	message: z.string().min(1).max(200),
});

export type NewSignature = InferInsertModel<typeof signatures>;
