

export function SubmissionsStorageBox({ submissions, onClear }) {
  return (
    <div className="submissions-storage-box" id="submissions-storage-box">
      <div className="submissions-box-header">
        <div className="submissions-title-row">
          <h4 className="submissions-title">Submissions Storage Box</h4>
          <span className="submissions-count-badge">
            {submissions.length} {submissions.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        {submissions.length > 0 && (
          <button
            type="button"
            className="submissions-clear-btn"
            onClick={onClear}
            title="Clear all stored submissions"
          >
            Clear
          </button>
        )}
      </div>

      <div className="submissions-list">
        {submissions.length === 0 ? (
          <div className="submissions-empty-state">
            No submissions yet. Enter text above and click Submit.
          </div>
        ) : (
          submissions.map((item) => (
            <div key={item.id} className="submission-item-card">
              <span className="submission-index-badge">#{item.index}</span>
              {item.source && (
                <span className={`submission-origin-badge origin-${item.source.toLowerCase()}`}>
                  {item.source}
                </span>
              )}
              <span className="submission-text-content">{item.text}</span>
              <span className="submission-time-badge">{item.timestamp}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
