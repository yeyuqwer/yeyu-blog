import type { BaseErrorOptions } from './base'
import { BaseError } from './base'

export class UserRejectedRequestError extends BaseError {
  name = 'UserRejectedRequestError'

  constructor(message = 'User rejected request.', options: BaseErrorOptions = {}) {
    super(message, { ...options, needFix: options.needFix ?? false })
  }
}

export class UnknownEvmError extends BaseError {
  name = 'UnknownEvmError'

  constructor(message = 'Unknown EVM error.', options: BaseErrorOptions = {}) {
    super(message, options)
  }
}
