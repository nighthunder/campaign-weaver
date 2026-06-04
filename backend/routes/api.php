<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ContactListController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Campaigns
    Route::prefix('campaigns')->group(function () {
        Route::get('/', [CampaignController::class, 'index']);
        Route::post('/', [CampaignController::class, 'store']);
        Route::get('/{campaign}', [CampaignController::class, 'show']);
        Route::put('/{campaign}', [CampaignController::class, 'update']);
        Route::delete('/{campaign}', [CampaignController::class, 'destroy']);
        Route::post('/{campaign}/queue', [CampaignController::class, 'queue']);
        Route::get('/{campaign}/metrics', [CampaignController::class, 'metrics']);
    });

    // Contact Lists
    Route::prefix('contact-lists')->group(function () {
        Route::get('/', [ContactListController::class, 'index']);
        Route::post('/', [ContactListController::class, 'store']);
        Route::get('/{contactList}', [ContactListController::class, 'show']);
        Route::delete('/{contactList}', [ContactListController::class, 'destroy']);
        Route::post('/import', [ContactListController::class, 'import']);
    });
});

// Webhooks (public, validar com token secret)
Route::post('/webhooks/mailersend/events', [\App\Http\Controllers\WebhookController::class, 'mailersendEvents']);
