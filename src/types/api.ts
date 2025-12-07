export interface Draft {
  id: string
  draftName: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateDraftRequest {
  draftName: string
}

export interface UpdateDraftRequest {
  id: string
  draftName: string
}

export interface ApiError {
  error: string
  status: number
}

export interface ApiSuccess<T> {
  data: T
}

