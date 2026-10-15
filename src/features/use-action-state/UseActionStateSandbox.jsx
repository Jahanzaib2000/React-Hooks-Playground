import { ActionStateView } from './ActionStateView.jsx';
import { DEFAULT_EMAIL, DEMO_PASSWORD, ACTION_STATE_TIMING_MS } from '../../constants/use-action-state.js';
import { useState, useActionState } from 'react';
import { SandboxContainer } from '../../shared/components';

function UseActionStateInnerSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  const [renderCount, setRenderCount] = useState(1);
  const [email] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState({
    isOpen: false,
    phase: 0,
    message: '',
    status: 'idle'
  });

  const [_state, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      const submittedEmail = formData.get('email') || email;
      const submittedPassword = formData.get('password') ?? password;
      const nextRender = renderCount + 1;
      setRenderCount(nextRender);

      // Phase 1: Validating login information (2s)
      setPopup({
        isOpen: true,
        phase: 1,
        message: 'Validating login information.',
        status: 'pending'
      });

      if (onRecordRender) {
        onRecordRender({
          renderNumber: nextRender,
          trigger: 'Form Action: Validating login information.',
          prevState: previousState,
          currentState: { phase: 1, isPending: true }
        });
      }

      if (onRecordTrace) {
        onRecordTrace({
          trigger: { label: 'Form Submit (formAction)', type: 'Form Action Start' },
          componentName: 'LoginForm',
          renderNumber: nextRender,
          hooks: [
            {
              slot: 0,
              name: 'useActionState',
              status: 'isPending: true (Phase 1: Validating)',
              prevState: JSON.stringify(previousState),
              nextState: JSON.stringify({ phase: 1, status: 'validating' }),
              actionLabel: 'Validating login information.'
            }
          ],
          commit: {
            diffSummary: 'Pop-up opened: "Validating login information." (Phase 1 for 2s)',
            mutationsCount: 1
          },
          effects: null
        });
      }

      // Wait 2 seconds for Phase 1
      await new Promise((resolve) => setTimeout(resolve, ACTION_STATE_TIMING_MS.validation));

      // Phase 2: useActionState confirming response (3s)
      setPopup({
        isOpen: true,
        phase: 2,
        message: 'useActionState confirming response',
        status: 'pending'
      });

      if (onRecordTrace) {
        onRecordTrace({
          trigger: { label: 'Transition (Phase 2)', type: 'Action Progress' },
          componentName: 'LoginForm',
          renderNumber: nextRender,
          hooks: [
            {
              slot: 0,
              name: 'useActionState',
              status: 'isPending: true (Phase 2: Confirming)',
              prevState: JSON.stringify({ phase: 1 }),
              nextState: JSON.stringify({ phase: 2, status: 'confirming' }),
              actionLabel: 'useActionState confirming response'
            }
          ],
          commit: {
            diffSummary: 'Pop-up updated: "useActionState confirming response" (Phase 2 for 3s)',
            mutationsCount: 1
          },
          effects: null
        });
      }

      // Wait 3 seconds for Phase 2
      await new Promise((resolve) => setTimeout(resolve, ACTION_STATE_TIMING_MS.confirmation));

      // Phase 3: Final validation check
      const isValid = submittedPassword === DEMO_PASSWORD;
      const finalMessage = isValid ? 'logged in' : 'incorrect login or password';
      const finalStatus = isValid ? 'success' : 'error';

      setPopup({
        isOpen: true,
        phase: 3,
        message: finalMessage,
        status: finalStatus
      });

      if (onRecordMutation) {
        onRecordMutation({
          type: 'content',
          target: '#uas-popup-message',
          oldValue: 'useActionState confirming response',
          newValue: finalMessage,
          timestamp: Date.now()
        });
      }

      if (onRecordTrace) {
        onRecordTrace({
          trigger: { label: `Action Complete: ${finalMessage}`, type: 'Form Action Resolved' },
          componentName: 'LoginForm',
          renderNumber: nextRender + 1,
          hooks: [
            {
              slot: 0,
              name: 'useActionState',
              status: `Resolved: ${finalMessage}`,
              prevState: JSON.stringify({ phase: 2 }),
              nextState: JSON.stringify({ status: finalStatus, message: finalMessage }),
              actionLabel: `Result: ${finalMessage}`
            }
          ],
          commit: {
            diffSummary: `Pop-up resolved: "${finalMessage}" (${isValid ? 'Green' : 'Red'})`,
            mutationsCount: 1
          },
          effects: null
        });
      }

      return {
        email: submittedEmail,
        status: finalStatus,
        message: finalMessage
      };
    },
    { status: 'idle', message: null }
  );

  const handleClosePopup = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
  };

  const handleResetForm = () => {
    setPassword('');
    setPopup({ isOpen: false, phase: 0, message: '', status: 'idle' });
    if (onReset) onReset();
  };

  return (
    <ActionStateView
      popup={popup}
      handleClosePopup={handleClosePopup}
      formAction={formAction}
      email={email}
      password={password}
      setPassword={setPassword}
      isPending={isPending}
      handleResetForm={handleResetForm}
    />
  );
}

// ==========================================
// use Hook: Dual-Lane Timeline Sandbox
// ==========================================

export function UseActionStateSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  return (
    <SandboxContainer hookName="useActionState" onReset={onReset} isFullArena={true}>
      <UseActionStateInnerSandbox
        onRecordRender={onRecordRender}
        onRecordTrace={onRecordTrace}
        onRecordMutation={onRecordMutation}
        onReset={onReset}
      />
    </SandboxContainer>
  );
}
