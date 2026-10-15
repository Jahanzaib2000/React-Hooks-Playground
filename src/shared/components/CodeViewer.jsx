import { useState } from 'react';

export function CodeViewer({
  lessons,
  activeLessonId,
  onSelectLesson,
  lesson,
  selectedTokenId,
  onSelectToken
}) {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const activeToken = lesson.tokenOptions.find(t => t.id === selectedTokenId) || lesson.tokenOptions[0];
  const codeLines = lesson.codeTemplate(activeToken.label).split('\n');

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, flexWrap: 'wrap' }}>
          <span className="panel-title" style={{ whiteSpace: 'nowrap' }}>
            Component Source
          </span>

          {/* Lesson Selector Buttons */}
          <div className="lesson-btn-group">
            {lessons.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`lesson-btn ${l.id === activeLessonId ? 'active' : ''}`}
                onClick={() => onSelectLesson(l.id)}
              >
                {l.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {lesson.splitCodes ? (
        <div className="code-split-container">
          <div className="code-split-pane pane-traditional">
            <div className="code-split-header">
              <span className="code-split-title">{lesson.splitCodes.left.title}</span>
              <span className="code-split-badge badge-inefficient">{lesson.splitCodes.left.badge}</span>
            </div>
            <pre className="code-canvas split-canvas">
              <code>
                {lesson.splitCodes.left.code.split('\n').map((line, idx) => (
                  <div key={idx} className="code-line">
                    <span className="line-num">{idx + 1}</span>
                    <span className="line-text">{line}</span>
                  </div>
                ))}
              </code>
            </pre>
            <div className="code-split-footer footer-inefficient">
              {lesson.splitCodes.left.note}
            </div>
          </div>

          <div className="code-split-pane pane-optimized">
            <div className="code-split-header">
              <span className="code-split-title">{lesson.splitCodes.right.title}</span>
              <span className="code-split-badge badge-efficient">{lesson.splitCodes.right.badge}</span>
            </div>
            <pre className="code-canvas split-canvas">
              <code>
                {lesson.splitCodes.right.code.split('\n').map((line, idx) => (
                  <div key={idx} className="code-line">
                    <span className="line-num">{idx + 1}</span>
                    <span className="line-text">{line}</span>
                  </div>
                ))}
              </code>
            </pre>
            <div className="code-split-footer footer-efficient">
              {lesson.splitCodes.right.note}
            </div>
          </div>
        </div>
      ) : (
        <pre className="code-canvas">
          <code>
            {codeLines.map((line, idx) => {
              const hasTokenMarker = line.includes('<TOKEN>');
              if (hasTokenMarker) {
                const [before, after] = line.split('<TOKEN>');
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--salt-dim)', userSelect: 'none', width: 34, marginRight: 8, display: 'inline-block', fontSize: 13 }}>{idx + 1}</span>
                    <span>{before}</span>
                    <button
                      type="button"
                      className={`token-pill ${activeToken.isBroken ? 'broken' : ''}`}
                      onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                      title="Click to toggle code variant"
                    >
                      <span>{activeToken.label}</span>
                      <span style={{ fontSize: 9, opacity: 0.7 }}>▾</span>
                    </button>
                    <span>{after}</span>
                  </div>
                );
              }

              return (
                <div key={idx}>
                  <span style={{ color: 'var(--salt-dim)', userSelect: 'none', width: 34, marginRight: 8, display: 'inline-block', fontSize: 13 }}>{idx + 1}</span>
                  <span>{line}</span>
                </div>
              );
            })}
          </code>
        </pre>
      )}

      {/* Inline Token Switcher */}
      {!lesson.splitCodes && isSwitcherOpen && (
        <div className="token-switcher">
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--salt-dim)', textTransform: 'uppercase', marginBottom: 4 }}>
            Toggle Token Variant:
          </div>
          {lesson.tokenOptions.map((opt) => (
            <div
              key={opt.id}
              className={`token-option-row ${opt.id === selectedTokenId ? 'active' : ''}`}
              onClick={() => {
                onSelectToken(opt.id);
                setIsSwitcherOpen(false);
              }}
            >
              <div>
                <strong style={{ fontFamily: 'var(--font-mono)' }}>{opt.preview}</strong>
                <div style={{ fontSize: 11, color: 'var(--salt-dim)', marginTop: 2 }}>{opt.hint}</div>
              </div>
              <span className={`tree-tag ${opt.isBroken ? 'broken' : 'hook'}`}>
                {opt.isBroken ? '⚠️ Buggy' : '✓ Clean'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
