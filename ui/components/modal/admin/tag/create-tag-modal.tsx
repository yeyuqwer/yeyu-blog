'use client'

import type { CreateTagDTO } from '@/lib/api/tag'
import { zodResolver } from '@hookform/resolvers/zod'
import { TagType } from '@prisma/client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { sileo } from 'sileo'
import { useTagCreateMutation } from '@/hooks/api/tag'
import { CreateTagSchema } from '@/lib/api/tag'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/shadcn/form'
import { Input } from '@/ui/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/shadcn/select'

export default function CreateTagModal() {
  const modalType = useModalStore(s => s.modalType)
  const closeModal = useModalStore(s => s.closeModal)
  const isModalOpen = modalType === 'createTagModal'
  const { mutate: createTag, isPending } = useTagCreateMutation()

  const form = useForm<CreateTagDTO>({
    resolver: zodResolver(CreateTagSchema),
    defaultValues: {
      tagName: '',
      tagType: TagType.BLOG,
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!isModalOpen) {
      form.reset()
    }
  }, [isModalOpen, form])

  function onSubmit(values: CreateTagDTO) {
    createTag(values, {
      onSuccess: () => {
        sileo.success({ title: '创建成功' })
        closeModal()
      },
      onError: error => {
        sileo.error({ title: `创建标签失败~ ${error.message}` })
      },
    })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新建标签</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="tagName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入标签名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签类型</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={value => {
                          field.onChange(value)
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TagType.BLOG}>BLOG</SelectItem>
                          <SelectItem value={TagType.NOTE}>NOTE</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="cursor-pointer" disabled={isPending}>
                  保存
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
