import { SandboxContainer } from '../../shared/components';
import { UseContextTreeSandbox } from './UseContextTreeSandbox';
import { UseContextDirectSandbox } from './ContextDirectSandbox.jsx';

/* =========================================================================
   USECONTEXT TREE PLAYGROUND: 3 LAYERS BINARY TREE + SIDE BROADCAST HUB
   ========================================================================= */

export function UseContextSandbox({
  activeLessonId,
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  return (
    <SandboxContainer hookName="useContext" onReset={onReset} isFullArena={true}>
      {activeLessonId === 'uc-provider-scope' ? (
        <UseContextTreeSandbox
          onRecordRender={onRecordRender}
          onRecordTrace={onRecordTrace}
          onRecordMutation={onRecordMutation}
        />
      ) : (
        <UseContextDirectSandbox
          onRecordRender={onRecordRender}
          onRecordTrace={onRecordTrace}
          onRecordMutation={onRecordMutation}
        />
      )}
    </SandboxContainer>
  );
}
