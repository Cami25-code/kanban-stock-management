import { useState } from 'react';
import { toast } from 'sonner';
import { createStore, updateStore } from '../api/stores';
import Modal from './Modal';
import './FormModal.css';

function AddStoreModal({ store, onClose, onSaved }) {
  const isEditing = Boolean(store);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: store?.name || '',
    address: store?.address || '',
    phone: store?.phone || '',
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = isEditing
        ? await updateStore(store.id, form)
        : await createStore(form);
      onSaved(response.data);
      toast.success(isEditing ? 'Store updated' : 'Store added successfully');
      onClose();
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : 'Error saving store';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={isEditing ? 'Edit Store' : 'New Store'} onClose={onClose}>
      <form className="form-modal" onSubmit={handleSubmit}>
        <label>
          Store Name
          <input
            type="text"
            placeholder="Enter store name"
            value={form.name}
            onChange={handleChange('name')}
            required
          />
        </label>

        <label>
          Address
          <input
            type="text"
            placeholder="Enter store address"
            value={form.address}
            onChange={handleChange('address')}
          />
        </label>

        <label>
          Phone
          <input
            type="text"
            placeholder="Enter store phone"
            value={form.phone}
            onChange={handleChange('phone')}
          />
        </label>

        <div className="form-modal__actions">
          <button type="button" className="form-modal__discard" onClick={onClose}>
            Discard
          </button>
          <button type="submit" className="form-modal__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Store'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddStoreModal;
