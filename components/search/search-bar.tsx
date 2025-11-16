"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  defaultValue?: string
}

export function SearchBar({ placeholder = "Search...", onSearch, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          // Optional: debounce for real-time search
          if (e.target.value === "") {
            onSearch("")
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            onSearch(query)
          }
        }}
        className="pl-9"
      />
    </form>
  )
}

