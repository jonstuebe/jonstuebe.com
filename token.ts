import open from "open";
import Koa from "koa";
import Router from "koa-router";
import { promises as fs } from "node:fs";
import path from "node:path";
import chalk from "chalk";

require("dotenv").config();

(async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID as string;
  const state = "s0d9fw3lkrsdf";

  const redirectUri = "http://localhost:8888/callback";
  const scope = "user-read-private user-top-read user-read-email";
  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.set("response_type", "token");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("scope", scope);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);

  const app = new Koa({});
  const router = new Router();

  router.get("/callback", (ctx) => {
    ctx.body = `<html><head>
    <script>
      (async () => {
        const hash = window.location.hash.replace('#','');    
        await fetch(window.location.origin + "?" + hash);
        window.close();
      })()
      
    </script>
    </head><body>loading...</body></html>`;
  });

  router.get("/", async (ctx) => {
    const accessToken = ctx.request.query.access_token as string;

    let env = await fs.readFile(path.join(__dirname, ".env"), "utf8");

    env = env.replace(
      /SPOTIFY_ACCESS_TOKEN=".*?"$/gm,
      `SPOTIFY_ACCESS_TOKEN="${accessToken}"`
    );

    await fs.writeFile(path.join(__dirname, ".env"), env, "utf8");
    console.log(chalk.green("Updated Token!"));
    setTimeout(() => {
      process.exit();
    }, 1000);
  });

  app.use(router.routes()).use(router.allowedMethods());
  app.listen(8888);

  open(url.toString());
})();
