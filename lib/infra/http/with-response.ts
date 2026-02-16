import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { BaseError } from '@/lib/common/errors/base'

type Handler<Args extends unknown[] = unknown[]> = (
  request: NextRequest,
  ...args: Args
) => Promise<unknown> | unknown

type ErrorResponse = { name: string; message: string; data: unknown }

export function withResponse<Args extends unknown[] = unknown[]>(handler: Handler<Args>) {
  return async (request: NextRequest, ...args: Args) => {
    try {
      const result = await handler(request, ...args)

      return NextResponse.json(result, { status: 200 })
    } catch (error) {
      const response: ErrorResponse =
        error instanceof BaseError
          ? { name: error.name, message: error.message, data: error.data }
          : {
              name: 'InternalServerError',
              message: error instanceof Error ? error.message : 'Internal Server Error',
              data: null,
            }

      const status = error instanceof BaseError ? (error.needFix ? 500 : 400) : 500

      return NextResponse.json(response, { status })
    }
  }
}
