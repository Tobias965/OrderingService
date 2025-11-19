export type AppError = ValidationError | NotFoundError | ConflictError | { type: string; message?: string }

export type ValidationError = { type: 'validation'; message: string; details?: any }
export type NotFoundError = { type: 'not_found'; resource: string; id?: string }
export type ConflictError = { type: 'conflict'; message: string }

export class AppException extends Error {
  constructor(public error: AppError) {
    // some AppError variants may not have a `message` property
    const msg = (error as any).message ?? (error as any).type ?? 'app_error'
    super(msg)
  }
}
