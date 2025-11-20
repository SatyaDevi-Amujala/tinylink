interface CreateLinkFormProps {
  originalUrl: string
  setOriginalUrl: (value: string) => void
  shortCode: string
  setShortCode: (value: string) => void
  submitting: boolean
  urlError: string
  codeError: string
  setUrlError: (error: string) => void
  setCodeError: (error: string) => void
  handleSubmit: (e: React.FormEvent) => void
}

export default function CreateLinkForm({
  originalUrl,
  setOriginalUrl,
  shortCode,
  setShortCode,
  submitting,
  urlError,
  codeError,
  setUrlError,
  setCodeError,
  handleSubmit
}: CreateLinkFormProps) {
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6" noValidate>
      <h2 className="text-xl font-semibold mb-4">Create New Link</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Original URL <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => {
            setOriginalUrl(e.target.value)
            setUrlError('')
          }}
          className="w-full p-2 border rounded"
          placeholder="https://example.com"
          required
        />
        {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Short Code (optional)</label>
        <input
          type="text"
          value={shortCode}
          onChange={(e) => {
            setShortCode(e.target.value)
            setCodeError('')
          }}
          className="w-full p-2 border rounded"
          placeholder="e.g., abc123 (6-8 alphanumeric characters)"
        />
        {codeError && <p className="text-red-500 text-sm mt-1">{codeError}</p>}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
      >
        {submitting ? 'Creating...' : 'Create Link'}
      </button>
    </form>
  )
}