import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";

import { signatures, type NewSignature } from "./schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { logger: true });

export const createSignature = (signature: NewSignature) => {
	return db.insert(signatures).values(signature).all();
};

export const getSignatures = () => {
	return db.select().from(signatures).all();
};

migrate(db, { migrationsFolder: "./src/db/migrations" });
