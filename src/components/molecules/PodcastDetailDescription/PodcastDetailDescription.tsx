import NavLink from "components/atoms/NavLink/NavLink";
import type { Podcast } from "types/types";
import "./PodcastDetailDescription.scss";

type PodcastDetailDescriptionProps = {
  podcast: Podcast;
};
export default function PodcastDetailDescription({
  podcast,
}: PodcastDetailDescriptionProps): React.ReactNode {
  return (
    <div className="podcast-detail-description">
      <div className="podcast-detail-description__top">
        <NavLink
          to={`/podcast/${podcast.id}`}
          className="podcast-detail-description__image"
          aria-label={`Return to podcast details for ${podcast.title}`}
        >
          <img src={podcast.imageUrl} alt={podcast.title} />
        </NavLink>
      </div>
      <div className="podcast-detail-description__center">
        <NavLink
          to={`/podcast/${podcast.id}`}
          aria-label={`Return to podcast details for ${podcast.title}`}
          className="podcast-detail-description__title"
        >
          <h3>{podcast.title}</h3>
        </NavLink>
        <NavLink
          to={`/podcast/${podcast.id}`}
          className="podcast-detail-description__author"
          aria-label={`Return to podcast details for ${podcast.title}`}
        >
          <i>By {podcast.author}</i>
        </NavLink>
      </div>
      <div className="podcast-detail-description__bottom">
        <div className="podcast-detail-description__description">
          <div className="podcast-detail-description__description-header">
            <b>Description:</b>
          </div>
          <div className="podcast-detail-description__description-content">
            {podcast.summary}
          </div>
        </div>
      </div>
    </div>
  );
}
