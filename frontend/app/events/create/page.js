'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateEvent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const validateForm = () => {
    if (formData.title.trim().length < 3) return "Title must be at least 3 characters long.";
    if (formData.description.trim().length < 10) return "Description must be at least 10 characters long.";
    if (formData.location.trim().length < 3) return "Location must be at least 3 characters long.";
    
    const selectedDate = new Date(formData.date);
    const now = new Date();
    if (selectedDate <= now) return "Event date and time must be in the future.";
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Front-end Validation
    const validationError = validateForm();
    if (validationError) {
      console.warn("Form validation failed:", validationError);
      setError(validationError);
      return;
    }

    try {
      console.log("Submitting new event data:", formData);
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/events`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error("API error response:", data);
        throw new Error(data.error || 'Failed to create event');
      }
      
      console.log("Event created successfully:", data);
      router.push('/');
    } catch (err) {
      console.error("Failed to submit event:", err.message);
      setError(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 max-w-md w-full">
          <svg className="w-16 h-16 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6 font-medium">You must be logged in to create a new meetup event.</p>
          <Link href="/login" className="block w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-md border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">Create New Meetup</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 font-medium p-4 mb-6 rounded-lg text-sm border border-red-200 flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Event Title</label>
          <input 
            type="text" 
            placeholder="e.g. Weekend Tech Mixer"
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-gray-400" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
          <textarea 
            placeholder="What's this event about?"
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all resize-none placeholder-gray-400" 
            rows="4" 
            required 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Date & Time</label>
            <input 
              type="datetime-local" 
              value={formData.date} 
              onChange={e => setFormData({...formData, date: e.target.value})} 
              className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Location</label>
            <input 
              type="text" 
              placeholder="e.g. Central Park"
              value={formData.location} 
              onChange={e => setFormData({...formData, location: e.target.value})} 
              className="w-full border border-gray-300 text-gray-900 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-gray-400" 
              required 
            />
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-700 text-white font-bold py-3.5 rounded-lg hover:bg-blue-800 transition-colors shadow-md mt-6 text-lg"
        >
          Publish Event
        </button>
      </form>
    </div>
  );
}
