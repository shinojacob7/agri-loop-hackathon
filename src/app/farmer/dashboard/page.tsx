import Link from 'next/link'
import { Search, ClipboardList, CheckCircle, Sprout, Map } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function FarmerDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch pending/confirmed requests in the future. For now, empty array since we don't have a requests table.
  const activeRequests = 0;
  const confirmedMatches = 0;

  const STATS = {
    activeRequests,
    confirmedMatches,
    totalReceived: '0 tonnes',
    carbonSaved: '0 kg'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your resource requests and matches.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Link 
            href="/farmer/search" 
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium shadow-sm"
          >
            <Search className="w-5 h-5" />
            Find New Resources
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Requests</p>
            <p className="text-2xl font-bold text-gray-900">{STATS.activeRequests}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Confirmed Matches</p>
            <p className="text-2xl font-bold text-gray-900">{STATS.confirmedMatches}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Received</p>
            <p className="text-2xl font-bold text-gray-900">{STATS.totalReceived}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Est. CO2 Saved</p>
            <p className="text-2xl font-bold text-gray-900">{STATS.carbonSaved}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Requests */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Recent Requests</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">No active requests yet.</p>
          </div>
        </div>

        {/* Confirmed Matches */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Confirmed Matches (Ready for Pickup)</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">No confirmed matches yet.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Leaf(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 14 6a7 7 0 0 1 7 7v7h-7a7 7 0 0 1-3-10"/><path d="M14 6v14"/></svg>
}
