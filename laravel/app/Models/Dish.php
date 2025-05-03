<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Dish extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description', 'price','image', 'restaurant_id'];
    public function restaurant() {
        return $this->belongsTo(Restaurant::class);
    }
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
