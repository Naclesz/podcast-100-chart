import { AppProvider } from "./context/AppContext";

function App({ children }: { children: React.ReactNode }): React.ReactNode {
  return <AppProvider>{children}</AppProvider>;
}

export default App;
