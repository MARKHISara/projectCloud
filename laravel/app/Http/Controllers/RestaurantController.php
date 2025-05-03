<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Restaurant;

class RestaurantController extends Controller
{
    /**
     * Affiche la liste des restaurants avec leurs plats.
     */
    public function index()
    {
        return Restaurant::with('dishes')->get();
    }

    /**
     * Crée un nouveau restaurant pour l'utilisateur authentifié.
     */

     public function store(Request $request)
     {
         // Vérifier si l'utilisateur est authentifié
         $userId = $request->user->id ?? null;
         if (!$userId) {
             return response()->json(['error' => 'Utilisateur non authentifié'], 401);
         }
     
         // Validation des données
         $validated = $request->validate([
             'name' => 'required|string',
             'description' => 'nullable|string',
             'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validation de l'image
         ]);
     
         // Gérer l'upload de l'image si elle est présente
         $imagePath = null;
         if ($request->hasFile('image')) {
             // Sauvegarder l'image dans le dossier 'restaurants'
             $imagePath = $request->file('image')->store('restaurants', 'public');
         }
     
         // Créer le restaurant
         $restaurant = Restaurant::create([
             'name' => $validated['name'],
             'description' => $validated['description'] ?? null,
             'user_id' => $userId, // Assurer que le user_id est correctement attribué
             'image' => $imagePath, // Sauvegarder le chemin de l'image
         ]);
     
         return response()->json($restaurant, 201);
     }
     
    /**
     * Affiche un restaurant spécifique avec ses plats.
     */
    public function show($id)
    {
        $restaurant = Restaurant::with('dishes')->findOrFail($id);
        return response()->json($restaurant);
    }

    /**
     * Met à jour un restaurant spécifique.
     */
    public function update(Request $request, $id)
    {
        $restaurant = Restaurant::findOrFail($id);

        // Vérifie si l'utilisateur est bien le propriétaire
        if ($restaurant->user_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'description' => 'nullable|string',
        ]);

        $restaurant->update($validated);

        return response()->json($restaurant);
    }

    /**
     * Supprime un restaurant spécifique.
     */
    public function destroy($id)
    {
        $restaurant = Restaurant::findOrFail($id);

        // Vérifie si l'utilisateur est bien le propriétaire
        if ($restaurant->user_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $restaurant->delete();

        return response()->json(['message' => 'Restaurant supprimé avec succès.']);
    }
}
