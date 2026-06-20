import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getProduct } from '../api/products';
import AppLayout from '../components/AppLayout';
import './ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProduct(productId)
      .then((response) => setProduct(response.data))
      .catch(() => toast.error('Impossible de charger ce produit'))
      .finally(() => setIsLoading(false));
  }, [productId]);

  if (isLoading) {
    return (
      <AppLayout>
        <p>Chargement...</p>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout>
        <p>Produit introuvable.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="product-detail">
        <Link to="/inventory" className="product-detail__back">
          ← Back to Inventory
        </Link>

        <h1>{product.name}</h1>

        <div className="product-detail__section">
          <h2>Primary Details</h2>
          <dl>
            <dt>Product name</dt>
            <dd>{product.name}</dd>
            <dt>Product ID</dt>
            <dd>{product.sku || '-'}</dd>
            <dt>Product category</dt>
            <dd>{product.category?.name || '-'}</dd>
            <dt>Expiry Date</dt>
            <dd>
              {product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : '-'}
            </dd>
            <dt>Threshold Value</dt>
            <dd>{product.threshold}</dd>
          </dl>
        </div>

        <div className="product-detail__section">
          <h2>Supplier Details</h2>
          {product.supplier ? (
            <dl>
              <dt>Supplier name</dt>
              <dd>{product.supplier.name}</dd>
              <dt>Contact Number</dt>
              <dd>{product.supplier.phone || '-'}</dd>
            </dl>
          ) : (
            <p>Aucun fournisseur associé.</p>
          )}
        </div>

        <div className="product-detail__section">
          <h2>Stock Locations</h2>
          {product.stores?.length > 0 ? (
            <table className="product-detail__table">
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Stock in hand</th>
                </tr>
              </thead>
              <tbody>
                {product.stores.map((store) => (
                  <tr key={store.id}>
                    <td>{store.name}</td>
                    <td>{store.pivot.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Ce produit n'est rattaché à aucun magasin (stock global uniquement).</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default ProductDetail;
