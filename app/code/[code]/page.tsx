'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Link {
  id: number
  shortCode: string
  originalUrl: string
  createdAt: string
  clickCount: number
  lastClickedAt: string | null
}

export default function StatsPage() {
  const { code } = useParams() as { code: string }
  const [link, setLink] = useState<Link | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [code])

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/links/${code}`)
      if (!res.ok) throw new Error('Link not found')
      const data = await res.json()
      setLink(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  )
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!link) return <div className="p-4">Link not found.</div>

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003'

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-6">Link Stats</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Short Code</label>
            <p className="font-mono">{link.shortCode}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Short URL</label>
            <a href={`${baseUrl}/${link.shortCode}`} className="text-blue-500 hover:underline">
              {`${baseUrl}/${link.shortCode}`}
            </a>
          </div>
          <div>
            <label className="block text-sm font-medium">Original URL</label>
            <a href={link.originalUrl} target="_blank" className="text-blue-500 break-all">
              {link.originalUrl}
            </a>
          </div>
          <div>
            <label className="block text-sm font-medium">Click Count</label>
            <p>{link.clickCount}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Created At</label>
            <p>{new Date(link.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Last Clicked At</label>
            <p>{link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : 'Never'}</p>
          </div>
        </div>
        <div className="mt-6">
          <a href="/" className="bg-blue-500 text-white px-4 py-2 rounded">
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}