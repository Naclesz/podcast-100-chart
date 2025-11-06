import PodcastCard from "components/molecules/PodcastCard/PodcastCard";
import { memo } from "react";
import type { Podcast } from "types/types";
import "./PodcastGrid.scss";

type PodcastGridProps = {
  podcasts: Podcast[];
  isLoading: boolean;
};

const PodcastGrid = memo(function PodcastGrid({
  podcasts,
}: PodcastGridProps): React.ReactNode {
  return (
    <div className="podcast-grid">
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
});

export default PodcastGrid;
