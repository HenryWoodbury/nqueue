const fetcher = (...args: [RequestInfo | URL, RequestInit?]) =>
  fetch(...args)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      return res.json()
    })
    .catch(error => {
      // This catch block handles:
      // 1. Initial network errors during the fetch() call (Stage 1)
      // 2. Errors thrown manually in the .then() block above (like the !res.ok check)
      // 3. Errors from res.json() parsing failure (Stage 2)
      console.error("Fetch operation failed:", error.message)
      throw error
    })

export {
  fetcher
}
