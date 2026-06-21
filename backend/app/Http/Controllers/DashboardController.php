<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Sale;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function summary()
    {
        $last7 = Carbon::now()->subDays(7);

        $salesAgg = Sale::where('sale_date', '>=', $last7)
            ->selectRaw('COALESCE(SUM(quantity), 0) as units')
            ->selectRaw('COALESCE(SUM(selling_price * quantity), 0) as revenue')
            ->selectRaw('COALESCE(SUM(buying_price * quantity), 0) as cost')
            ->first();

        $purchaseAgg = PurchaseOrder::where('order_date', '>=', $last7)
            ->selectRaw('COUNT(*) as orders')
            ->selectRaw('COALESCE(SUM(order_value), 0) as cost')
            ->first();

        $cancelledAgg = PurchaseOrder::where('order_date', '>=', $last7)
            ->where('status', PurchaseOrder::STATUS_RETURNED)
            ->selectRaw('COUNT(*) as count')
            ->selectRaw('COALESCE(SUM(order_value), 0) as cost')
            ->first();

        return response()->json([
            'total_categories' => Category::count(),
            'total_products' => Product::count(),
            'total_suppliers' => Supplier::count(),
            'quantity_in_hand' => (int) Product::sum('quantity'),
            'to_be_received' => (int) PurchaseOrder::whereNotIn('status', [
                PurchaseOrder::STATUS_DELIVERED,
                PurchaseOrder::STATUS_RETURNED,
            ])->sum('quantity'),
            'low_stock_count' => Product::where('quantity', '>', 0)
                ->whereColumn('quantity', '<=', 'threshold')
                ->count(),
            'out_of_stock_count' => Product::where('quantity', 0)->count(),
            'sales_last7' => [
                'units' => (int) $salesAgg->units,
                'revenue' => (float) $salesAgg->revenue,
                'cost' => (float) $salesAgg->cost,
                'profit' => (float) ($salesAgg->revenue - $salesAgg->cost),
            ],
            'purchase_last7' => [
                'orders' => (int) $purchaseAgg->orders,
                'cost' => (float) $purchaseAgg->cost,
                'cancelled' => (int) $cancelledAgg->count,
                'returned_cost' => (float) $cancelledAgg->cost,
            ],
        ]);
    }

    public function salesVsPurchases()
    {
        $start = Carbon::now()->subMonths(5)->startOfMonth();

        $salesByMonth = Sale::where('sale_date', '>=', $start)
            ->selectRaw("DATE_FORMAT(sale_date, '%Y-%m') as ym")
            ->selectRaw('COALESCE(SUM(selling_price * quantity), 0) as total')
            ->groupBy('ym')
            ->pluck('total', 'ym');

        $purchasesByMonth = PurchaseOrder::where('order_date', '>=', $start)
            ->selectRaw("DATE_FORMAT(order_date, '%Y-%m') as ym")
            ->selectRaw('COALESCE(SUM(order_value), 0) as total')
            ->groupBy('ym')
            ->pluck('total', 'ym');

        return response()->json($this->buildMonthlySeries($salesByMonth, $purchasesByMonth, 'sales', 'purchases'));
    }

    public function ordersSummary()
    {
        $start = Carbon::now()->subMonths(5)->startOfMonth();

        $orderedByMonth = PurchaseOrder::where('order_date', '>=', $start)
            ->selectRaw("DATE_FORMAT(order_date, '%Y-%m') as ym")
            ->selectRaw('COUNT(*) as total')
            ->groupBy('ym')
            ->pluck('total', 'ym');

        $deliveredByMonth = PurchaseOrder::where('status', PurchaseOrder::STATUS_DELIVERED)
            ->where('updated_at', '>=', $start)
            ->selectRaw("DATE_FORMAT(updated_at, '%Y-%m') as ym")
            ->selectRaw('COUNT(*) as total')
            ->groupBy('ym')
            ->pluck('total', 'ym');

        return response()->json($this->buildMonthlySeries($orderedByMonth, $deliveredByMonth, 'ordered', 'delivered'));
    }

    public function topProducts(Request $request)
    {
        $limit = (int) $request->query('limit', 3);

        $rows = Sale::selectRaw('product_id, SUM(quantity) as sold_quantity')
            ->groupBy('product_id')
            ->orderByDesc('sold_quantity')
            ->limit($limit)
            ->get();

        $products = Product::whereIn('id', $rows->pluck('product_id'))->get()->keyBy('id');

        return response()->json($rows->map(function ($row) use ($products) {
            $product = $products->get($row->product_id);

            return [
                'product_id' => $row->product_id,
                'name' => $product->name ?? 'Produit supprimé',
                'sold_quantity' => (int) $row->sold_quantity,
                'remaining_quantity' => $product->quantity ?? 0,
                'price' => $product->selling_price ?? 0,
            ];
        })->values());
    }

    public function lowStock(Request $request)
    {
        $limit = (int) $request->query('limit', 5);

        return response()->json(
            Product::with('category')
                ->where('quantity', '>', 0)
                ->whereColumn('quantity', '<=', 'threshold')
                ->orderBy('quantity')
                ->limit($limit)
                ->get()
        );
    }

    private function buildMonthlySeries($seriesA, $seriesB, string $labelA, string $labelB): array
    {
        $result = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $key = $date->format('Y-m');

            $result[] = [
                'month' => $date->format('M'),
                $labelA => (float) ($seriesA[$key] ?? 0),
                $labelB => (float) ($seriesB[$key] ?? 0),
            ];
        }

        return $result;
    }
}
