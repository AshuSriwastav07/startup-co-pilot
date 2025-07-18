"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LightbulbIcon, ArrowRightIcon } from "lucide-react"

export default function AnalyzePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const idea = searchParams.get("idea")

  // State to hold answers for the 7 questions + new idea category (q0) + location (q8)
  const [answers, setAnswers] = useState({
    q0: "", // What best describes your idea?
    q1: "", // How many of you are working on this idea?
    q2: "", // How do you want to scale your idea?
    q3: "", // How will your startup operate?
    q4: "", // Do you have a startup model in mind or want us to suggest one?
    q5: "", // Have you done market research?
    q6: "", // Do you have any initial funding or investment?
    q7: "", // What is the primary problem your idea solves?
    q8: "", // New: Where do you want to start your idea? (Location)
  })

  useEffect(() => {
    if (!idea) {
      router.push("/") // Redirect if no idea is provided
    }
  }, [idea, router])

  const handleAnswerChange = (questionKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }))
  }

  const handleContinue = () => {
    // Store the original idea and answers in localStorage for the summary page
    localStorage.setItem("startupIdea", idea || "")
    localStorage.setItem("startupAnswers", JSON.stringify(answers))
    router.push("/summary")
  }

  // Check if all required questions have been answered
  const allQuestionsAnswered =
    answers.q0 !== "" && // New question
    answers.q1 !== "" &&
    answers.q2 !== "" &&
    answers.q3 !== "" &&
    answers.q4 !== "" &&
    answers.q5 !== "" &&
    answers.q6.trim() !== "" &&
    answers.q7.trim() !== "" &&
    answers.q8 !== "" // New: Location question

  const countries = [
    "United States",
    "India",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Brazil",
    "Japan",
    "China",
    "Mexico",
    "South Africa",
    "Nigeria",
    "Egypt",
    "Kenya",
    "Argentina",
    "Colombia",
    "Chile",
    "Peru",
    "Spain",
    "Italy",
    "Netherlands",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Switzerland",
    "Belgium",
    "Austria",
    "Ireland",
    "New Zealand",
    "Singapore",
    "Malaysia",
    "Indonesia",
    "Thailand",
    "Vietnam",
    "Philippines",
    "South Korea",
    "United Arab Emirates",
    "Saudi Arabia",
    "Qatar",
    "Israel",
    "Turkey",
    "Russia",
    "Poland",
    "Ukraine",
    "Portugal",
    "Greece",
    "Czech Republic",
    "Hungary",
    "Romania",
    "Pakistan",
    "Bangladesh",
    "Sri Lanka",
    "Nepal",
    "Afghanistan",
    "Algeria",
    "Morocco",
    "Tunisia",
    "Ghana",
    "Ethiopia",
    "Tanzania",
    "Uganda",
    "Angola",
    "Mozambique",
    "Zambia",
    "Zimbabwe",
    "Madagascar",
    "Cameroon",
    "Ivory Coast",
    "Democratic Republic of Congo",
    "Sudan",
    "Uzbekistan",
    "Kazakhstan",
    "Azerbaijan",
    "Georgia",
    "Armenia",
    "Belarus",
    "Bulgaria",
    "Croatia",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Lithuania",
    "Latvia",
    "Estonia",
    "Iceland",
    "Luxembourg",
    "Malta",
    "Cyprus",
    "Albania",
    "Bosnia and Herzegovina",
    "North Macedonia",
    "Montenegro",
    "Kosovo",
    "Cuba",
    "Dominican Republic",
    "Jamaica",
    "Haiti",
    "Puerto Rico",
    "Trinidad and Tobago",
    "Costa Rica",
    "Panama",
    "Guatemala",
    "Honduras",
    "El Salvador",
    "Nicaragua",
    "Paraguay",
    "Uruguay",
    "Venezuela",
    "Bolivia",
    "Ecuador",
    "Guyana",
    "Suriname",
    "French Guiana",
    "Fiji",
    "Papua New Guinea",
    "Solomon Islands",
    "Vanuatu",
    "Samoa",
    "Tonga",
    "Kiribati",
    "Micronesia",
    "Marshall Islands",
    "Palau",
    "Nauru",
    "Tuvalu",
    "Other / Global", // Option for global or not specific
  ]

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
      <main className="flex-1 flex flex-col items-center p-4 md:p-6 z-10">
        {/* Hero Section */}
        <div className="w-full max-w-3xl text-center mb-8 mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Tell Us More About Your Idea
          </h1>
          <div className="mt-4 text-lg md:text-xl text-blue-700 font-semibold animate-fade-in delay-200">
            Answer a few quick questions to get a tailored analysis and plan.
          </div>
        </div>
        {/* Idea Card */}
        <Card className="w-full max-w-3xl shadow-2xl rounded-xl mb-8 bg-white/90 backdrop-blur-sm border border-blue-200 animate-fade-in delay-300">
          <CardHeader className="flex flex-row items-center gap-4 p-6 bg-blue-50 border-b border-blue-200">
            <LightbulbIcon className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl font-bold text-blue-800">Your Brilliant Idea</CardTitle>
              <CardDescription className="text-gray-600">Let's refine this vision together.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50 text-lg font-medium text-blue-800 shadow-inner">
              {idea || "No idea provided."}
            </div>
          </CardContent>
        </Card>
        {/* Questions Card */}
        <Card className="w-full max-w-3xl shadow-2xl rounded-xl bg-white/90 backdrop-blur-sm border border-blue-200 animate-fade-in delay-500">
          <CardHeader className="p-6 bg-blue-50 border-b border-blue-200">
            <CardTitle className="text-2xl font-bold text-blue-800">Deep Dive into Your Concept</CardTitle>
            <CardDescription className="text-gray-600">
              Answer these questions to help us craft your comprehensive startup plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="grid gap-8">
              {" "}
              {/* Grid for questions, naturally responsive */}
              {/* Question 1: What best describes your idea? */}
              <div className="space-y-2">
                <Label htmlFor="q0" className="text-lg font-semibold text-gray-700">
                  1. What best describes your idea?
                </Label>
                <Select value={answers.q0} onValueChange={(value) => handleAnswerChange("q0", value)}>
                  <SelectTrigger
                    id="q0"
                    className="w-full text-base p-3 border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="App Idea">App Idea</SelectItem>
                    <SelectItem value="Startup Idea">Startup Idea</SelectItem>
                    <SelectItem value="Website Idea">Website Idea</SelectItem>
                    <SelectItem value="Platform-Based Idea">Platform-Based Idea</SelectItem>
                    <SelectItem value="Product Idea">Product Idea</SelectItem>
                    <SelectItem value="General Innovation or Concept">General Innovation or Concept</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Question 2: How many of you are working on this idea? */}
              <div className="space-y-2">
                <Label htmlFor="q1" className="text-lg font-semibold text-gray-700">
                  2. How many of you are working on this idea?
                </Label>
                <Select value={answers.q1} onValueChange={(value) => handleAnswerChange("q1", value)}>
                  <SelectTrigger
                    id="q1"
                    className="w-full text-base p-3 border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Just Me">Just Me</SelectItem>
                    <SelectItem value="2-3 Team Members">2–3 Team Members</SelectItem>
                    <SelectItem value="More than 3">More than 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Question 3: How do you want to scale your idea? */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-700">3. How do you want to scale your idea?</Label>
                <RadioGroup
                  value={answers.q2}
                  onValueChange={(value) => handleAnswerChange("q2", value)}
                  className="flex flex-col space-y-3 p-2 border border-blue-200 rounded-md bg-blue-50"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Locally" id="q2-locally" className="text-blue-600" />
                    <Label htmlFor="q2-locally" className="text-base text-gray-800">
                      Locally
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Nationally" id="q2-nationally" className="text-blue-600" />
                    <Label htmlFor="q2-nationally" className="text-base text-gray-800">
                      Nationally
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Globally" id="q2-globally" className="text-blue-600" />
                    <Label htmlFor="q2-globally" className="text-base text-gray-800">
                      Globally
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {/* Question 4: How will your startup operate? */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-700">4. How will your startup operate?</Label>
                <RadioGroup
                  value={answers.q3}
                  onValueChange={(value) => handleAnswerChange("q3", value)}
                  className="flex flex-col space-y-3 p-2 border border-blue-200 rounded-md bg-blue-50"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Online" id="q3-online" className="text-blue-600" />
                    <Label htmlFor="q3-online" className="text-base text-gray-800">
                      Online
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Offline" id="q3-offline" className="text-blue-600" />
                    <Label htmlFor="q3-offline" className="text-base text-gray-800">
                      Offline
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Both" id="q3-both" className="text-blue-600" />
                    <Label htmlFor="q3-both" className="text-base text-gray-800">
                      Both
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {/* Question 5: Do you have a startup model in mind or want us to suggest one? */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-700">
                  5. Do you have a startup model in mind or want us to suggest one?
                </Label>
                <RadioGroup
                  value={answers.q4}
                  onValueChange={(value) => handleAnswerChange("q4", value)}
                  className="flex flex-col space-y-3 p-2 border border-blue-200 rounded-md bg-blue-50"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="I have one" id="q4-have" className="text-blue-600" />
                    <Label htmlFor="q4-have" className="text-base text-gray-800">
                      I have one
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Suggest one" id="q4-suggest" className="text-blue-600" />
                    <Label htmlFor="q4-suggest" className="text-base text-gray-800">
                      Suggest one
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {/* Question 6: Have you done market research? */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-700">6. Have you done market research?</Label>
                <RadioGroup
                  value={answers.q5}
                  onValueChange={(value) => handleAnswerChange("q5", value)}
                  className="flex flex-col space-y-3 p-2 border border-blue-200 rounded-md bg-blue-50"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Yes" id="q5-yes" className="text-blue-600" />
                    <Label htmlFor="q5-yes" className="text-base text-gray-800">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="A little" id="q5-little" className="text-blue-600" />
                    <Label htmlFor="q5-little" className="text-base text-gray-800">
                      A little
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="No" id="q5-no" className="text-blue-600" />
                    <Label htmlFor="q5-no" className="text-base text-gray-800">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {/* Question 7: Do you have any initial funding or investment? */}
              <div className="space-y-2">
                <Label htmlFor="q6" className="text-lg font-semibold text-gray-700">
                  7. Do you have any initial funding or investment?
                </Label>
                <Input
                  id="q6"
                  placeholder="e.g., Self-funded, Seed round, None yet"
                  className="w-full text-base p-3 border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  value={answers.q6}
                  onChange={(e) => handleAnswerChange("q6", e.target.value)}
                />
              </div>
              {/* Question 8: What is the primary problem your idea solves? */}
              <div className="space-y-2">
                <Label htmlFor="q7" className="text-lg font-semibold text-gray-700">
                  8. What is the primary problem your idea solves?
                </Label>
                <Input
                  id="q7"
                  placeholder="e.g., Lack of affordable housing, inefficient task management"
                  className="w-full text-base p-3 border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  value={answers.q7}
                  onChange={(e) => handleAnswerChange("q7", e.target.value)}
                />
              </div>
              {/* New Question 9: Where do you want to start your idea? (Location) */}
              <div className="space-y-2">
                <Label htmlFor="q8" className="text-lg font-semibold text-gray-700">
                  9. Where do you want to start your idea? (Location)
                </Label>
                <Select value={answers.q8} onValueChange={(value) => handleAnswerChange("q8", value)}>
                  <SelectTrigger
                    id="q8"
                    className="w-full text-base p-3 border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  >
                    <SelectValue placeholder="Select a country or region" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              className="w-full py-4 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
              disabled={!allQuestionsAnswered}
            >
              Continue to Plan Generation
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
