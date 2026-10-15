import { FORM_STATUS_TIMING_MS } from '../../constants/use-form-status.js';
import { useState, useRef, useEffect } from 'react';
import { SandboxContainer } from '../../shared/components';
import { SubmitButton, TraditionalFormCard, ModernFormCard } from './FormStatusCards.jsx';
import { SubmissionsStorageBox } from './SubmissionsStorageBox.jsx';

function UseFormStatusInnerSandbox({
  activeLessonId,
  onRecordRender,
  _onRecordTrace,
  onRecordMutation
}) {
  const [submissions, setSubmissions] = useState([]);
  const [showSubmittedPopup, setShowSubmittedPopup] = useState(false);
  const formRef = useRef(null);
  const popupTimerRef = useRef(null);

  const triggerSubmittedPopup = () => {
    setShowSubmittedPopup(true);
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => {
      setShowSubmittedPopup(false);
    }, FORM_STATUS_TIMING_MS.submittedPopup);
  };

  const handleAddSubmission = (text, source = 'useFormStatus') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      index: submissions.length + 1,
      text,
      source,
      timestamp: timeStr
    };

    setSubmissions((prev) => [...prev, newEntry]);
    triggerSubmittedPopup();

    if (onRecordMutation) {
      onRecordMutation({
        type: 'childList',
        target: 'Submissions Storage Box',
        description: `Stored submission #${newEntry.index} from [${source}]: "${text}". Displayed 1-second Submitted popup and cleared form.`
      });
    }
  };

  const handleStandardFormAction = async (formData) => {
    const rawText = formData.get('entryText');
    const text = typeof rawText === 'string' ? rawText.trim() : '';
    if (!text) return;

    if (onRecordRender) onRecordRender('Form Action Initiated (Pending: true)');
    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: 'Submit Button',
        description: 'useFormStatus set pending to true: button changed to Loading'
      });
    }

    await new Promise((resolve) => setTimeout(resolve, FORM_STATUS_TIMING_MS.submission));

    handleAddSubmission(text, 'useFormStatus');

    if (formRef.current) {
      formRef.current.reset();
    }

    if (onRecordRender) onRecordRender('Form Action Resolved (Pending: false)');
  };

  const handleClearSubmissions = () => {
    setSubmissions([]);
    if (onRecordRender) onRecordRender('Submissions Cleared');
  };

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, []);

  const isComparisonMode = activeLessonId === 'ufs-pending-state';

  return (
    <div className="form-status-playground-root" id="form-status-playground">
      {/* 1-second Submitted Pop-up Notification */}
      {showSubmittedPopup && (
        <div className="submitted-toast-popup" id="submitted-toast-popup">
          Submitted
        </div>
      )}

      {isComparisonMode ? (
        /* Side-by-Side Live Forms: Traditional (useState) vs useFormStatus */
        <div className="form-status-comparison-grid">
          <TraditionalFormCard
            onSubmitSuccess={(text) => handleAddSubmission(text, 'Traditional')}
            onRecordRender={onRecordRender}
            onRecordMutation={onRecordMutation}
          />
          <ModernFormCard
            onSubmitSuccess={(text) => handleAddSubmission(text, 'useFormStatus')}
            onRecordRender={onRecordRender}
            onRecordMutation={onRecordMutation}
          />
        </div>
      ) : (
        /* Single Form Card for other lessons */
        <div className="form-status-card">
          <div className="form-status-card-header">
            <h4 className="form-status-card-title">Text Input Form</h4>
            <span className="theme-pill-badge pill-parent">useFormStatus Consumer</span>
          </div>

          <form ref={formRef} action={handleStandardFormAction} className="form-status-inner-form">
            <div className="form-input-group">
              <label htmlFor="form-status-text-input" className="form-input-label">
                Text Message
              </label>
              <input
                type="text"
                id="form-status-text-input"
                name="entryText"
                className="form-text-input"
                placeholder="Enter text to submit..."
                required
                autoComplete="off"
              />
            </div>

            <SubmitButton />
          </form>
        </div>
      )}

      {/* Shared Submissions Storage Box */}
      <SubmissionsStorageBox
        submissions={submissions}
        onClear={handleClearSubmissions}
      />
    </div>
  );
}

/* =========================================================================
   USELAYOUTEFFECT PLAYGROUND: DUAL LIFECYCLE TREES WITH SIDE-BRANCHING EFFECTS
   ========================================================================= */

export function UseFormStatusSandbox({
  activeLessonId,
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  return (
    <SandboxContainer hookName="useFormStatus" onReset={onReset} isFullArena={true}>
      <UseFormStatusInnerSandbox
        activeLessonId={activeLessonId}
        onRecordRender={onRecordRender}
        onRecordTrace={onRecordTrace}
        onRecordMutation={onRecordMutation}
      />
    </SandboxContainer>
  );
}
