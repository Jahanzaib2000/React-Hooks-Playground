import { ProductCatalog } from './ProductCatalog.jsx';
import { Cart } from './Cart.jsx';
import { ReducerFunctionsRow, HookLane, ReducerBox } from './ReducerNode.jsx';
import { TrashZone, WireLane } from './ReducerWires.jsx';

export function ReducerPlaygroundView({
  rootRef,
  handleStartAdd,
  isAnimating,
  box1Ref,
  animPhase,
  activeHookTarget,
  cartState,
  handleDirectAddFn,
  handleDirectRemoveFn,
  hookStage,
  box3Ref,
  showTrash,
  trashBoxRef,
  trashExiting,
  onAddToCart,
  onDecrementFromCart,
  handleStartRemove,
  onClearCart,
  box2Ref,
  animatingItem,
  animType,
  packetPos
}) {
  return (
    <div className="cart-playground-root" ref={rootRef}>
      {/* Box 1: Store Catalog */}
      <ProductCatalog
        onAddToCart={handleStartAdd}
        isAnimating={isAnimating}
        boxRef={box1Ref}
      />

      {/* Wire 1: Box 1 to Box 3 */}
      <WireLane laneNumber={1} isActive={animPhase === 'to-box3'} isRemoving={false} />

      {/* Center Column: Functions + Hook Lane + Box 3 (useReducer) + Conditional Trash Box */}
      <div className="cart-center-column">
        {/* 2 Buttons above useReducer for add and remove function */}
        <ReducerFunctionsRow
          activeHookTarget={activeHookTarget}
          isAnimating={isAnimating}
          canRemove={cartState.items.length > 0}
          onPressAddFn={handleDirectAddFn}
          onPressRemoveFn={handleDirectRemoveFn}
        />

        {/* Hook Animation Arm */}
        <HookLane activeHookTarget={activeHookTarget} hookStage={hookStage} />

        <ReducerBox
          animPhase={animPhase}
          activeHookTarget={activeHookTarget}
          hookStage={hookStage}
          boxRef={box3Ref}
        />

        {showTrash && (
          <TrashZone
            animPhase={animPhase}
            trashBoxRef={trashBoxRef}
            isExiting={trashExiting}
          />
        )}
      </div>

      {/* Wire 2: Box 3 to Box 2 */}
      <WireLane
        laneNumber={2}
        isActive={animPhase === 'to-box2'}
        isRemoving={animPhase === 'remove-to-box3'}
      />

      {/* Box 2: Shopping Cart */}
      <Cart
        cartState={cartState}
        onIncrementItem={onAddToCart}
        onDecrementFromCart={onDecrementFromCart}
        onStartRemove={handleStartRemove}
        onClearCart={onClearCart}
        isAnimating={isAnimating}
        boxRef={box2Ref}
      />

      {/* Traveling Item Animation Packet */}
      {animatingItem && (
        <div
          className={`traveling-item-packet stage-${animPhase} type-${animType}`}
          style={{
            left: `${packetPos.x}px`,
            top: `${packetPos.y}px`
          }}
        >
          <span className="packet-icon">{animatingItem.icon}</span>
          <span className="packet-label">
            {animPhase === 'to-box2'
              ? '+1 Cart'
              : animPhase === 'remove-to-box3'
              ? 'DISPATCH: REMOVE'
              : animPhase === 'remove-in-box3'
              ? '⚡ REDUCING'
              : animPhase === 'remove-to-trash'
              ? '🗑️ TRASHING'
              : animPhase === 'in-trash'
              ? '💥 DELETED'
              : 'ADD_ITEM'}
          </span>
        </div>
      )}
    </div>
  );
}
