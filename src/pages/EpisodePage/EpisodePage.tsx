import TextHtml from "components/atoms/TextHtml/TextHtml";
import PodcastDetailDescription from "components/molecules/PodcastDetailDescription/PodcastDetailDescription";
import Layout from "components/templates/Layout/Layout";
import { useEpisode } from "hooks/useEpisode";
import { useParams } from "react-router";
import "./EpisodePage.scss";

export default function EpisodePage(): React.ReactNode {
  const { podcastId, episodeId } = useParams();

  const { podcast, episode } = useEpisode(podcastId || "", episodeId || "");

  return (
    <Layout>
      <div className="episode-page">
        <div className="episode-page__left">
          <PodcastDetailDescription podcast={podcast} />
        </div>
        <div className="episode-page__right">
          <div className="episode-page__right-content">
            <h3 className="episode-page__right-content-title">
              {episode.title}
            </h3>
            <div className="episode-page__right-content-description">
              <TextHtml text={episode.description} />
            </div>
            <div className="episode-page__right-content-audio-container">
              <audio
                src={episode.episodeUrl}
                controls
                className="episode-page__right-content-audio"
              >
                <track
                  kind="captions"
                  src={episode.closedCaptioning}
                  srcLang="en"
                  label={
                    episode.closedCaptioning &&
                    episode.closedCaptioning !== "none"
                      ? "English captions"
                      : "No captions available"
                  }
                  default={
                    !!(
                      episode.closedCaptioning &&
                      episode.closedCaptioning !== "none"
                    )
                  }
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
