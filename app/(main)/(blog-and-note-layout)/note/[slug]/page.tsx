import { prisma } from '@/prisma/instance'
import { NoteDetail } from '@/ui/(main)/(blog-and-note-layout)/note/[slug]'

export async function generateStaticParams() {
  const notes = await prisma.note.findMany({
    where: { isPublished: true },
    select: { slug: true },
  })

  return notes.map(note => ({ slug: note.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug

  return <NoteDetail slug={slug} />
}
