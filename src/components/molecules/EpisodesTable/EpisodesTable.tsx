import NavLink from "components/atoms/NavLink/NavLink";
import type { Episode } from "types/types";
import "./EpisodesTable.scss";

type EpisodesTableProps = {
  podcastId: string;
  episodes: Episode[];
};

export default function EpisodesTable({
  podcastId,
  episodes,
}: EpisodesTableProps): React.ReactNode {
  return (
    <div className="episodes-table">
      <table>
        <thead>
          <tr>
            <th className="title-column">Title</th>
            <th className="date-column">Date</th>
            <th className="duration-column">Duration</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((episode) => (
            <tr key={episode.id}>
              <td className="title-column">
                <NavLink
                  className="episodes-table__link"
                  to={`/podcast/${podcastId}/episode/${episode.id}`}
                >
                  {episode.title}
                </NavLink>
              </td>
              <td className="date-column">{episode.date}</td>
              <td className="duration-column">{episode.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
