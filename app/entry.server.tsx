import { handleRequest } from "@vercel/remix";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@vercel/remix";
import { setCDN } from "shiki";

setCDN("https://unpkg.com/shiki/");

export default function (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const remixServer = <RemixServer context={remixContext} url={request.url} />;
  return handleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixServer
  );
}
