import Header from "presentation/components/organisms/Header/Header";
import { useNavigationContext } from "application/context/NavigationContext";
import "./Layout.scss";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps): React.ReactNode {
  const { isNavigating } = useNavigationContext();

  return (
    <div className="layout">
      <div className="layout__header">
        <Header isLoading={isNavigating} />
      </div>
      <div className="layout__main">{children}</div>
    </div>
  );
}
