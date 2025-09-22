import "./Layout.scss";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps): React.ReactNode {
  return (
    <div className="layout">
      <div className="layout__header">
        <h1 className="layout__title">Podcast 100 Chart</h1>
      </div>
      <div className="layout__main">{children}</div>
    </div>
  );
}
