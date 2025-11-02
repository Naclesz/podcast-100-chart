import Header from "components/organisms/Header/Header";
import { useNavigation } from "hooks/useNavigation";
import "./Layout.scss";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps): React.ReactNode {
  const { navigateTo } = useNavigation();

  return (
    <div className="layout">
      <div className="layout__header">
        <Header onClickHome={() => navigateTo("/")} />
      </div>
      <div className="layout__main">{children}</div>
    </div>
  );
}
