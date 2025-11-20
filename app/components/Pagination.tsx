interface PaginationProps {
  total: number
  pageSize: number
  currentPage: number
  setCurrentPage: (page: number) => void
}

export default function Pagination({ total, pageSize, currentPage, setCurrentPage }: PaginationProps) {
  if (total === 0) return null

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
      >
        Previous
      </button>
      {Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 mx-1 rounded cursor-pointer ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
        disabled={currentPage === Math.ceil(total / pageSize)}
        className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
      >
        Next
      </button>
    </div>
  )
}