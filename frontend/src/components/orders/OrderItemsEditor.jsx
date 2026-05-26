const EMPTY_ITEM = { product_id: "", quantity: 1 };

function getProduct(products, productId) {
  return products.find((p) => String(p.id) === String(productId)) ?? null;
}

function calcLineTotal(product, quantity) {
  if (!product || !quantity) return 0;
  return Number(product.price) * Number(quantity);
}

export default function OrderItemsEditor({ items, products, errors, onChange }) {
  function updateItem(index, field, value) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  }

  function addItem() {
    onChange([...items, { ...EMPTY_ITEM }]);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  const subtotal = items.reduce((sum, item) => {
    const product = getProduct(products, item.product_id);
    return sum + calcLineTotal(product, item.quantity);
  }, 0);

  return (
    <div className="items-editor">
      <div className="items-editor-header">
        <span className="items-editor-label">Line Items</span>
        <button type="button" className="btn-secondary btn-sm" onClick={addItem}>
          + Add Item
        </button>
      </div>

      {items.length === 0 && (
        <p style={{ color: "var(--color-muted)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
          No items yet. Add at least one product.
        </p>
      )}

      {errors?.items && typeof errors.items === "string" && (
        <p className="field-error" style={{ marginBottom: "0.5rem" }}>{errors.items}</p>
      )}

      {items.map((item, index) => {
        const product  = getProduct(products, item.product_id);
        const lineTotal = calcLineTotal(product, item.quantity);

        return (
          <div key={index} className="order-item-row">
            {/* Product select */}
            <div className="field" style={{ margin: 0 }}>
              {index === 0 && <label>Product</label>}
              <select
                value={item.product_id}
                onChange={(e) => updateItem(index, "product_id", e.target.value)}
              >
                <option value="">Select product…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
              {errors?.[`items.${index}.product_id`] && (
                <p className="field-error">{errors[`items.${index}.product_id`][0]}</p>
              )}
            </div>

            {/* Quantity */}
            <div className="field" style={{ margin: 0 }}>
              {index === 0 && <label>Qty</label>}
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
              />
              {errors?.[`items.${index}.quantity`] && (
                <p className="field-error">{errors[`items.${index}.quantity`][0]}</p>
              )}
            </div>

            {/* Unit price — read-only display */}
            <div className="field" style={{ margin: 0 }}>
              {index === 0 && <label>Unit Price</label>}
              <div className="readonly-value">
                {product ? `$${Number(product.price).toFixed(2)}` : "—"}
              </div>
            </div>

            {/* Line total */}
            <div className="field" style={{ margin: 0 }}>
              {index === 0 && <label>Line Total</label>}
              <div className="readonly-value" style={{ fontWeight: 600 }}>
                {lineTotal > 0 ? `$${lineTotal.toFixed(2)}` : "—"}
              </div>
            </div>

            {/* Remove */}
            <div style={{ paddingTop: index === 0 ? "1.5rem" : 0 }}>
              <button
                type="button"
                className="btn-danger btn-sm"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                title="Remove item"
              >
                &times;
              </button>
            </div>
          </div>
        );
      })}

      {/* Totals */}
      {items.length > 0 && (
        <div className="order-totals">
          <div className="order-total-row grand-total">
            <span className="order-total-label">Total</span>
            <span className="order-total-value">${subtotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
