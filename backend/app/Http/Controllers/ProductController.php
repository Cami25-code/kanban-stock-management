<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);

        return Product::with(['category', 'supplier'])->latest()->paginate($perPage);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'buying_price' => ['required', 'numeric', 'min:0'],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'threshold' => ['required', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:255'],
            'expiry_date' => ['nullable', 'date'],
        ]);

        $product = Product::create($data);
        $product->load(['category', 'supplier']);

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return $product->load(['category', 'supplier']);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:255'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'buying_price' => ['sometimes', 'numeric', 'min:0'],
            'selling_price' => ['sometimes', 'numeric', 'min:0'],
            'quantity' => ['sometimes', 'integer', 'min:0'],
            'threshold' => ['sometimes', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:255'],
            'expiry_date' => ['nullable', 'date'],
        ]);

        $product->update($data);

        return $product->load(['category', 'supplier']);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->noContent();
    }
}
