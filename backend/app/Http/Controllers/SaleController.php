<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SaleController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'store_id' => ['nullable', 'exists:stores,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($data['product_id']);

        if ($data['quantity'] > $product->quantity) {
            throw ValidationException::withMessages([
                'quantity' => ['La quantité vendue dépasse le stock disponible.'],
            ]);
        }

        $sale = Sale::create([
            'product_id' => $product->id,
            'store_id' => $data['store_id'] ?? null,
            'quantity' => $data['quantity'],
            'selling_price' => $product->selling_price,
            'buying_price' => $product->buying_price,
        ]);

        $product->decrement('quantity', $data['quantity']);

        if (! empty($data['store_id'])) {
            $pivot = $product->stores()->where('store_id', $data['store_id'])->first();

            if ($pivot) {
                $product->stores()->updateExistingPivot($data['store_id'], [
                    'quantity' => max(0, $pivot->pivot->quantity - $data['quantity']),
                ]);
            }
        }

        return response()->json($sale->load(['product', 'store']), 201);
    }
}
