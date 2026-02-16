import { prisma } from '@/prisma/instance'
import { BlogDetail } from '@/ui/(main)/(blog-and-note-layout)/blog/[slug]'

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    select: { slug: true },
  })

  return blogs.map(blog => ({ slug: blog.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug

  return <BlogDetail slug={slug} />
}
