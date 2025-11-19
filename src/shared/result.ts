export type Result<T, E = any> = { ok: true; value: T } | { ok: false; error: E }

export function ok<T>(value: T): Result<T> {
  return { ok: true, value }
}

export function fail<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

export default Result
