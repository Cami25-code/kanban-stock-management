import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAllProducts } from '../api/products';
import { getSuppliers } from '../api/suppliers';
import { getStores } from '../api/stores';
import { createOrder } from '../api/orders';
import Modal from './Modal';
import './FormModal.css';

const EMPTY_FORM = {
  product_id: '',
  supplier_id: '',
  store_id: '',
  quantity: '',
  expected_date: '',
};

function AddOrderModal({ onClose, onCreated }) {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stores, setStores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    getAllProducts()
      .then((response) => setProducts(response.data.data))
      .catch(() => toast.error('Impossible de charger les produits'));
    getSuppliers()
      .then((response) => setSuppliers(response.data))
      .catch(() => toast.error('Impossible de charger les fournisseurs'));
    getStores()
      .then((response) => setStores(response.data))
      .catch(() => toast.error('Impossible de charger les magasins'));
  }, []);

  const selectedProduct = products.find((product) => product.id === Number(form.product_id));

  const handleProductChange = (event) => {
    const productId = event.target.value;
    const product = products.find((item) => item.id === Number(productId));
    setForm((prev) => ({
      ...prev,
      product_id: productId,
      supplier_id: product?.supplier_id ? String(product.supplier_id) : '',
    }));
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createOrder(form);
      onCreated(response.data);
      toast.success('Commande créée avec succès');
      onClose();
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : 'Erreur lors de la création de la commande';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="New Order" onClose={onClose}>
      <form className="form-modal" onSubmit={handleSubmit}>
        <label>
          Product
          <select value={form.product_id} onChange={handleProductChange} required>
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
          <p className="form-modal__hint">Buying price: ₹{selectedProduct.buying_price}</p>
        )}

        {selectedProduct && !selectedProduct.supplier_id && (
          <label>
            Supplier
            <select value={form.supplier_id} onChange={handleChange('supplier_id')} required>
              <option value="" disabled>
                Select a supplier
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {stores.length > 0 && (
          <label>
            Deliver to (optional)
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
            placeholder="Enter quantity"
            value={form.quantity}
            onChange={handleChange('quantity')}
            required
          />
        </label>

        <label>
          Expected Delivery
          <input
            type="date"
            value={form.expected_date}
            onChange={handleChange('expected_date')}
          />
        </label>

        <div className="form-modal__actions">
          <button type="button" className="form-modal__discard" onClick={onClose}>
            Discard
          </button>
          <button type="submit" className="form-modal__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Order'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddOrderModal;
