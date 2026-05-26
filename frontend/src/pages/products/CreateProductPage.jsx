import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/products/ProductForm";
import { createProduct } from "../../services/products";

export default function CreateProductPage() {
  const navigate       = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  async function handleSubmit(data) {
    setLoading(true);
    setErrors({});
    try {
      await createProduct(data);
      navigate("/products");
    } catch (err) {
      setErrors(err.errors ?? { _general: err.message });
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>New Product</h1>
          <p>Add a product to your catalog.</p>
        </div>
      </div>

      <div className="form-card">
        <ProductForm
          onSubmit={handleSubmit}
          loading={loading}
          errors={errors}
          submitLabel="Create Product"
        />
      </div>
    </div>
  );
}
