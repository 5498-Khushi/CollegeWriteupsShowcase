"use client"
import { useState, useMemo } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChevronLeft, FileText, Trash2 } from "lucide-react"
import { useWriteups } from "@/hooks/use-writeups"
import { PDFViewerModal } from "@/components/pdf-viewer-modal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"

export default function ViewWriteupsPage() {
  const { writeups, removeWriteup, isLoading } = useWriteups()
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedPDF, setSelectedPDF] = useState<{
    id: string
    title: string
    fileData?: string
    fileName?: string
  } | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    writeupId: string
    writeupTitle: string
  }>({
    isOpen: false,
    writeupId: "",
    writeupTitle: "",
  })

  // Get unique subjects
  const subjects = useMemo(() => {
    return Array.from(new Set(writeups.map((w) => w.subject))).sort()
  }, [writeups])

  // Filter writeups by selected subject
  const filteredWriteups = useMemo(() => {
    if (!selectedSubject) return writeups
    return writeups.filter((w) => w.subject === selectedSubject)
  }, [writeups, selectedSubject])

  const handleDeleteClick = (e: React.MouseEvent, writeupId: string, writeupTitle: string) => {
    e.stopPropagation()
    setDeleteConfirmation({
      isOpen: true,
      writeupId,
      writeupTitle,
    })
  }

  const handleConfirmDelete = () => {
    removeWriteup(deleteConfirmation.writeupId)
    setDeleteConfirmation({ isOpen: false, writeupId: "", writeupTitle: "" })
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading writeups...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-balance">Your Writeups</h1>
          <p className="text-muted-foreground mt-2">
            {filteredWriteups.length} writeup{filteredWriteups.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Subject Filter */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Subjects</h2>
              <div className="space-y-2">
                <Button
                  variant={selectedSubject === null ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject(null)}
                >
                  All Subjects
                </Button>
                {subjects.map((subject) => (
                  <Button
                    key={subject}
                    variant={selectedSubject === subject ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    {subject}
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Writeups List */}
          <div className="lg:col-span-3">
            {filteredWriteups.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No writeups found</h3>
                <p className="text-muted-foreground mb-6">
                  {selectedSubject ? `No writeups in ${selectedSubject} yet.` : "Start by adding your first writeup!"}
                </p>
                <Link href="/">
                  <Button>Add Writeup</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredWriteups.map((writeup) => (
                  <Card
                    key={writeup.id}
                    onClick={() =>
                      setSelectedPDF({
                        id: writeup.id,
                        title: writeup.title,
                        fileData: writeup.fileData,
                        fileName: writeup.fileName,
                      })
                    }
                    className="p-6 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <h3 className="text-lg font-semibold truncate">{writeup.title}</h3>
                      </div>
                      {writeup.description && (
                        <p className="text-muted-foreground text-sm mb-3">{writeup.description}</p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="secondary">{writeup.subject}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(writeup.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClick(e, writeup.id, writeup.title)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <PDFViewerModal
        isOpen={!!selectedPDF}
        onClose={() => setSelectedPDF(null)}
        title={selectedPDF?.title || ""}
        fileData={selectedPDF?.fileData}
        fileName={selectedPDF?.fileName}
      />

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, writeupId: "", writeupTitle: "" })}
        onConfirm={handleConfirmDelete}
        title={deleteConfirmation.writeupTitle}
      />
    </main>
  )
}
