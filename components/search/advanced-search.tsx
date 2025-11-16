"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { SearchBar } from "./search-bar"

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onClear?: () => void
  entityType?: "cases" | "quotes" | "all"
}

export interface SearchFilters {
  query: string
  type?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  carrier?: string
}

export function AdvancedSearch({ onSearch, onClear, entityType = "all" }: AdvancedSearchProps) {
  const [expanded, setExpanded] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
  })

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleClear = () => {
    setFilters({ query: "" })
    onClear?.()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Search</CardTitle>
            <CardDescription>Find cases, quotes, and more</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Simple" : "Advanced"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by name, number, or keyword..."
              onSearch={(query) => {
                setFilters({ ...filters, query })
                onSearch({ ...filters, query })
              }}
              defaultValue={filters.query}
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          {(filters.type || filters.status || filters.dateFrom || filters.dateTo || filters.carrier) && (
            <Button variant="outline" onClick={handleClear}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {expanded && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4 border-t">
            {(entityType === "cases" || entityType === "all") && (
              <>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={filters.type || ""}
                    onValueChange={(value) =>
                      setFilters({ ...filters, type: value || undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="life">Life</SelectItem>
                      <SelectItem value="term">Term</SelectItem>
                      <SelectItem value="annuity">Annuity</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status || ""}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value || undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="issued">Issued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                placeholder="Filter by carrier"
                value={filters.carrier || ""}
                onChange={(e) =>
                  setFilters({ ...filters, carrier: e.target.value || undefined })
                }
              />
            </div>

            <div>
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value || undefined })
                }
              />
            </div>

            <div>
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value || undefined })
                }
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

