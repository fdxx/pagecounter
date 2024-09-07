import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/*', cors());

app.get("/", (c) => {
	return c.text("Hello World");
});

app.post("/pageviews", async (c) => {
	try {
		const body = await c.req.json();
		const domain = body.domain;
		const path = body.path;

		if (!domain || !path) {
			return c.json({ ret: "Missing domain or path"}, 400);
		}

		let stmt = 'INSERT INTO pageviews(domain, path, count) VALUES(?, ?, 1) ON CONFLICT(domain, path) DO UPDATE SET count = count + 1';
		await c.env.DB.prepare(stmt).bind(domain, path).run();

		stmt = 'SELECT * FROM pageviews WHERE domain = ? AND path = ?';
		const results = await c.env.DB.prepare(stmt).bind(domain, path).first();
		return c.json({ ret: "OK", data: results }, 200);
	}
	catch (e) {
		console.error(e.message);
		return c.json({ ret: "Unknown error" }, 500);
	}
});

export default app;

