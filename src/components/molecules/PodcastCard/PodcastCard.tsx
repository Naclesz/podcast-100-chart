import type { Podcast } from "types/types";
import "./PodcastCard.scss";

type PodcastCardProps = {
  podcast: Podcast;
  onClick: (podcastId: string) => void;
};

export default function PodcastCard({
  podcast,
  onClick,
}: PodcastCardProps): React.ReactNode {
  function handleKeyDown(event: React.KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(podcast.id);
    }
  }

  return (
    <button
      className="podcast-card"
      onClick={() => onClick(podcast.id)}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${podcast.title} by ${podcast.author}`}
    >
      <div className="podcast-card__image">
        <img src={podcast.imageUrl} alt={podcast.title} />
      </div>
      <div className="podcast-card__content">
        <h3 title={podcast.title} className="podcast-card__title">
          {podcast.title}
        </h3>
        <div title={podcast.author} className="podcast-card__author">
          Author: {podcast.author}
        </div>
      </div>
    </button>
  );
}
