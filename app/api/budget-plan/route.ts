import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

// Initialize Google AI model
const geminiPro = google("gemini-2.5-pro")

export async function POST(req: NextRequest) {
  try {
    const { idea, answers, location, problem } = await req.json()

    if (!idea || !answers || !location || !problem) {
      return NextResponse.json({ error: "Idea, answers, location, and problem are required" }, { status: 400 })
    }

    const budgetPlanningPrompt = `You are a senior startup advisor and financial planner. A user has submitted a business or startup idea with limited budget. Your job is to write a clear, simple, and well-structured **budget plan and startup launch strategy**, customized to the user's idea and country.

💡 Purpose: Help early-stage founders understand **how to start, where to spend, how much to spend**, and **how to grow smartly** with minimal resources.

---

📌 INSTRUCTIONS:
1. Do not ask the user questions — just write the full explanation.
2. Use currency and examples **based on user's selected location**. For India, use ₹ INR; for USA, use $ USD, etc.
3. Be extremely beginner-friendly and explain terms like MVP, hosting, publishing, etc.
4. Structure the answer in **clearly labeled steps and sections**.
5. Show a strong plan of action with focus on **low cost, smart marketing, and early traction**.

---

📎 USER INPUT (use for context):
- Idea: ${idea}
- Problem Solved: ${problem}
- Location: ${location}
- Team Size: ${answers.q1 || "Not specified"}
- Launch Type: ${answers.q3 || "Not specified"}
- Funding Available: ${answers.q6 || "Not specified"}

---

### 💼 Step 1: Understand the Idea
Briefly explain what the idea is about, what problem it solves, and who it helps. Keep it short and use plain language.

---

### 🚀 Step 2: How to Start
Explain how the founder should start building this idea step-by-step:
- Start with building a Minimum Viable Product (MVP)
- Should they use no-code tools or hire freelancers?
- What are the fastest and cheapest ways to launch this kind of idea?

---

### 💰 Step 3: Smart Budget Planning
Break down the **total available budget** (as per user input) and show how the money should be spent wisely.
**Use this structure:**
> Table 1: Budget Allocation Plan
> Columns: Area | Estimated Cost | Notes
> Rows to include:
> - App or Website Development
> - AI API or Premium Tool Usage (if applicable)
> - Hosting & Domain / App Store Publishing
> - Marketing (Ads + Organic)
> - Design & Branding
> - Emergency or Backup Fund
Use country-specific values, for example:
- In India, Google Play Store publishing fee is around ₹2,500 INR
- Use ₹5,000 to ₹10,000 for simple website development using no-code or AI tools
- Hosting can cost ₹500–₹1000/month in India
- Mention Canva, Figma (free design tools), or Firebase (free tier)

---

### 📣 Step 4: Marketing Strategy
Explain **how to promote the app or website** on a small budget:
- Use free methods: WhatsApp groups, Telegram, Reddit, LinkedIn, Instagram Reels
- Collaborate with student influencers or small content creators
- Join niche communities (e.g., productivity, student forums)
- Create a small referral or rewards system
- Run simple paid ads if possible (₹500–₹1000 budget/month to start)
Also answer this question:
- Should the user hire a marketing agency?
> Clearly say NO unless budget is high or product is already gaining traction.

---

### 📈 Step 5: Growth Strategy
Share smart tips for growth:
- Add user feedback form early on
- Use basic analytics to track installs or visitors
- Join startup accelerators or pitch events for funding
- Consider combining idea with trending tools (AI, automation, productivity bundles)

---

### ✅ Final Insight
Close with a simple summary:
- Is this idea budget-friendly?
- What is the right path for 0-to-1 growth?
- Any risks to avoid?
Keep tone motivational, practical, and beginner-friendly. Only return the full explanation — no bullet prompts or questions.

---

📝 Important:
- Use ₹ for India, $ for US, etc.
- Mention real costs like ₹2500 Play Store fee or free hosting tools.
- Keep tone very clear and helpful for non-technical users.
`

    const { text } = await generateText({
      model: geminiPro,
      prompt: budgetPlanningPrompt,
      temperature: 0.7, // Slightly higher temperature for more creative but still structured output
    })

    return NextResponse.json({ plan: text })
  } catch (error) {
    console.error("Error in budget plan API:", error)
    return NextResponse.json({ error: "Failed to generate budget plan" }, { status: 500 })
  }
}
