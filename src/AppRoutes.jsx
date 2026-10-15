import { Link, Redirect, useLocation } from 'wouter';
import App from './App.jsx';
import { DEFAULT_HOOK } from './constants/app.js';
import { HOOK_PATHS, ROOT_PATH } from './routes/paths.js';
import { Header } from './shared/components/Header.jsx';

export default function AppRoutes() {
  const [path] = useLocation();
  const activeHook = Object.keys(HOOK_PATHS).find((hook) => HOOK_PATHS[hook] === path);

  if (path === ROOT_PATH) return <Redirect to={HOOK_PATHS[DEFAULT_HOOK]} replace />;
  if (activeHook) return <App activeHook={activeHook} />;

  return (
    <div className="app-container">
      <Header />
      <main className="panel-card">
        <h1>Page not found</h1>
        <p>This URL does not match a hook lesson.</p>
        <Link className="salt-btn" href={HOOK_PATHS[DEFAULT_HOOK]}>Open useState</Link>
      </main>
    </div>
  );
}
