'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchEvent();
  }, [id]);

  const fetchEvent = () => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/events/${id}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
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
      
      setError('');
      fetchEvent();
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto mt-12 animate-pulse px-4">
        <div className="h-4 bg-gray-200 rounded w-24 mb-8"></div>
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-100 rounded w-1/3 mb-8"></div>
        <div className="h-64 bg-gray-50 rounded-2xl mb-8"></div>
      </div>
    );
  }

  if (!event) return (
    <div className="max-w-3xl mx-auto mt-12 text-center">
      <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
      <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Go back home</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-16 px-4">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors group">
        <svg className="w-5 h-5 mr-1.5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Events
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">{event.title}</h1>
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
            {event.creator?.name?.[0]?.toUpperCase()}
          </div>
          <span>Organized by <span className="font-semibold text-gray-700">{event.creator?.name}</span></span>
        </div>
      </div>
      
      {/* Event Details Card */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-gray-50 pb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Date & Time</h3>
              <p className="text-gray-600">{new Date(event.date).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
              <p className="text-gray-600">{event.location}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-3">About this event</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 mb-8 rounded-xl text-sm border border-red-100 flex items-center gap-2 font-medium">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
          {error}
        </div>
      )}

      {/* RSVP Actions */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Are you going?</h3>
          <p className="text-sm text-gray-500">Let the organizer know if you can make it.</p>
        </div>
        
        {user ? (
          <div className="flex gap-3">
            <button onClick={() => handleRSVP('going')} className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm">Going</button>
            <button onClick={() => handleRSVP('maybe')} className="px-6 py-2.5 bg-yellow-500 text-white font-medium rounded-xl hover:bg-yellow-600 transition-colors shadow-sm">Maybe</button>
            <button onClick={() => handleRSVP('declined')} className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm">Declined</button>
          </div>
        ) : (
          <Link href="/login" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            Sign in to RSVP
          </Link>
        )}
      </div>

      {/* Attendees List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          Attendees <span className="bg-gray-100 text-gray-600 text-sm py-0.5 px-2.5 rounded-full">{event.RSVPs?.length || 0}</span>
        </h3>
        
        {event.RSVPs?.length > 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-50">
              {event.RSVPs.map(rsvp => (
                <li key={rsvp.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {rsvp.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{rsvp.user?.name}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    rsvp.status === 'going' ? 'bg-green-100 text-green-800' :
                    rsvp.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {rsvp.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
            <p className="text-gray-500 font-medium">No RSVPs yet. Be the first to join!</p>
          </div>
        )}
      </div>
    </div>
  );
}
