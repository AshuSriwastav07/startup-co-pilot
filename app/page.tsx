"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainIcon, LightbulbIcon } from "lucide-react"

export default function HomePage() {
  const [idea, setIdea] = useState("")
  const router = useRouter()

  const handleSubmit = () => {
    if (idea.trim()) {
      router.push(`/analyze?idea=${encodeURIComponent(idea)}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Analytics />

      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        {" "}
        {/* Responsive padding */}
        <Card className="w-full max-w-3xl shadow-2xl rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm border border-blue-200">
          {" "}
          {/* Responsive width */}
          <CardHeader className="text-center p-8 bg-blue-600 text-white">
            <BrainIcon className="h-12 w-12 mx-auto mb-4 text-white" />
            <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {" "}
              {/* Responsive font size */}
              Transform Your Vision into a Viable Startup
            </CardTitle>
            <CardDescription className="text-blue-100 mt-4 text-lg md:text-xl font-medium">
              {" "}
              {/* Responsive font size */}
              Your ultimate partner for strategic business planning. Get comprehensive analysis and actionable insights
              to launch and scale your idea with confidence.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="relative">
              <LightbulbIcon className="absolute top-4 left-4 h-6 w-6 text-gray-400" />
              <Textarea
                placeholder="Describe your groundbreaking startup idea here... (e.g., 'An AI-driven platform that helps small businesses automate their customer support using natural language processing.')"
                className="min-h-[200px] text-lg p-6 pl-12 border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-inner transition-all duration-300 resize-y"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full py-4 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!idea.trim()}
            >
              Submit Idea & Start Analyzing
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
