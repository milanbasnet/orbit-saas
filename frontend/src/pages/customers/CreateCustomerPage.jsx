import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerForm from "../../components/customers/CustomerForm";
import { createCustomer } from "../../services/customers";

export default function CreateCustomerPage() {
  const navigate              = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  async function handleSubmit(data) {
    setLoading(true);
    setErrors({});
    try {
      await createCustomer(data);
      navigate("/customers");
    } catch (err) {
      setErrors(err.errors ?? { _general: err.message });
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>New Customer</h1>
          <p>Add a customer to your base.</p>
        </div>
      </div>

      <div className="form-card">
        <CustomerForm
          onSubmit={handleSubmit}
          loading={loading}
          errors={errors}
          submitLabel="Create Customer"
        />
      </div>
    </div>
  );
}
