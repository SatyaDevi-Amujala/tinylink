interface SearchFilterProps {
  filter: string
  setFilter: (value: string) => void
}

export default function SearchFilter({ filter, setFilter }: SearchFilterProps) {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by code or URL"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  )
}