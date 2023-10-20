import { handleRequest } from "@vercel/remix";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@vercel/remix";

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
// import { renderToString } from "react-dom/server";
// import { RemixServer } from "@remix-run/react";
// import { type EntryContext, handleRequest } from "@vercel/remix";

// export default function handleRequest(
//   request: Request,
//   responseStatusCode: number,
//   responseHeaders: Headers,
//   remixContext: EntryContext
// ) {
//   const markup = renderToString(
//     <RemixServer context={remixContext} url={request.url} />
//   );

//   responseHeaders.set("Content-Type", "text/html");

//   return new Response("<!DOCTYPE html>" + markup, {
//     status: responseStatusCode,
//     headers: responseHeaders,
//   });
// }
