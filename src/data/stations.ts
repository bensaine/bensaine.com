export interface StationData {
  id: string;
  title: string;
  subtitle: string;
  color: number;
  colorHex: string;
  geometry: 'icosahedron' | 'torusKnot' | 'octahedron' | 'dodecahedron' | 'icosahedronLow';
  position: [number, number, number];
  description: string;
}

// Stations sit on the raised object path between the ridge (z=-22) and the fire (z=-5).
// They're the "real objects" whose shadows the prisoners see on the wall.
export const STATIONS: StationData[] = [
  {
    id: 'interpretability',
    title: 'Mechanistic Interpretability',
    subtitle: 'Mila · 2024–present',
    color: 0x7eb8ff,
    colorHex: '#7eb8ff',
    geometry: 'icosahedron',
    position: [-2.5, 0, -18],
    description:
      'Research at Mila into understanding the internal mechanisms of large language models. ' +
      'Looking past the shadows of outputs to see what\'s actually happening inside - ' +
      'attention heads, circuits, and the geometry of representation.',
  },
  {
    id: 'rag-pipeline',
    title: 'Agent Framework & RAG Pipeline',
    subtitle: 'Coveo · 2023–2024',
    color: 0xff7a55,
    colorHex: '#ff7a55',
    geometry: 'torusKnot',
    position: [2.5, 0, -15],
    description:
      'Redesigned a 17,000-line monolithic ML service into a composable agent framework. ' +
      'Built a retrieval-augmented generation pipeline with multi-modal retrieval, ' +
      'chunk-level re-ranking, and a clean abstraction layer for plugging in new retrievers.',
  },
  {
    id: 'ai-avatars',
    title: 'Conversational AI Avatars',
    subtitle: 'Shared Reality Lab · McGill · 2023',
    color: 0x55ffa8,
    colorHex: '#55ffa8',
    geometry: 'octahedron',
    position: [-2, 0, -12],
    description:
      'Long-term memory architecture for conversational agents supporting elderly patients. ' +
      'Maintained coherent context across sessions, reduced response latency by 58%, ' +
      'and deployed into a clinical pilot with real users.',
  },
  {
    id: 'ml-observability',
    title: 'ML Observability at Scale',
    subtitle: 'Coveo MLOps · 2022–2023',
    color: 0xffcc44,
    colorHex: '#ffcc44',
    geometry: 'dodecahedron',
    position: [2, 0, -10],
    description:
      'Built an observability platform monitoring thousands of production ML models. ' +
      'Automated health dashboards, drift detection, and CI/CD pipelines that cut ' +
      'deployment time from 60 minutes to 12.',
  },
  {
    id: 'speech-analytics',
    title: 'Speech Analytics Pipeline',
    subtitle: 'Pleio · 2022',
    color: 0xcc88ff,
    colorHex: '#cc88ff',
    geometry: 'icosahedronLow',
    position: [0, 0, -8],
    description:
      'End-to-end pipeline for analyzing customer service call recordings. ' +
      'Real-time transcription, sentiment analysis, and automated insight extraction ' +
      'across tens of thousands of calls per day.',
  },
];
