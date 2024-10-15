import "jsr:@std/dotenv/load";

let API_KEY: string | undefined;
let API_URL: string | undefined;
let API_URL_UNIT: string | undefined;

if (Deno.env.get("API_KEY")) API_KEY = Deno.env.get("API_KEY");
else console.error("MISSING: env variable: API_KEY!");

if (Deno.env.get("API_URL")) API_URL = Deno.env.get("API_URL");
else console.error("MISSING: env variable: API_URL");

if (Deno.env.get("API_URL_UNIT")) API_URL_UNIT = Deno.env.get("API_URL_UNIT");
else console.error("MISSING: env variable: API_URL_UNIT");

Deno.serve(async (req: Request) => {
  const pathname: string = new URL(req.url).pathname;

  if (pathname.startsWith("/ui")) {
    const filePath: string = `.${pathname}`;
    let contentType: string;

    switch (true) {
      case pathname.endsWith(".html"):
        contentType = "text/html";
        break;

      case pathname.endsWith(".css"):
        contentType = "text/css";
        break;

      case pathname.endsWith(".js"):
        contentType = "application/javascript";
        break;

      case pathname.endsWith(".png"):
        contentType = "image/png";
        break;

      default:
        return new Response("Unsupported file type", { status: 415 });
    }

    try {
      const fileContent: Uint8Array = await Deno.readFile(filePath);
      return new Response(fileContent, {
        headers: { "Content-Type": contentType },
      });
    } catch (error) {
      console.error("Error reading file:", error);
      return new Response("File not found", { status: 404 });
    }
  }

  if (pathname.startsWith("/weather")) {
    const url: URL = new URL(req.url);
    const lat: string | null = url.searchParams.get("lat");
    const lon: string | null = url.searchParams.get("lon");

    if (!lat || !lon) {
      return new Response("Missing lat or lon!", { status: 400 });
    }

    const weatherData: Response = await fetch(
      `${API_URL}lat=${lat}&lon=${lon}&appid=${API_KEY}${API_URL_UNIT}`,
    );
    const weatherJson = await weatherData.json();

    return new Response(JSON.stringify(weatherJson), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
});