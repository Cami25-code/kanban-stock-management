<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'update']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::get('/suppliers/{supplier}', [SupplierController::class, 'show']);
    Route::post('/suppliers', [SupplierController::class, 'store']);
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update']);
    Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy']);

    Route::get('/orders', [PurchaseOrderController::class, 'index']);
    Route::get('/orders/{order}', [PurchaseOrderController::class, 'show']);
    Route::post('/orders', [PurchaseOrderController::class, 'store']);
    Route::put('/orders/{order}', [PurchaseOrderController::class, 'update']);
    Route::delete('/orders/{order}', [PurchaseOrderController::class, 'destroy']);

    Route::get('/stores', [StoreController::class, 'index']);
    Route::post('/stores', [StoreController::class, 'store']);
    Route::put('/stores/{store}', [StoreController::class, 'update']);

    Route::post('/sales', [SaleController::class, 'store']);

    Route::get('/dashboard', [DashboardController::class, 'summary']);
    Route::get('/stats/sales-vs-purchases', [DashboardController::class, 'salesVsPurchases']);
    Route::get('/stats/orders-summary', [DashboardController::class, 'ordersSummary']);
    Route::get('/stats/top-products', [DashboardController::class, 'topProducts']);
    Route::get('/stats/low-stock', [DashboardController::class, 'lowStock']);

    Route::get('/reports/overview', [ReportsController::class, 'overview']);
    Route::get('/reports/best-categories', [ReportsController::class, 'bestCategories']);
    Route::get('/reports/profit-vs-revenue', [ReportsController::class, 'profitVsRevenue']);
    Route::get('/reports/best-products', [ReportsController::class, 'bestProducts']);
});
