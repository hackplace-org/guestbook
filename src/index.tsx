import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import * as elements from "typed-html";
import { createSignature, getSignatures } from "./db/client";
import { insertSignatureSchema } from "./db/schema";

const Root = ({ children }: elements.Children) => `
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>hack.place()</title>

			<link href="/static/uno.css" rel="stylesheet" type="text/css" />
			<script src="https://unpkg.com/htmx.org@1.9.4"></script>
		</head>

		${children}
	</html>
`;

const app = new Hono();
app.use("/static/*", serveStatic({ root: "./" }));

app.get("/empty", (c) => c.text(""));
app.get("/signatures", (c) => {
	const signatures = getSignatures();

	return c.html(
		<div>
			{signatures.map((signature) => (
				<div>
					{signature.author} @ {signature.time}: {signature.message}
				</div>
			))}
		</div>
	);
});

app.post("/sign", async (c) => {
	const formData = await c.req.formData();

	return await insertSignatureSchema
		.parseAsync({
			author: formData.get("author"),
			message: formData.get("message"),
		})
		.then((result) => {
			createSignature(result);

			return c.html(
				<div
					class="rounded-lg bg-[#04aa6d] w-full"
					hx-get="/empty"
					hx-trigger="load delay:5s"
					hx-swap="outerHTML"
				>
					<div class="rounded-t-lg h-2 w-full bg-[#03784b]"></div>
					<p class="p-4">Signature added successfully.</p>
				</div>
			);
		})
		.catch((error) => {
			console.error(error);

			return c.html(
				<div
					class="rounded-lg bg-[#e63757] w-full"
					hx-get="/empty"
					hx-trigger="load delay:5s"
					hx-swap="outerHTML"
				>
					<div class="rounded-t-lg h-2 w-full bg-[#aa0000]"></div>
					<p class="p-4">An error occured.</p>
				</div>
			);
		});
});

app.get("/", (c) =>
	c.html(
		<Root>
			<body class="flex flex-row relative h-screen bg-[#0c0a09] text-light">
				<div class="w-1/2 p-8 flex flex-col gap-6 border border-r-dashed border-white/10">
					<h1 class="text-6xl font-bold">Guestbook</h1>

					<div
						hx-get="/signatures"
						hx-trigger="load"
						hx-swap="innerHTML"
					></div>
				</div>

				<div class="w-1/2 p-8 flex flex-col gap-6">
					<h1 class="text-6xl font-thin">Sign here</h1>

					<form
						class="flex flex-col gap-2"
						hx-post="/sign"
						hx-target="#toast"
						hx-swap="innerHTML"
					>
						<div class="flex flex-col gap-1">
							<label for="author">Name</label>
							<input
								id="author"
								name="author"
								type="text"
								placeholder="Your name"
								maxlength="50"
								required="true"
								class="px-4 py-2 bg-dark rounded-lg border border-white/10"
							></input>
						</div>

						<div class="flex flex-col gap-1">
							<label for="message">Message</label>
							<input
								id="message"
								name="message"
								type="text"
								placeholder="Your message"
								maxlength="200"
								required="true"
								class="px-4 py-2 bg-dark rounded-lg border border-white/10"
							></input>
						</div>

						<button
							type="submit"
							class="w-24 mt-2 py-2 rounded-lg bg-[#e11d48]"
						>
							Sign
						</button>
					</form>
				</div>

				<div
					id="toast"
					class="absolute flex items-end w-64 h-24 bottom-8 right-8"
				></div>
			</body>
		</Root>
	)
);

export default app;
