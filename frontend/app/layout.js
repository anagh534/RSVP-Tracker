import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'RSVP Tracker',
  description: 'Manage and RSVP to local meetups',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900 font-sans antialiased">
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-blue-600 tracking-tight flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              RSVP Tracker
            </Link>
            <div className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Browse Events</Link>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Sign in</Link>
              <Link href="/events/create" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                Create Event
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4 max-w-5xl">
          {children}
        </main>
      </body>
    </html>
  )
}
