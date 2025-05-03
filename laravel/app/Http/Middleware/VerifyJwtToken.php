<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Exception;

class VerifyJwtToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Token manquant'], 401);
        }

        try {
            $key = env('JWT_SECRET');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));

            // On attache directement le payload du token à la requête
            $request->user = (object) [
                'id' => $decoded->id,
                'email' => $decoded->email ?? null,
                'role' => $decoded->role ?? null
            ];

        } catch (Exception $e) {
            return response()->json(['error' => 'Token invalide: ' . $e->getMessage()], 401);
        }

        return $next($request);
    }
}
