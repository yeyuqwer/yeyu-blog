import type { BaseErrorOptions } from './base'
import { BaseError } from './base'

export class TimeoutError extends BaseError {
  name = 'TimeoutError'

  constructor(message = 'Request timeout.', options: BaseErrorOptions = {}) {
    super(message, options)
  }
}

export type HttpRequestErrorOptions = BaseErrorOptions & {
  data?: {
    status?: number
    json?: unknown
  }
}

export class HttpRequestError extends BaseError {
  name = 'HttpRequestError'
  status: number | null
  json: unknown

  constructor(message: string | undefined, options: HttpRequestErrorOptions = {}) {
    const status = options.data?.status
    super(
      message ?? `HTTP request failed${status != null ? ` with status ${status}` : ''}.`,
      options,
    )
    this.status = status ?? null
    this.json = options.data?.json
  }
}

export type ApiRequestErrorOptions = BaseErrorOptions & {
  data: {
    status: number
    responseErrorName: string
    responseErrorData: unknown
  }
}

export class ApiRequestError extends BaseError {
  name = 'ApiRequestError'
  status: number
  responseErrorName: string
  responseErrorData: unknown

  constructor(message = 'API request failed.', options: ApiRequestErrorOptions) {
    super(message, options)
    this.status = options.data.status
    this.responseErrorName = options.data.responseErrorName
    this.responseErrorData = options.data.responseErrorData
  }
}
