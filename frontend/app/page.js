'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/events`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('API Error:', data);
          setEvents([]); // Prevent crash
        }
      })
      .catch(err => {
        console.error(err);
        setEvents([]);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Upcoming Meetups</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <div key={event.id} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-2">{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500 mb-4">{event.location}</p>
            <Link href={`/events/${event.id}`} className="text-blue-600 hover:underline">
              View Details & RSVP
            </Link>
          </div>
        ))}
        {events.length === 0 && <p>No events found. Be the first to create one!</p>}
      </div>
    </div>
  );
}
