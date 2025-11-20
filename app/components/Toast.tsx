interface ToastProps {
  message: string
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  )
}