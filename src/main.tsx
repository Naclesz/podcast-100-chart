import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { AppProvider } from "./application/context/AppContext";
import { router } from "./presentation/router/routes";
import "./styles/main.scss";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
);
