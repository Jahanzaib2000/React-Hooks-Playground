import { Link } from 'wouter';
import { HOOK_PATHS } from '../../routes/paths.js';
import { APP_TITLE } from '../../constants/app.js';
import { HEADER_HOOK_GROUPS } from '../../constants/navigation.js';

export function Header({ activeHook, _onOpenTheory }) {
  return (
    <header className="header-bar">
      <div className="header-left">
        <span className="app-title">{APP_TITLE}</span>

        {/* Hook Switcher */}
        <div className="hook-tabs">
          {HEADER_HOOK_GROUPS.map((group) => (
            <div className="hook-tabs-row" key={group[0]}>
              {group.map((hook) => (
                <Link
                  key={hook}
                  href={HOOK_PATHS[hook]}
                  aria-current={activeHook === hook ? 'page' : undefined}
                  className={`hook-tab-btn ${activeHook === hook ? 'active' : ''}`}
                >
                  {hook}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
