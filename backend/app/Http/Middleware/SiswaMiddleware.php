<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SiswaMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user || $user->is_admin || $user->is_guru) {
            return response()->json([
                'message' => 'Unauthorized. Siswa access required.'
            ], 403);
        }

        return $next($request);
    }
}