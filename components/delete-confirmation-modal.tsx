"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle, Lock, Trash2 } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title }: DeleteConfirmationModalProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (code === "EduKey@2025#Secure") {
      setCode("")
      setIsSubmitting(false)
      onConfirm()
      onClose()
    } else {
      setError("Invalid teacher code. Deletion rejected.")
      setCode("")
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-destructive" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Delete Writeup?</h2>
        <p className="text-muted-foreground text-center mb-2">
          You are about to delete: <span className="font-semibold text-foreground">"{title}"</span>
        </p>
        <p className="text-muted-foreground text-center mb-6 text-sm">
          This action cannot be undone. Enter the teacher code to confirm deletion.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="delete-code" className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Teacher Code
            </label>
            <Input
              id="delete-code"
              type="password"
              placeholder="Enter teacher code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                if (error) setError("")
              }}
              disabled={isSubmitting}
              className={error ? "border-destructive" : ""}
            />
          </div>

          {error && (
            <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Delete"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
