<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Restaurant extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description','image', 'user_id'];
    public function dishes() {
        return $this->hasMany(Dish::class);
    }

    public function order()
    {
        return $this->hasMany(Order::class);
    }
}
