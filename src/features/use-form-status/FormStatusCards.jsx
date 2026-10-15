import { FORM_STATUS_TIMING_MS } from '../../constants/use-form-status.js';
import { useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="form-submit-btn"
      id="btn-form-status-submit"
      disabled={pending}
    >
      {pending ? 'Loading' : 'Submit'}
    </button>
  );
}

export function TraditionalFormCard({ onSubmitSuccess, onRecordRender, onRecordMutation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [renderFlash, setRenderFlash] = useState(false);
  const [renderCount, setRenderCount] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;

    if (onRecordRender) onRecordRender('Traditional Form: isSubmitting set to true (Render +1)');
    setRenderFlash(true);
    setRenderCount((c) => c + 1);
    setIsSubmitting(true);

    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: 'Traditional Form',
        description: 'useState changed isSubmitting to true: re-rendered parent form'
      });
    }

    await new Promise((resolve) => setTimeout(resolve, FORM_STATUS_TIMING_MS.submission));

    onSubmitSuccess(trimmed);
    setText('');

    if (onRecordRender) onRecordRender('Traditional Form: isSubmitting set to false (Render +2)');
    setRenderCount((c) => c + 1);
    setIsSubmitting(false);
    setTimeout(() => setRenderFlash(false), FORM_STATUS_TIMING_MS.renderFlash);
  };

  return (
    <div className={`form-comparison-card card-traditional ${renderFlash ? 'card-flashing' : ''}`}>
      <div className="form-status-card-header">
        <h4 className="form-status-card-title">Traditional Form</h4>
        <span className="theme-pill-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          useState in Form
        </span>
      </div>

      <div className="form-efficiency-meter meter-warning">
        <span>Form Renders: {renderCount}</span>
        <span className="efficiency-tag tag-warning">+2 on every submit</span>
      </div>

      <form onSubmit={handleSubmit} className="form-status-inner-form">
        <div className="form-input-group">
          <label htmlFor="trad-text-input" className="form-input-label">
            Text Message
          </label>
          <input
            type="text"
            id="trad-text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="form-text-input"
            placeholder="Type text (traditional)..."
            disabled={isSubmitting}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          className="form-submit-btn"
          id="btn-traditional-submit"
          disabled={isSubmitting}
          style={{ background: isSubmitting ? '#334155' : '#dc2626' }}
        >
          {isSubmitting ? 'Loading' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export function ModernFormCard({ onSubmitSuccess, onRecordRender, onRecordMutation }) {
  const formRef = useRef(null);
  const renderCount = 1;

  const handleAction = async (formData) => {
    const rawText = formData.get('entryText');
    const text = typeof rawText === 'string' ? rawText.trim() : '';
    if (!text) return;

    if (onRecordRender) onRecordRender('useFormStatus: Button pending changed to true (Parent Form: 0 renders)');
    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: 'Submit Button',
        description: 'useFormStatus read pending from Form Context (Parent Form: 0 renders)'
      });
    }

    await new Promise((resolve) => setTimeout(resolve, FORM_STATUS_TIMING_MS.submission));

    onSubmitSuccess(text);

    if (formRef.current) {
      formRef.current.reset();
    }

    if (onRecordRender) onRecordRender('useFormStatus: Form action completed (Parent Form: 0 renders)');
  };

  return (
    <div className="form-comparison-card card-optimized">
      <div className="form-status-card-header">
        <h4 className="form-status-card-title">useFormStatus Form</h4>
        <span className="theme-pill-badge pill-parent">
          Form Context
        </span>
      </div>

      <div className="form-efficiency-meter meter-success">
        <span>Form Renders: {renderCount}</span>
        <span className="efficiency-tag tag-success">0 on submit (Isolated)</span>
      </div>

      <form ref={formRef} action={handleAction} className="form-status-inner-form">
        <div className="form-input-group">
          <label htmlFor="modern-text-input" className="form-input-label">
            Text Message
          </label>
          <input
            type="text"
            id="modern-text-input"
            name="entryText"
            className="form-text-input"
            placeholder="Type text (useFormStatus)..."
            required
            autoComplete="off"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
