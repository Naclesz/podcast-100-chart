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
        <div className="podcast-detail-description__image">
          <img src={podcast.imageUrl} alt={podcast.title} />
        </div>
      </div>
      <div className="podcast-detail-description__center">
        <h3 className="podcast-detail-description__title">{podcast.title}</h3>
        <div className="podcast-detail-description__author">
          <i>By {podcast.author}</i>
        </div>
      </div>
      <div className="podcast-detail-description__bottom">
        <p className="podcast-detail-description__description">
          <div className="podcast-detail-description__description-header">
            <b>Description:</b>
          </div>
          <div className="podcast-detail-description__description-content">
            {podcast.summary}
          </div>
        </p>
      </div>
    </div>
  );
}
