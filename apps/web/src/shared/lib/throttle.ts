export interface ThrottleOptions {
  leading?: boolean
  trailing?: boolean
}

export function throttle<T extends unknown[]>(
  func: (...args: T) => void,
  ms: number,
  { leading = true, trailing = true }: ThrottleOptions = {},
): {
  (...args: T): void
  cancel: () => void
  flush: () => void
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let pendingCall: (() => void) | null = null

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = null
    pendingCall = null
  }

  const flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
      if (trailing && pendingCall) {
        pendingCall()
        pendingCall = null
      }
    }
  }

  const throttled = Object.assign(
    function (this: ThisParameterType<T>, ...args: T) {
      if (!timeoutId) {
        if (leading) {
          func.apply(this, args)
        }

        if (trailing) {
          pendingCall = () => func.apply(this, args)
        }

        timeoutId = setTimeout(() => {
          timeoutId = null
          if (trailing && pendingCall) {
            pendingCall()
          }
          pendingCall = null
        }, ms)
      } else if (trailing) {
        pendingCall = () => func.apply(this, args)
      }
    },
    { cancel, flush },
  )

  return throttled
}
