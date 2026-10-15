import { OptimisticRequestView } from './OptimisticRequestView.jsx';
import { COLOR_WHITE } from '../../constants/use-optimistic.js';

export function UseOptimisticInnerSandbox({
  _selectedTokenId,
  confirmedColor,
  displayColor,
  isServerOn,
  isPending,
  _countdown,
  statusBanner,
  onToggleServer,
  onChameleonClick
}) {
  const isWhite = displayColor.toLowerCase() === COLOR_WHITE.hex;

  return (
    <OptimisticRequestView
      isServerOn={isServerOn}
      onToggleServer={onToggleServer}
      isPending={isPending}
      displayColor={displayColor}
      isWhite={isWhite}
      onChameleonClick={onChameleonClick}
      confirmedColor={confirmedColor}
      statusBanner={statusBanner}
    />
  );
}
