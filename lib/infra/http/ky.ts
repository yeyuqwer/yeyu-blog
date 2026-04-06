import type { Options } from 'ky'
import ky, { HTTPError, TimeoutError as KyTimeoutError } from 'ky'
import { ApiRequestError, HttpRequestError, TimeoutError } from '@/lib/common/errors/request'

export type HttpRequestParams = Options & {
  url?: string
}

export async function httpRequest<T = unknown>(params: HttpRequestParams): Promise<T> {
  try {
    const { url, ...rest } = params
    const response = await ky(url ?? '', { retry: 0, timeout: 30_000, ...rest })
    return response.json()
  } catch (error) {
    if (error instanceof KyTimeoutError) {
      throw new TimeoutError(undefined, { cause: error })
    }
    let status: number | undefined
    let json: unknown
    if (error instanceof HTTPError) {
      try {
        status = error.response.status
        json = await error.response.json()
      } catch {
        // ignore
      }
    }
    if (error instanceof Error) {
      throw new HttpRequestError(undefined, { data: { status, json }, cause: error })
    }
    throw error
  }
}

export async function apiRequest<T = unknown>(params: HttpRequestParams): Promise<T> {
  try {
    return await httpRequest<T>({ prefix: '/api', ...params })
  } catch (error) {
    if (error instanceof HttpRequestError) {
      if (error.status != null && error.json != null) {
        const json = error.json as { name: string; message: string; data: unknown }

        throw new ApiRequestError(json.message, {
          data: {
            status: error.status,
            responseErrorName: json.name,
            responseErrorData: json.data,
          },
          cause: error,
        })
      }
    }
    throw error
  }
}
