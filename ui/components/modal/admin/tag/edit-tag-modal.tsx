'use client'

import type { UpdateTagNameDTO } from '@/lib/api/tag'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { sileo } from 'sileo'
import { useTagUpdateMutation } from '@/hooks/api/tag'
import { UpdateTagNameSchema } from '@/lib/api/tag'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/shadcn/form'
import { Input } from '@/ui/shadcn/input'

export default function EditTagModal() {
  const { modalType, onModalClose, payload } = useModalStore()
  const isModalOpen = modalType === 'editTagModal'
  const { id, tagName, tagType } = payload != null ? (payload as UpdateTagNameDTO) : {}

  const { mutate: updateTagName, isPending } = useTagUpdateMutation()

  const form = useForm<UpdateTagNameDTO>({
    resolver: zodResolver(UpdateTagNameSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (isModalOpen && tagName != null) {
      form.reset({
        id: id!,
        tagName: tagName!,
        tagType: tagType!,
      })
    }
  }, [isModalOpen, form, tagName, id, tagType])

  function onSubmit(values: UpdateTagNameDTO) {
    updateTagName(values, {
      onSuccess: () => {
        sileo.success({ title: '修改成功' })
        onModalClose()
      },
      onError: error => {
        sileo.error({ title: `修改标签出错 ${error.message}` })
      },
    })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑标签</DialogTitle>
          <DialogDescription>修改标签名会影响所有关联的文章喵~</DialogDescription>
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
                      <Input placeholder="请输入新的标签名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="cursor-pointer" disabled={isPending}>
                保存修改
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
