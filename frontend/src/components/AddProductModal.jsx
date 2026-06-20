import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createProduct } from '../api/products';
import { getCategories, createCategory } from '../api/categories';
import Modal from './Modal';
import './AddProductModal.css';

const EMPTY_FORM = {
  name: '',
  sku: '',
  category_id: '',
  buying_price: '',
  selling_price: '',
  quantity: '',
  unit: '',
  expiry_date: '',
  threshold: '',
};

function AddProductModal({ onClose, onCreated }) {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    getCategories()
      .then((response) => setCategories(response.data))
      .catch(() => toast.error('Impossible de charger les catégories'));
  }, []);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCategorySelectChange = (event) => {
    const value = event.target.value;
    if (value === '__new__') {
      setIsCreatingCategory(true);
      return;
    }
    setForm((prev) => ({ ...prev, category_id: value }));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }

    try {
      const response = await createCategory({ name: newCategoryName.trim() });
      setCategories((prev) => [...prev, response.data]);
      setForm((prev) => ({ ...prev, category_id: String(response.data.id) }));
      setIsCreatingCategory(false);
      setNewCategoryName('');
      toast.success('Catégorie créée');
    } catch {
      toast.error('Erreur lors de la création de la catégorie');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createProduct(form);
      onCreated(response.data);
      toast.success('Produit ajouté avec succès');
      onClose();
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : "Erreur lors de l'ajout du produit";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="New Product" onClose={onClose}>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="add-product-form__image"
          onClick={() => toast.info('Fonctionnalité non disponible')}
        >
          <span>Drag image here</span>
          <span className="add-product-form__browse">or Browse image</span>
        </button>

        <label>
          Product Name
          <input
            type="text"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange('name')}
            required
          />
        </label>

        <label>
          Product ID
          <input
            type="text"
            placeholder="Enter product ID"
            value={form.sku}
            onChange={handleChange('sku')}
          />
        </label>

        <label>
          Category
          {isCreatingCategory ? (
            <div className="add-product-form__new-category">
              <input
                type="text"
                placeholder="Nom de la nouvelle catégorie"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
              />
              <button type="button" onClick={handleCreateCategory}>
                Create
              </button>
              <button type="button" onClick={() => setIsCreatingCategory(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <select value={form.category_id} onChange={handleCategorySelectChange} required>
              <option value="" disabled>
                Select product category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="__new__">+ Add new category</option>
            </select>
          )}
        </label>

        <label>
          Buying Price
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter buying price"
            value={form.buying_price}
            onChange={handleChange('buying_price')}
            required
          />
        </label>

        <label>
          Selling Price
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter selling price"
            value={form.selling_price}
            onChange={handleChange('selling_price')}
            required
          />
        </label>

        <label>
          Quantity
          <input
            type="number"
            min="0"
            placeholder="Enter product quantity"
            value={form.quantity}
            onChange={handleChange('quantity')}
            required
          />
        </label>

        <label>
          Unit
          <input
            type="text"
            placeholder="Enter product unit"
            value={form.unit}
            onChange={handleChange('unit')}
          />
        </label>

        <label>
          Expiry Date
          <input type="date" value={form.expiry_date} onChange={handleChange('expiry_date')} />
        </label>

        <label>
          Threshold Value
          <input
            type="number"
            min="0"
            placeholder="Enter threshold value"
            value={form.threshold}
            onChange={handleChange('threshold')}
            required
          />
        </label>

        <div className="add-product-form__actions">
          <button type="button" className="add-product-form__discard" onClick={onClose}>
            Discard
          </button>
          <button type="submit" className="add-product-form__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddProductModal;
