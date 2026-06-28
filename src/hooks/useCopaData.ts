import { useEffect, useState } from "react"
import { fetchCopa2026 } from "../api/api"
import type { CopaData } from "../types"

export function useCopaData() {
  const [data, setData] = useState<CopaData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    fetchCopa2026(controller.signal)
      .then(setData)
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return
        setError(e instanceof Error ? e.message : "Failed to load data")
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  return { data, loading, error }
}
