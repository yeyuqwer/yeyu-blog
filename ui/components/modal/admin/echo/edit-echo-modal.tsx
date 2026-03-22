'use client'

import type { UpdateEchoDTO } from '@/lib/api/echo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { sileo } from 'sileo'
import { useEchoUpdateMutation } from '@/hooks/api/echo'
import { UpdateEchoSchema } from '@/lib/api/echo'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/shadcn/form'
import { Input } from '@/ui/shadcn/input'
import { Switch } from '@/ui/shadcn/switch'
import { Textarea } from '@/ui/shadcn/textarea'

export default function EditEchoModal() {
  const { modalType, onModalClose, payload } = useModalStore()
  const isModalOpen = modalType === 'editEchoModal'

  const { id, content, isPublished, reference } = payload != null ? (payload as UpdateEchoDTO) : {}

  const initialValues: UpdateEchoDTO = {
    content: content ?? '',
    reference: reference ?? '',
    isPublished: isPublished ?? true,
    id: id!,
  }

  const form = useForm<UpdateEchoDTO>({
    resolver: zodResolver(UpdateEchoSchema),
    defaultValues: {
      content: '',
      reference: '',
      isPublished: true,
      id: id!,
    },
    mode: 'onBlur',
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <TEMP TODO>
  useEffect(() => {
    if (isModalOpen) {
      form.reset(initialValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, form])
  const { mutate: updateEcho, isPending } = useEchoUpdateMutation()

  function onSubmit(values: UpdateEchoDTO) {
    updateEcho(values, {
      onSuccess: () => {
        sileo.success({ title: '修改成功' })
        onModalClose()
      },
      onError: error => {
        sileo.error({ title: `更新引用失败~ ${error.message}` })
      },
    })
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        form.reset(initialValues)
        onModalClose()
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑引用</DialogTitle>
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
                        className="h-52 resize-none"
                        value={field.value}
                        onChange={field.onChange}
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
                    <FormLabel className="text-lg">是否发布</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={checked => {
                          field.onChange(checked)
                        }}
                      />
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
