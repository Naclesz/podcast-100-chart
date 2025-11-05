import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { AppProvider } from "./context/AppContext";
import { router } from "./router/routes";
import "./styles/main.scss";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
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
