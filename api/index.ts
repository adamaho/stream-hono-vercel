import { Hono } from "hono";
import { handle } from "hono/vercel";

export const config = {
  runtime: "edge",
};

let count = 0;

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  count += 1;
  return c.json({ count });
});

export default handle(app);
