import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import * as elements from "typed-html";

const Root = ({ children }: elements.Children) => `
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>

			<link href="/static/uno.css" rel="stylesheet" type="text/css" />
			<script src="https://unpkg.com/htmx.org@1.9.4"></script>
		</head>

		${children}
	</html>
`;

const app = new Hono();
app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", (c) =>
	c.html(
		<Root>
			<body>
				<p>Hello world!</p>
			</body>
		</Root>
	)
);

export default app;
