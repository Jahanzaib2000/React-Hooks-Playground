import { SandboxContainer } from '../../shared/components';
import { UseEffectEventDirectSandbox } from './EffectEventDirectSandbox.jsx';
import { UseEffectEventCallComparisonSandbox } from './EffectEventCallComparisonSandbox.jsx';

// ==========================================
// useEffectEvent: Module 02 Dual Call Comparison Sandbox
// ==========================================

// ==========================================
// useEffect Playground: 2-State Perimeter Demo
// ==========================================

export function UseEffectEventSandbox({
  activeLessonId,
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  return (
    <SandboxContainer hookName="useEffectEvent" onReset={onReset} isFullArena={true}>
      {activeLessonId === 'uee-uninterrupted-call' ? (
        <UseEffectEventCallComparisonSandbox
          onRecordRender={onRecordRender}
          onRecordTrace={onRecordTrace}
          onRecordMutation={onRecordMutation}
          onReset={onReset}
        />
      ) : (
        <UseEffectEventDirectSandbox
          onRecordRender={onRecordRender}
          onRecordTrace={onRecordTrace}
          onRecordMutation={onRecordMutation}
          onReset={onReset}
        />
      )}
    </SandboxContainer>
  );
}
