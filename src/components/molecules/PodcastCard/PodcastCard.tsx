import type { Podcast } from "types/types";
import "./PodcastCard.scss";

type PodcastCardProps = {
  podcast: Podcast;
};

export default function PodcastCard({
  podcast,
}: PodcastCardProps): React.ReactNode {
  return (
    <div className="podcast-card">
      <div className="podcast-card__image">
        <img src={podcast.imageUrl} alt={podcast.title} />
      </div>
      <div className="podcast-card__content">
        <div title={podcast.title} className="podcast-card__title">
          {podcast.title}
        </div>
        <div title={podcast.author} className="podcast-card__author">
          Author: {podcast.author}
        </div>
      </div>
    </div>
  );
}
