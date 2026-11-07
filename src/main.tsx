import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Games } from "./pages/games.tsx";

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const Page = path === "/games" ? Games : App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
