import { assertEquals } from "@std/assert";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve((req: Request) => {
  const pathname: string = new URL(req.url).pathname;
  const url: URL = new URL(req.url);

  if (pathname.startsWith("/ui")) {
    return serveDir(req, {
      fsRoot: "./public/ui",
    });
  }

  if (pathname.startsWith("/weather")) {
    const lat: string | null = url.searchParams.get("lat");
    const lon: string | null = url.searchParams.get("lon");

    if (!lat || !lon) {
      return new Response("Missing lat or lon!", { status: 400 });
    }

    const weatherJson: { temp: number; description: string } = {
      temp: 72,
      description: "Clear sky",
    };
    return new Response(JSON.stringify(weatherJson), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
});

Deno.test("GET /weather with missing parameters", async () => {
  const response: Response = await fetch("http://localhost:8000/weather");
  assertEquals(response.status, 400);
  const text: string = await response.text();
  assertEquals(text, "Missing lat or lon!");
});

Deno.test("GET /weather with valid parameters", async () => {
  const response = await fetch(
    "http://localhost:8000/weather?lat=38.99&lon=-77.48",
  );
  assertEquals(response.status, 200);
  const json = await response.json();
  assertEquals(json, { temp: 72, description: "Clear sky" });
});

Deno.test("GET /weather with invalid path", async () => {
  const response = await fetch("http://localhost:8000/invalid");
  assertEquals(response.status, 404);
  const text = await response.text();
  assertEquals(text, "Not Found");
});
