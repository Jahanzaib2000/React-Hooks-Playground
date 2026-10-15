import { UseOptimisticInnerSandbox } from './OptimisticRequestSandbox.jsx';
import { SandboxContainer } from '../../shared/components';

export function OptimisticSandboxView({
  handleReset,
  selectedTokenId,
  confirmedColor,
  sluggishColor,
  optimisticColor,
  isServerOn,
  isOptimisticPending,
  optimisticCountdown,
  optimisticStatusBanner,
  handleServerToggle,
  handleChameleonClick
}) {
  return (
    <SandboxContainer hookName="useOptimistic" onReset={handleReset}>
      <UseOptimisticInnerSandbox
        selectedTokenId={selectedTokenId}
        confirmedColor={confirmedColor}
        displayColor={selectedTokenId === 'traditional-sluggish' ? sluggishColor : optimisticColor}
        isServerOn={isServerOn}
        isPending={isOptimisticPending}
        countdown={optimisticCountdown}
        statusBanner={optimisticStatusBanner}
        onToggleServer={handleServerToggle}
        onChameleonClick={handleChameleonClick}
      />
    </SandboxContainer>
  );
}
