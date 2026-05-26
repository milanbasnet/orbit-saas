import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomerForm from "../../components/customers/CustomerForm";
import { getCustomer, updateCustomer } from "../../services/customers";

export default function EditCustomerPage() {
  const { id }                    = useParams();
  const navigate                  = useNavigate();
  const [customer, setCustomer]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [errors, setErrors]       = useState({});

  useEffect(() => {
    getCustomer(id)
      .then((res) => setCustomer(res.data))
      .catch(() => setErrors({ _general: "Customer not found." }))
      .finally(() => setFetching(false));
  }, [id]);

  async function handleSubmit(data) {
    setLoading(true);
    setErrors({});
    try {
      await updateCustomer(id, data);
      navigate("/customers");
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
          <h1>Edit Customer</h1>
          <p>{customer?.name ?? "—"}</p>
        </div>
      </div>

      {errors._general && !customer && (
        <p className="alert-error">{errors._general}</p>
      )}

      {customer && (
        <div className="form-card">
          {/* key forces fresh form state when the fetched customer arrives */}
          <CustomerForm
            key={customer.id}
            initialValues={customer}
            onSubmit={handleSubmit}
            loading={loading}
            errors={errors}
            submitLabel="Save Changes"
          />
        </div>
      )}
    </div>
  );
}
