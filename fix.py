content = '''import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function ProviderResourcesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('provider_id', user?.id)
    .order('created_at', { ascending: false })

  async function deleteResource(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const supabaseServer = createClient()
    await supabaseServer.from('resources').delete().eq('id', id)
    revalidatePath('/provider/resources')
    revalidatePath('/provider/dashboard')
  }

  return (
    <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8\>
 <div className=\flex justify-between items-center mb-8\>
 <div>
 <h1 className=\text-3xl font-bold text-gray-900\>My Resources</h1>
 <p className=\text-gray-600 mt-1\>Manage your active and matched listings.</p>
 </div>
 <Link 
 href=\/provider/resources/new\
 className=\inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm\
 >
 <Plus className=\w-5 h-5 mr-2\ />
 List New Resource
 </Link>
 </div>

 <div className=\bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden\>
 <div className=\overflow-x-auto\>
 <table className=\w-full\>
 <thead className=\bg-gray-50 border-b border-gray-100\>
 <tr>
 <th className=\px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider\>Resource</th>
 <th className=\px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider\>Quantity</th>
 <th className=\px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider\>Status</th>
 <th className=\px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider\>Date Added</th>
 <th className=\px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider\>Actions</th>
 </tr>
 </thead>
 <tbody className=\divide-y divide-gray-100\>
 {resources && resources.length > 0 ? resources.map((item) => (
 <tr key={item.id} className=\hover:bg-gray-50 transition-colors\>
 <td className=\px-6 py-4 whitespace-nowrap\>
 <div className=\font-medium text-gray-900\>{item.resource_type}</div>
 </td>
 <td className=\px-6 py-4 whitespace-nowrap\>
 <div className=\text-gray-600\>{item.quantity} {item.unit}</div>
 </td>
 <td className=\px-6 py-4 whitespace-nowrap\>
 <span className={inline-flex px-2.5 py-1 rounded-full text-xs font-medium border }>
 {item.status.toUpperCase()}
 </span>
 </td>
 <td className=\px-6 py-4 whitespace-nowrap text-gray-500 text-sm\>
 {new Date(item.created_at).toLocaleDateString()}
 </td>
 <td className=\px-6 py-4 whitespace-nowrap text-right text-sm font-medium\>
 <div className=\flex justify-end gap-3\>
 <form action={deleteResource}>
 <input type=\hidden\ name=\id\ value={item.id} />
 <button type=\submit\ className=\text-red-500 hover:text-red-700 transition-colors\ title=\Delete\>
 <Trash2 className=\w-5 h-5\ />
 </button>
 </form>
 </div>
 </td>
 </tr>
 )) : (
 <tr>
 <td colSpan={5} className=\px-6 py-12 text-center text-gray-500\>
 You haven't listed any resources yet.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )
}'''

with open('src/app/provider/resources/page.tsx', 'w', encoding='utf-8') as f:
 f.write(content)
