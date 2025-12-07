import useSWR from 'swr'

import type { Draft } from '@/types/api'
import { fetcher } from '@/lib/fetcher'

export type GetDraftsApi = {
  drafts: Draft[] | undefined,
  isLoading: boolean,
  error: Error | undefined
}

const useGetDrafts = (id?: string): GetDraftsApi => {
  const route = id ? `/api/draft/${id}` : `/api/draft`
  const { data, error, isLoading } = useSWR<Draft[], Error>(route, fetcher)
  return {
    drafts: data,
    isLoading,
    error: error
  }
}

export {
  useGetDrafts,
}