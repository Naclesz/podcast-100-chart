import "./Header.scss";

type HeaderProps = {
  isLoading?: boolean;
  onClickHome: () => void;
};

export default function Header({
  isLoading = false,
  onClickHome,
}: HeaderProps): React.ReactNode {
  return (
    <header className="header">
      <div className="header__left">
        <button
          className="header__title"
          onClick={onClickHome}
          aria-label="Go to home"
        >
          Podcaster
        </button>
      </div>
      <div className="header__right">
        {isLoading && <div className="header__loading" />}
      </div>
    </header>
  );
}
