import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { branding } from "./config/branding.config";
import "./index.css";

// Set dynamic title and favicon from config
document.title = branding.appName;
const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
if (favicon) {
  favicon.href = branding.logo;
}

createRoot(document.getElementById("root")!).render(<App />);
