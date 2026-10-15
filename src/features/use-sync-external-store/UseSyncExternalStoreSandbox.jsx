import { useState, useSyncExternalStore } from 'react';
import { SandboxContainer } from '../../shared/components';
import { recordAction } from '../../shared/utils';

let isServerConnectedGlobal = true;
const serverStoreListeners = new Set();

const serverConnectionStore = {
  subscribe(callback) {
    serverStoreListeners.add(callback);
    return () => serverStoreListeners.delete(callback);
  },
  getSnapshot() {
    return isServerConnectedGlobal;
  },
  setConnected(status) {
    if (isServerConnectedGlobal !== status) {
      isServerConnectedGlobal = status;
      serverStoreListeners.forEach((fn) => fn());
    }
  }
};

function UseSyncExternalStoreInnerSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  _onReset
}) {
  const isConnected = useSyncExternalStore(
    serverConnectionStore.subscribe,
    serverConnectionStore.getSnapshot
  );
  const [renderCount, setRenderCount] = useState(1);

  const handleToggle = () => {
    const nextStatus = !isConnected;
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);
    serverConnectionStore.setConnected(nextStatus);

    recordAction({
      onRecordRender,
      onRecordTrace,
      onRecordMutation,
      renderNumber: nextRender,
      trigger: `Server Connection: ${nextStatus ? 'ON' : 'OFF'}`,
      prevState: { isConnected },
      currentState: { isConnected: nextStatus },
      mutation: {
        type: 'content',
        target: '#ui-interface-status',
        oldValue: isConnected ? 'Connected' : 'Disconnected',
        newValue: nextStatus ? 'Connected' : 'Disconnected',
        timestamp: Date.now()
      },
      trace: {
        trigger: { label: `Server Toggle: ${nextStatus ? 'ON' : 'OFF'}`, type: 'External Store Update' },
        componentName: 'UIInterface',
        renderNumber: nextRender,
        hooks: [
          {
            slot: 0,
            name: 'useSyncExternalStore',
            status: nextStatus ? 'Connected (Store Online)' : 'Disconnected (Store Offline)',
            prevState: isConnected ? 'true' : 'false',
            nextState: nextStatus ? 'true' : 'false',
            actionLabel: `serverConnectionStore.setConnected(${nextStatus})`
          }
        ],
        commit: {
          diffSummary: `UI Interface updated status to ${nextStatus ? 'Connected (Green)' : 'Disconnected (Red)'}`,
          mutationsCount: 1
        },
        effects: null
      }
    });
  };

  return (
    <div className="useses-sandbox-root">
      <div className="useses-tree-container">
        {/* Node 1: Toggle switch called server connection */}
        <div className="useses-tree-node useses-node-server">
          <div className="useses-node-header">
            <span className="useses-node-title">Server Connection</span>
            <span className="useses-node-type">External Store</span>
          </div>
          <div className="useses-toggle-row">
            <label className="useses-toggle-switch-wrapper" htmlFor="server-connection-toggle">
              <span className="useses-switch-label">Server Connection:</span>
              <input
                id="server-connection-toggle"
                type="checkbox"
                className="useses-switch-input"
                checked={isConnected}
                onChange={handleToggle}
              />
              <span className="useses-switch-track">
                <span className={`useses-switch-thumb ${isConnected ? 'thumb-on' : 'thumb-off'}`} />
              </span>
            </label>
            <span className="useses-toggle-status-text">
              {isConnected ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>

        {/* Vertical tree connector line */}
        <div className="useses-tree-connector">
          <span className="useses-connector-line" />
          <span className="useses-connector-arrow">▼</span>
        </div>

        {/* Node 2: Just a node called useSyncExternalStore */}
        <div className="useses-tree-node useses-node-hook">
          <div className="useses-node-header">
            <span className="useses-node-title">useSyncExternalStore</span>
            <span className="useses-node-type">Hook Bridge</span>
          </div>
          <div className="useses-node-desc">
            <code>subscribe(callback) + getSnapshot()</code>
          </div>
        </div>

        {/* Vertical tree connector line */}
        <div className="useses-tree-connector">
          <span className="useses-connector-line" />
          <span className="useses-connector-arrow">▼</span>
        </div>

        {/* Node 3: A node called UI Interface which has a connected or disconnected element */}
        <div className="useses-tree-node useses-node-ui">
          <div className="useses-node-header">
            <span className="useses-node-title">UI Interface</span>
            <span className="useses-node-type">Subscribed Component</span>
          </div>
          <div className="useses-ui-status-box">
            <span className="useses-ui-label">Status:</span>
            {isConnected ? (
              <span className="useses-status-connected" id="ui-interface-status">
                Connected
              </span>
            ) : (
              <span className="useses-status-disconnected" id="ui-interface-status">
                Disconnected
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// useActionState: Login Form & Multi-Phase Pop-up
// ==========================================

export function UseSyncExternalStoreSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  return (
    <SandboxContainer hookName="useSyncExternalStore" onReset={onReset} isFullArena={true}>
      <UseSyncExternalStoreInnerSandbox
        onRecordRender={onRecordRender}
        onRecordTrace={onRecordTrace}
        onRecordMutation={onRecordMutation}
        onReset={onReset}
      />
    </SandboxContainer>
  );
}
