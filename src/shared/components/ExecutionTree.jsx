import React from 'react';

export function ExecutionTree({ executionTrace }) {
  if (!executionTrace) {
    return (
      <div className="execution-tree-container" style={{ textAlign: 'center', color: 'var(--salt-dim)' }}>
        Interact with the component sandbox above to trace events.
      </div>
    );
  }

  const { trigger, componentName, renderNumber, hooks, commit, effects } = executionTrace;
  const events = [];

  // 1. Trigger Event
  if (trigger) {
    events.push({
      name: trigger.label || 'User Event',
      type: 'trigger'
    });
  }

  // 2. Component Invocation / Render Event
  if (componentName) {
    events.push({
      name: `<${componentName} /> Render #${renderNumber || 1}`,
      type: 'component'
    });
  }

  // 3. Hook Events
  if (hooks && hooks.length > 0) {
    hooks.forEach((hook) => {
      let label = hook.name;
      if (hook.status) {
        label += ` (${hook.status})`;
      }
      events.push({
        name: label,
        type: 'hook'
      });
    });
  }

  // 4. DOM Commit Event
  if (commit) {
    const isBailedOut = hooks?.some((h) => h.bailedOut);
    const label = isBailedOut && commit.mutationsCount === 0
      ? 'DOM Commit (Skipped)'
      : 'DOM Commit';
    events.push({
      name: label,
      type: 'commit'
    });
  }

  // 5. Effect Events
  if (effects) {
    if (effects.cleanupRan) {
      events.push({
        name: 'useEffect Cleanup',
        type: 'effect'
      });
    }
    if (effects.ran) {
      events.push({
        name: 'useEffect Callback',
        type: 'effect'
      });
    }
  }

  return (
    <div className="execution-tree-container">
      <div className="event-flow-chain">
        {events.map((event, idx) => (
          <React.Fragment key={idx}>
            <div className={`event-step-pill ${event.type}`}>
              <span className="event-step-name">{event.name}</span>
            </div>
            {idx < events.length - 1 && (
              <span className="event-step-arrow">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
