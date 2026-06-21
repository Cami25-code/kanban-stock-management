import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAllProducts } from '../api/products';
import { getStores } from '../api/stores';
import { createSale } from '../api/sales';
import { formatCurrency } from '../utils/currency';
import Modal from './Modal';
import './FormModal.css';

const EMPTY_FORM = {
  product_id: '',
  store_id: '',
  quantity: '',
};

function RecordSaleModal({ onClose, onRecorded }) {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    getAllProducts()
      .then((response) => setProducts(response.data.data))
      .catch(() => toast.error('Impossible de charger les produits'));
    getStores()
      .then((response) => setStores(response.data))
      .catch(() => toast.error('Impossible de charger les magasins'));
  }, []);

  const selectedProduct = products.find((product) => product.id === Number(form.product_id));

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await createSale(form);
      onRecorded();
      toast.success('Vente enregistrée');
      onClose();
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : "Erreur lors de l'enregistrement de la vente";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Record a Sale" onClose={onClose}>
      <form className="form-modal" onSubmit={handleSubmit}>
        <label>
          Product
          <select value={form.product_id} onChange={handleChange('product_id')} required>
            <option value="" disabled>
              Select a product
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        {selectedProduct && (
          <p className="form-modal__hint">
            In stock: {selectedProduct.quantity} — Selling price:{' '}
            {formatCurrency(selectedProduct.selling_price)}
          </p>
        )}

        {stores.length > 0 && (
          <label>
            Store (optional)
            <select value={form.store_id} onChange={handleChange('store_id')}>
              <option value="">No specific store</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Quantity
          <input
            type="number"
            min="1"
            placeholder="Enter quantity sold"
            value={form.quantity}
            onChange={handleChange('quantity')}
            required
          />
        </label>

        <div className="form-modal__actions">
          <button type="button" className="form-modal__discard" onClick={onClose}>
            Discard
          </button>
          <button type="submit" className="form-modal__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Record Sale'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default RecordSaleModal;
