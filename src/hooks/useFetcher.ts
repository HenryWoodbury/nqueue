import useSWR from 'swr'

import type { Draft } from '@/types/api'
import { fetcher } from '@/lib/fetcher'

export type DraftPayload = {
  draft: Draft | undefined,
  isLoading: boolean,
  error: Error | undefined
}

export type DraftsPayload = {
  drafts: Draft[] | undefined,
  isLoading: boolean,
  error: Error | undefined
}

const useGetDraft = (id: string): DraftPayload => {
  const route = `/api/draft/${id}`
  const { data, error, isLoading } = useSWR<Draft, Error>(route, fetcher)
  return {
    draft: data,
    isLoading,
    error: error
  }
}

const useGetDrafts = (): DraftsPayload => {
  const route = '/api/draft'
  const { data, error, isLoading } = useSWR<Draft[], Error>(route, fetcher)
  return {
    drafts: data,
    isLoading,
    error: error
  }
}

export {
  useGetDraft,
  useGetDrafts,
}