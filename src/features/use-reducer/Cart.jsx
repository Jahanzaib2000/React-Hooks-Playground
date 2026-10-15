

export function Cart({
  cartState,
  onIncrementItem,
  onDecrementFromCart,
  onStartRemove,
  onClearCart,
  isAnimating,
  boxRef
}) {
  return (
    <div className="cart-box-container cart-summary-box" id="box-2-cart" ref={boxRef}>
      <div className="cart-box-title-row">
        <span className="cart-box-title">Box 2: Shopping Cart</span>
        <span className="cart-count-badge" id="cart-item-count">
          {cartState.totalCount} {cartState.totalCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {cartState.items.length === 0 ? (
        <div className="cart-empty-state" id="cart-empty-message">
          Your cart is empty. Add products from Box 1.
        </div>
      ) : (
        <div className="cart-items-list" id="cart-items-container">
          {cartState.items.map((item) => (
            <div key={item.id} className="cart-item-row" id={`cart-row-${item.id}`}>
              <div className="cart-item-title-col">
                <span className="cart-item-icon">{item.icon}</span>
                <div className="cart-item-text">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-qty-controls">
                    <button
                      type="button"
                      className="cart-qty-btn"
                      id={`dec-btn-${item.id}`}
                      title={`Decrease quantity of ${item.name}`}
                      disabled={isAnimating}
                      onClick={() => onDecrementFromCart(item.id)}
                    >
                      −
                    </button>
                    <span className="cart-item-qty">×{item.quantity}</span>
                    <button
                      type="button"
                      className="cart-qty-btn"
                      id={`inc-btn-${item.id}`}
                      title={`Increase quantity of ${item.name}`}
                      disabled={isAnimating}
                      onClick={() => onIncrementItem(item)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="cart-item-actions-col">
                <span className="cart-item-subtotal">${item.price * item.quantity}</span>
                <button
                  type="button"
                  className="cart-item-remove-btn"
                  id={`remove-btn-${item.id}`}
                  title={`Remove ${item.name} from cart`}
                  disabled={isAnimating}
                  style={{ opacity: isAnimating ? 0.6 : 1, cursor: isAnimating ? 'wait' : 'pointer' }}
                  onClick={() => onStartRemove(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-summary-bar">
        <div className="cart-totals-readout">
          <span>Total:</span>
          <span className="cart-total-price" id="cart-total-amount">
            ${cartState.totalAmount}
          </span>
        </div>
        <button
          type="button"
          className="cart-clear-btn"
          id="cart-clear-btn"
          disabled={isAnimating || cartState.items.length === 0}
          onClick={onClearCart}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
