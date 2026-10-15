import { DebugValueView } from './DebugValueView.jsx';
import { INITIAL_DEBUG_THEME, INITIAL_CART_COUNT } from '../../constants/use-debug-value.js';
import { useState } from 'react';
import { SandboxContainer } from '../../shared/components';

function UseDebugValueInnerSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  const [isOnline, setIsOnline] = useState(true);
  const [theme, setTheme] = useState(INITIAL_DEBUG_THEME);
  const [cartCount, setCartCount] = useState(INITIAL_CART_COUNT);
  const [renderCount, setRenderCount] = useState(1);

  const handleToggleOnline = () => {
    const nextStatus = !isOnline;
    const nextRender = renderCount + 1;
    setIsOnline(nextStatus);
    setRenderCount(nextRender);

    if (onRecordRender) {
      onRecordRender({
        renderNumber: nextRender,
        trigger: `Toggled Online Status: ${nextStatus ? 'Online' : 'Offline'}`,
        prevState: { isOnline, theme, cartCount },
        currentState: { isOnline: nextStatus, theme, cartCount }
      });
    }

    if (onRecordMutation) {
      onRecordMutation({
        type: 'State Change & DevTools Update',
        target: '<ProfileCard />',
        summary: `useOnlineStatus updated label in DevTools: "${nextStatus ? 'Online' : 'Offline'}" (0 DOM attribute changes)`
      });
    }

    if (onRecordTrace) {
      onRecordTrace({
        trigger: { label: `useOnlineStatus -> "${nextStatus ? 'Online' : 'Offline'}"`, type: 'DevTools Inspection' },
        componentName: 'ProfileCard',
        renderNumber: nextRender,
        hooks: [
          { slot: 0, name: 'useOnlineStatus', status: `useDebugValue("${nextStatus ? 'Online' : 'Offline'}")`, actionRequired: false },
          { slot: 1, name: 'useTheme', status: `useDebugValue("${theme}")`, actionRequired: false },
          { slot: 2, name: 'useCart', status: `useDebugValue("${cartCount} items")`, actionRequired: false }
        ],
        commit: { diffSummary: `DevTools refreshed hook label to "${nextStatus ? 'Online' : 'Offline'}"`, mutationsCount: 1 },
        effects: null
      });
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'Dark' ? 'Light' : 'Dark';
    const nextRender = renderCount + 1;
    setTheme(nextTheme);
    setRenderCount(nextRender);

    if (onRecordRender) {
      onRecordRender({
        renderNumber: nextRender,
        trigger: `Switched Theme: ${nextTheme}`,
        prevState: { isOnline, theme, cartCount },
        currentState: { isOnline, theme: nextTheme, cartCount }
      });
    }

    if (onRecordMutation) {
      onRecordMutation({
        type: 'State Change & DevTools Update',
        target: '<ProfileCard />',
        summary: `useTheme updated label in DevTools: "${nextTheme}" (0 DOM attribute changes)`
      });
    }
  };

  const handleCartChange = (delta) => {
    const nextCount = Math.max(1, Math.min(9, cartCount + delta));
    const nextRender = renderCount + 1;
    setCartCount(nextCount);
    setRenderCount(nextRender);

    if (onRecordRender) {
      onRecordRender({
        renderNumber: nextRender,
        trigger: `Cart Count Changed: ${nextCount} items`,
        prevState: { isOnline, theme, cartCount },
        currentState: { isOnline, theme, cartCount: nextCount }
      });
    }

    if (onRecordMutation) {
      onRecordMutation({
        type: 'State Change & DevTools Update',
        target: '<ProfileCard />',
        summary: `useCart updated label in DevTools: "${nextCount} items" via deferred formatter`
      });
    }
  };

  const handleResetAll = () => {
    setIsOnline(true);
    setTheme(INITIAL_DEBUG_THEME);
    setCartCount(INITIAL_CART_COUNT);
    setRenderCount(1);
    if (onReset) onReset();
  };

  return (
    <DebugValueView
      cartCount={cartCount}
      theme={theme}
      isOnline={isOnline}
      handleToggleOnline={handleToggleOnline}
      handleToggleTheme={handleToggleTheme}
      handleCartChange={handleCartChange}
      handleResetAll={handleResetAll}
    />
  );
}

// ==========================================
// useEffectEvent: Tree Dependency Graph Sandbox
// ==========================================

export function UseDebugValueSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  return (
    <SandboxContainer hookName="useDebugValue" onReset={onReset} isFullArena={true}>
      <UseDebugValueInnerSandbox
        onRecordRender={onRecordRender}
        onRecordTrace={onRecordTrace}
        onRecordMutation={onRecordMutation}
        onReset={onReset}
      />
    </SandboxContainer>
  );
}
