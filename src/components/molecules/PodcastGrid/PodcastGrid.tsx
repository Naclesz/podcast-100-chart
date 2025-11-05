import PodcastCard from "components/molecules/PodcastCard/PodcastCard";
import type { Podcast } from "types/types";
import "./PodcastGrid.scss";

type PodcastGridProps = {
  podcasts: Podcast[];
  isLoading: boolean;
};

export default function PodcastGrid({
  podcasts,
}: PodcastGridProps): React.ReactNode {
  return (
    <div className="podcast-grid">
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
}
