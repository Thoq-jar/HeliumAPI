import "@std/dotenv/load";
import { serveDir } from "@std/http/file-server";
import * as banners from "./banners.ts";
import exit = Deno.exit;

let API_KEY: string | undefined;
let API_URL: string | undefined;
let API_UNIT: string | undefined;

const defaultResponse = {
  message: "Hi mom!",
  status: "honeypot",
};

function serve() {
  console.log("Server started!");
  Deno.serve(async (req: Request) => {
    const pathname: string = new URL(req.url).pathname;

    switch (true) {
      case (pathname.startsWith("/ui") || pathname.startsWith("/icbm")): {
        return serveDir(req, { fsRoot: "./public" });
      }

      case pathname.startsWith("/weather"): {
        const url = new URL(req.url);
        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");

        if (!lat || !lon) {
          return new Response("Missing lat or lon!", { status: 400 });
        }

        const weatherData = await fetch(
          `${API_URL}lat=${lat}&lon=${lon}&appid=${API_KEY}${API_UNIT}`,
        );
        const weatherJson = await weatherData.json();

        return new Response(JSON.stringify(weatherJson), {
          headers: { "Content-Type": "application/json" },
        });
      }

      case (pathname === "/"): {
        return new Response(JSON.stringify(defaultResponse, null, 2), {
          headers: { "content-type": "application/json" },
          status: 418,
        });
      }

      default: {
        return new Response("Could not route your request!", {
          status: 400,
        });
      }
    }
  });
}

function checkENV() {
  let hasErrors: boolean = false;

  console.log("Checking for variables...");
  try {
    if (Deno.env.get("API_KEY")) API_KEY = Deno.env.get("API_KEY");
    else {
      console.error("MISSING: env variable: API_KEY!");
      hasErrors = true;
    }

    if (Deno.env.get("API_URL")) API_URL = Deno.env.get("API_URL");
    else {
      console.error("MISSING: env variable: API_URL");
      hasErrors = true;
    }

    if (Deno.env.get("API_UNIT")) API_UNIT = Deno.env.get("API_UNIT");
    else {
      console.error("MISSING: env variable: API_UNIT");
      hasErrors = true;
    }
  } catch (ex) {
    console.error(`${ex}\nPlease Fix the above errors!`);
    exit(1);
  }

  console.log("Variables found!\nChecking validity of variables...");

  const apiKey: string | undefined = Deno.env.get("API_KEY");
  const apiUrl: string | undefined = Deno.env.get("API_URL");
  const apiUnit: string | undefined = Deno.env.get("API_UNIT");

  if (apiKey && apiKey.length < 5) {
    console.error("API_KEY must be at least 5 characters long!");
    hasErrors = true;
  }

  if (apiUrl && !apiUrl.startsWith("https://")) {
    console.error("API_URL must start with 'https://'");
    hasErrors = true;
  }

  if (apiUnit && !apiUnit.startsWith("&")) {
    console.error("API_UNIT must start with '&'");
    hasErrors = true;
  }

  if (hasErrors) {
    console.error("Please fix the above errors!");
    exit(1);
  }

  console.log("Environment is set up correctly!\n");
  console.log(banners.serverBanner);
  console.log("Trying to start server...");

  try {
    serve();
  } catch (ex) {
    console.error(`Error while running server: ${ex}`);
    exit(1);
  }
}

export function begin() {
  console.log(banners.welcomeBanner);
  console.log("Trying to check environment...");

  try {
    checkENV();
  } catch (ex) {
    console.error(`${ex}\nFailed to check environment!`);
  }
}
