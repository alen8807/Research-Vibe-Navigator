export interface RadarMetric {
  metric: string;
  value: number;
}

export interface RoadmapStep {
  phase: string;
  description: string;
  timeline: string;
}

export interface Paper {
  title: string;
  year: number;
  oneLiner: string;
  abstract: string;
  github: string;
}

export interface Methodology {
  mermaidCode: string;
  description: string;
}

export interface ConferenceRecommendation {
  name: string;
  url: string;
  reason: string;
  relevantPapers: Paper[];
}

export interface AnalysisResult {
  isValid: boolean;
  validationFeedback?: string;
  generatedAbstract?: string;
  keywords: string[];
  trendMatchScore: number;
  oneLiner: string;
  conferences: ConferenceRecommendation[];
  metrics: RadarMetric[];
  roadmap: RoadmapStep[];
  methodology: Methodology;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}
