import { useState } from 'react';
import { toast } from 'sonner';
import { createSupplier } from '../api/suppliers';
import Modal from './Modal';
import './FormModal.css';
import './AddSupplierModal.css';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  takes_back_returns: true,
};

function AddSupplierModal({ onClose, onCreated }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createSupplier(form);
      onCreated(response.data);
      toast.success('Supplier added successfully');
      onClose();
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = errors
        ? Object.values(errors)[0][0]
        : 'Error adding supplier';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="New Supplier" onClose={onClose}>
      <form className="form-modal" onSubmit={handleSubmit}>
        <button
          type="button"
          className="form-modal__image"
          onClick={() => toast.info('Feature not available')}
        >
          <span>Drag image here</span>
          <span className="form-modal__browse">or Browse image</span>
        </button>

        <label>
          Supplier Name
          <input
            type="text"
            placeholder="Enter supplier name"
            value={form.name}
            onChange={handleChange('name')}
            required
          />
        </label>

        <label>
          Contact Number
          <input
            type="text"
            placeholder="Enter supplier contact number"
            value={form.phone}
            onChange={handleChange('phone')}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            placeholder="Enter supplier email"
            value={form.email}
            onChange={handleChange('email')}
            required
          />
        </label>

        <div className="form-modal__field">
          <span>Type</span>
          <div className="form-modal__toggle">
            <button
              type="button"
              className={!form.takes_back_returns ? 'is-active' : ''}
              onClick={() => setForm((prev) => ({ ...prev, takes_back_returns: false }))}
            >
              Not taking return
            </button>
            <button
              type="button"
              className={form.takes_back_returns ? 'is-active' : ''}
              onClick={() => setForm((prev) => ({ ...prev, takes_back_returns: true }))}
            >
              Taking return
            </button>
          </div>
        </div>

        <div className="form-modal__actions">
          <button type="button" className="form-modal__discard" onClick={onClose}>
            Discard
          </button>
          <button type="submit" className="form-modal__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Supplier'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddSupplierModal;
