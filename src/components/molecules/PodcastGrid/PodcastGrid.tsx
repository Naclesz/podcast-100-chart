import PodcastCard from "components/molecules/PodcastCard/PodcastCard";
import type { Podcast } from "types/types";
import "./PodcastGrid.scss";

type PodcastGridProps = {
  podcasts: Podcast[];
  isLoading: boolean;
  onClickPodcast: (podcastId: string) => void;
};

export default function PodcastGrid({
  isLoading, //TODO: add skeleton loading
  podcasts,
  onClickPodcast,
}: PodcastGridProps): React.ReactNode {
  return (
    <div className="podcast-grid">
      {podcasts.map((podcast) => (
        <PodcastCard
          key={podcast.id}
          podcast={podcast}
          onClick={onClickPodcast}
        />
      ))}
    </div>
  );
}
