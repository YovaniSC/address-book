<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ContactService;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function __construct(private readonly ContactService $service) {}
    /**
     * Display a listing of the resource.
     */
 public function index(Request $request): JsonResponse
    {
        $data = $this->service->list(
            $request->query('search'),
            $request->query('city'),
            (int) $request->query('per_page', 20)
        );

        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactRequest $request): JsonResponse
    {
        $contact = $this->service->create($request->validated());
        return response()->json($contact, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $contact = $this->service->get($id);
        return response()->json($contact);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContactRequest $request, int $id): JsonResponse
    {
        $contact = $this->service->update($id, $request->validated());
        return response()->json($contact);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return response()->json(null, 204);
    }
}
