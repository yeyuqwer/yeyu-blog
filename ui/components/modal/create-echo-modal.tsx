'use client'

import type { CreateEchoDTO } from '@/lib/api/echo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { sileo } from 'sileo'
import { useEchoCreateMutation } from '@/hooks/api/echo'
import { CreateEchoSchema } from '@/lib/api/echo'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/shadcn/form'
import { Input } from '@/ui/shadcn/input'
import { Switch } from '@/ui/shadcn/switch'
import { Textarea } from '@/ui/shadcn/textarea'

export default function CreateEchoModal() {
  const { modalType, onModalClose } = useModalStore()
  const isModalOpen = modalType === 'createEchoModal'
  const { mutate: createEcho, isPending } = useEchoCreateMutation()

  const form = useForm<CreateEchoDTO>({
    resolver: zodResolver(CreateEchoSchema),
    defaultValues: {
      content: '',
      reference: '',
      isPublished: true,
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!isModalOpen) {
      form.reset()
    }
  }, [isModalOpen, form])

  function onSubmit(values: CreateEchoDTO) {
    createEcho(values, {
      onSuccess: () => {
        sileo.success({ title: '创建成功' })
        onModalClose()
      },
      onError: error => {
        sileo.error({ title: `创建引用失败~ ${error.message}` })
      },
    })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onModalClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>创建引用</DialogTitle>
          <DialogDescription>又看到什么有意思的东西了嘛~</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>引用</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="请输入新的引用"
                        {...field}
                        className="h-52 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>来源</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入来源" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>是否发布</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="cursor-pointer" disabled={isPending}>
                  保存修改
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
