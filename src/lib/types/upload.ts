export interface UploadProgress {
  progress: number
  total: number
  loaded: number
}

export interface UploadError {
  message: string
  code?: string
} 