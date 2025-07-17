import { generateText } from "ai"
import { google } from "@ai-sdk/google" // Import google from @ai-sdk/google
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { idea, answers } = await req.json()

    if (!idea || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Idea and answers are required" }, { status: 400 })
    }

    const combinedPrompt = `
      You are a startup mentor. Based on the following startup idea and the user's answers to follow-up questions, generate a complete, detailed, and well-structured startup plan.
      Ensure the plan includes the following sections with clear headings:

      - Startup Summary
      - Industry & Target Market
      - Market Research
      - Competitor Overview
      - Business Model Suggestions
      - Revenue Model
      - Required Tools & Team
      - Funding Suggestions
      - Step-by-Step Execution Plan
      - Timeline for Launch
      - Budget Forecast

      ---
      Startup Idea: ${idea}

      User Answers:
      ${answers.map((answer: string, index: number) => `${index + 1}. ${answer}`).join("\n")}
      ---

      Please provide the plan in a clear, readable text format, using markdown headings for each section.
    `

    const { text } = await generateText({
      model: google("models/gemini-pro"), // Use Gemini Pro model directly
      prompt: combinedPrompt,
    })

    return NextResponse.json({ plan: text })
  } catch (error) {
    console.error("Error generating plan:", error)
    return NextResponse.json({ error: "Failed to generate startup plan" }, { status: 500 })
  }
}
