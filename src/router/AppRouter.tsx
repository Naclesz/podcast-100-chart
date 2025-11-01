import { useAppContext } from "context/AppContext";
import HomePage from "pages/HomePage/HomePage";
import PodcastPage from "pages/PodcastPage/PodcastPage";
import { Route, Routes } from "react-router";

export default function AppRouter(): React.ReactNode {
  const { state } = useAppContext();
  if (!state?.hydrated) {
    return <div>Loading...</div>;
  }
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/podcast/:podcastId" element={<PodcastPage />} />
    </Routes>
  );
}
