import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'RSVP Tracker',
  description: 'Manage and RSVP to local meetups',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="p-4 bg-blue-600 text-white flex justify-between">
          <Link href="/" className="font-bold text-xl">RSVP Tracker</Link>
          <div className="space-x-4">
            <Link href="/">Events</Link>
            <Link href="/login">Login</Link>
            <Link href="/events/create" className="bg-white text-blue-600 px-3 py-1 rounded">Create Event</Link>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
