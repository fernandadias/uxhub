import { useState } from 'react'
import { uploadFile } from '@/lib/services/upload'

interface UseUploadOptions {
  onSuccess?: (url: string) => void
  onError?: (error: Error) => void
}

export function useUpload({ onSuccess, onError }: UseUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const upload = async (file: File) => {
    try {
      setIsUploading(true)
      setError(null)
      setProgress(0)

      const url = await uploadFile(file, (progress) => {
        setProgress(progress)
      })

      onSuccess?.(url)
      return url
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed')
      setError(error)
      onError?.(error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return {
    upload,
    isUploading,
    progress,
    error,
  }
} 