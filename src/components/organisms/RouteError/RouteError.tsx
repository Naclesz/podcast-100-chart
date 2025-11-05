import Layout from "components/templates/Layout/Layout";
import { Link, useRouteError } from "react-router";
import "./RouteError.scss";

export default function RouteError(): React.ReactNode {
  const error = useRouteError() as Error;

  return (
    <Layout>
      <div className="route-error">
        <div className="route-error__content">
          <h1>😔 ¡Oops! Algo salió mal</h1>
          <h3>
            Lo sentimos, ocurrió un error inesperado al cargar esta página.
          </h3>

          {error?.message && (
            <div className="route-error__details">{error.message}</div>
          )}

          <div className="route-error__actions">
            <div className="route-error__actions-home">
              <Link to="/">🏠 Volver al inicio</Link>
            </div>
            <div className="route-error__actions-reload">
              <button onClick={() => globalThis.location.reload()}>
                🔄 Recargar página
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
