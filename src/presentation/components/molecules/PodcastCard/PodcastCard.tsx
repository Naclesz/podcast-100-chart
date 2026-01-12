import type { Podcast } from "domain/models";
import NavLink from "presentation/components/atoms/NavLink/NavLink";
import React, { memo } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import "./PodcastCard.scss";

type PodcastCardProps = {
  podcast: Podcast;
  onFavoriteToggle: (
    e: React.MouseEvent<HTMLButtonElement>,
    podcastId: string
  ) => void;
};

const PodcastCard = memo(function PodcastCard({
  podcast,
  onFavoriteToggle,
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
        <div className="podcast-card__favorite">
          <button
            className="podcast-card__favorite__icon"
            aria-label={`${
              podcast.favorite ? "Remove from favorites" : "Add to favorites"
            }`}
            onClick={(e) => onFavoriteToggle(e, podcast.id)}
          >
            {podcast.favorite ? <FaStar /> : <FaRegStar />}
          </button>
        </div>
      </div>
    </NavLink>
  );
});

export default PodcastCard;
