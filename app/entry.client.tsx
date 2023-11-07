import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";
import { setCDN } from "shiki";

setCDN("/");
hydrateRoot(document, <RemixBrowser />);
