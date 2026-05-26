import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/products/ProductForm";
import { getProduct, updateProduct } from "../../services/products";

export default function EditProductPage() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors]     = useState({});

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(() => setErrors({ _general: "Product not found." }))
      .finally(() => setFetching(false));
  }, [id]);

  async function handleSubmit(data) {
    setLoading(true);
    setErrors({});
    try {
      await updateProduct(id, data);
      navigate("/products");
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
          <h1>Edit Product</h1>
          <p>{product?.name ?? "—"}</p>
        </div>
      </div>

      {errors._general && !product && (
        <p className="alert-error">{errors._general}</p>
      )}

      {product && (
        <div className="form-card">
          {/* key forces a fresh form state when the fetched product arrives */}
          <ProductForm
            key={product.id}
            initialValues={product}
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
