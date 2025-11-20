'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CreateLinkForm from './components/CreateLinkForm'
import SearchFilter from './components/SearchFilter'
import LinkTable from './components/LinkTable'
import Pagination from './components/Pagination'
import Toast from './components/Toast'
import DeleteModal from './components/DeleteModal'

interface Link {
  id: number
  shortCode: string
  originalUrl: string
  createdAt: string
  clickCount: number
  lastClickedAt: string | null
}

export default function Home() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortCode, setShortCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('')
  const [toast, setToast] = useState('')
  const [urlError, setUrlError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedLink, setSelectedLink] = useState<Link | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const router = useRouter()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003'

  useEffect(() => {
    fetchLinks(currentPage)
  }, [currentPage])

  const fetchLinks = async (page: number = 1) => {
    try {
      const res = await fetch(`/api/links?page=${page}&limit=${pageSize}`)
      if (!res.ok) throw new Error('Failed to fetch links')
      const data = await res.json()
      console.log("data:", data);
      setLinks(data.data.map((link: any) => ({
        id: link.id,
        shortCode: link.shortcode,
        originalUrl: link.originalurl,
        createdAt: link.createdat,
        clickCount: link.clickcount,
        lastClickedAt: link.lastclickedat
      })))
      setTotal(data.total)
    } catch (err) {
      setToast('Failed to load links')
      setTimeout(() => setToast(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setUrlError('')
    setCodeError('')

    if (!originalUrl.trim()) {
      setUrlError('Original URL is required')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl, shortCode: shortCode || undefined }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create link')
      }
      const newLink = await res.json()
      const transformedLink = {
        id: newLink.id,
        shortCode: newLink.shortcode,
        originalUrl: newLink.originalurl,
        createdAt: newLink.createdAt,
        clickCount: newLink.clickCount,
        lastClickedAt: newLink.lastClickedAt
      }
      setCurrentPage(1)
      fetchLinks(1)
      setOriginalUrl('')
      setShortCode('')
    } catch (err: any) {
      const errorMsg = err.message
      if (errorMsg.includes('URL')) {
        setUrlError(errorMsg)
      } else if (errorMsg.includes('code')) {
        setCodeError(errorMsg)
      } else {
        setToast(errorMsg)
        setTimeout(() => setToast(''), 3000)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (link: Link) => {
    setSelectedLink(link)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedLink) return
    try {
      const res = await fetch(`/api/links/${selectedLink.shortCode}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setLinks(links.filter(l => l.shortCode !== selectedLink.shortCode))
      fetchLinks(currentPage)
      setToast('Link deleted successfully')
      setTimeout(() => setToast(''), 3000)
    } catch (err) {
      setToast('Failed to delete link')
      setTimeout(() => setToast(''), 3000)
    } finally {
      setShowDeleteModal(false)
      setSelectedLink(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setToast('Copied to clipboard')
    setTimeout(() => setToast(''), 3000)
  }

  const filteredLinks = links.filter(l =>
    (l.shortCode?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    (l.originalUrl?.toLowerCase() || '').includes(filter.toLowerCase())
  )
  console.log("Filtered Links:", filteredLinks)

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">TinyLink Dashboard</h1>

        <CreateLinkForm
          originalUrl={originalUrl}
          setOriginalUrl={setOriginalUrl}
          shortCode={shortCode}
          setShortCode={setShortCode}
          submitting={submitting}
          urlError={urlError}
          codeError={codeError}
          setUrlError={setUrlError}
          setCodeError={setCodeError}
          handleSubmit={handleSubmit}
        />

        <SearchFilter filter={filter} setFilter={setFilter} />

        <LinkTable
          filteredLinks={filteredLinks}
          baseUrl={baseUrl}
          handleDeleteClick={handleDeleteClick}
          copyToClipboard={copyToClipboard}
        />

        <Pagination
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <Toast message={toast} />

        <DeleteModal
          showDeleteModal={showDeleteModal}
          selectedLink={selectedLink}
          setShowDeleteModal={setShowDeleteModal}
          confirmDelete={confirmDelete}
        />
      </div>
    </div>
  )
}
