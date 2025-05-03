<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dish;

class DishController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation des données
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'restaurant_id' => 'required|exists:restaurants,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validation de l'image
        ]);

        // Traitement de l'image si elle existe
        $imagePath = null;
        if ($request->hasFile('image')) {
            // Sauvegarder l'image dans le répertoire 'dishes' du stockage
            $imagePath = $request->file('image')->store('dishes', 'public');
        }

        // Créer un nouveau plat
        $dish = Dish::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'restaurant_id' => $request->restaurant_id,
            'image' => $imagePath, // Enregistrer le chemin de l'image
        ]);

        return response()->json([
            'message' => 'Plat ajouté avec succès.',
            'dish' => $dish
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
