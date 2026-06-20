<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PurchaseOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = PurchaseOrder::with(['product.category', 'supplier'])->latest('order_date');

        if ($request->query('status') !== 'all') {
            $query->whereNotIn('status', [
                PurchaseOrder::STATUS_DELIVERED,
                PurchaseOrder::STATUS_RETURNED,
            ]);
        }

        return $query->paginate(10);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'expected_date' => ['nullable', 'date'],
        ]);

        $product = Product::findOrFail($data['product_id']);

        $supplierId = $data['supplier_id'] ?? $product->supplier_id;

        if (! $supplierId) {
            throw ValidationException::withMessages([
                'supplier_id' => ['Ce produit n\'a pas de fournisseur associé, veuillez en choisir un.'],
            ]);
        }

        $order = PurchaseOrder::create([
            'product_id' => $product->id,
            'supplier_id' => $supplierId,
            'quantity' => $data['quantity'],
            'order_value' => $data['quantity'] * $product->buying_price,
            'expected_date' => $data['expected_date'] ?? null,
            'status' => PurchaseOrder::STATUS_CONFIRMED,
        ]);

        $order->load(['product.category', 'supplier']);

        return response()->json($order, 201);
    }

    public function show(PurchaseOrder $order)
    {
        return $order->load(['product.category', 'supplier']);
    }

    public function update(Request $request, PurchaseOrder $order)
    {
        $data = $request->validate([
            'status' => ['required', 'in:' . implode(',', [
                PurchaseOrder::STATUS_CONFIRMED,
                PurchaseOrder::STATUS_OUT_FOR_DELIVERY,
                PurchaseOrder::STATUS_DELAYED,
                PurchaseOrder::STATUS_DELIVERED,
                PurchaseOrder::STATUS_RETURNED,
            ])],
        ]);

        if ($data['status'] === PurchaseOrder::STATUS_DELIVERED && ! $order->received) {
            $order->product->increment('quantity', $order->quantity);
            $order->received = true;
        }

        $order->status = $data['status'];
        $order->save();

        return $order->load(['product.category', 'supplier']);
    }

    public function destroy(PurchaseOrder $order)
    {
        if ($order->status === PurchaseOrder::STATUS_DELIVERED) {
            return response()->json([
                'message' => 'Impossible de supprimer une commande déjà livrée.',
            ], 422);
        }

        $order->delete();

        return response()->noContent();
    }
}
