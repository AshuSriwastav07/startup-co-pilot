// File: app/summary/page.tsx

"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { RefreshCcwIcon, HomeIcon, CheckCircleIcon } from "lucide-react"
import { marked } from "marked"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Analytics } from "@vercel/analytics/next"

interface MarketGrowthData {
  year: number
  value: number
}

export default function SummaryPage() {
  const router = useRouter()
  const [explainedIdea, setExplainedIdea] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [renderedHtml, setRenderedHtml] = useState<string | null>(null)
  const [wantsCompetitorDetails, setWantsCompetitorDetails] = useState<string>("")
  const [isCompetitorQuerySubmitted, setIsCompetitorQuerySubmitted] = useState(false)

  // New state for AI market research
  const [aiMarketResearchLoading, setAiMarketResearchLoading] = useState(false)
  const [aiMarketResearchError, setAiMarketResearchError] = useState<string | null>(null)
  const [aiMarketInsights, setAiMarketInsights] = useState<string | null>(null)
  const [marketGrowthChartData, setMarketGrowthChartData] = useState<MarketGrowthData[]>([])

  // New state for Budget Details
  const [wantsBudgetDetails, setWantsBudgetDetails] = useState<string>("")
  const [isBudgetQuerySubmitted, setIsBudgetQuerySubmitted] = useState(false)
  const [budgetPlanLoading, setBudgetPlanLoading] = useState(false)
  const [budgetPlanError, setBudgetPlanError] = useState<string | null>(null)
  const [budgetPlanInsights, setBudgetPlanInsights] = useState<string | null>(null)

  const printRef = useRef(null)

  useEffect(() => {
    const idea = localStorage.getItem("startupIdea")
    const answersString = localStorage.getItem("startupAnswers")

    if (!idea || !answersString) {
      router.push("/")
      return
    }

    let answers: Record<string, string>
    try {
      answers = JSON.parse(answersString)
    } catch (e) {
      console.error("Failed to parse startupAnswers from localStorage:", e)
      setError("Failed to load answers. Please start over.")
      setIsLoading(false)
      return
    }

    const ideaCategory = answers.q0 || "General Innovation or Concept"
    const location = answers.q8 || "Not specified" // Get location for explanation

    const fetchExplainedIdea = async () => {
      setIsLoading(true)
      setError(null)
      setExplainedIdea(null)
      setRenderedHtml(null)

      try {
        const response = await fetch("/api/generateExplanation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idea, answers, ideaCategory, location }), // Pass location
        })

        if (!response.ok) {
          const errorData = await response.json()
          if (response.status === 429) {
            setError("API Rate Limit Exceeded: Please wait and try again.")
          } else {
            setError(`Failed to generate explanation: ${errorData.message || response.statusText}`)
          }
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        const aiResponseText = data.explanation
        setExplainedIdea(aiResponseText)
        setRenderedHtml(marked.parse(aiResponseText) as string)
      } catch (err) {
        console.error("Failed to fetch explained idea:", err)
        if (!error) {
          setError(`Failed to generate explanation. Please try again.`)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchExplainedIdea()
  }, [router, error])

  const handleReAnalyze = () => {
    router.push("/")
  }

  const handleStartNew = () => {
    localStorage.removeItem("startupIdea")
    localStorage.removeItem("startupAnswers")
    setExplainedIdea(null)
    setRenderedHtml(null)
    setWantsCompetitorDetails("")
    setIsCompetitorQuerySubmitted(false)
    setAiMarketInsights(null) // Reset AI market insights
    setMarketGrowthChartData([]) // Reset chart data
    setWantsBudgetDetails("") // Reset budget details
    setIsBudgetQuerySubmitted(false) // Reset budget details
    setBudgetPlanInsights(null) // Reset budget details
    router.push("/")
  }

  const handleExportPdf = async () => {
    const element = printRef.current
    if (!element) {
      console.warn("No element to export to PDF.")
      return
    }

    const html2pdf = (await import("html2pdf.js")).default

    const options = {
      margin: 0.5,
      filename: "startup-idea-summary.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }

    html2pdf().set(options).from(element).save()
  }

  const handleSubmitCompetitorQuery = async () => {
    setIsCompetitorQuerySubmitted(true) // Mark that the choice has been submitted

    if (wantsCompetitorDetails === "yes") {
      setAiMarketResearchLoading(true) // Start loading for AI market research
      setAiMarketResearchError(null)
      setAiMarketInsights(null)
      setMarketGrowthChartData([])

      const idea = localStorage.getItem("startupIdea")
      const answersString = localStorage.getItem("startupAnswers")

      if (!idea || !answersString) {
        setAiMarketResearchError("Missing idea or answers to perform research.")
        setAiMarketResearchLoading(false)
        return
      }

      let answers: Record<string, string>
      try {
        answers = JSON.parse(answersString)
      } catch (e) {
        console.error("Failed to parse startupAnswers for AI market research:", e)
        setAiMarketResearchError("Failed to load answers for research. Please try again.")
        setAiMarketResearchLoading(false)
        return
      }

      const ideaCategory = answers.q0 || "General Innovation or Concept"
      const problem = answers.q7 || ""
      const location = answers.q8 || "Not specified" // Get location for market research

      try {
        const response = await fetch("/api/ai-market-research", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idea, ideaCategory, problem, answers, location }), // Pass location
        })

        if (!response.ok) {
          const errorData = await response.json()
          setAiMarketResearchError(errorData.error || `Failed to get AI insights: ${response.statusText}`)
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        setAiMarketInsights(data.insight) // Set the AI-generated insight (the report markdown)
        setMarketGrowthChartData(data.marketGrowthData || []) // Set the chart data
      } catch (err) {
        console.error("Error fetching AI market research:", err)
        if (!aiMarketResearchError) {
          setError(`Failed to perform AI market research. Please try again.`) // Use setError for main error display
        }
      } finally {
        setAiMarketResearchLoading(false)
      }
    }
  }

  const handleSubmitBudgetQuery = async () => {
    setIsBudgetQuerySubmitted(true) // Mark that the choice has been submitted

    if (wantsBudgetDetails === "yes") {
      setBudgetPlanLoading(true)
      setBudgetPlanError(null)
      setBudgetPlanInsights(null)

      const idea = localStorage.getItem("startupIdea")
      const answersString = localStorage.getItem("startupAnswers")

      if (!idea || !answersString) {
        setBudgetPlanError("Missing idea or answers to generate budget plan.")
        setBudgetPlanLoading(false)
        return
      }

      let answers: Record<string, string>
      try {
        answers = JSON.parse(answersString)
      } catch (e) {
        console.error("Failed to parse startupAnswers for budget plan:", e)
        setBudgetPlanError("Failed to load answers for budget plan. Please try again.")
        setBudgetPlanLoading(false)
        return
      }

      const problem = answers.q7 || ""
      const location = answers.q8 || "Not specified"

      try {
        const response = await fetch("/api/budget-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idea, answers, location, problem }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          setBudgetPlanError(errorData.error || `Failed to get budget plan: ${response.statusText}`)
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        setBudgetPlanInsights(data.plan) // Set the AI-generated budget plan
      } catch (err) {
        console.error("Error fetching budget plan:", err)
        if (!budgetPlanError) {
          setBudgetPlanError(`Failed to generate budget plan. Please try again.`)
        }
      } finally {
        setBudgetPlanLoading(false)
      }
    }
  }

  // Determine if the budget question should be shown
  const showBudgetQuestion =
    !isLoading &&
    !error &&
    explainedIdea &&
    isCompetitorQuerySubmitted && // Competitor choice has been made
    !isBudgetQuerySubmitted && // Budget choice not yet made
    ((wantsCompetitorDetails === "yes" && !aiMarketResearchLoading && aiMarketInsights) || // If yes, wait for market research to finish loading AND content is there
      wantsCompetitorDetails === "no") // If no, show immediately after competitor choice

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main ref={printRef} className="flex-1 flex flex-col items-center p-4 md:p-6">
        {" "}
        {/* Responsive padding */}
        <Card className="w-full max-w-4xl shadow-2xl rounded-xl bg-white/90 backdrop-blur-sm border border-blue-200">
          {" "}
          {/* Responsive width */}
          <CardHeader className="text-center p-8 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t-xl">
            <CheckCircleIcon className="h-12 w-12 mx-auto mb-4 text-white" />
            <CardTitle className="text-4xl md:text-5xl font-extrabold">Your Startup Plan is Ready!</CardTitle>{" "}
            {/* Responsive font size */}
            <CardDescription className="text-blue-100 mt-4 text-lg md:text-xl">
              {" "}
              {/* Responsive font size */}
              Dive into the detailed explanation of your idea, crafted by AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-red-500 text-center text-lg font-medium p-6 border border-red-300 bg-red-50 rounded-lg">
                {error}
              </div>
            ) : explainedIdea ? (
              <div className="prose max-w-none mx-auto p-6 border-2 border-blue-300 rounded-lg bg-blue-50 shadow-inner text-gray-800 leading-relaxed">
                <h2 className="text-3xl font-bold text-blue-800 mb-4">Detailed Idea Explanation</h2>
                <div dangerouslySetInnerHTML={{ __html: renderedHtml || "" }} />
              </div>
            ) : (
              <div className="text-center text-gray-600 text-lg p-6 border border-gray-300 bg-gray-50 rounded-lg">
                No explanation found. Please go back and submit your idea.
              </div>
            )}

            {/* Section: Want to know more about competition? */}
            {!isLoading && !error && explainedIdea && !isCompetitorQuerySubmitted && (
              <Card className="w-full mt-8 shadow-xl rounded-xl bg-white/90 backdrop-blur-sm border border-blue-200">
                {" "}
                {/* Responsive width */}
                <CardHeader className="p-6 bg-blue-50 border-b border-blue-200">
                  <CardTitle className="text-2xl font-bold text-blue-800">
                    Want to know more about competition in the same segment?
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Would you like to explore existing competitors and similar businesses in your idea’s space?
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <>
                    <RadioGroup
                      value={wantsCompetitorDetails}
                      onValueChange={setWantsCompetitorDetails}
                      className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6" // Responsive layout
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="yes" id="competitor-yes" />
                        <Label htmlFor="competitor-yes">✅ Yes, tell me more!</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="no" id="competitor-no" />
                        <Label htmlFor="competitor-no">❌ No, not right now.</Label>
                      </div>
                    </RadioGroup>
                    <Button
                      onClick={handleSubmitCompetitorQuery}
                      disabled={!wantsCompetitorDetails}
                      className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Submit Choice
                    </Button>
                  </>
                </CardContent>
              </Card>
            )}

            {/* AI Market Research Section */}
            {isCompetitorQuerySubmitted && wantsCompetitorDetails === "yes" && (
              <Card className="w-full mt-8 shadow-xl rounded-xl bg-white/90 backdrop-blur-sm border border-blue-200">
                {" "}
                {/* Responsive width */}
                <CardHeader className="p-6 bg-green-50 border-b border-green-200">
                  <CardTitle className="text-2xl font-bold text-green-800">📊 AI Market Research Report</CardTitle>
                  <CardDescription className="text-gray-600">
                    A detailed market analysis generated by AI.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {aiMarketResearchLoading ? (
                    <LoadingSpinner />
                  ) : aiMarketResearchError ? (
                    <div className="text-red-500 text-center text-lg font-medium p-6 border border-red-300 bg-red-50 rounded-lg">
                      {aiMarketResearchError}
                    </div>
                  ) : aiMarketInsights ? (
                    <>
                      <div className="prose max-w-none mx-auto p-6 border-2 border-blue-300 rounded-lg bg-blue-50 shadow-inner text-gray-800 leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: marked.parse(aiMarketInsights) as string }} />
                      </div>
                      <p className="text-sm text-gray-500 mt-4 text-center">
                        Results are AI-generated and based on the model's training data. Market growth data is
                        hypothetical. May vary in accuracy.
                      </p>
                    </>
                  ) : (
                    <div className="text-center text-gray-600 text-lg p-6 border border-gray-300 bg-gray-50 rounded-lg">
                      No AI market research available.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Section: Do you want to check Budget Details and how To start your idea? */}
            {showBudgetQuestion && (
              <Card className="w-full mt-8 shadow-xl rounded-xl bg-white/90 backdrop-blur-sm border border-blue-200">
                {" "}
                {/* Responsive width */}
                <CardHeader className="p-6 bg-purple-50 border-b border-purple-200">
                  <CardTitle className="text-2xl font-bold text-purple-800">
                    Do you want to check Budget Details and how To start your idea?
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Get insights into budget planning and a step-by-step guide to launch your idea.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <>
                    <RadioGroup
                      value={wantsBudgetDetails}
                      onValueChange={setWantsBudgetDetails}
                      className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6" // Responsive layout
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="yes" id="budget-yes" />
                        <Label htmlFor="budget-yes">✅ Yes, show me the plan!</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="no" id="budget-no" />
                        <Label htmlFor="budget-no">❌ No, not right now.</Label>
                      </div>
                    </RadioGroup>
                    <Button
                      onClick={handleSubmitBudgetQuery}
                      disabled={!wantsBudgetDetails}
                      className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Submit Choice
                    </Button>
                  </>
                </CardContent>
              </Card>
            )}

            {/* Budget Details and How to Start Section */}
            {isBudgetQuerySubmitted && wantsBudgetDetails === "yes" && (
              <Card className="w-full mt-8 shadow-xl rounded-xl bg-white/90 backdrop-blur-sm border border-blue-200">
                {" "}
                {/* Responsive width */}
                <CardHeader className="p-6 bg-yellow-50 border-b border-yellow-200">
                  <CardTitle className="text-2xl font-bold text-yellow-800">
                    💰 Budget Details & Startup Launch Plan
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    A tailored plan for starting and budgeting your idea.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {budgetPlanLoading ? (
                    <LoadingSpinner />
                  ) : budgetPlanError ? (
                    <div className="text-red-500 text-center text-lg font-medium p-6 border border-red-300 bg-red-50 rounded-lg">
                      {budgetPlanError}
                    </div>
                  ) : budgetPlanInsights ? (
                    <>
                      <div className="prose max-w-none mx-auto p-6 border-2 border-blue-300 rounded-lg bg-blue-50 shadow-inner text-gray-800 leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: marked.parse(budgetPlanInsights) as string }} />
                      </div>
                      <p className="text-sm text-gray-500 mt-4 text-center">
                        Results are AI-generated and based on the model's training data. May vary in accuracy.
                      </p>
                    </>
                  ) : (
                    <div className="text-center text-gray-600 text-lg p-6 border border-gray-300 bg-gray-50 rounded-lg">
                      No budget plan available.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
        {/* Main Action Buttons (moved to bottom) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full max-w-4xl">
          {" "}
          {/* Responsive layout */}
          <Button
            onClick={handleReAnalyze}
            className="flex items-center gap-2 py-3 text-lg font-semibold bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <RefreshCcwIcon className="h-5 w-5" />
            Re-analyze
          </Button>
          <Button
            onClick={handleStartNew}
            className="flex items-center gap-2 py-3 text-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <HomeIcon className="h-5 w-5" />
            Start New Idea
          </Button>
        </div>
      </main>
    </div>
  )
}
