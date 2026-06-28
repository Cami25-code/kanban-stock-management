import { useEffect, useState } from 'react';
import {
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
  getReportsOverview,
  getBestCategories,
  getProfitVsRevenue,
  getBestProducts,
} from '../api/reports';
import AppLayout from '../components/AppLayout';
import { formatPercentChange } from '../utils/percent';
import { formatCurrency } from '../utils/currency';
import './Reports.css';

function Reports() {
  const [overview, setOverview] = useState(null);
  const [bestCategories, setBestCategories] = useState([]);
  const [profitVsRevenue, setProfitVsRevenue] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true);

      try {
        const [overviewRes, bestCategoriesRes, profitVsRevenueRes, bestProductsRes] =
          await Promise.all([
            getReportsOverview(),
            getBestCategories(),
            getProfitVsRevenue(),
            getBestProducts(),
          ]);

        setOverview(overviewRes.data);
        setBestCategories(bestCategoriesRes.data);
        setProfitVsRevenue(profitVsRevenueRes.data);
        setBestProducts(bestProductsRes.data);
      } catch {
        toast.error('Unable to load reports');
      } finally {
        setIsLoading(false);
      }
    }

    loadReports();
  }, []);

  if (isLoading && !overview) {
    return (
      <AppLayout>
        <p className="reports__empty">Loading reports...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="reports">
        <div className="reports__top">
          <div className="reports__card">
            <h2>Overview</h2>
            <div className="reports__stats">
              <div>
                <strong>{formatCurrency(overview?.total_profit_ytd)}</strong>
                <span>Total Profit</span>
              </div>
              <div>
                <strong>{formatCurrency(overview?.revenue_this_month)}</strong>
                <span>Revenue</span>
              </div>
              <div>
                <strong>{formatCurrency(overview?.cost_this_month)}</strong>
                <span>Sales (cost)</span>
              </div>
              <div>
                <strong>{formatCurrency(overview?.net_purchase_value_ytd)}</strong>
                <span>Net purchase value</span>
              </div>
              <div>
                <strong>{formatCurrency(overview?.net_sales_value_ytd)}</strong>
                <span>Net sales value</span>
              </div>
              <div>
                <strong>
                  {overview?.mom_profit_change_percent != null
                    ? `${overview.mom_profit_change_percent}%`
                    : '-'}
                </strong>
                <span>MoM Profit</span>
              </div>
              <div>
                <strong>
                  {overview?.yoy_profit_change_percent != null
                    ? `${overview.yoy_profit_change_percent}%`
                    : '-'}
                </strong>
                <span>YoY Profit</span>
              </div>
            </div>
          </div>

          <div className="reports__card">
            <h2>Best selling category</h2>
            {bestCategories.length === 0 ? (
              <p className="reports__empty">No sales this month.</p>
            ) : (
              <div className="table-scroll-wrapper">
                <table className="reports__table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Turn Over</th>
                      <th>Increase By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bestCategories.map((category) => {
                      const change = formatPercentChange(category.increase_percent);
                      return (
                        <tr key={category.category}>
                          <td>{category.category}</td>
                          <td>{formatCurrency(category.turnover)}</td>
                          <td className={change.className}>{change.label}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="reports__card reports__card--wide">
          <h2>Profit &amp; Revenue</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={profitVsRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" />
              <Line type="monotone" dataKey="profit" stroke="#f0b860" name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="reports__card reports__card--wide">
          <h2>Best selling product</h2>
          {bestProducts.length === 0 ? (
            <p className="reports__empty">No sales this month.</p>
          ) : (
            <div className="table-scroll-wrapper">
              <table className="reports__table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Product ID</th>
                    <th>Category</th>
                    <th>Remaining Quantity</th>
                    <th>Turn Over</th>
                    <th>Increase By</th>
                  </tr>
                </thead>
                <tbody>
                  {bestProducts.map((product) => {
                    const change = formatPercentChange(product.increase_percent);
                    return (
                      <tr key={product.product_id}>
                        <td>{product.name}</td>
                        <td>{product.sku || '-'}</td>
                        <td>{product.category || '-'}</td>
                        <td>
                          {product.remaining_quantity} {product.unit || ''}
                        </td>
                        <td>{formatCurrency(product.turnover)}</td>
                        <td className={change.className}>{change.label}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default Reports;
