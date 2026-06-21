import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getSuppliers } from '../api/suppliers';
import AppLayout from '../components/AppLayout';
import AddSupplierModal from '../components/AddSupplierModal';
import '../styles/DataPage.css';
import './Suppliers.css';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadSuppliers = () => {
    setIsLoading(true);
    getSuppliers()
      .then((response) => setSuppliers(response.data))
      .catch(() => toast.error('Unable to load suppliers'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleCreated = (supplier) => {
    setSuppliers((prev) => [{ ...supplier, products: [], on_the_way: 0 }, ...prev]);
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout onSearch={setSearchTerm}>
      <div className="data-page">
        <div className="data-page__header">
          <h1>Suppliers</h1>
          <button className="data-page__add" onClick={() => setIsModalOpen(true)}>
            Add Supplier
          </button>
        </div>

        <table className="data-page__table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Product</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Type</th>
              <th>On the way</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6}>Loading...</td>
              </tr>
            ) : filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={6}>No suppliers yet.</td>
              </tr>
            ) : (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.products?.[0]?.name || '-'}</td>
                  <td>{supplier.phone || '-'}</td>
                  <td>{supplier.email}</td>
                  <td>
                    <span
                      className={
                        supplier.takes_back_returns ? 'supplier-type--yes' : 'supplier-type--no'
                      }
                    >
                      {supplier.takes_back_returns ? 'Taking Return' : 'Not Taking Return'}
                    </span>
                  </td>
                  <td>{supplier.on_the_way ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddSupplierModal onClose={() => setIsModalOpen(false)} onCreated={handleCreated} />
      )}
    </AppLayout>
  );
}

export default Suppliers;
