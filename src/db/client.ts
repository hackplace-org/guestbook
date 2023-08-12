import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

import { insertSignatureSchema, signatures, type NewSignature } from "./schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

export const createSignature = (signature: NewSignature) => {
	const parsed = insertSignatureSchema.parse(signature);

	return db.insert(signatures).values(parsed).all();
};
