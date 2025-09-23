import Input from "components/atoms/Input/Input";
import Label from "components/atoms/Label/Label";
import "./HeaderHomeSearch.scss";

type HeaderHomeSearchProps = {
  onFilterPodcasts: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredPodcastsCount: number;
};

function HeaderHomeSearch({
  onFilterPodcasts,
  filteredPodcastsCount,
}: HeaderHomeSearchProps): React.ReactNode {
  return (
    <div className="header-home-search">
      <div className="header-home-search_label">
        <Label>{filteredPodcastsCount}</Label>
      </div>
      <div className="header-home-search_input">
        <Input placeholder="Filter podcasts..." onChange={onFilterPodcasts} />
      </div>
    </div>
  );
}

export default HeaderHomeSearch;
