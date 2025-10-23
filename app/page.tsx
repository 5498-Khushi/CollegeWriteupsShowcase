"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { TeacherAuthModal } from "@/components/teacher-auth-modal"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleAddWriteupClick = () => {
    setShowAuthModal(true)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    router.push("/add")
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-balance">College Writeup Showcase</h1>
          <p className="text-muted-foreground mt-2">Organize and share your academic work</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* View Writeups Card */}
          <Card className="p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <h2 className="text-2xl font-bold mb-3">View Writeups</h2>
              <p className="text-muted-foreground mb-6">
                Browse and open your collection of writeups organized by subject.
              </p>
            </div>
            <Link href="/view">
              <Button className="w-full" size="lg">
                View Writeups
              </Button>
            </Link>
          </Card>

          {/* Add Writeup Card */}
          <Card className="p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <h2 className="text-2xl font-bold mb-3">Add Writeup</h2>
              <p className="text-muted-foreground mb-6">Upload a new writeup and organize it by subject.</p>
            </div>
            <Button onClick={handleAddWriteupClick} className="w-full bg-transparent" size="lg" variant="outline">
              Add Writeup
            </Button>
          </Card>
        </div>
      </div>

      <TeacherAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
    </main>
  )
}
