import NavLink from "components/atoms/NavLink/NavLink";
import "./Header.scss";

type HeaderProps = {
  isLoading?: boolean;
};

export default function Header({
  isLoading = false,
}: HeaderProps): React.ReactNode {
  return (
    <header className="header">
      <div className="header__left">
        <NavLink to="/" className="header__title" aria-label="Go to home">
          Podcaster
        </NavLink>
      </div>
      <div className="header__right">
        {isLoading && <div className="header__loading" />}
      </div>
    </header>
  );
}
