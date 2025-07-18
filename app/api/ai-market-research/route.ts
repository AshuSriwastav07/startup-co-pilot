import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

// Initialize Google AI model
const geminiPro = google("gemini-2.5-pro")

export async function POST(req: NextRequest) {
  try {
    const { idea, ideaCategory, problem, answers, location } = await req.json()

    if (!idea || !answers) {
      console.error("Missing idea or answers in AI market research request.")
      return NextResponse.json({ error: "Startup idea and answers are required" }, { status: 400 })
    }

    const teamSize = answers.q1 || "Not specified"
    const launchType = answers.q3 || "Not specified"
    const funding = answers.q6 || "Not specified"
    const marketResearchAnswer = answers.q5 || "Not specified"
    const userLocation = location || "Not specified" // Use a different variable name to avoid conflict with prompt variable

    const aiPrompt = `You are a highly precise market researcher and startup analyst.

Your task is to generate a **comprehensive and realistic market research report** for a startup idea. This report must be formatted as a **single, raw JSON object**. Do not include any conversational text, preambles, or markdown code blocks (like \`\`\`json) outside of the JSON itself. The JSON object should contain two keys: \`report\` (string, containing the full market research in Markdown format) and \`marketGrowthData\` (array of objects, each with \`year\` and \`value\`).

**Strictly adhere to the JSON format. If you cannot find data for a section, state "Data not available" or "N/A" within the report string, but do not break the JSON structure.**

Search about the idea on internet and get some if data related of sector growth and shows.

**IMPORTANT:** In all monetary values, market size, and funding data, use the currency of the user's selected country/region (${userLocation}) instead of US dollars. If the currency is not obvious, use the most common local currency for that country. Always show the currency symbol or abbreviation (e.g., INR, EUR, GBP, etc.).

**Content for the "report" key (in Markdown format):**

### 🔍 STEP 1: UNDERSTANDING THE IDEA
Write a 3–4 line summary covering:
- What the idea is
- What industry or category it fits in
- What pain point it solves
- Who the target users are

---

### 📊 STEP 2: COMPETITOR LANDSCAPE
Do **real competitive research** and include **9-13 well-known or niche competitors** working in the **same or similar space**. Of these, at least **8 should be international/global competitors** and the remaining should be from the **same country/region as the user (selected country: ${userLocation})**.
For each competitor include:
- Name of company or product
- Official website link
- What it offers (1-line description)
- Country or region
- Growth level (e.g. Early, Growing, Established, Declining)
- Known funding stage or capital raised (if publicly available)

🧾 **Describe a table like this**:
> Table 1: Competitive Landscape
> Columns: Name | Website | What they do | Region | Growth | Funding

---

### 📈 STEP 3: MARKET SIZE & TRENDS
Estimate and explain:
- Global market size (in USD)
- Number of users, businesses, or customers this segment has
- Current annual growth rate or trend
- Fastest-growing regions or user segments
- Main technologies disrupting this space (if any)
- **Specific insights for ${userLocation}**: How does the market in ${userLocation} compare? What are the local trends, opportunities, and challenges?

📊 **Describe a chart** like this:
> Chart 1: Market Growth Over Time (2020–2024)
> X-axis: Year
> Y-axis: Market Value (in billions USD)

Also include **realistic trend sources** (e.g., AI, SaaS, e-commerce shift, remote work, creator economy, etc.)

---

### ⚔️ STEP 4: STRATEGIC COMPARISON
Show how the user’s idea compares with top competitors:
- What unique value or gap it targets
- What features it improves
- Any clear competitive disadvantages or risks
- Opportunities where others are weak
- **Location-specific competitive advantages/disadvantages in ${userLocation}**.

Use another small table to highlight this:
> Table 2: Strategic Positioning
> Columns: Feature | Our Idea | Competitors

---

### 🚀 STEP 5: GROWTH POTENTIAL
Explain:
- Can this grow to a startup with global scale?
- Can it integrate with AI, automation, creator tools, or enterprise software?
- Which other sectors or products could be combined to grow faster?
- What would a strong go-to-market strategy look like?
- **Considerations for scaling in ${userLocation} or expanding from ${userLocation}**.

---

### 📌 FINAL INSIGHT
Close with:
- Scalability: low / medium / high
- Investor readiness: early idea / MVP / growth-ready
- Strengths and weaknesses
- One strong recommendation for the founder
- **Summary of location-specific factors for ${userLocation}**.

---

### 📎 USER INPUT
Use this data to personalize analysis:
- Idea Summary: ${idea}
- Category: ${ideaCategory}
- Problem: ${problem}
- Team Size: ${teamSize}
- Launch Type: ${launchType}
- Funding Type: ${funding}
- Market Research Done: ${marketResearchAnswer}
- Location: ${userLocation}

---

🔍 IMPORTANT RESEARCH TASKS (BEFORE WRITING):
- Search for products/apps/startups with similar functionality or audience.
- Identify how big the segment or market is and its real-time growth.
- Use real names, links, public data (e.g., funding, usage, website).
- Look for potential cross-industry opportunities (e.g., combine with AI, analytics, e-commerce, SaaS).
- Mention top competitors and their edge.
- Identify which models or features are growing in the market.
- **Research specific market conditions, competition, and funding landscape in ${userLocation}**.

📝 FORMAT TIPS FOR REPORT:
- Use headings (###) and bullet points.
- Be detailed and realistic.
- Focus on **real-world data**, not just hypothetical AI output.
- Competitor names and websites are important.
- Use basic business terms, avoid overly technical explanations.

`

    console.log("Sending prompt to AI for market research...")
    const { text: aiResponseText } = await generateText({
      model: geminiPro,
      prompt: aiPrompt,
      temperature: 0.5,
    })
    console.log("Received AI response for market research.")
    console.log("Raw AI Response Text:", aiResponseText) // Log the raw response

    let parsedResponse: { report: string; marketGrowthData: { year: number; value: number }[] }

    try {
      // Robustly extract JSON: find the first '{' and the last '}'
      const jsonStartIndex = aiResponseText.indexOf("{")
      const jsonEndIndex = aiResponseText.lastIndexOf("}")

      if (jsonStartIndex === -1 || jsonEndIndex === -1) {
        throw new Error("Could not find valid JSON object in AI response.")
      }

      const jsonString = aiResponseText.substring(jsonStartIndex, jsonEndIndex + 1)
      console.log("Extracted JSON String:", jsonString) // Log the extracted string before parsing
      parsedResponse = JSON.parse(jsonString)
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e)
      // Fallback if AI doesn't return valid JSON, treat entire response as report
      // This will prevent a 500 error, but the chart data will be missing.
      return NextResponse.json({ insight: aiResponseText, marketGrowthData: [] })
    }

    return NextResponse.json({
      insight: parsedResponse.report,
      marketGrowthData: parsedResponse.marketGrowthData,
    })
  } catch (error) {
    console.error("Error in AI market research API:", error)
    // Ensure a 500 response is sent if an unexpected error occurs
    return NextResponse.json({ error: "Failed to perform AI market research" }, { status: 500 })
  }
}
