"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainIcon, LightbulbIcon, RocketIcon, UsersIcon, BarChart3Icon, ShieldCheckIcon, StarIcon, QuoteIcon } from "lucide-react"

export default function HomePage() {
  const [idea, setIdea] = useState("")
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (idea.trim()) {
      router.push(`/analyze?idea=${encodeURIComponent(idea)}`)
    }
  }

  const handleExample = () => {
    setIdea("A platform that helps remote teams brainstorm and vote on new product features using AI-generated suggestions.")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const TESTIMONIALS = [
    {
      name: "Priya S.",
      role: "Startup Founder",
      image: "/placeholder-user.jpg",
      text: "This platform turned my rough idea into a clear, actionable business plan. The AI insights and competitor research were spot on!",
      rating: 5,
    },
    {
      name: "Alex T.",
      role: "Product Manager",
      image: "/placeholder.jpg",
      text: "I was amazed by how quickly I got a market analysis and competitor breakdown. The UI is clean and the advice is actionable.",
      rating: 5,
    },
    {
      name: "Fatima Z.",
      role: "Tech Entrepreneur",
      image: "/placeholder-user.jpg",
      text: "The budget planning and launch steps were super helpful. I recommend this to anyone starting out!",
      rating: 5,
    },
    {
      name: "John D.",
      role: "Startup Mentor",
      image: "/placeholder.jpg",
      text: "A must-have tool for early founders. The AI-generated plans are detailed and realistic.",
      rating: 5,
    },
  ]

  function TestimonialSlider() {
    const [index, setIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768)
      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % TESTIMONIALS.length)
      }, 3500)
      return () => clearInterval(interval)
    }, [])

    const count = isMobile ? 1 : 2
    const slides = []
    for (let i = 0; i < count; i++) {
      slides.push(TESTIMONIALS[(index + i) % TESTIMONIALS.length])
    }

    return (
      <div className="relative w-full max-w-4xl mx-auto mt-16 z-10">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">What Founders Are Saying</h2>
        <div className="flex justify-center gap-8 transition-all duration-700">
          {slides.map((t, idx) => (
            <div
              key={idx}
              className="w-[340px] h-[220px] flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl border border-blue-200 p-8 flex flex-col items-center text-center mx-auto relative"
              style={{ minWidth: 340, maxWidth: 340 }}
            >
              <p className="text-gray-700 italic mb-4 mt-2 line-clamp-5">"{t.text}"</p>
              <div className="mt-auto">
                <span className="font-semibold text-blue-700">{t.name}</span>
                <span className="ml-2 text-blue-500 text-sm">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-x-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <svg viewBox="0 0 1440 320" className="w-full h-64 md:h-96 opacity-60">
          <path fill="#6366f1" fillOpacity="0.2" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
        <div className="absolute top-10 right-10 animate-float-slow">
          <svg width="60" height="60"><circle cx="30" cy="30" r="28" fill="#a5b4fc" fillOpacity="0.18" /></svg>
        </div>
        <div className="absolute bottom-20 left-10 animate-float-fast">
          <svg width="40" height="40"><rect width="40" height="40" rx="12" fill="#818cf8" fillOpacity="0.12" /></svg>
        </div>
      </div>
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 z-10">
        {/* Hero Section with Animated Headline */}
        <div className="w-full max-w-3xl text-center mb-8 mt-8">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Get a Clear, Actionable Explanation for Your Startup Idea
          </h1>
          <div className="mt-4 text-xl md:text-2xl text-blue-700 font-semibold animate-fade-in delay-200">
            Instantly receive detailed analysis and budget planning for your idea—no signup needed.
          </div>
        </div>
        {/* Main Card with Clean Input and Buttons */}
        <Card className="w-full max-w-3xl shadow-2xl rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm border border-blue-200 animate-fade-in delay-300">
          <CardHeader className="text-center p-8 bg-blue-600 text-white">
            <BrainIcon className="h-12 w-12 mx-auto mb-4 text-white animate-bounce" />
            <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Transform Your Vision into a Viable Startup
            </CardTitle>
            <CardDescription className="text-blue-100 mt-4 text-lg md:text-xl font-medium">
              Your ultimate partner for strategic business planning. Get comprehensive analysis and actionable insights
              to launch and scale your idea with confidence.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="relative group">
              <LightbulbIcon className="absolute top-4 left-4 h-6 w-6 text-yellow-400 animate-pulse" />
              <Textarea
                ref={inputRef}
                placeholder="Describe your startup idea here... (e.g., 'An AI-driven platform that helps small businesses automate their customer support using natural language processing.')"
                className="min-h-[200px] text-lg p-6 pl-12 border-2 border-blue-400 focus:border-purple-500 focus:ring-purple-500 rounded-lg shadow-inner transition-all duration-300 resize-y ring-2 ring-blue-200 group-focus-within:ring-purple-400"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleExample}
              className="w-full md:w-auto mt-2 px-6 py-2 text-base font-medium bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg shadow-sm transition-all"
            >
              See Example
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-full py-4 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!idea.trim()}
            >
              Get My Startup Plan
            </Button>
          </CardContent>
        </Card>
        {/* Why Try Section */}
        <section className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 z-10 animate-fade-in delay-700">
          <div className="flex flex-col items-center text-center p-6 bg-white/90 rounded-xl shadow-md border border-blue-100">
            <UsersIcon className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-bold text-lg mb-1">No Signup Needed</h3>
            <p className="text-gray-600">Jump right in and get your startup plan—no account required.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white/90 rounded-xl shadow-md border border-blue-100">
            <RocketIcon className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-bold text-lg mb-1">Instant Results</h3>
            <p className="text-gray-600">Get a detailed, actionable plan in less than a minute.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white/90 rounded-xl shadow-md border border-blue-100">
            <ShieldCheckIcon className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-bold text-lg mb-1">Private & Secure</h3>
            <p className="text-gray-600">Your ideas stay on your device. We never see or store your input.</p>
          </div>
        </section>
        {/* Features Section */}
        <section className="w-full max-w-5xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
          <div className="flex flex-col items-center text-center p-6 bg-white/80 rounded-xl shadow-md border border-blue-100">
            <RocketIcon className="h-10 w-10 text-purple-500 mb-2" />
            <h3 className="font-bold text-lg mb-1">AI-Powered Analysis</h3>
            <p className="text-gray-600">Get deep insights and actionable plans for your startup idea, powered by advanced AI models.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white/80 rounded-xl shadow-md border border-blue-100">
            <BarChart3Icon className="h-10 w-10 text-blue-500 mb-2" />
            <h3 className="font-bold text-lg mb-1">Market & Competitor Research</h3>
            <p className="text-gray-600">Instantly discover market trends and top competitors in your segment, tailored to your idea.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white/80 rounded-xl shadow-md border border-blue-100">
            <ShieldCheckIcon className="h-10 w-10 text-green-500 mb-2" />
            <h3 className="font-bold text-lg mb-1">Confidential & Secure</h3>
            <p className="text-gray-600">Your ideas are safe. We never share your data and use secure, privacy-first technology.</p>
          </div>
        </section>
        {/* Testimonial Section */}
        <TestimonialSlider />
        {/* Product Hunt Badge - after testimonials, before footer */}
        <div className="w-full flex justify-center my-8">
          <a href="https://www.producthunt.com/products/startup-co-pilot?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-startup&#0045;co&#0045;pilot" target="_blank" rel="noopener noreferrer">
            <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=994485&theme=dark&t=1752864789817" alt="Startup Co-Pilot - Take the First Step to Validate and Shape Your Startup Idea | Product Hunt" style={{ width: 250, height: 54 }} width="250" height="54" />
          </a>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full bg-white/90 border-t border-blue-200 py-6 mt-16 z-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4 relative">
          <div className="flex items-center gap-2">
            <img src="/images/rocket-icon.jpeg" alt="Logo" className="h-8 w-8" />
            <span className="font-bold text-blue-700 text-lg">Startup Co-Pilot</span>
          </div>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-blue-600 transition">About</a>
            <a href="#" className="hover:text-blue-600 transition">Contact</a>
          </div>
          <div className="text-gray-400 text-xs">&copy; {new Date().getFullYear()} Startup Co-Pilot. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
