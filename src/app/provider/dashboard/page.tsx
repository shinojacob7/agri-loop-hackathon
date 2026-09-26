import Link from 'next/link'
import { Plus, List, Bell, Star, Leaf } from 'lucide-react'

// Dummy data for MVP layout purposes
const STATS = {
  activeListings: 3,
  pendingRequests: 2,
  completedExchanges: 15,
  totalProvided: '2.5 tonnes'
}

export default function ProviderDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your organic resources and requests</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Link 
            href="/provider/resources/new" 
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            List New Resource
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <List className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Listings</p>
            <p className="text-2xl font-bold text-gray-900">{STATS.activeListings}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Requests</p>
            <p className="text-2xl font-bold text-gray-900">{STATS.pendingRequests}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed Exchanges</p>
            <p className="text-2xl font-bold text-gray-900">{STATS.completedExchanges}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Provided</p>
            <p className="text-2xl font-bold text-gray-900">{STATS.totalProvided}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requests */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Requests</h2>
          <div className="space-y-4">
            {/* Placeholder Request Item */}
            <div className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">Pending</span>
                  <p className="font-semibold text-gray-900">300 kg Vegetable Waste</p>
                </div>
                <p className="text-sm text-gray-600">Requested by <span className="font-medium text-gray-900">John Farmer</span> • 10 km away</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">Reject</button>
                <button className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700">Accept</button>
              </div>
            </div>
            {/* Can map more items here when hooked up to DB */}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link href="/provider/requests" className="text-emerald-600 font-medium text-sm hover:text-emerald-700">
              View all requests →
            </Link>
          </div>
        </div>

        {/* Your Active Listings summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Listings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <div>
                <p className="font-medium text-gray-900">500 kg Vegetable Waste</p>
                <p className="text-sm text-gray-500">Added 2 days ago</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">Available</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <div>
                <p className="font-medium text-gray-900">200 kg Cow Dung</p>
                <p className="text-sm text-gray-500">Added yesterday</p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">Reserved</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/provider/resources" className="text-emerald-600 font-medium text-sm hover:text-emerald-700">
              Manage all listings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
