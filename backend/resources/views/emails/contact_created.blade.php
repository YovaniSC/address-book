<h2>New contact created</h2>

<p><strong>Name:</strong> {{ $contact->name }}</p>
<p><strong>Birthday:</strong> {{ $contact->birthday_date }}</p>
<p><strong>Company:</strong> {{ $contact->company ?? '-' }}</p>
<p><strong>Website:</strong> {{ $contact->website ?? '-' }}</p>

@if($contact->emails->count())
  <p><strong>Email(s):</strong></p>
  <ul>
    @foreach($contact->emails as $e)
      <li>{{ $e->email }}</li>
    @endforeach
  </ul>
@endif
