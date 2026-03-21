'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { toast } from 'sonner'
import { customMarkdownTheme } from '@/lib/core/markdown'
import { simpleProcessor } from '@/lib/core/markdown/simple-processor'
import { MarkdownCodeBlockEnhancer } from '@/ui/components/shared/markdown-code-block-enhancer'
import { useUploadThing } from './uploadthing'
import { useMarkdownAutoSave } from './use-markdown-auto-save'

export default function MarkdownEditor({
  value,
  onChange,
  previewTitle,
}: {
  value: string
  onChange: (value: string) => void
  previewTitle?: string
}) {
  const [html, setHtml] = useState('')
  const previewId = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useMarkdownAutoSave({ value, onChange })

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: res => {
      if (res.length > 0) {
        const imgUrl = res[0].url
        const markdownImage = `![](${imgUrl})`
        insertText(markdownImage)
        toast.success('图片上传成功')
      }
    },
    onUploadError: error => {
      toast.error(`上传失败: ${error.message}`)
    },
  })

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

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items
    const files: File[] = []
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file !== null) files.push(file)
      }
    }
    if (files.length > 0) {
      e.preventDefault()
      toast.info('正在上传图片...')
      await startUpload(files)
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
    if (files.length > 0) {
      toast.info('正在上传图片...')
      await startUpload(files)
    }
  }

  useEffect(() => {
    const render = async () => {
      const normalizedPreviewTitle = previewTitle?.trim() ?? ''
      const previewHeading = normalizedPreviewTitle.length > 0 ? `# ${normalizedPreviewTitle}` : ''
      const firstLine = value.split(/\r?\n/, 1)[0]?.trim() ?? ''
      const hasMarkdownH1 = /^#\s+/.test(firstLine)
      const markdownForPreview =
        previewHeading.length > 0 && !hasMarkdownH1 ? `${previewHeading}\n\n${value}` : value

      const file = await simpleProcessor.process(markdownForPreview)
      setHtml(String(file))
    }
    render()
  }, [previewTitle, value])

  return (
    <div className="flex h-[800px] w-full flex-row gap-2 rounded-md border bg-background p-2 shadow-sm">
      <textarea
        ref={textareaRef}
        className={`h-full w-1/2 resize-none rounded-md border bg-muted/30 p-4 focus:outline-none focus:ring-2 focus:ring-primary ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        onPaste={handlePaste}
        onDrop={handleDrop}
        disabled={isUploading}
        placeholder="在此输入 Markdown... (支持粘贴/拖拽上传图片)"
      />
      <div
        id={previewId}
        className={`h-full w-1/2 overflow-y-auto rounded-md border p-4 ${customMarkdownTheme}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <MarkdownCodeBlockEnhancer rootSelector={`#${previewId}`} />
    </div>
  )
}
