<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\Sale;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    public function overview()
    {
        $now = Carbon::now();
        $yearStart = $now->copy()->startOfYear();
        $monthStart = $now->copy()->startOfMonth();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();
        $lastYearStart = $now->copy()->subYear()->startOfYear();
        $lastYearEnd = $now->copy()->subYear()->endOfYear();

        $ytdAgg = Sale::where('sale_date', '>=', $yearStart)
            ->selectRaw('COALESCE(SUM(selling_price * quantity), 0) as revenue')
            ->selectRaw('COALESCE(SUM(buying_price * quantity), 0) as cost')
            ->first();

        $monthAgg = Sale::where('sale_date', '>=', $monthStart)
            ->selectRaw('COALESCE(SUM(selling_price * quantity), 0) as revenue')
            ->selectRaw('COALESCE(SUM(buying_price * quantity), 0) as cost')
            ->first();

        $netPurchaseValue = PurchaseOrder::where('status', PurchaseOrder::STATUS_DELIVERED)
            ->where('order_date', '>=', $yearStart)
            ->sum('order_value');

        $totalProfitYtd = (float) $ytdAgg->revenue - (float) $ytdAgg->cost;
        $thisMonthProfit = (float) $monthAgg->revenue - (float) $monthAgg->cost;
        $lastMonthProfit = $this->profitBetween($lastMonthStart, $lastMonthEnd);
        $lastYearProfit = $this->profitBetween($lastYearStart, $lastYearEnd);

        return response()->json([
            'total_profit_ytd' => $totalProfitYtd,
            'revenue_this_month' => (float) $monthAgg->revenue,
            'cost_this_month' => (float) $monthAgg->cost,
            'net_purchase_value_ytd' => (float) $netPurchaseValue,
            'net_sales_value_ytd' => (float) $ytdAgg->revenue,
            'mom_profit_change_percent' => $this->percentChange($thisMonthProfit, $lastMonthProfit),
            'yoy_profit_change_percent' => $this->percentChange($totalProfitYtd, $lastYearProfit),
        ]);
    }

    public function bestCategories()
    {
        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

        $current = DB::table('sales')
            ->join('products', 'sales.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.id', 'categories.name')
            ->selectRaw('SUM(sales.selling_price * sales.quantity) as turnover')
            ->where('sales.sale_date', '>=', $monthStart)
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('turnover')
            ->limit(3)
            ->get();

        return response()->json($current->map(function ($row) use ($lastMonthStart, $lastMonthEnd) {
            $previousTurnover = DB::table('sales')
                ->join('products', 'sales.product_id', '=', 'products.id')
                ->where('products.category_id', $row->id)
                ->whereBetween('sales.sale_date', [$lastMonthStart, $lastMonthEnd])
                ->sum(DB::raw('sales.selling_price * sales.quantity'));

            return [
                'category' => $row->name,
                'turnover' => (float) $row->turnover,
                'increase_percent' => $this->percentChange((float) $row->turnover, (float) $previousTurnover),
            ];
        }));
    }

    public function profitVsRevenue()
    {
        $start = Carbon::now()->subMonths(11)->startOfMonth();

        $monthly = DB::table('sales')
            ->selectRaw("DATE_FORMAT(sale_date, '%Y-%m') as ym")
            ->selectRaw('SUM(selling_price * quantity) as revenue')
            ->selectRaw('SUM(buying_price * quantity) as cost')
            ->where('sale_date', '>=', $start)
            ->groupBy('ym')
            ->get()
            ->keyBy('ym');

        $result = [];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $key = $date->format('Y-m');
            $row = $monthly->get($key);
            $revenue = $row ? (float) $row->revenue : 0.0;
            $cost = $row ? (float) $row->cost : 0.0;

            $result[] = [
                'month' => $date->format('M'),
                'revenue' => $revenue,
                'profit' => $revenue - $cost,
            ];
        }

        return response()->json($result);
    }

    public function bestProducts()
    {
        $limit = 5;
        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

        $current = DB::table('sales')
            ->join('products', 'sales.product_id', '=', 'products.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select(
                'products.id',
                'products.name',
                'products.sku',
                'products.unit',
                'products.quantity',
                'categories.name as category_name'
            )
            ->selectRaw('SUM(sales.selling_price * sales.quantity) as turnover')
            ->where('sales.sale_date', '>=', $monthStart)
            ->groupBy(
                'products.id',
                'products.name',
                'products.sku',
                'products.unit',
                'products.quantity',
                'categories.name'
            )
            ->orderByDesc('turnover')
            ->limit($limit)
            ->get();

        return response()->json($current->map(function ($row) use ($lastMonthStart, $lastMonthEnd) {
            $previousTurnover = DB::table('sales')
                ->where('product_id', $row->id)
                ->whereBetween('sale_date', [$lastMonthStart, $lastMonthEnd])
                ->sum(DB::raw('selling_price * quantity'));

            return [
                'product_id' => $row->id,
                'name' => $row->name,
                'sku' => $row->sku,
                'category' => $row->category_name,
                'remaining_quantity' => $row->quantity,
                'unit' => $row->unit,
                'turnover' => (float) $row->turnover,
                'increase_percent' => $this->percentChange((float) $row->turnover, (float) $previousTurnover),
            ];
        }));
    }

    private function profitBetween($start, $end): float
    {
        $agg = Sale::whereBetween('sale_date', [$start, $end])
            ->selectRaw('COALESCE(SUM(selling_price * quantity), 0) as revenue')
            ->selectRaw('COALESCE(SUM(buying_price * quantity), 0) as cost')
            ->first();

        return (float) $agg->revenue - (float) $agg->cost;
    }

    private function percentChange(float $current, float $previous): ?float
    {
        if ($previous === 0.0) {
            return $current > 0 ? null : 0.0;
        }

        return round((($current - $previous) / abs($previous)) * 100, 1);
    }
}
