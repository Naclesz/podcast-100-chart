import NavLink from "components/atoms/NavLink/NavLink";
import type { Podcast } from "types/types";
import "./PodcastCard.scss";

type PodcastCardProps = {
  podcast: Podcast;
};

export default function PodcastCard({
  podcast,
}: PodcastCardProps): React.ReactNode {
  return (
    <NavLink
      to={`/podcast/${podcast.id}`}
      className="podcast-card"
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
    </NavLink>
  );
}
