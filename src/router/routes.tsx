/* eslint-disable react-refresh/only-export-components */
import RouteError from "components/organisms/RouteError/RouteError";
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
    errorElement: <RouteError />,
    children: [
      {
        path: "/",
        element: (
          <RouteWrapper>
            <HomePage />
          </RouteWrapper>
        ),
        errorElement: <RouteError />,
      },
      {
        path: "/podcast/:podcastId",
        element: (
          <RouteWrapper>
            <PodcastPage />
          </RouteWrapper>
        ),
        errorElement: <RouteError />,
      },
      {
        path: "/podcast/:podcastId/episode/:episodeId",
        element: (
          <RouteWrapper>
            <EpisodePage />
          </RouteWrapper>
        ),
        errorElement: <RouteError />,
      },
    ],
  },
]);
