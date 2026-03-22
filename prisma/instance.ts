import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { serverEnv } from '@/config/env/server-env'

const rawConnectionString = serverEnv.DATABASE_URL

const normalizeConnectionString = (connectionString: string) => {
  const url = new URL(connectionString)
  const sslmode = url.searchParams.get('sslmode')?.toLowerCase()

  if (sslmode === 'prefer' || sslmode === 'require' || sslmode === 'verify-ca') {
    url.searchParams.set('sslmode', 'verify-full')
    return url.toString()
  }

  return connectionString
}

const connectionString = rawConnectionString
  ? normalizeConnectionString(rawConnectionString)
  : undefined

const adapter = new PrismaPg({ connectionString })

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
