import { useRouter } from 'next/navigation'

interface Link {
  id: number
  shortCode: string
  originalUrl: string
  createdAt: string
  clickCount: number
  lastClickedAt: string | null
}

interface LinkTableProps {
  filteredLinks: Link[]
  baseUrl: string
  handleDeleteClick: (link: Link) => void
  copyToClipboard: (text: string) => void
}

export default function LinkTable({ filteredLinks, baseUrl, handleDeleteClick, copyToClipboard }: LinkTableProps) {
  const router = useRouter()

  return (
    <div className="bg-white rounded shadow overflow-hidden overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Short Code</th>
            <th className="p-3 text-left">Original URL</th>
            <th className="p-3 text-left">Clicks</th>
            <th className="p-3 text-left">Last Clicked</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLinks.map((link) => (
            <tr key={link.id} className="border-t">
              <td className="p-3">
                <a href={`${baseUrl}/${link.shortCode}`} target="_blank" className="font-mono text-blue-500 hover:underline mr-2">
                  {link.shortCode}
                </a>
                <button
                  onClick={() => copyToClipboard(`${baseUrl}/${link.shortCode}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
                >
                  Copy
                </button>
              </td>
              <td className="p-3">
                <a href={link.originalUrl} target="_blank" className="text-blue-500 truncate block max-w-xs">
                  {link.originalUrl}
                </a>
              </td>
              <td className="p-3">{link.clickCount}</td>
              <td className="p-3">
                {link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : 'Never'}
              </td>
              <td className="p-3">
                <button
                  onClick={() => router.push(`/code/${link.shortCode}`)}
                  className="w-16 bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 cursor-pointer"
                >
                  Stats
                </button>
                <button
                  onClick={() => handleDeleteClick(link)}
                  className="w-16 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredLinks.length === 0 && <p className="p-4 text-center">No links found.</p>}
    </div>
  )
}