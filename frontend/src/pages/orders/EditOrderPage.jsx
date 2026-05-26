import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderForm from "../../components/orders/OrderForm";
import { getOrder, updateOrder } from "../../services/orders";
import { getAllCustomers } from "../../services/customers";
import { getAllActiveProducts } from "../../services/products";

export default function EditOrderPage() {
  const { id }                  = useParams();
  const navigate                = useNavigate();
  const [order, setOrder]       = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors]     = useState({});

  useEffect(() => {
    Promise.all([getOrder(id), getAllCustomers(), getAllActiveProducts()])
      .then(([o, c, p]) => {
        setOrder(o.data);
        setCustomers(c.data);
        setProducts(p.data);
      })
      .catch(() => setErrors({ _general: "Failed to load order." }))
      .finally(() => setFetching(false));
  }, [id]);

  async function handleSubmit(data) {
    setLoading(true);
    setErrors({});
    try {
      await updateOrder(id, data);
      navigate("/orders");
    } catch (err) {
      setErrors(err.errors ?? { _general: err.message });
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="page">
        <p style={{ color: "var(--color-muted)" }}>Loading…</p>
      </div>
    );
  }

  // Map stored order items → form item shape { product_id, quantity }
  const initialValues = order
    ? {
        customer_id: order.customer_id ?? order.customer?.id ?? "",
        status:      order.status,
        notes:       order.notes ?? "",
        items:       (order.items ?? []).map((item) => ({
          product_id: item.product_id ?? "",
          quantity:   item.quantity,
        })),
      }
    : {};

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Edit Order</h1>
          <p>{order?.order_number ?? "—"}</p>
        </div>
      </div>

      {errors._general && !order && (
        <p className="alert-error">{errors._general}</p>
      )}

      {order && (
        <div className="form-card form-card--wide">
          <OrderForm
            key={order.id}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            loading={loading}
            errors={errors}
            submitLabel="Save Changes"
            customers={customers}
            products={products}
          />
        </div>
      )}
    </div>
  );
}
