import "./Header.scss";

type HeaderProps = {
  isLoading?: boolean;
};

export default function Header({
  isLoading = false,
}: HeaderProps): React.ReactNode {
  return (
    <header className="header">
      <div className="header_left">
        <h2 className="header_title">Podcaster</h2>
      </div>
      <div className="header_right">
        {isLoading && <div className="header_loading" />}
      </div>
    </header>
  );
}
