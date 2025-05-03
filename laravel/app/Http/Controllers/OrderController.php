<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use App\Models\Restaurant;


class OrderController extends Controller
{
    // Créer une commande
    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id' => 'required',
            'restaurant_id' => 'required|exists:restaurants,id',
            'total' => 'required|numeric',
            'items' => 'required|array',
            'items.*.dish_id' => 'required|exists:dishes,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);
    
        // Créer la commande
        $order = Order::create([
            'client_id' => $data['client_id'],
            'restaurant_id' => $data['restaurant_id'],
            'total' => $data['total'],
            'status' => 'en_attente',
        ]);
    
        foreach ($data['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'dish_id' => $item['dish_id'],
                'quantity' => $item['quantity'],
            ]);
        }
    
       
        return response()->json(['message' => 'Commande créée avec succès', 'order' => $order], 201);
    }
    

    // Lister les commandes par restaurant
    public function getByRestaurant($restaurantId)
    {
        $orders = Order::with('items.dish')
            ->where('restaurant_id', $restaurantId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    // Lister les commandes par client
    public function getByClient($clientId)
    {
        $orders = Order::with('items.dish')
            ->where('client_id', $clientId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    // Modifier le statut
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $request->validate([
            'status' => 'required|string',
        ]);

        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Statut mis à jour', 'order' => $order]);
    }
}
