<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        return Supplier::with('products')->get()->map(function (Supplier $supplier) {
            $supplier->on_the_way = PurchaseOrder::where('supplier_id', $supplier->id)
                ->whereNotIn('status', [PurchaseOrder::STATUS_DELIVERED, PurchaseOrder::STATUS_RETURNED])
                ->sum('quantity');

            return $supplier;
        });
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:suppliers,email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'takes_back_returns' => ['boolean'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $supplier = Supplier::create($data);

        return response()->json($supplier, 201);
    }

    public function show(Supplier $supplier)
    {
        return $supplier->load('products');
    }

    public function update(Request $request, Supplier $supplier)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:suppliers,email,' . $supplier->id],
            'phone' => ['nullable', 'string', 'max:50'],
            'takes_back_returns' => ['boolean'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        $supplier->update($data);

        return $supplier->load('products');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return response()->noContent();
    }
}
