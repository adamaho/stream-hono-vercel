import { Hono } from "hono";
import { handle } from "hono/vercel";

export const config = {
  runtime: "edge",
};

const clients: Map<string, ReadableStreamDefaultController> = new Map();
let count = 0;

const app = new Hono().basePath("/api");

app.get("/subscribe", (c) => {
  const clientId = `client-${clients.size}`;
  const body = new ReadableStream({
    start(controller) {
      clients.set(clientId, controller);
      controller.enqueue(new TextEncoder().encode("Client connected...\n"));
    },
    cancel() {
      clients.delete(clientId);
    },
  });

  return new Response(body, {
    headers: {
      "content-type": "text/plain",
      "x-content-type-options": "nosniff",
    },
  });
});

app.get("/publish", () => {
  count += 1;
  for (const [key, controller] of clients) {
    controller.enqueue(new TextEncoder().encode(`count: ${count}`));
  }

  return new Response("published");
});

export default handle(app);
