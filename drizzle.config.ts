import type { Config } from "drizzle-kit";

export default {
	verbose: true,
	breakpoints: true,
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
} satisfies Config;
