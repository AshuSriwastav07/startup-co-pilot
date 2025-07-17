import { generateText } from "ai"
import { google } from "@ai-sdk/google" // Import google from @ai-sdk/google
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { idea, answers, ideaCategory, location } = await req.json()

    if (!idea || !answers) {
      return NextResponse.json({ error: "Idea and answers are required" }, { status: 400 })
    }

    const promptText = `You are an expert startup mentor and business analyst.

A user has submitted an idea and answered a few structured questions. Your job is to analyze this information and generate a **detailed, beginner-friendly, professional explanation** of the idea. Use clear and simple language.

---

🔎 Step 1: Classify the Idea Type  
Based on the user’s description, determine what kind of idea this really is:
- a full startup idea  
- a mobile/web app idea  
- a digital tool or product  
- a service-based idea  
- or another type (e.g., platform, B2B solution, etc.)

📌 Step 2: If the user selected **"Startup Idea"** but the actual content sounds more like an **app, tool, or service**, gently explain this at the beginning. Mention that while it may be categorized as a startup, it is currently better positioned as a tool/service, which can evolve into a full startup with proper scaling, market entry, and funding.

---

📝 Step 3: Write a clean and structured explanation in simple but professional language. Include the following:

1. **Overview**  
   - What is the core idea? (1–2 lines)  
   - What industry or segment it fits into  

2. **Problem Solved**  
   - What specific problem does it address?  
   - Why is this problem worth solving?

3. **Target Audience**  
   - Who is this idea meant for? (individuals, companies, creators, students, etc.)  
   - Which regions or markets does it apply to? Use the provided location to personalize.

4. **Growth Potential**  
   - How could this idea evolve or scale over time?  
   - Could it become a larger product or startup in the future?

5. **Business Model Direction**  
   - What kind of model could work well? (e.g., freemium, SaaS subscription, service fee, B2B licensing, ads, API usage, commission, marketplace, etc.)  
   - Mention any specific preferences shared by the user in their answers.

6. **User Input-Based Insight**  
   - Mention any relevant insight based on:  
     - Team size  
     - Launch stage (idea/MVP/soft-launch)  
     - Funding type (use Selected Country currency)
     - Market research answer  
     - Currency/local relevance (use location-based currency in your explanation)

---

📎 DATA PROVIDED:  
- Idea Summary: ${idea}  
- Detected Category: ${ideaCategory}  
- Team Size: ${answers.q1}  
- Scale Level: ${answers.q2}  
- Launch Type: ${answers.q3}  
- Model Preference: ${answers.q4}  
- Market Research: ${answers.q5}  
- Funding: ${answers.q6}  
- Problem Solved: ${answers.q7}  
- Location: ${location}  

Use this data to personalize the explanation.

---

✅ Output Format:  
- Use clear section titles  
- Write in short paragraphs  
- Avoid jargon unless it's explained  
- Use real currency and economic references based on user's country  
- Keep tone motivational but grounded in real business reasoning  
- Do **not** ask questions, do **not** give suggestions — only provide the explanation.

Only return the explanation. No extra wrapping.`

    const { text } = await generateText({
      model: google("gemini-2.5-pro"), // Corrected model name for Gemini Flash
      prompt: promptText,
    })

    return NextResponse.json({ explanation: text })
  } catch (error) {
    console.error("Error generating explanation:", error)
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 })
  }
}
