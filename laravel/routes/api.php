<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\DishController;
use App\Http\Controllers\OrderController;
use App\Http\Middleware\VerifyJwtToken;  

Route::middleware(['jwt.verify'])->group(function () {
    Route::apiResource('restaurants', RestaurantController::class);
    Route::apiResource('dishes', DishController::class);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/restaurant/{id}', [OrderController::class, 'getByRestaurant']);
    Route::get('/orders/client/{id}', [OrderController::class, 'getByClient']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
});
