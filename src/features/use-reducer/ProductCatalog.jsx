import { CATALOG_PRODUCTS } from '../../constants/use-reducer.js';

export function ProductCatalog({ onAddToCart, isAnimating, boxRef }) {
  return (
    <div className="cart-box-container catalog-box" id="box-1-catalog" ref={boxRef}>
      <div className="cart-box-title-row">
        <span className="cart-box-title">Box 1: Store Catalog</span>
        <span className="cart-count-badge">{CATALOG_PRODUCTS.length} Products</span>
      </div>
      <div className="catalog-items-grid">
        {CATALOG_PRODUCTS.map((prod) => (
          <div key={prod.id} className="catalog-item-card" id={`catalog-item-${prod.id}`}>
            <div className="catalog-item-info">
              <span className="catalog-item-icon">{prod.icon}</span>
              <div className="catalog-item-text">
                <div className="catalog-item-name">{prod.name}</div>
                <div className="catalog-item-price">${prod.price}</div>
              </div>
            </div>
            <button
              type="button"
              className="catalog-add-btn"
              id={`add-btn-${prod.id}`}
              disabled={isAnimating}
              style={{ opacity: isAnimating ? 0.6 : 1, cursor: isAnimating ? 'wait' : 'pointer' }}
              onClick={() => onAddToCart(prod)}
            >
              + Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
