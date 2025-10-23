"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Download } from "lucide-react"

interface PDFViewerModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  fileData?: string
  fileName?: string
}

export function PDFViewerModal({ isOpen, onClose, title, fileData, fileName }: PDFViewerModalProps) {
  if (!isOpen) return null

  const handleDownload = () => {
    if (!fileData) return

    const link = document.createElement("a")
    link.href = fileData
    link.download = fileName || "writeup.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold truncate">{title}</h2>
          <div className="flex items-center gap-2">
            {fileData && (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto">
          {fileData ? (
            <iframe src={fileData} className="w-full h-full border-0" title={title} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No file available to display</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
