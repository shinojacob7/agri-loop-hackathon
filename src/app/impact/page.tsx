'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts'
import { Leaf, Users, Sprout, Handshake } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0']
const PIE_COLORS = ['#059669', '#f59e0b']

export default function ImpactPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalListed: 0,
    totalReused: 0,
    successfulMatches: 0,
    activeUsers: 0
  })
  
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [userSplitData, setUserSplitData] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchImpactData() {
      // 1. Fetch Users Split
      const { data: users } = await supabase.from('users').select('role')
      let farmerCount = 0
      let providerCount = 0
      if (users) {
        users.forEach(u => {
          if (u.role?.toUpperCase() === 'FARMER') farmerCount++
          if (u.role?.toUpperCase() === 'PROVIDER') providerCount++
        })
      }
      
      setUserSplitData([
        { name: 'Farmers', value: farmerCount || 1 }, // Fallback to 1 to show chart in empty DB
        { name: 'Providers', value: providerCount || 1 }
      ])
      
      // 2. Fetch Resources and Aggregate
      const { data: resources } = await supabase.from('resources').select('quantity, status, resource_type')
      let listed = 0
      let reused = 0
      const categories: Record<string, number> = {}

      if (resources) {
        resources.forEach(r => {
          const qty = Number(r.quantity) || 0
          listed += qty
          
          if (r.status === 'reserved' || r.status === 'completed' || r.status === 'matched') {
            reused += qty
            categories[r.resource_type] = (categories[r.resource_type] || 0) + qty
          }
        })
      }

      // Format category data for bar chart
      let barData = Object.keys(categories).map(key => ({
        name: key,
        amount: categories[key]
      })).sort((a, b) => b.amount - a.amount).slice(0, 5)

      // Fallback data if DB is empty
      if (barData.length === 0) {
         barData = [
          { name: 'Vegetable Waste', amount: 0 },
          { name: 'Cow Dung', amount: 0 },
        ]
      }
      setCategoryData(barData)

      // 3. Fetch Matches (Accepted Requests)
      const { data: requests } = await supabase.from('requests').select('id').eq('status', 'accepted')

      setStats({
        totalListed: listed,
        totalReused: reused,
        successfulMatches: requests?.length || 0,
        activeUsers: users?.length || 0
      })
      
      setLoading(false)
    }
    
    fetchImpactData()
  }, [])

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading live impact data...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Environmental Impact</h1>
        <p className="text-xl text-gray-600">
          See how the AgriLoop community is turning organic waste into valuable agricultural resources in real-time.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Leaf className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalListed.toLocaleString()} kg</p>
          <p className="text-gray-500 font-medium">Total Material Listed</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Sprout className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.totalReused.toLocaleString()} kg</p>
          <p className="text-gray-500 font-medium">Successfully Reused</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Handshake className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.successfulMatches}</p>
          <p className="text-gray-500 font-medium">Matches Confirmed</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.activeUsers}</p>
          <p className="text-gray-500 font-medium">Active Community Members</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Organic Resources Reused (kg)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Community Distribution</h2>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userSplitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userSplitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      
      {/* Call to action */}
      <div className="mt-12 bg-emerald-700 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to make an impact?</h2>
        <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
          Whether you have organic waste to provide or need affordable resources for your farm, joining AgriLoop makes a tangible difference to our environment.
        </p>
        <button className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors">
          Join the Platform Today
        </button>
      </div>
    </div>
  )
}
