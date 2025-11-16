"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Plus } from "lucide-react"
import { formatDateTime } from "@/lib/utils/format"
import { showSuccess, showError } from "@/lib/utils/toast-helpers"

interface Note {
  id: string
  content: string
  isInternal: boolean
  createdAt: string
  user: {
    firstName: string | null
    lastName: string | null
    email: string
  }
}

interface CaseNotesProps {
  caseId: string
}

export function CaseNotes({ caseId }: CaseNotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    content: "",
    isInternal: false,
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/cases/${caseId}/notes`)
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`/api/cases/${caseId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showSuccess("Note added successfully")
        setFormData({ content: "", isInternal: false })
        setShowForm(false)
        fetchNotes()
      } else {
        const error = await response.json()
        showError(error.message || "Failed to add note")
      }
    } catch (error) {
      console.error("Failed to create note:", error)
      showError("An unexpected error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading notes...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notes & Communication
            </CardTitle>
            <CardDescription>Add notes and track case communication</CardDescription>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
            <div>
              <Label htmlFor="content">Note Content *</Label>
              <Textarea
                id="content"
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter your note..."
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isInternal"
                checked={formData.isInternal}
                onChange={(e) =>
                  setFormData({ ...formData, isInternal: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isInternal" className="text-sm font-normal cursor-pointer">
                Internal note (not visible to client)
              </Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add Note"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setFormData({ content: "", isInternal: false })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No notes yet. Add the first note to start tracking case communication.
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-md border ${
                  note.isInternal ? "bg-muted/50" : "bg-background"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">
                      {note.user.firstName || note.user.lastName
                        ? `${note.user.firstName || ""} ${note.user.lastName || ""}`.trim()
                        : note.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(note.createdAt)}
                      {note.isInternal && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-xs">
                          Internal
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

