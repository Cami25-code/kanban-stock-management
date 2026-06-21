import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';
import {
  getDashboardSummary,
  getSalesVsPurchases,
  getOrdersSummary,
  getTopProducts,
  getLowStock,
} from '../api/dashboard';
import AppLayout from '../components/AppLayout';
import RecordSaleModal from '../components/RecordSaleModal';
import { getAvailability } from '../utils/stock';
import '../styles/Availability.css';
import './Dashboard.css';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [salesVsPurchases, setSalesVsPurchases] = useState([]);
  const [ordersSummary, setOrdersSummary] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAll = () => {
    getDashboardSummary()
      .then((response) => setSummary(response.data))
      .catch(() => toast.error('Impossible de charger les indicateurs'));
    getSalesVsPurchases()
      .then((response) => setSalesVsPurchases(response.data))
      .catch(() => toast.error('Impossible de charger le graphique ventes/achats'));
    getOrdersSummary()
      .then((response) => setOrdersSummary(response.data))
      .catch(() => toast.error('Impossible de charger le graphique des commandes'));
    getTopProducts(3)
      .then((response) => setTopProducts(response.data))
      .catch(() => toast.error('Impossible de charger les meilleures ventes'));
    getLowStock(5)
      .then((response) => setLowStock(response.data))
      .catch(() => toast.error('Impossible de charger le stock faible'));
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <AppLayout>
      <div className="dashboard">
        <div className="dashboard__header">
          <h1>Dashboard</h1>
          <button className="dashboard__record-sale" onClick={() => setIsModalOpen(true)}>
            Record a Sale
          </button>
        </div>

        <div className="dashboard__grid">
          <div className="dashboard__card">
            <h2>Sales Overview</h2>
            <div className="dashboard__stats">
              <div>
                <strong>{summary?.sales_last7.units ?? '-'}</strong>
                <span>Sales</span>
              </div>
              <div>
                <strong>₹{summary?.sales_last7.revenue ?? '-'}</strong>
                <span>Revenue</span>
              </div>
              <div>
                <strong>₹{summary?.sales_last7.profit ?? '-'}</strong>
                <span>Profit</span>
              </div>
              <div>
                <strong>₹{summary?.sales_last7.cost ?? '-'}</strong>
                <span>Cost</span>
              </div>
            </div>
          </div>

          <div className="dashboard__card">
            <h2>Inventory Summary</h2>
            <div className="dashboard__stats">
              <div>
                <strong>{summary?.quantity_in_hand ?? '-'}</strong>
                <span>Quantity in Hand</span>
              </div>
              <div>
                <strong>{summary?.to_be_received ?? '-'}</strong>
                <span>To be received</span>
              </div>
            </div>
          </div>

          <div className="dashboard__card">
            <h2>Purchase Overview</h2>
            <div className="dashboard__stats">
              <div>
                <strong>{summary?.purchase_last7.orders ?? '-'}</strong>
                <span>Purchase</span>
              </div>
              <div>
                <strong>₹{summary?.purchase_last7.cost ?? '-'}</strong>
                <span>Cost</span>
              </div>
              <div>
                <strong>{summary?.purchase_last7.cancelled ?? '-'}</strong>
                <span>Cancel</span>
              </div>
              <div>
                <strong>₹{summary?.purchase_last7.returned_cost ?? '-'}</strong>
                <span>Return</span>
              </div>
            </div>
          </div>

          <div className="dashboard__card">
            <h2>Product Summary</h2>
            <div className="dashboard__stats">
              <div>
                <strong>{summary?.total_suppliers ?? '-'}</strong>
                <span>Number of Suppliers</span>
              </div>
              <div>
                <strong>{summary?.total_categories ?? '-'}</strong>
                <span>Number of Categories</span>
              </div>
            </div>
          </div>

          <div className="dashboard__card dashboard__card--wide">
            <h2>Sales &amp; Purchase</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salesVsPurchases}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="purchases" fill="#93c5fd" name="Purchase" />
                <Bar dataKey="sales" fill="#86efac" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard__card dashboard__card--wide">
            <h2>Order Summary</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ordersSummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ordered" stroke="#93c5fd" name="Ordered" />
                <Line type="monotone" dataKey="delivered" stroke="#fb923c" name="Delivered" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard__card dashboard__card--wide">
            <h2>Top Selling Stock</h2>
            {topProducts.length === 0 ? (
              <p className="dashboard__empty">Aucune vente enregistrée pour le moment.</p>
            ) : (
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Sold Quantity</th>
                    <th>Remaining Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.product_id}>
                      <td>{product.name}</td>
                      <td>{product.sold_quantity}</td>
                      <td>{product.remaining_quantity}</td>
                      <td>₹{product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="dashboard__card dashboard__card--wide">
            <h2>Low Quantity Stock</h2>
            {lowStock.length === 0 ? (
              <p className="dashboard__empty">Aucun produit en stock faible.</p>
            ) : (
              <ul className="dashboard__low-stock-list">
                {lowStock.map((product) => {
                  const availability = getAvailability(product.quantity, product.threshold);
                  return (
                    <li key={product.id}>
                      <span>{product.name}</span>
                      <span>Remaining Quantity : {product.quantity}</span>
                      <span className={`availability ${availability.className}`}>
                        {availability.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <RecordSaleModal onClose={() => setIsModalOpen(false)} onRecorded={loadAll} />
      )}
    </AppLayout>
  );
}

export default Dashboard;
