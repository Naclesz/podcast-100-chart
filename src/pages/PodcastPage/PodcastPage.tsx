import EpisodesTable from "components/molecules/EpisodesTable/EpisodesTable";
import PodcastDetailDescription from "components/molecules/PodcastDetailDescription/PodcastDetailDescription";
import Layout from "components/templates/Layout/Layout";
import { usePodcastDetail } from "hooks/usePodcastDetail";
import { useParams } from "react-router";
import "./PodcastPage.scss";

export default function PodcastPage(): React.ReactNode {
  const { podcastId } = useParams();
  const { podcast } = usePodcastDetail(podcastId || "");

  return (
    <Layout>
      <div className="podcast-page">
        <div className="podcast-page__left">
          <PodcastDetailDescription podcast={podcast} />
        </div>
        <div className="podcast-page__right">
          <div className="podcast-page__right-header">
            <h3>Episodes: {podcast.details.totalEpisodes}</h3>
          </div>
          <div className="podcast-page__right-episodes">
            <EpisodesTable episodes={podcast.details.episodes} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
