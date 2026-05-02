import { redirect } from 'next/navigation'
import { noPermission } from '@/lib/core/auth/guard'
import AdminProvider from '@/ui/components/provider/admin'
import { AdminNavbar } from './layout/header'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (await noPermission()) {
    redirect('/')
  }

  return (
    <AdminProvider>
      <main className="flex min-h-screen w-full min-w-0 max-w-screen flex-col overflow-x-hidden dark:bg-black dark:text-white">
        <AdminNavbar />
        <div className="mt-2 flex min-w-0 flex-1 px-6">
          <main className="flex min-w-0 flex-1">{children}</main>
        </div>
      </main>
    </AdminProvider>
  )
}
