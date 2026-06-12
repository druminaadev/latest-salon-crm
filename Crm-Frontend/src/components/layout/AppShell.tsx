'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6" style={{ background: 'var(--bg-secondary)', minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
