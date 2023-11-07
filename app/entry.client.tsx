import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";
import { setCDN } from "shiki";

setCDN("https://unpkg.com/shiki/");
hydrateRoot(document, <RemixBrowser />);
