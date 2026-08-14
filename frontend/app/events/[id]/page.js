'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    fetchEvent();
  }, [id]);

  const fetchEvent = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/events/${id}`)
      .then(res => res.json())
      .then(data => setEvent(data))
      .catch(err => console.error(err));
  };

  const handleRSVP = async (status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in to RSVP');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/events/${id}/rsvp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to RSVP');
      
      // Refresh event to show updated RSVPs
      fetchEvent();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-500 mb-6">Organized by: {event.creator?.name}</p>
      
      <div className="bg-gray-50 p-6 rounded mb-6">
        <p className="mb-4">{event.description}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

      {user ? (
        <div className="mb-8">
          <h3 className="font-semibold mb-2">Your RSVP</h3>
          <div className="space-x-2">
            <button onClick={() => handleRSVP('going')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Going</button>
            <button onClick={() => handleRSVP('maybe')} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Maybe</button>
            <button onClick={() => handleRSVP('declined')} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Declined</button>
          </div>
        </div>
      ) : (
        <p className="mb-8 text-blue-600"><a href="/login">Log in to RSVP</a></p>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4">Attendees</h3>
        {event.RSVPs?.length > 0 ? (
          <ul className="space-y-2">
            {event.RSVPs.map(rsvp => (
              <li key={rsvp.id} className="flex justify-between border-b pb-2">
                <span>{rsvp.user?.name}</span>
                <span className={`px-2 rounded text-sm ${
                  rsvp.status === 'going' ? 'bg-green-100 text-green-800' :
                  rsvp.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>{rsvp.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No RSVPs yet.</p>
        )}
      </div>
    </div>
  );
}
