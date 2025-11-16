"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { showSuccess, showError } from "@/lib/utils/toast-helpers"

export function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Send feedback to API
      // const response = await fetch("/api/feedback", {
      //   method: "POST",
      //   body: JSON.stringify({ feedback }),
      // })

      // Placeholder - just show success
      showSuccess("Thank you for your feedback!")
      setFeedback("")
      setOpen(false)
    } catch (error) {
      showError("Failed to submit feedback")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve the platform by sharing your thoughts and suggestions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What can we improve?"
              rows={5}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !feedback.trim()}>
              {loading ? "Sending..." : "Send Feedback"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

