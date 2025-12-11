import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isValid: {
      type: Type.BOOLEAN,
      description: "Set to FALSE if the user input is gibberish, random numbers, too short to be meaningful, or completely unrelated to research/tech. Otherwise TRUE.",
    },
    validationFeedback: {
      type: Type.STRING,
      description: "If isValid is false, explain why and ask the user to revise. If isValid is true, leave empty or null.",
      nullable: true,
    },
    generatedAbstract: {
      type: Type.STRING,
      description: "If mode is 'Ideation' and valid, this is the generated abstract. Else null.",
      nullable: true,
    },
    keywords: {
      type: Type.ARRAY,
      description: "3-4 core technical keywords extracted from the idea.",
      items: { type: Type.STRING },
      nullable: true,
    },
    trendMatchScore: {
      type: Type.INTEGER,
      description: "Strict Match score (0-100). 50 is average. 80+ is rare/exceptional. Do not inflate.",
      nullable: true,
    },
    oneLiner: {
      type: Type.STRING,
      description: "A punchy one-sentence summary.",
      nullable: true,
    },
    methodology: {
      type: Type.OBJECT,
      description: "Proposed methodology visualization and description.",
      properties: {
        mermaidCode: { type: Type.STRING, description: "Professional Mermaid.js 'graph TD' code. MUST use 'subgraph' to group components. MUST use 'classDef' for modern styling (rounded corners, pastel colors). MUST use distinct shapes (cylinder for data, rhombus for decision)." },
        description: { type: Type.STRING, description: "Brief text explanation of the methodology figure." }
      },
      nullable: true,
    },
    conferences: {
      type: Type.ARRAY,
      description: "Top 3 recommended conferences.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Conference Name (e.g. CVPR 2026)" },
          url: { type: Type.STRING, description: "Official homepage URL" },
          reason: { type: Type.STRING, description: "Why it fits" },
          relevantPapers: {
            type: Type.ARRAY,
            description: "3 REAL, EXISTING papers relevant to this specific conference.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Exact title of a real existing paper." },
                year: { type: Type.INTEGER },
                oneLiner: { type: Type.STRING, description: "A very short takeaway." },
                abstract: { type: Type.STRING, description: "2-3 sentences summary of the paper." },
                github: { type: Type.STRING, description: "Leave empty/null if unsure. Do not hallucinate." },
              },
              required: ["title", "year", "oneLiner", "abstract"],
            },
          },
        },
        required: ["name", "url", "reason", "relevantPapers"],
      },
      nullable: true,
    },
    metrics: {
      type: Type.ARRAY,
      description: "5 radar chart metrics.",
      items: {
        type: Type.OBJECT,
        properties: {
          metric: { type: Type.STRING },
          value: { type: Type.INTEGER },
        },
        required: ["metric", "value"],
      },
      nullable: true,
    },
    roadmap: {
      type: Type.ARRAY,
      description: "Implementation roadmap steps.",
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          description: { type: Type.STRING },
          timeline: { type: Type.STRING },
        },
        required: ["phase", "description", "timeline"],
      },
      nullable: true,
    },
  },
  required: ["isValid"],
};

export const analyzeResearch = async (
  input: string, 
  mode: 'idea' | 'abstract', 
  isFastTrack: boolean
): Promise<AnalysisResult> => {
  try {
    const simulatedDate = "December 2025";
    
    let prompt = "";
    
    if (mode === 'idea') {
      prompt = `
      User Input Topic: "${input}"
      MODE: Ideation. 
      STEP 1: Validate input. If meaningful, generate a high-quality, novel SOTA-level research abstract based on this topic.
      STEP 2: Analyze the generated abstract.
      `;
    } else {
      prompt = `
      User Input Abstract: "${input}"
      MODE: Evaluation.
      STEP 1: Validate input. If meaningful, analyze the provided abstract directly.
      `;
    }

    prompt += `
      CONFIG:
      - Fast Track Mode: ${isFastTrack}
      - Current Simulated Date: ${simulatedDate}
      
      Task Guidelines:
      1. VALIDATION (CRITICAL):
         - Check if the input is nonsense (e.g. "1234", "asdf"), profane, or completely unrelated to research/science.
         - If Invalid: Set "isValid" to false.

      2. SCORING (STRICT & OBJECTIVE):
         - Trend Match Score & Radar Metrics must be OBJECTIVE. 
         - 50% = Average. 85%+ = Exceptional.

      3. Content Generation (Only if Valid):
         - Methodology Figure: 
             - Create a HIGHLY DETAILED Mermaid.js 'graph TD'. 
             - Use 'subgraph' to organize logical blocks (e.g., 'Encoder', 'Latent Space', 'Decoder'). 
             - Define and Apply classes: 
               classDef data fill:#e0f2f1,stroke:#00695c,stroke-width:2px;
               classDef process fill:#fff3e0,stroke:#e65100,stroke-width:2px;
               classDef model fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
             - Assign these classes to nodes to make it visually professional.
         - Conferences & Papers: 
             - IF Fast Track: Deadlines in Jan/Feb 2026.
             - FIND REAL PAPERS: Provide 3 *existing* papers that actually exist in the real world. 
             - Do NOT hallucinate GitHub links unless you are 100% certain.

      Return the result in strict JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are the 'Research Vibe Navigator,' a strict AI research evaluator. You provide professional, modern visualizations and cite REAL research papers.",
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text) as AnalysisResult;
      if (parsed.isValid) {
        parsed.keywords = parsed.keywords || [];
        parsed.conferences = parsed.conferences || [];
        parsed.metrics = parsed.metrics || [];
        parsed.roadmap = parsed.roadmap || [];
        parsed.methodology = parsed.methodology || { mermaidCode: "", description: "" };
      }
      return parsed;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
