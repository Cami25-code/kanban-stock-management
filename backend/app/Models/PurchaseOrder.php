<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseOrder extends Model
{
    public const STATUS_CONFIRMED = 'Confirmed';

    public const STATUS_OUT_FOR_DELIVERY = 'Out for delivery';

    public const STATUS_DELAYED = 'Delayed';

    public const STATUS_DELIVERED = 'Delivered';

    public const STATUS_RETURNED = 'Returned';

    protected $fillable = [
        'product_id',
        'supplier_id',
        'store_id',
        'quantity',
        'order_value',
        'order_date',
        'expected_date',
        'status',
        'received',
    ];

    protected $casts = [
        'order_date' => 'datetime',
        'expected_date' => 'date',
        'received' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
