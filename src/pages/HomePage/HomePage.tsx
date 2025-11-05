import PodcastGrid from "components/molecules/PodcastGrid/PodcastGrid";
import HeaderHomeSearch from "components/organisms/HeaderHomeSearch/HeaderHomeSearch";
import Layout from "components/templates/Layout/Layout";
import { usePodcasts } from "hooks/usePodcasts";
import "./HomePage.scss";

export default function HomePage(): React.ReactNode {
  const {
    podcasts,
    isLoading,
    error,
    filteredPodcastsCount,
    onFilterPodcasts,
  } = usePodcasts();

  return (
    <Layout>
      <div className="home-page">
        <div className="home-page__header">
          <HeaderHomeSearch
            onFilterPodcasts={onFilterPodcasts}
            filteredPodcastsCount={filteredPodcastsCount}
          />
        </div>
        <div className="home-page__podcasts">
          {error ? (
            <div className="home-page__error">{error.message}</div>
          ) : (
            <PodcastGrid
              podcasts={podcasts}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
