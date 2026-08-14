'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/events?page=${page}&limit=6`)
      .then(res => res.json())
      .then(data => {
        if (data.events) {
          setEvents(data.events);
          setTotalPages(data.totalPages);
        } else if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      })
      .catch(err => {
        console.error(err);
        setEvents([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page]);

  return (
    <div className="py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Upcoming Meetups</h1>
          <p className="text-gray-500 mt-2">Discover and join local events happening around you.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton Loading Effect
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-[280px] animate-pulse">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded-md w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded-md w-2/3 mb-6"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded-md w-full"></div>
                  <div className="h-3 bg-gray-100 rounded-md w-5/6"></div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-50 mt-auto flex items-center justify-between">
                <div className="h-6 bg-gray-100 rounded-md w-20"></div>
                <div className="h-5 bg-gray-200 rounded-md w-24"></div>
              </div>
            </div>
          ))
        ) : events.map(event => (
          <div key={event.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-[280px]">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{event.title}</h2>
              <div className="flex items-center text-sm text-gray-500 mb-3 gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4 gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="line-clamp-1">{event.location}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-6 leading-relaxed">
                {event.description}
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-50 mt-auto flex items-center justify-between">
              <div className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">
                {event.RSVPs?.length || 0} attending
              </div>
              <Link href={`/events/${event.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:underline">
                View Details
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </Link>
            </div>
          </div>
        ))}
        {!isLoading && events.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <p className="text-gray-500 font-medium">No events found. Be the first to create one!</p>
          </div>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
