import { generateText } from "ai"
import { google } from "@ai-sdk/google" // Import google from @ai-sdk/google
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json()

    if (!idea) {
      return NextResponse.json({ error: "Startup idea is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: google("models/gemini-pro"), // Use Gemini Pro model directly
      system: `You are a helpful startup mentor. Based on the user's startup idea, generate 4-5 concise, open-ended follow-up questions that will help gather more information to build a comprehensive business plan. Each question should be on a new line, prefixed with a hyphen.`,
      prompt: `Startup Idea: ${idea}`,
    })

    // Parse the questions from the AI response
    const questions = text
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.startsWith("- ") && q.length > 2)
      .map((q) => q.substring(2).trim()) // Remove the hyphen and space

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error asking questions:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
