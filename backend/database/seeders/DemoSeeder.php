<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Sale;
use App\Models\Store;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    /**
     * Seed realistic demo data so a fresh deployment looks "alive".
     *
     * Idempotent: every run wipes the previous inventory data and rebuilds it,
     * so it can be re-run safely without piling up duplicates.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $this->reset();

            $user = $this->seedUser();
            $categories = $this->seedCategories();
            $suppliers = $this->seedSuppliers();
            $stores = $this->seedStores();
            $products = $this->seedProducts($categories, $suppliers);

            $this->attachProductsToStores($products, $stores);
            $this->seedPurchaseOrders($products, $suppliers, $stores);
            $this->seedSales($products, $stores);
        });
    }

    /**
     * Remove previous demo data in a FK-safe order. The demo user is kept and
     * simply refreshed via updateOrCreate below.
     */
    private function reset(): void
    {
        Sale::query()->delete();
        PurchaseOrder::query()->delete();
        DB::table('product_store')->delete();
        Product::query()->delete();
        Supplier::query()->delete();
        Store::query()->delete();
        Category::query()->delete();
    }

    private function seedUser(): User
    {
        return User::updateOrCreate(
            ['email' => 'demo@kanban.com'],
            [
                'name' => 'Demo User',
                'password' => Hash::make('demo1234'),
            ]
        );
    }

    /**
     * @return array<string, Category>
     */
    private function seedCategories(): array
    {
        $rows = [
            'Electronics' => 'Consumer electronic devices',
            'Accessories' => 'Miscellaneous accessories and peripherals',
            'Computing' => 'Computers and components',
            'Audio' => 'Headphones, speakers and audio gear',
            'Smart Home' => 'Connected devices for the home',
            'Office' => 'Office supplies and equipment',
        ];

        $categories = [];
        foreach ($rows as $name => $description) {
            $categories[$name] = Category::create([
                'name' => $name,
                'description' => $description,
            ]);
        }

        return $categories;
    }

    /**
     * @return array<int, Supplier>
     */
    private function seedSuppliers(): array
    {
        $rows = [
            ['TechDistrib Ltd', 'contact@techdistrib.example', '+1 212 555 0101', true, '12 Industry Street, New York, NY 10010'],
            ['NorthImport Inc', 'sales@northimport.example', '+1 312 555 0122', false, '5 Commerce Avenue, Chicago, IL 60601'],
            ['Global Supply Co', 'hello@globalsupply.example', '+44 20 7946 0088', true, '88 Dock Quay, London, EC1 2AB'],
            ['ElectroPro', 'pro@electropro.example', '+1 415 555 0166', false, '3 Artisan Lane, San Francisco, CA 94103'],
            ['SmartHome Trading', 'info@smarthometrading.example', '+1 416 555 0134', true, '21 Atlantic Boulevard, Toronto, ON M5V 2T6'],
        ];

        return array_map(fn ($r) => Supplier::create([
            'name' => $r[0],
            'email' => $r[1],
            'phone' => $r[2],
            'takes_back_returns' => $r[3],
            'address' => $r[4],
        ]), $rows);
    }

    /**
     * @return array<int, Store>
     */
    private function seedStores(): array
    {
        $rows = [
            ['Downtown Store', '14 Republic Square, New York, NY 10011', '+1 212 555 0201'],
            ['South Warehouse', 'South Logistics Park, Chicago, IL 60607', '+1 312 555 0202'],
            ['Harbor Shop', '7 Port Road, Toronto, ON M5J 1A7', '+1 416 555 0203'],
        ];

        return array_map(fn ($r) => Store::create([
            'name' => $r[0],
            'address' => $r[1],
            'phone' => $r[2],
        ]), $rows);
    }

    /**
     * Products with deliberately varied stock so every availability badge
     * (in stock / low / out of stock) shows up in the UI.
     *
     * @param  array<string, Category>  $categories
     * @param  array<int, Supplier>  $suppliers
     * @return array<int, Product>
     */
    private function seedProducts(array $categories, array $suppliers): array
    {
        // [name, category, supplierIndex, buying, selling, quantity, threshold, unit]
        $rows = [
            ['Galaxy A54 Smartphone', 'Electronics', 0, 280, 399, 42, 10, 'pcs'],
            ['iPhone SE Smartphone', 'Electronics', 0, 350, 489, 0, 8, 'pcs'],        // out of stock
            ['Tab S6 Tablet', 'Electronics', 2, 220, 329, 6, 8, 'pcs'],               // low
            ['Air Bluetooth Earbuds', 'Audio', 3, 18, 39, 120, 20, 'pcs'],
            ['ProSound X Headphones', 'Audio', 3, 65, 119, 4, 6, 'pcs'],              // low
            ['Boom 360 Speaker', 'Audio', 2, 45, 89, 0, 5, 'pcs'],                    // out of stock
            ['RGB Mechanical Keyboard', 'Accessories', 1, 35, 69, 75, 15, 'pcs'],
            ['Wireless Pro Mouse', 'Accessories', 1, 12, 29, 9, 12, 'pcs'],           // low
            ['USB-C 7-in-1 Hub', 'Accessories', 0, 22, 45, 60, 10, 'pcs'],
            ['Full HD Webcam', 'Accessories', 3, 28, 59, 0, 6, 'pcs'],                // out of stock
            ['UltraBook 14" Laptop', 'Computing', 2, 620, 899, 18, 5, 'pcs'],
            ['27" 144Hz Monitor', 'Computing', 0, 190, 279, 3, 5, 'pcs'],             // low
            ['1TB NVMe SSD', 'Computing', 1, 70, 109, 95, 20, 'pcs'],
            ['16GB RAM Module', 'Computing', 1, 38, 65, 7, 10, 'pcs'],                // low
            ['Color Smart Bulb', 'Smart Home', 4, 9, 22, 200, 30, 'pcs'],
            ['WiFi Smart Plug', 'Smart Home', 4, 11, 25, 0, 15, 'pcs'],               // out of stock
            ['Eco Smart Thermostat', 'Smart Home', 4, 75, 139, 25, 8, 'pcs'],
            ['MonoJet Laser Printer', 'Office', 2, 130, 199, 11, 6, 'pcs'],
            ['Toner Cartridge Pack', 'Office', 2, 40, 75, 5, 10, 'pcs'],              // low
            ['Document Shredder', 'Office', 3, 55, 99, 30, 8, 'pcs'],
        ];

        $products = [];
        $skuCounter = 1000;
        foreach ($rows as $r) {
            $products[] = Product::create([
                'name' => $r[0],
                'sku' => 'SKU-' . $skuCounter++,
                'category_id' => $categories[$r[1]]->id,
                'supplier_id' => $suppliers[$r[2]]->id,
                'buying_price' => $r[3],
                'selling_price' => $r[4],
                'quantity' => $r[5],
                'threshold' => $r[6],
                'unit' => $r[7],
            ]);
        }

        return $products;
    }

    /**
     * Spread stock of some products across stores via the pivot table.
     *
     * @param  array<int, Product>  $products
     * @param  array<int, Store>  $stores
     */
    private function attachProductsToStores(array $products, array $stores): void
    {
        foreach ($products as $i => $product) {
            $store = $stores[$i % count($stores)];
            $product->stores()->attach($store->id, [
                'quantity' => (int) max(1, round($product->quantity / 2)),
            ]);
        }
    }

    /**
     * Purchase orders spread over the last 3 months with varied statuses so the
     * dashboard "ordered vs delivered" chart shows real movement.
     *
     * @param  array<int, Product>  $products
     * @param  array<int, Supplier>  $suppliers
     * @param  array<int, Store>  $stores
     */
    private function seedPurchaseOrders(array $products, array $suppliers, array $stores): void
    {
        // [productIndex, qty, daysAgo, status]
        $rows = [
            [0, 50, 78, PurchaseOrder::STATUS_DELIVERED],
            [3, 100, 70, PurchaseOrder::STATUS_DELIVERED],
            [12, 60, 64, PurchaseOrder::STATUS_DELIVERED],
            [6, 40, 52, PurchaseOrder::STATUS_DELIVERED],
            [10, 15, 40, PurchaseOrder::STATUS_DELIVERED],
            [2, 20, 33, PurchaseOrder::STATUS_OUT_FOR_DELIVERY],
            [16, 30, 25, PurchaseOrder::STATUS_DELIVERED],
            [4, 12, 14, PurchaseOrder::STATUS_DELAYED],
            [11, 10, 7, PurchaseOrder::STATUS_CONFIRMED],
            [18, 25, 2, PurchaseOrder::STATUS_OUT_FOR_DELIVERY],
        ];

        foreach ($rows as $r) {
            $product = $products[$r[0]];
            $orderDate = Carbon::now()->subDays($r[2]);
            $delivered = $r[3] === PurchaseOrder::STATUS_DELIVERED;

            $order = PurchaseOrder::create([
                'product_id' => $product->id,
                'supplier_id' => $product->supplier_id,
                'store_id' => $stores[$r[0] % count($stores)]->id,
                'quantity' => $r[1],
                'order_value' => round($product->buying_price * $r[1], 2),
                'order_date' => $orderDate,
                'expected_date' => $orderDate->copy()->addDays(7),
                'status' => $r[3],
                'received' => $delivered,
            ]);

            // The dashboard "delivered" chart keys off updated_at; align it with
            // the order window. A raw query update bypasses Eloquent's automatic
            // timestamp handling (which would otherwise reset it to now()).
            PurchaseOrder::where('id', $order->id)->update([
                'updated_at' => $delivered ? $orderDate->copy()->addDays(5) : $orderDate,
            ]);
        }
    }

    /**
     * Sales spread over the last 5 months so the "sales vs purchases" and
     * "top products" widgets have a real history to chart.
     *
     * @param  array<int, Product>  $products
     * @param  array<int, Store>  $stores
     */
    private function seedSales(array $products, array $stores): void
    {
        // Bestsellers get more sales so "top products" is meaningful.
        // [productIndex, weight]
        $catalog = [
            [0, 6], [3, 9], [6, 7], [8, 4], [12, 8],
            [14, 10], [10, 3], [16, 4], [19, 5], [2, 3],
        ];

        foreach ($catalog as [$idx, $weight]) {
            $product = $products[$idx];

            for ($n = 0; $n < $weight; $n++) {
                // distribute across the last ~150 days
                $daysAgo = random_int(1, 150);
                $qty = random_int(1, 5);

                Sale::create([
                    'product_id' => $product->id,
                    'store_id' => $stores[$n % count($stores)]->id,
                    'quantity' => $qty,
                    'selling_price' => $product->selling_price,
                    'buying_price' => $product->buying_price,
                    'sale_date' => Carbon::now()->subDays($daysAgo),
                ]);
            }
        }
    }
}
