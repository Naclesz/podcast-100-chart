import { useNavigate } from "react-router";
import type { Podcast } from "types/types";
import "./PodcastDetailDescription.scss";

type PodcastDetailDescriptionProps = {
  podcast: Podcast;
};
export default function PodcastDetailDescription({
  podcast,
}: PodcastDetailDescriptionProps): React.ReactNode {
  const navigate = useNavigate();

  function handleClick(): void {
    navigate(`/podcast/${podcast.id}`);
  }
  return (
    <div className="podcast-detail-description">
      <div className="podcast-detail-description__top">
        <button
          className="podcast-detail-description__image"
          onClick={handleClick}
          aria-label={`Return to podcast details for ${podcast.title}`}
        >
          <img src={podcast.imageUrl} alt={podcast.title} />
        </button>
      </div>
      <div className="podcast-detail-description__center">
        <button
          onClick={handleClick}
          aria-label={`Return to podcast details for ${podcast.title}`}
          className="podcast-detail-description__title"
        >
          <h3>{podcast.title}</h3>
        </button>
        <button
          className="podcast-detail-description__author"
          onClick={handleClick}
          aria-label={`Return to podcast details for ${podcast.title}`}
        >
          <i>By {podcast.author}</i>
        </button>
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
