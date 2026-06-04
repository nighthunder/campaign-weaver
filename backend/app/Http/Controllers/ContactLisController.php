<?php

namespace App\Http\Controllers;

use App\Models\ContactList;
use App\Models\Subscriber;
use Illuminate\Http\Request;

class ContactListController extends Controller
{
    public function index(Request $request)
    {
        $lists = $request->user()
            ->contactLists()
            ->withCount('subscribers')
            ->latest()
            ->get();

        return response()->json($lists);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $list = ContactList::create([
            'user_id' => $request->user()->id,
            ...$data
        ]);

        return response()->json($list, 201);
    }

    /**
     * Bulk import subscribers (async com queue)
     */
    public function import(Request $request)
    {
        $data = $request->validate([
            'contact_list_id' => 'required|exists:contact_lists,id',
            'subscribers' => 'required|array|min:1',
            'subscribers.*.email' => 'required|email',
            'subscribers.*.first_name' => 'nullable|string',
            'subscribers.*.last_name' => 'nullable|string',
        ]);

        $list = ContactList::findOrFail($data['contact_list_id']);

        dispatch(new \App\Jobs\ImportSubscribers($list->id, $data['subscribers']));

        return response()->json([
            'importing' => true,
            'count' => count($data['subscribers'])
        }, 202);
    }

    public function show(ContactList $list)
    {
        $this->authorize('view', $list);
        return response()->json($list->load(['subscribers']));
    }

    public function destroy(ContactList $list)
    {
        $this->authorize('delete', $list);
        $list->delete();
        return response()->json(['deleted' => true]);
    }
}
