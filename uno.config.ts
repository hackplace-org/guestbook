import { defineConfig, presetUno, transformerVariantGroup } from "unocss";
import { readFile } from "node:fs/promises";

const path = "node_modules/@unocss/reset/tailwind.css";

export default defineConfig({
	presets: [presetUno()],
	transformers: [transformerVariantGroup()],
	preflights: [
		{
			layer: "base",
			getCSS: () => readFile(path, "utf-8"),
		},
	],
	content: {
		pipeline: {
			include: ["./src/**/*.tsx"],
		},
	},
});
