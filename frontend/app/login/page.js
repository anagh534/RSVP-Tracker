'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // If user is already logged in, redirect them
    if (localStorage.getItem('token')) {
      console.log('User already logged in. Redirecting to home...');
      router.push('/');
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/users`)
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error fetching seeded users:', err);
      });
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      console.log(`Attempting login for: ${email}`);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Login failed:', data.error);
        throw new Error(data.error || 'Invalid credentials');
      }
      
      console.log('Login successful. Saving token and redirecting...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch (err) {
      console.error('Exception caught during login:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-gray-600 font-medium mt-2">Sign in to manage your RSVPs and events</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 font-semibold p-4 mb-6 rounded-lg text-sm border border-red-200 text-center flex items-center justify-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Email address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full border border-gray-300 text-gray-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-gray-400" 
              placeholder="alice@example.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full border border-gray-300 text-gray-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-gray-400" 
              placeholder="••••••••"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-700 text-white font-bold text-lg py-3.5 rounded-xl hover:bg-blue-800 transition-colors shadow-md"
          >
            Sign in
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 mb-3 text-center uppercase tracking-wider">Available Test Accounts</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {users.map(u => (
              <button 
                key={u.id}
                type="button"
                onClick={() => setEmail(u.email)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg border border-gray-300 transition-colors"
              >
                {u.email}
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-center text-gray-500 mt-4">
            All accounts use password: <span className="font-mono bg-gray-100 text-gray-800 px-2 py-0.5 border border-gray-300 rounded">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
