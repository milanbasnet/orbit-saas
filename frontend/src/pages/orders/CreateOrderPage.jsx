import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderForm from "../../components/orders/OrderForm";
import { createOrder } from "../../services/orders";
import { getAllCustomers } from "../../services/customers";
import { getAllActiveProducts } from "../../services/products";

export default function CreateOrderPage() {
  const navigate              = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [errors, setErrors]       = useState({});

  useEffect(() => {
    Promise.all([getAllCustomers(), getAllActiveProducts()])
      .then(([c, p]) => {
        setCustomers(c.data);
        setProducts(p.data);
      })
      .catch(() => setErrors({ _general: "Failed to load form data." }))
      .finally(() => setFetching(false));
  }, []);

  async function handleSubmit(data) {
    setLoading(true);
    setErrors({});
    try {
      await createOrder(data);
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

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>New Order</h1>
          <p>Create a new customer order.</p>
        </div>
      </div>

      {errors._general && !customers.length && (
        <p className="alert-error">{errors._general}</p>
      )}

      <div className="form-card form-card--wide">
        <OrderForm
          onSubmit={handleSubmit}
          loading={loading}
          errors={errors}
          submitLabel="Create Order"
          customers={customers}
          products={products}
        />
      </div>
    </div>
  );
}
