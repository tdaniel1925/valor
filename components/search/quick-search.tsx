"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

interface QuickSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

export function QuickSearch({
  onSearch,
  placeholder = "Search...",
  className,
  debounceMs = 300,
}: QuickSearchProps) {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, debounceMs)

  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-9"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

