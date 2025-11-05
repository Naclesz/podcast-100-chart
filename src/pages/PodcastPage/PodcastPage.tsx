import EpisodesTable from "components/molecules/EpisodesTable/EpisodesTable";
import PodcastDetailDescription from "components/molecules/PodcastDetailDescription/PodcastDetailDescription";
import Layout from "components/templates/Layout/Layout";
import { usePodcastDetail } from "hooks/usePodcastDetail";
import { useParams } from "react-router";
import "./PodcastPage.scss";

export default function PodcastPage(): React.ReactNode {
  const { podcastId } = useParams();
  const { podcast } = usePodcastDetail(podcastId || "");

  if (!podcast) {
    throw new Error(
      `Podcast con ID "${podcastId}" no encontrado. Verifica que el localStorage tenga datos o que el ID sea válido.`
    );
  }

  if (!podcast.details) {
    throw new Error(
      `Los detalles del podcast "${
        podcast.title || podcastId
      }" no están disponibles. Intenta recargar la página.`
    );
  }

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
            <EpisodesTable
              podcastId={podcastId || ""}
              episodes={podcast.details.episodes}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
