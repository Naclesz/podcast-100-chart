import PodcastGrid from "presentation/components/molecules/PodcastGrid/PodcastGrid";
import HeaderHomeSearch from "presentation/components/organisms/HeaderHomeSearch/HeaderHomeSearch";
import Layout from "presentation/components/templates/Layout/Layout";
import { usePodcasts } from "application/hooks/usePodcasts";
import { memo } from "react";
import "./HomePage.scss";

const HomePage = memo(function HomePage(): React.ReactNode {
  const {
    podcasts,
    isLoading,
    error,
    filteredPodcastsCount,
    onFilterPodcasts,
  } = usePodcasts();

  function renderPodcasts(): React.ReactNode {
    if (error) {
      return <div className="home-page__error">{error.message}</div>;
    }
    if (podcasts.length === 0) {
      return <div className="home-page__empty">No podcasts found</div>;
    }
    return <PodcastGrid podcasts={podcasts} isLoading={isLoading} />;
  }

  return (
    <Layout>
      <div className="home-page">
        <div className="home-page__header">
          <HeaderHomeSearch
            onFilterPodcasts={onFilterPodcasts}
            filteredPodcastsCount={filteredPodcastsCount}
          />
        </div>
        <div className="home-page__podcasts">{renderPodcasts()}</div>
      </div>
    </Layout>
  );
});

export default HomePage;
