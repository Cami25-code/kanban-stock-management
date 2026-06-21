import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getProducts } from '../api/products';
import AppLayout from '../components/AppLayout';
import AddProductModal from '../components/AddProductModal';
import { getAvailability } from '../utils/stock';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import '../styles/DataPage.css';
import '../styles/Availability.css';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = (page = 1) => {
    setIsLoading(true);
    getProducts(page)
      .then((response) => {
        setProducts(response.data.data);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
        });
      })
      .catch(() => toast.error('Impossible de charger les produits'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout onSearch={setSearchTerm}>
      <div className="data-page">
        <div className="data-page__header">
          <h1>Products</h1>
          <button className="data-page__add" onClick={() => setIsModalOpen(true)}>
            Add Product
          </button>
        </div>

        <table className="data-page__table">
          <thead>
            <tr>
              <th>Products</th>
              <th>Buying Price</th>
              <th>Quantity</th>
              <th>Threshold Value</th>
              <th>Expiry Date</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6}>Chargement...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6}>Aucun produit pour le moment.</td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const availability = getAvailability(product.quantity, product.threshold);
                return (
                  <tr key={product.id}>
                    <td>
                      <Link to={`/inventory/${product.id}`}>{product.name}</Link>
                    </td>
                    <td>{formatCurrency(product.buying_price)}</td>
                    <td>
                      {product.quantity} {product.unit || ''}
                    </td>
                    <td>
                      {product.threshold} {product.unit || ''}
                    </td>
                    <td>{formatDate(product.expiry_date)}</td>
                    <td>
                      <span className={`availability ${availability.className}`}>
                        {availability.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="data-page__pagination">
          <button
            disabled={pagination.current_page <= 1}
            onClick={() => loadProducts(pagination.current_page - 1)}
          >
            Previous
          </button>
          <span>
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <button
            disabled={pagination.current_page >= pagination.last_page}
            onClick={() => loadProducts(pagination.current_page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AddProductModal
          onClose={() => setIsModalOpen(false)}
          onCreated={() => loadProducts(1)}
        />
      )}
    </AppLayout>
  );
}

export default Inventory;
