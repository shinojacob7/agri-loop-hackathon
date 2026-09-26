import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-emerald-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6" />
            <Link href="/" className="font-bold text-xl tracking-tight">
              AgriLoop
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/map" className="hover:text-emerald-200 font-medium transition-colors hidden sm:block">
              Live Map
            </Link>
            <Link href="/impact" className="hover:text-emerald-200 font-medium transition-colors hidden sm:block">
              Impact
            </Link>
            <Link href="/login" className="hover:text-emerald-200 font-medium transition-colors">
              Login
            </Link>
            <Link 
              href="/register" 
              className="bg-white text-emerald-700 px-4 py-2 rounded-md font-semibold hover:bg-emerald-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
