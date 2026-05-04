const maxImageSideLength = 1920
const compressedImageMimeType = 'image/webp'
const compressedImageQuality = 0.82

function getCompressedImageSize(width: number, height: number) {
  const scale = Math.min(1, maxImageSideLength / width, maxImageSideLength / height)

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

function getCompressedImageFileName(fileName: string) {
  const dotIndex = fileName.lastIndexOf('.')
  const baseName = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName

  return `${baseName}.webp`
}

function createCompressedImageBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob === null) {
          reject(new Error('图片压缩失败，请换一张图片再试'))
          return
        }

        resolve(blob)
      },
      compressedImageMimeType,
      compressedImageQuality,
    )
  })
}

async function compressImageFile(file: File) {
  const imageBitmap = await createImageBitmap(file)
  const imageSize = getCompressedImageSize(imageBitmap.width, imageBitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = imageSize.width
  canvas.height = imageSize.height

  const context = canvas.getContext('2d')
  if (context === null) {
    imageBitmap.close()
    throw new Error('图片压缩失败，请换一张图片再试')
  }

  context.drawImage(imageBitmap, 0, 0, imageSize.width, imageSize.height)
  imageBitmap.close()

  const blob = await createCompressedImageBlob(canvas)

  return new File([blob], getCompressedImageFileName(file.name), {
    type: compressedImageMimeType,
    lastModified: file.lastModified,
  })
}

export function compressImageFiles(files: File[]) {
  return Promise.all(files.map(file => compressImageFile(file)))
}
