import { LoadingSpinner } from "./loading-spinner"

interface LoadingOverlayProps {
  message?: string
}

export default function LoadingOverlay({ message = "Processing your request..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 text-center">
        <LoadingSpinner size={40} className="mx-auto text-slate-700 mb-4" />
        <p className="text-slate-800 font-medium">{message}</p>
      </div>
    </div>
  )
}
