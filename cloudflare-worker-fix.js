// ===================================================
// Cloudflare Worker — Gemini API Version
// ===================================================
// DEPLOY THIS in your Cloudflare Worker dashboard.
//
// SETUP:
// 1. Go to Worker Settings → Variables
// 2. Add a Secret: GEMINI_API_KEY = your Google AI API key
// 3. Deploy this code
// ===================================================

export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {

      if (request.method === "POST" && request.url.includes("/generate")) {

        const { idea } = await request.json();

        const prompt = `
You are an elite startup strategist, product manager, and YC-level founder.

Your job is NOT to give generic advice.
Your job is to turn an idea into a REAL, EXECUTABLE startup plan with deep insight.

You MUST:
- Think about real-world market conditions
- Identify specific user behavior and pain points
- Avoid generic answers
- Provide actionable, build-ready output

-------------------------------------

IDEA:
${idea}

-------------------------------------

ANALYZE BEFORE ANSWERING:

1. Who EXACTLY needs this? (be specific, not "general users")
2. What REAL problem are they facing?
3. Why would they switch to this product?
4. What makes this idea DIFFERENT from existing solutions?
5. How can this realistically make money?
6. What are the biggest risks/failure points?
7. What is the FASTEST way to build and launch this?

-------------------------------------

RETURN ONLY VALID JSON (NO TEXT, NO MARKDOWN, NO CODE BLOCKS, NO BACKTICKS)

STRUCTURE:

{
  "idea_summary": "refined version of the idea in one clear sentence",
  "target_user": ["very specific user segments (age, context, behavior)"],
  "problem": ["real, painful problems users face"],
  "solution": "clear explanation of the product and why it is valuable",
  "unique_angle": "what makes this different from competitors",
  "market_insight": ["realistic observations about demand, trends, or behavior"],
  "features": ["specific MVP features (not vague)"],
  "monetization": ["realistic ways this can make money"],
  "distribution": ["how to get first 100 users (real strategies)"],
  "risks": ["real reasons this might fail"],
  "tech_stack": ["practical technologies to build this fast"],
  "execution_plan": {
    "goal": "what success looks like in 14 days",
    "daily_checklist": [
      { "day": 1, "task": "very specific actionable task" },
      { "day": 2, "task": "very specific actionable task" },
      { "day": 3, "task": "very specific actionable task" },
      { "day": 4, "task": "very specific actionable task" },
      { "day": 5, "task": "very specific actionable task" },
      { "day": 6, "task": "very specific actionable task" },
      { "day": 7, "task": "very specific actionable task" },
      { "day": 8, "task": "very specific actionable task" },
      { "day": 9, "task": "very specific actionable task" },
      { "day": 10, "task": "very specific actionable task" },
      { "day": 11, "task": "very specific actionable task" },
      { "day": 12, "task": "very specific actionable task" },
      { "day": 13, "task": "very specific actionable task" },
      { "day": 14, "task": "launch or validation milestone" }
    ]
  }
}

IMPORTANT RULES:
- Do NOT use generic words like "build UI", "research market"
- Each task must be something a founder can ACTUALLY DO
- Keep answers concise but high-value
- Think like a founder trying to LAUNCH FAST
- You MUST include all 14 days in daily_checklist
- Return ONLY the raw JSON object, absolutely no other text or formatting
`;

        // Gemini API call
        const aiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }]
                }
              ],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7
              }
            })
          }
        );

        const data = await aiResponse.json();

        // If Gemini returned an error
        if (data.error) {
          return new Response(JSON.stringify({
            success: false,
            error: data.error.message || "Gemini API error",
            debug: data.error
          }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        let parsed;

        try {
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!text) {
            return new Response(JSON.stringify({
              success: false,
              error: "No content in Gemini response",
              debug_response: data
            }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
          }

          // Clean any markdown formatting Gemini might add
          const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
          parsed = JSON.parse(cleaned);
        } catch (parseErr) {
          return new Response(JSON.stringify({
            success: false,
            error: "Failed to parse Gemini response as JSON",
            raw_text: data.candidates?.[0]?.content?.parts?.[0]?.text || "empty",
            debug: parseErr.message
          }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        return new Response(JSON.stringify({
          success: true,
          data: parsed
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({
        success: false,
        message: "Route not found"
      }), {
        status: 404,
        headers: corsHeaders
      });

    } catch (err) {

      return new Response(JSON.stringify({
        success: false,
        error: err.message
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
