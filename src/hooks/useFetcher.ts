import useSWR from 'swr'

// SWR Helper Functions
const fetcher = (...args: [RequestInfo | URL, RequestInit?]) => fetch(...args).then(res => res.json())

const useGetDrafts = (id?: string) => {
  const route = id ? `/api/draft/${id}` : `/api/draft`
  const { data, error, isLoading } = useSWR(route, fetcher)
  return {
    drafts: data,
    isLoading,
    isError: error,
  }
}

export {
  fetcher,
  useGetDrafts,
}