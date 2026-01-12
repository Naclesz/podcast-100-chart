import type { Podcast } from "domain/models";
import PodcastCard from "presentation/components/molecules/PodcastCard/PodcastCard";
import { memo } from "react";
import "./PodcastGrid.scss";

type PodcastGridProps = {
  podcasts: Podcast[];
  isLoading: boolean;
  onFavoriteToggle: (
    e: React.MouseEvent<HTMLButtonElement>,
    podcastId: string
  ) => void;
};

const PodcastGrid = memo(function PodcastGrid({
  podcasts,
  onFavoriteToggle,
}: PodcastGridProps): React.ReactNode {
  return (
    <div className="podcast-grid">
      {podcasts.map((podcast) => (
        <PodcastCard
          key={podcast.id}
          podcast={podcast}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
});

export default PodcastGrid;
