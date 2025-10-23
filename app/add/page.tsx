"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ChevronLeft, Upload, AlertCircle } from "lucide-react"
import { useWriteups } from "@/hooks/use-writeups"
import { useRouter } from "next/navigation"

const COMMON_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Computer Science", "Biology", "History", "Literature"]

export default function AddWriteupPage() {
  const router = useRouter()
  const { addWriteup } = useWriteups()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("teacher_auth_token")
    if (token === "EduKey@2025#Secure") {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [])

  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [showNewSubject, setShowNewSubject] = useState(false)
  const [newSubject, setNewSubject] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const selectedSubject = showNewSubject ? newSubject : subject

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!selectedSubject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!file) {
      newErrors.file = "File is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        const fileData = event.target?.result as string

        addWriteup({
          title,
          subject: selectedSubject,
          description,
          fileName: file?.name,
          fileData,
        })

        setSuccess(true)
        setTitle("")
        setSubject("")
        setDescription("")
        setFile(null)
        setNewSubject("")
        setShowNewSubject(false)
        setErrors({})

        // Redirect to view page after 2 seconds
        setTimeout(() => {
          router.push("/view")
        }, 2000)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Failed to add writeup:", error)
      setErrors({ submit: "Failed to add writeup. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (errors.file) {
        setErrors({ ...errors, file: "" })
      }
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-balance">Access Denied</h1>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-12">
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Teacher Access Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to enter the correct teacher code to access this section.
            </p>
            <Link href="/">
              <Button>Go Back Home</Button>
            </Link>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-balance">Add New Writeup</h1>
          <p className="text-muted-foreground mt-2">Upload and organize your academic work</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {success && (
          <Card className="p-4 mb-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <p className="text-green-800 dark:text-green-200 font-medium">
              Writeup added successfully! Redirecting to your collection...
            </p>
          </Card>
        )}

        {errors.submit && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200 font-medium">{errors.submit}</p>
          </Card>
        )}

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Introduction to Quantum Computing"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) setErrors({ ...errors, title: "" })
                }}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              {!showNewSubject ? (
                <div className="space-y-3">
                  <select
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value)
                      if (errors.subject) setErrors({ ...errors, subject: "" })
                    }}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="">Select a subject</option>
                    {COMMON_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewSubject(true)}
                    className="w-full"
                  >
                    Create New Subject
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Enter new subject name"
                    value={newSubject}
                    onChange={(e) => {
                      setNewSubject(e.target.value)
                      if (errors.subject) setErrors({ ...errors, subject: "" })
                    }}
                    className={errors.subject ? "border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowNewSubject(false)
                      setNewSubject("")
                    }}
                    className="w-full"
                  >
                    Use Existing Subject
                  </Button>
                </div>
              )}
              {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject}</p>}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                placeholder="Add a brief description of your writeup..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Upload File</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                  accept=".pdf,.doc,.docx,.txt,.md"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="font-medium mb-1">{file ? file.name : "Click to upload or drag and drop"}</p>
                  <p className="text-sm text-muted-foreground">PDF, DOC, DOCX, TXT, or MD</p>
                </label>
              </div>
              {errors.file && <p className="text-destructive text-sm mt-1">{errors.file}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Link href="/view" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Writeup"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Box */}
        <Card className="p-4 mt-6 bg-muted">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Tip:</p>
              <p>You can organize your writeups by subject and easily search through them later.</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
