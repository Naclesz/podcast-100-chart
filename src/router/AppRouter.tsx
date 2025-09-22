import { AppProvider } from "context/AppContext";
import HomePage from "pages/HomePage";
import { Route, Routes } from "react-router";

export default function AppRouter(): React.ReactNode {
  return (
    <AppProvider>
      <Routes>
        {/* Página principal con el listado de podcasts */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </AppProvider>
  );
}
