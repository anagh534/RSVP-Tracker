'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  // Check auth state on mount and when pathname changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAuthenticated(true);
        setUserName(user.name || user.email);
      } catch (e) {
        console.error('Failed to parse user data from local storage');
      }
    } else {
      setIsAuthenticated(false);
      setUserName('');
    }
  }, [pathname]); // Re-run whenever route changes

  const handleLogout = () => {
    console.log('Logging out user...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserName('');
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-blue-700 tracking-tight flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          RSVP Tracker
        </Link>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-gray-700 hover:text-blue-700 transition-colors">Browse Events</Link>
          
          {isAuthenticated ? (
            <>
              <span className="text-gray-500 hidden md:inline">Hi, {userName}</span>
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-blue-700 transition-colors">Sign in</Link>
          )}

          <Link href="/events/create" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-sm font-semibold">
            Create Event
          </Link>
        </div>
      </div>
    </nav>
  );
}
