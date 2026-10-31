'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { sileo } from 'sileo'
import { customMarkdownTheme } from '@/lib/core/markdown/markdown-style'
import '@/lib/core/markdown/styles/index.css'
import { simpleProcessor } from '@/lib/core/markdown/simple-processor'
import { MarkdownCodeBlockEnhancer } from '@/ui/components/shared/markdown-code-block-enhancer'
import { compressImageFiles } from './compress-image-files'
import { useUploadThing } from './uploadthing'

export default function MarkdownEditor({
  value,
  onChange,
  previewTitle,
}: {
  value: string
  onChange: (value: string) => void
  previewTitle?: string
}) {
  const [sanitizedHtml, setSanitizedHtml] = useState('')
  const [isCompressing, setIsCompressing] = useState(false)
  const previewId = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: res => {
      if (res.length > 0) {
        const imgUrl = res[0].url
        const markdownImage = `![](${imgUrl})`
        insertText(markdownImage)
        sileo.success({ title: '图片上传成功' })
      }
    },
    onUploadError: error => {
      sileo.error({ title: `上传失败: ${error.message}` })
    },
  })

  const isImageProcessing = isCompressing || isUploading

  const insertText = (text: string) => {
    const textarea = textareaRef.current
    if (textarea === null) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newValue = value.substring(0, start) + text + value.substring(end)

    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const uploadCompressedImages = (files: File[]) => {
    setIsCompressing(true)
    sileo.info({ title: '正在压缩图片...' })

    void compressImageFiles(files).then(
      async compressedFiles => {
        setIsCompressing(false)
        sileo.info({ title: '正在上传图片...' })
        await startUpload(compressedFiles)
      },
      (error: Error) => {
        setIsCompressing(false)
        sileo.error({ title: error.message })
      },
    )
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items
    const files: File[] = []
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image')) {
        const file = items[i].getAsFile()
        if (file !== null) files.push(file)
      }
    }
    if (files.length > 0) {
      e.preventDefault()
      uploadCompressedImages(files)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
    if (files.length > 0) {
      uploadCompressedImages(files)
    }
  }

  useEffect(() => {
    let isActive = true
    const normalizedPreviewTitle = previewTitle?.trim() ?? ''
    const previewHeading = normalizedPreviewTitle.length > 0 ? `# ${normalizedPreviewTitle}` : ''
    const firstLine = value.split(/\r?\n/, 1)[0]?.trim() ?? ''
    const hasMarkdownH1 = /^#\s+/.test(firstLine)
    const markdownForPreview =
      previewHeading.length > 0 && !hasMarkdownH1 ? `${previewHeading}\n\n${value}` : value

    void simpleProcessor.process(markdownForPreview).then(sanitizedFile => {
      if (isActive) {
        setSanitizedHtml(String(sanitizedFile))
      }
    })

    return () => {
      isActive = false
    }
  }, [previewTitle, value])

  return (
    <div className="bg-background flex h-[800px] w-full flex-row gap-2 rounded-md border p-2 shadow-sm">
      <textarea
        ref={textareaRef}
        className={`bg-muted/30 focus:ring-primary h-full w-1/2 resize-none rounded-md border p-4 focus:ring-2 focus:outline-none ${isImageProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        onPaste={handlePaste}
        onDrop={handleDrop}
        disabled={isImageProcessing}
        aria-label="Markdown 内容"
        placeholder="在此输入 Markdown... (支持粘贴/拖拽上传图片)"
      />
      <div
        id={previewId}
        className={`h-full w-1/2 overflow-y-auto rounded-md border p-4 ${customMarkdownTheme}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
      <MarkdownCodeBlockEnhancer rootSelector={`#${previewId}`} />
    </div>
  )
}
