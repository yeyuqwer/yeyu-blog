import { NextResponse } from 'next/server'

const githubAccountIdPattern = /^\d+$/

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ accountId: string }> },
) {
  const accountId = (await params).accountId

  if (!githubAccountIdPattern.test(accountId)) {
    return NextResponse.json({ message: 'Invalid GitHub account id.' }, { status: 400 })
  }

  const response = await fetch(`https://api.github.com/user/${accountId}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'yeyu-blog',
    },
    next: {
      revalidate: 86_400,
    },
  })

  if (!response.ok) {
    return NextResponse.json({ message: 'GitHub user not found.' }, { status: response.status })
  }

  const githubUser = (await response.json()) as { html_url?: string }

  if (githubUser.html_url == null) {
    return NextResponse.json({ message: 'GitHub profile url not found.' }, { status: 404 })
  }

  return NextResponse.redirect(githubUser.html_url)
}
