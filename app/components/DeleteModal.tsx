interface Link {
  id: number
  shortCode: string
  originalUrl: string
  createdAt: string
  clickCount: number
  lastClickedAt: string | null
}

interface DeleteModalProps {
  showDeleteModal: boolean
  selectedLink: Link | null
  setShowDeleteModal: (show: boolean) => void
  confirmDelete: () => void
}

export default function DeleteModal({ showDeleteModal, selectedLink, setShowDeleteModal, confirmDelete }: DeleteModalProps) {
  if (!showDeleteModal || !selectedLink) return null

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg border border-gray-300 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-4">Are you sure you want to delete the link "{selectedLink.shortCode}"? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}