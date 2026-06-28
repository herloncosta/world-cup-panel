import { Link } from "react-router-dom"
import { getFlag } from "../utils/flags"

export function TeamLink({ name, className = "" }: { name: string; className?: string }) {
  const isPlaceholder = /^\d[ABCDFGHIJKL](?:\/[A-Z]+)*$/.test(name) || /^[WLR]\d+/.test(name)

  if (isPlaceholder) {
    return <span className={className}>{name}</span>
  }

  return (
    <Link
      to={`/team/${encodeURIComponent(name)}`}
      className={`hover:text-wc-cyan transition-colors ${className}`}
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="text-sm leading-none">{getFlag(name)}</span>
        <span>{name}</span>
      </span>
    </Link>
  )
}
