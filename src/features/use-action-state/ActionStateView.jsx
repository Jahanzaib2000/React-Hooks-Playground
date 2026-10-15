import { DEMO_PASSWORD } from '../../constants/use-action-state.js';

export function ActionStateView({
  popup,
  handleClosePopup,
  formAction,
  email,
  password,
  setPassword,
  isPending,
  handleResetForm
}) {
  return (
    <div className="uas-sandbox-root">
      {/* Pop-up positioned above the sandbox, NO backdrop blur */}
      {popup.isOpen && (
        <div className="uas-popup-card" id="uas-popup-container">
          <div className="uas-popup-header">
            <span className="uas-popup-badge">
              {popup.phase === 1
                ? 'Phase 1: Validation'
                : popup.phase === 2
                ? 'Phase 2: Hook Confirmation'
                : popup.status === 'success'
                ? 'Authenticated'
                : 'Authentication Error'}
            </span>
            <button
              type="button"
              className="uas-popup-close-btn"
              onClick={handleClosePopup}
              title="Close notification"
            >
              ✕
            </button>
          </div>
          <div className="uas-popup-body">
            <p
              id="uas-popup-message"
              className={`uas-popup-message ${
                popup.status === 'success'
                  ? 'status-success'
                  : popup.status === 'error'
                  ? 'status-error'
                  : 'status-pending'
              }`}
            >
              {popup.message}
            </p>
          </div>
          {popup.phase === 3 && (
            <div className="uas-popup-footer">
              <span className="uas-popup-timestamp">Resolved via useActionState</span>
              <button
                type="button"
                className="uas-popup-dismiss-btn"
                onClick={handleClosePopup}
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* Login Form Card */}
      <div className="uas-login-card">
        <div className="uas-form-header">
          <h3 className="uas-form-title">Account Login</h3>
          <p className="uas-form-subtitle">React 19 useActionState Sandbox</p>
        </div>

        <form action={formAction} className="uas-form-body">
          <div className="uas-field-group">
            <label className="uas-field-label" htmlFor="uas-email-input">
              Email Address
            </label>
            <input
              id="uas-email-input"
              name="email"
              type="email"
              className="uas-text-input"
              value={email}
              readOnly
            />
          </div>

          <div className="uas-field-group">
            <label className="uas-field-label" htmlFor="uas-password-input">
              Password
            </label>
            <input
              id="uas-password-input"
              name="password"
              type="password"
              className="uas-text-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="uas-actions-group">
            <button
              type="submit"
              className="uas-submit-btn"
              disabled={isPending}
            >
              {isPending ? 'Verifying...' : 'Sign In'}
            </button>
            <div className="uas-password-hint">
              Hint: Password is "{DEMO_PASSWORD}"
            </div>
          </div>
        </form>

        <div className="uas-card-footer">
          <button
            type="button"
            className="uas-reset-btn"
            onClick={handleResetForm}
            disabled={isPending}
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
}
