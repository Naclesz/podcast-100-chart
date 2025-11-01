import Header from "components/organisms/Header/Header";
import { useNavigate } from "react-router";
import "./Layout.scss";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps): React.ReactNode {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <div className="layout__header">
        <Header onClickHome={() => navigate("/")} />
      </div>
      <div className="layout__main">{children}</div>
    </div>
  );
}
