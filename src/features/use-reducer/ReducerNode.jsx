

export function ReducerFunctionsRow({
  activeHookTarget,
  isAnimating,
  canRemove,
  onPressAddFn,
  onPressRemoveFn
}) {
  return (
    <div className="reducer-functions-row" id="reducer-functions-toolbar">
      <button
        type="button"
        className={`reducer-fn-btn fn-add ${activeHookTarget === 'add' ? 'hook-connected' : ''}`}
        id="btn-add-function"
        title="Add function (calls addItem case in reducer)"
        disabled={isAnimating}
        onClick={onPressAddFn}
      >
        <span className="fn-tag">+</span>
        <span className="fn-label">add function</span>
        <div className="fn-socket socket-bottom" />
      </button>

      <button
        type="button"
        className={`reducer-fn-btn fn-remove ${activeHookTarget === 'remove' ? 'hook-connected' : ''}`}
        id="btn-remove-function"
        title="Remove function (calls removeItem case in reducer)"
        disabled={isAnimating || !canRemove}
        onClick={onPressRemoveFn}
      >
        <span className="fn-tag">−</span>
        <span className="fn-label">remove function</span>
        <div className="fn-socket socket-bottom" />
      </button>
    </div>
  );
}

export function HookLane({ activeHookTarget, hookStage }) {
  return (
    <div className={`reducer-hook-lane ${activeHookTarget ? `hooking-${activeHookTarget}` : ''}`} id="hook-lane">
      <svg className="hook-cable-svg" viewBox="0 0 160 32" preserveAspectRatio="none">
        {activeHookTarget === 'add' && (
          <path
            d="M 80,32 C 80,16 40,20 40,0"
            className={`hook-cable-path hook-cable-add ${
              hookStage === 'retracting'
                ? 'cable-retracting'
                : hookStage === 'hooked'
                ? 'cable-hooked'
                : 'cable-extending'
            }`}
          />
        )}
        {activeHookTarget === 'remove' && (
          <path
            d="M 80,32 C 80,16 120,20 120,0"
            className={`hook-cable-path hook-cable-remove ${
              hookStage === 'retracting'
                ? 'cable-retracting'
                : hookStage === 'hooked'
                ? 'cable-hooked'
                : 'cable-extending'
            }`}
          />
        )}
      </svg>
      {activeHookTarget && (
        <div
          className={`hook-claw-node claw-${activeHookTarget} claw-${hookStage}`}
          title="React useReducer Hook connection"
        >
          <span className="hook-claw-icon">🪝</span>
        </div>
      )}
    </div>
  );
}

export function ReducerBox({ animPhase, activeHookTarget, hookStage, boxRef }) {
  const isAddActive = animPhase === 'in-box3';
  const isRemoveActive = animPhase === 'remove-in-box3';
  const isRemovingAny = animPhase.startsWith('remove-') || animPhase === 'in-trash';

  let statusLabel = 'Idle';
  if (hookStage === 'retracting') {
    statusLabel = '🪝 Unhooking...';
  } else if (animPhase === 'in-box3') {
    statusLabel = '⚡ Reducer: ADD_ITEM';
  } else if (animPhase === 'to-box2') {
    statusLabel = '🛒 Placing in Cart...';
  } else if (animPhase === 'to-box3') {
    statusLabel = '📦 Moving to Reducer...';
  } else if (animPhase === 'remove-to-box3') {
    statusLabel = '📦 Pulling from Cart...';
  } else if (animPhase === 'remove-in-box3') {
    statusLabel = '⚡ Reducer: REMOVE_ITEM';
  } else if (animPhase === 'remove-to-trash') {
    statusLabel = '🗑️ Moving to Trash...';
  } else if (animPhase === 'in-trash') {
    statusLabel = '🔥 Vaporizing in Trash...';
  } else if (activeHookTarget === 'add') {
    statusLabel = '🪝 Hook: add fn';
  } else if (activeHookTarget === 'remove') {
    statusLabel = '🪝 Hook: remove fn';
  }

  return (
    <div
      className={`cart-box-container reducer-node-box ${
        isAddActive ? 'reducer-active-pulse' : ''
      } ${isRemoveActive ? 'reducer-remove-pulse' : ''}`}
      id="box-3-reducer"
      ref={boxRef}
    >
      <div className="reducer-node-socket socket-left" title="Input Wire from Box 1" />
      <div
        className={`reducer-node-socket socket-top-left ${activeHookTarget === 'add' ? 'socket-active-add' : ''}`}
        title="Hook to Add Function"
      />
      <div
        className={`reducer-node-socket socket-top-right ${activeHookTarget === 'remove' ? 'socket-active-remove' : ''}`}
        title="Hook to Remove Function"
      />
      <div className="reducer-node-title">useReducer</div>
      <div
        className={`reducer-node-status ${isAddActive || activeHookTarget === 'add' ? 'active' : ''} ${
          isRemoveActive || isRemovingAny || activeHookTarget === 'remove' ? 'remove-active' : ''
        }`}
      >
        {statusLabel}
      </div>
      <div className="reducer-node-socket socket-right" title="Wire to Box 2" />
      {isRemovingAny && (
        <div className="reducer-node-socket socket-bottom socket-active" title="Trash Wire to Bin" />
      )}
    </div>
  );
}
