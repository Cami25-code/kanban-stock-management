import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getStores } from '../api/stores';
import AppLayout from '../components/AppLayout';
import AddStoreModal from '../components/AddStoreModal';
import './ManageStore.css';

function ManageStore() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const loadStores = () => {
    setIsLoading(true);
    getStores()
      .then((response) => setStores(response.data))
      .catch(() => toast.error('Unable to load stores'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handleSaved = (store) => {
    setStores((prev) => {
      const exists = prev.some((item) => item.id === store.id);
      return exists
        ? prev.map((item) => (item.id === store.id ? store : item))
        : [store, ...prev];
    });
  };

  const openCreateModal = () => {
    setEditingStore(null);
    setIsModalOpen(true);
  };

  const openEditModal = (store) => {
    setEditingStore(store);
    setIsModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="manage-store">
        <div className="manage-store__header">
          <h1>Manage Store</h1>
          <button className="manage-store__add" onClick={openCreateModal}>
            Add Store
          </button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : stores.length === 0 ? (
          <p>No stores yet.</p>
        ) : (
          <div className="manage-store__list">
            {stores.map((store) => (
              <div key={store.id} className="manage-store__card">
                <div className="manage-store__name">{store.name}</div>
                <div className="manage-store__info">
                  <p>{store.address || 'No address provided'}</p>
                  <p>{store.phone || ''}</p>
                </div>
                <button className="manage-store__edit" onClick={() => openEditModal(store)}>
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddStoreModal
          store={editingStore}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </AppLayout>
  );
}

export default ManageStore;
