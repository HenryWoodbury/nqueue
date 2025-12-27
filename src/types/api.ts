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

// Ottoneu Player Universe
export interface PlayerUniverseCsvFields {
  "Ottoneu ID": string
  Name: string
  "FG ID"?: string
  "FG Minor ID"?: string
  "MLBAM ID"?: string
  "Birthday"?: string
  "Ottoneu Positions"?: string
}

// Fangraphs ID is derived from FG ID || FG Minor ID
export interface PlayerCreateInput {
  ottoneuId: string
  name: string
  fangraphsId: string | null
  mlbamId: string | null
  birthday: string | null
  positions: string | null
}
