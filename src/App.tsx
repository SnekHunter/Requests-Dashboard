import { useState, useEffect } from 'react'
import axios from 'axios'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

const API_URL = 'http://localhost:8000/api'

interface Request {
  id: number
  customer_name: string
  request_details: string
  status: 'pending' | 'acknowledged' | 'completed'
  created_at?: string
  updated_at?: string
}

interface NewRequest {
  customer_name: string
  request_details: string
}

export default function App() {
  const [requests, setRequests] = useState<Request[]>([])
  const [newRequest, setNewRequest] = useState<NewRequest>({ 
    customer_name: '', 
    request_details: '' 
  })
  const [loading, setLoading] = useState(true)

  // Fetch all requests
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await axios.get<Request[]>(`${API_URL}/requests`)
      setRequests(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Create a request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post<Request>(`${API_URL}/requests`, newRequest)
      setNewRequest({ customer_name: '', request_details: '' })
      fetchRequests()
    } catch (err) {
      console.error(err)
    }
  }

  // Update status
  const updateStatus = async (id: number, status: Request['status']) => {
    try {
      await axios.put<Request>(`${API_URL}/requests/${id}`, { status })
      fetchRequests()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const pending = requests.filter((r) => r.status === 'pending').length
  const acknowledged = requests.filter((r) => r.status === 'acknowledged').length
  const completed = requests.filter((r) => r.status === 'completed').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <header className="max-w-5xl mx-auto p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Requests</h1>
        <div className="text-sm text-slate-500">Simple dashboard · React + Tailwind</div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500">Pending</div>
            <div className="text-2xl font-semibold">{pending}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500">Acknowledged</div>
            <div className="text-2xl font-semibold">{acknowledged}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500">Completed</div>
            <div className="text-2xl font-semibold">{completed}</div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-3">New Request</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Customer name"
                value={newRequest.customer_name}
                onChange={(e) => setNewRequest({ ...newRequest, customer_name: e.target.value })}
                required
              />
              <textarea
                className="w-full border rounded px-3 py-2 h-24"
                placeholder="Request details"
                value={newRequest.request_details}
                onChange={(e) => setNewRequest({ ...newRequest, request_details: e.target.value })}
                required
              />
              <button className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700">
                Submit
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Requests</h2>
            {loading ? (
              <div className="p-6 bg-white rounded shadow-sm">Loading...</div>
            ) : requests.length === 0 ? (
              <div className="p-6 bg-white rounded shadow-sm">No requests yet.</div>
            ) : (
              requests.map((r) => (
                <div key={r.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{r.customer_name}</div>
                    <div className="text-sm text-slate-600">{r.request_details}</div>
                    <div className="text-xs text-slate-400 mt-2">Status: {r.status}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {r.status === 'pending' && (
                      <button onClick={() => updateStatus(r.id, 'acknowledged')} className="text-yellow-600 hover:text-yellow-800">
                        <ClockIcon className="h-6 w-6" />
                      </button>
                    )}
                    {r.status === 'acknowledged' && (
                      <button onClick={() => updateStatus(r.id, 'completed')} className="text-green-600 hover:text-green-800">
                        <CheckCircleIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}