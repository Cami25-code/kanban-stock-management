import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getOrders, updateOrderStatus } from '../api/orders';
import AppLayout from '../components/AppLayout';
import AddOrderModal from '../components/AddOrderModal';
import { getOrderStatusClass, isFinalStatus } from '../utils/orderStatus';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import '../styles/DataPage.css';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const loadOrders = (page = 1, showAll = showHistory) => {
    setIsLoading(true);
    getOrders(page, showAll)
      .then((response) => {
        setOrders(response.data.data);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
        });
      })
      .catch(() => toast.error('Impossible de charger les commandes'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadOrders(1, showHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showHistory]);

  const handleStatusChange = async (order, status) => {
    try {
      await updateOrderStatus(order.id, status);
      toast.success(
        status === 'Delivered' ? 'Commande marquée comme livrée' : 'Commande marquée comme retournée'
      );
      loadOrders(pagination.current_page, showHistory);
    } catch {
      toast.error('Impossible de mettre à jour la commande');
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout onSearch={setSearchTerm}>
      <div className="data-page">
        <div className="data-page__header">
          <h1>Orders</h1>
          <div className="orders__header-actions">
            <button
              type="button"
              className="orders__history"
              onClick={() => setShowHistory((prev) => !prev)}
            >
              {showHistory ? 'Show Pending' : 'Order History'}
            </button>
            <button className="data-page__add" onClick={() => setIsModalOpen(true)}>
              Add Order
            </button>
          </div>
        </div>

        <table className="data-page__table">
          <thead>
            <tr>
              <th>Products</th>
              <th>Order Value</th>
              <th>Quantity</th>
              <th>Order ID</th>
              <th>Expected Delivery</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7}>Chargement...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7}>Aucune commande pour le moment.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.product.name}</td>
                  <td>{formatCurrency(order.order_value)}</td>
                  <td>
                    {order.quantity} {order.product.unit || ''}
                  </td>
                  <td>{order.id}</td>
                  <td>{formatDate(order.expected_date)}</td>
                  <td>
                    <span className={`order-status ${getOrderStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {!isFinalStatus(order.status) && (
                      <div className="orders__actions">
                        <button onClick={() => handleStatusChange(order, 'Delivered')}>
                          Mark as Delivered
                        </button>
                        <button onClick={() => handleStatusChange(order, 'Returned')}>
                          Mark as Returned
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="data-page__pagination">
          <button
            disabled={pagination.current_page <= 1}
            onClick={() => loadOrders(pagination.current_page - 1, showHistory)}
          >
            Previous
          </button>
          <span>
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <button
            disabled={pagination.current_page >= pagination.last_page}
            onClick={() => loadOrders(pagination.current_page + 1, showHistory)}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AddOrderModal
          onClose={() => setIsModalOpen(false)}
          onCreated={() => loadOrders(1, showHistory)}
        />
      )}
    </AppLayout>
  );
}

export default Orders;
