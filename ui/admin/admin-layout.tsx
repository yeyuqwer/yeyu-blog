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
      <main className="flex min-h-screen max-w-screen flex-col dark:bg-black dark:text-white">
        <AdminNavbar />
        <div className="mt-2 flex flex-1 px-6">
          <main className="flex flex-1">{children}</main>
        </div>
      </main>
    </AdminProvider>
  )
}
