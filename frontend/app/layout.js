import './globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'RSVP Tracker',
  description: 'Manage and RSVP to local meetups',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900 font-sans antialiased">
        <Navbar />
        <main className="container mx-auto p-4 max-w-5xl">
          {children}
        </main>
      </body>
    </html>
  )
}
