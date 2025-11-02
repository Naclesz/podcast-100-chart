import { useAppContext } from "context/AppContext";
import EpisodePage from "pages/EpisodePage/EpisodePage";
import HomePage from "pages/HomePage/HomePage";
import PodcastPage from "pages/PodcastPage/PodcastPage";
import { createBrowserRouter } from "react-router";

// Wrapper component to handle hydration logic
function RouteWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const { state } = useAppContext();

  if (!state?.hydrated) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouteWrapper>
        <HomePage />
      </RouteWrapper>
    ),
  },
  {
    path: "/podcast/:podcastId",
    element: (
      <RouteWrapper>
        <PodcastPage />
      </RouteWrapper>
    ),
  },
  {
    path: "/podcast/:podcastId/episode/:episodeId",
    element: (
      <RouteWrapper>
        <EpisodePage />
      </RouteWrapper>
    ),
  },
]);
