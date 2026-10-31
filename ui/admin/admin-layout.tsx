import { redirect } from 'next/navigation'
import { noPermission } from '@/lib/core/auth/guard'
import { defaultLanguage } from '@/lib/i18n/config'
import AdminProvider from '@/ui/components/provider/admin'
import { AdminNavbar } from './layout/header'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (await noPermission()) {
    redirect(`/${defaultLanguage}`)
  }

  return (
    <AdminProvider>
      <div className="flex min-h-dvh w-full max-w-screen min-w-0 flex-col overflow-x-hidden dark:bg-zinc-950 dark:text-white">
        <AdminNavbar />
        <div className="mt-2 flex min-w-0 flex-1 px-6">
          <main className="flex min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </AdminProvider>
  )
}
