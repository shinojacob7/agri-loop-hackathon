'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  
  // Smart Hackathon routing: infer role from the URL!
  const isFarmer = pathname.startsWith('/farmer')
  const isProvider = pathname.startsWith('/provider')
  const isLoggedIn = isFarmer || isProvider

  return (
    <nav className="bg-emerald-700 text-white shadow-md relative z-50">
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
            
            {/* Dynamic Auth Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4 border-l border-emerald-600 pl-4 ml-2">
                <Link 
                  href={isFarmer ? "/farmer/dashboard" : "/provider/dashboard"} 
                  className="flex items-center gap-1 hover:text-emerald-200 font-medium transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link 
                  href="/" 
                  className="flex items-center gap-1 text-emerald-100 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="hover:text-emerald-200 font-medium transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-white text-emerald-700 px-4 py-1.5 rounded-full font-bold hover:bg-emerald-50 transition-colors hidden sm:block">
                  Sign up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}
