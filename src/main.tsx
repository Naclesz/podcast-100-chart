import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./styles/main.scss";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

if (import.meta.env.DEV) {
  window.debug = {
    getState: () => JSON.parse(localStorage.getItem("podcast-app-state")),
    clearState: () => localStorage.removeItem("podcast-app-state"),
    setState: (state) =>
      localStorage.setItem("podcast-app-state", JSON.stringify(state)),
    showPodcasts: () =>
      JSON.parse(localStorage.getItem("podcast-app-state"))?.podcasts,
  };
}
