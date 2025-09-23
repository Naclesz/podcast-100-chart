import { AppProvider } from "context/AppContext";
import HomePage from "pages/HomePage/HomePage";
import { Route, Routes } from "react-router";

export default function AppRouter(): React.ReactNode {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </AppProvider>
  );
}
