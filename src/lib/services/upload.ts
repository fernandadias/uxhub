export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // TODO: Implementar upload real
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      onProgress?.(progress)
      if (progress >= 100) {
        clearInterval(interval)
        resolve('https://example.com/image.jpg')
      }
    }, 100)
  })
} 