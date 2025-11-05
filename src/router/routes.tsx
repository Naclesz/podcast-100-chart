import { useAppContext } from "context/AppContext";
import { NavigationProvider } from "context/NavigationContext";
import EpisodePage from "pages/EpisodePage/EpisodePage";
import HomePage from "pages/HomePage/HomePage";
import PodcastPage from "pages/PodcastPage/PodcastPage";
import { createBrowserRouter, Outlet } from "react-router";

function RootLayout(): React.ReactNode {
  return (
    <NavigationProvider>
      <Outlet />
    </NavigationProvider>
  );
}

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
    element: <RootLayout />,
    children: [
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
    ],
  },
]);
