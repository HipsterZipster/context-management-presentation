import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MonitorPlay, 
  MessageSquare,
  Search,
  Anchor,
  FileCode2,
  Database,
  Layers,
  BarChart3,
  Box,
  Terminal,
  FileText,
  Cpu,
  Zap,
  ShieldCheck,
  Network
} from 'lucide-react';

// --- Advanced Slide Data ---
const slides = [
  {
    id: 1,
    title: 'The AI "Attention Budget"',
    subtitle: 'Token Economics & The Lost-in-the-Middle Phenomenon',
    visualDesc: 'A heatmap showing high recall at the start/end of a context window, and a "valley of death" in the middle.',
    icon: <Database className="w-12 h-12 text-blue-400" />,
    points: [
      'Token Windows: From 128k (GPT-4) to 2M+ (Gemini/Claude).',
      'The Recall Valley: Information in the middle of a large context block has up to 40% lower retrieval accuracy.',
      'Parametric vs. Non-Parametric: Why training weights fail at "Long-Tail" repo specificities.'
    ],
    talkingPoints: [
      "2026 is the year of 'Context Engineering.' Having a 1-million token window doesn't mean the model 'sees' everything equally.",
      "Research shows a 'U-shaped' recall curve. If your critical repo rules are buried in the middle of a 500-file dump, the agent will hallucinate.",
      "We are moving from 'Brute Force Context' to 'Curated Context Injection.'"
    ]
  },
  {
    id: 2,
    title: 'Pull vs. Push: The Latency Gap',
    subtitle: 'RAG Retrieval vs. System Prompt Steering',
    visualDesc: 'A comparison table of Latency, Cost, and Precision.',
    icon: <Zap className="w-12 h-12 text-yellow-400" />,
    customRender: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-800/80 p-5 rounded-xl border border-blue-500/30">
          <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
            <Search className="w-5 h-5" /> Active (RAG/Pull)
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span>Latency</span><span className="text-red-400">1.5s - 4.0s</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span>Token Cost</span><span className="text-emerald-400">Dynamic/Low</span>
            </div>
            <div className="flex justify-between">
              <span>Reliability</span><span className="text-yellow-400">Depends on Embedding Match</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/80 p-5 rounded-xl border border-emerald-500/30">
          <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
            <Anchor className="w-5 h-5" /> Passive (System/Push)
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span>Latency</span><span className="text-emerald-400">0ms (Pre-loaded)</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-1">
              <span>Token Cost</span><span className="text-red-400">Static/High</span>
            </div>
            <div className="flex justify-between">
              <span>Reliability</span><span className="text-emerald-400">99.9% (In-Context Learning)</span>
            </div>
          </div>
        </div>
      </div>
    ),
    talkingPoints: [
      "RAG (Pull) is asynchronous and depends on the agent's ability to 'decide' to search.",
      "System Prompts (Push) utilize 'In-Context Learning.' The model doesn't have to retrieve; the weights are already biased toward your rules before the first token is generated."
    ]
  },
  {
    id: 3,
    title: 'Context Ranking Algorithms',
    subtitle: 'How IDEs Choose What to Send',
    visualDesc: 'A flowchart showing Jaccard Similarity and BM25 ranking.',
    icon: <Network className="w-12 h-12 text-purple-400" />,
    points: [
      'Jaccard Similarity: Comparing "Bag of Words" between your cursor and repo files.',
      'Recentness Bias: Prioritizing the last 5 files touched in the editor.',
      'Dependency Graphing: Following imports to find "Relevant Neighbors."'
    ],
    talkingPoints: [
      "Copilot doesn't send your whole repo. It uses a ranking algorithm to pick the 'Top 20' snippets.",
      "By using AGENTS.md, you bypass this ranking algorithm and ensure your core architecture is ALWAYS in the Top 1 spot."
    ]
  },
  {
    id: 4,
    title: 'Precision Metrics: The 56% Failure',
    subtitle: 'Why Passive Steering Wins in Evals',
    visualDesc: 'A detailed bar chart showing hallucination rates.',
    icon: <BarChart3 className="w-12 h-12 text-pink-400" />,
    customRender: () => (
      <div className="mt-6 space-y-4">
        {[
          { label: 'Baseline (RAG Only)', val: 53, fail: 47, color: 'bg-red-500' },
          { label: 'RAG + Skill Tools', val: 68, fail: 32, color: 'bg-orange-500' },
          { label: 'System Instructions', val: 84, fail: 16, color: 'bg-blue-500' },
          { label: 'AGENTS.md (Unified)', val: 98, fail: 2, color: 'bg-emerald-500' },
        ].map((item, i) => (
          <div key={i} className="group">
            <div className="flex justify-between text-xs mb-1 px-1">
              <span className="text-slate-300 font-semibold">{item.label}</span>
              <span className="text-slate-400">Success: {item.val}%</span>
            </div>
            <div className="w-full h-4 bg-slate-800 rounded-full flex overflow-hidden">
              <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.val}%` }} />
            </div>
          </div>
        ))}
        <p className="text-[10px] text-slate-500 italic mt-2 text-center">Data based on internal benchmarks for Next.js 15 App Router migrations.</p>
      </div>
    ),
    talkingPoints: [
      "The 'Aha' moment: Agents often ignore tools if they feel 'confident' in their training data.",
      "Passive Steering (AGENTS.md) acts as a guardrail that prevents the agent from even considering a hallucinated path."
    ]
  },
  {
    id: 5,
    title: 'The MCP Kitchen',
    subtitle: 'Model Context Protocol (Open Standard)',
    visualDesc: 'A diagram showing a Server-Client-Host relationship.',
    icon: <Box className="w-12 h-12 text-orange-400" />,
    points: [
      'Standardizing Tool-Call discovery across Claude, IDEs, and local DBs.',
      'Modular Context: One MCP server can provide context for Slack, Jira, and GitHub simultaneously.',
      'Reduced "Glue Code": Stop writing custom fetchers for every agent.'
    ],
    talkingPoints: [
      "MCP is the 'USB-C' for AI context. It allows any model to talk to any data source using a standardized JSON-RPC interface.",
      "This is how we move from 'Chatting with a PDF' to 'Giving an Agent a 360-degree view of the business.'"
    ]
  },
  {
    id: 6,
    title: 'Deterministic Agentic Design',
    subtitle: 'From Vibes-Based Prompting to Engineering',
    visualDesc: 'A checklist showing "Strict Schemas," "Error Handling," and "State Management."',
    icon: <ShieldCheck className="w-12 h-12 text-emerald-400" />,
    points: [
      'Task Decomposition: Breaking 1 request into 5 sub-agents.',
      'Self-Correction Loops: Agents running `npm test` and fixing their own errors.',
      'The "Ghosting" Rate: Metrics on how often an agent "gives up" mid-task.'
    ],
    talkingPoints: [
      "Ghosting is the biggest threat to agentic ROI. If an agent fails to complete a task 10% of the time, developers lose trust.",
      "High-depth context reduces ghosting by providing a 'map' for the agent to follow when it gets lost."
    ]
  },
  {
    id: 7,
    title: 'The 10M Token Era',
    subtitle: 'Devin & The Large Context Paradigm',
    visualDesc: 'A comparison of small-window context vs large-window "World State."',
    icon: <Cpu className="w-12 h-12 text-indigo-400" />,
    customRender: () => (
      <div className="mt-6 p-6 bg-slate-800/50 rounded-xl border-l-4 border-indigo-500">
        <h4 className="text-indigo-400 font-bold mb-2 uppercase text-xs tracking-widest">Architectural Shift</h4>
        <p className="text-slate-200 text-sm leading-relaxed">
          While Copilot focuses on <span className="text-white font-bold">Local File Context</span> (200k tokens), Devin maintains a <span className="text-white font-bold">Stateful Session</span> with access to full terminal history, browser snapshots, and a 10M+ token 'World State.'
        </p>
        <div className="mt-4 flex gap-4 text-[10px] font-mono">
          <div className="bg-slate-900 p-2 rounded">COPILOT: Jaccard-Ranked snippets</div>
          <div className="bg-slate-900 p-2 rounded">DEVIN: Full Repo Serialization</div>
        </div>
      </div>
    ),
    talkingPoints: [
      "In the 10M token era, the bottleneck is no longer 'What fits?', but 'What is true?'",
      "Large context models are more prone to 'Distraction.' Detailed instruction files are the only way to keep them focused on the intended architecture."
    ]
  },
  {
    id: 8,
    title: 'Strategic Implementation',
    subtitle: 'The 2026 Context Roadmap',
    visualDesc: 'A roadmap diagram: Foundation -> Scoping -> Agentification.',
    icon: <MonitorPlay className="w-12 h-12 text-emerald-400" />,
    points: [
      'Phase 1: Deploy /llms.txt for all public and internal dependency docs.',
      'Phase 2: Establish root-level AGENTS.md for repo-wide "Source of Truth."',
      'Phase 3: Implement MCP servers for dynamic enterprise data retrieval.'
    ],
    customRender: () => (
      <div className="mt-8 p-6 bg-indigo-900/20 border-2 border-indigo-500/50 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-indigo-400 mb-2">The ROI Metric</h3>
        <p className="text-xl text-indigo-100 italic">"Good context turns a $20/mo Copilot into a $200k/yr Senior Engineer."</p>
      </div>
    ),
    talkingPoints: [
      "The goal is 'Zero-Shot Accuracy.' Every time a dev has to fix an AI hallucination, the ROI drops.",
      "Investing 1 day into your context architecture saves 1,000 developer hours per year."
    ]
  }
];

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  
  const safeIndex = Math.min(Math.max(0, currentSlideIndex), slides.length - 1);
  const slide = slides[safeIndex];

  const nextSlide = () => {
    if (safeIndex < slides.length - 1) setCurrentSlideIndex(safeIndex + 1);
  };

  const prevSlide = () => {
    if (safeIndex > 0) setCurrentSlideIndex(safeIndex - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans flex flex-col items-center justify-center p-4 md:p-8 selection:bg-indigo-500/30">
      
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8 z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1 w-8 bg-indigo-500 rounded-full" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-indigo-400">Engineering Deep Dive</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">The Architecture of Context</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${showNotes ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'}`}
          >
            <MessageSquare className="w-4 h-4" />
            {showNotes ? 'Notes Visible' : 'Speaker Notes'}
          </button>
        </div>
      </div>

      {/* Main Presentation Area */}
      <div className="w-full max-w-6xl bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[580px] z-10 transition-all duration-500 group">
        
        {/* Slide Content */}
        <div className={`p-10 md:p-16 flex-1 flex flex-col justify-center transition-all duration-500 ${showNotes ? 'md:w-[60%]' : 'w-full'}`}>
          <div className="mb-10 inline-flex items-center justify-center bg-indigo-500/10 p-5 rounded-3xl border border-indigo-500/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
            {slide.icon}
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-3 leading-[1.1]">
            {slide.title}
          </h2>
          {slide.subtitle && (
            <h3 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 font-bold mb-10">
              {slide.subtitle}
            </h3>
          )}

          {slide.points && !slide.customRender && (
            <ul className="space-y-6 mb-10">
              {slide.points.map((point, idx) => (
                <li key={idx} className="flex items-start text-lg md:text-xl text-slate-300 font-medium leading-relaxed">
                  <div className="mr-5 mt-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex-shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {slide.points && slide.customRender && (
             <ul className="space-y-4 mb-8">
             {slide.points.map((point, idx) => (
               <li key={idx} className="flex items-start text-base text-slate-400 font-medium leading-relaxed">
                 <div className="mr-3 mt-2 w-2 h-2 rounded-full bg-slate-600 flex-shrink-0" />
                 <span>{point}</span>
               </li>
             ))}
           </ul>
          )}

          {slide.customRender && slide.customRender()}

          <div className="mt-auto pt-10 flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest border-t border-slate-800/50">
            <MonitorPlay className="w-4 h-4 text-indigo-500" />
            <span>Visualization Strategy: <span className="text-slate-300">{slide.visualDesc}</span></span>
          </div>
        </div>

        {/* Speaker Notes Sidebar */}
        {showNotes && (
          <div className="w-full md:w-[40%] bg-slate-900/80 backdrop-blur-xl border-t md:border-t-0 md:border-l border-slate-800 p-10 flex flex-col overflow-y-auto max-h-[500px] md:max-h-full">
            <h4 className="text-indigo-400 font-black tracking-[0.2em] uppercase text-xs mb-6 flex items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              Expert Insight & Commentary
            </h4>
            <div className="space-y-6">
              {slide.talkingPoints.map((note, idx) => (
                <div key={idx} className="relative group">
                   <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500/20 group-hover:bg-indigo-500 transition-colors" />
                   <p className="text-slate-200 text-lg font-medium leading-relaxed pl-2">
                    {note}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
               <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-2">Technical Note</span>
               <p className="text-xs text-slate-400 leading-relaxed italic">
                 Ensure the model temperature is set to &lt; 0.2 for these architectural evaluations to minimize stochastic variance in recall metrics.
               </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="w-full max-w-6xl mt-10 flex items-center justify-between z-10">
        <div className="flex gap-4">
          <button 
            onClick={prevSlide} 
            disabled={safeIndex === 0}
            className="p-4 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-20 disabled:cursor-not-allowed rounded-2xl text-white transition-all border border-slate-700 shadow-xl hover:-translate-x-1 active:scale-95"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button 
            onClick={nextSlide} 
            disabled={safeIndex === slides.length - 1}
            className="p-4 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-20 disabled:cursor-not-allowed rounded-2xl text-white transition-all border border-slate-700 shadow-xl hover:translate-x-1 active:scale-95"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
        
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
               <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Progress</span>
               <div className="text-white font-black bg-indigo-600 px-4 py-1.5 rounded-full text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                  {safeIndex + 1} / {slides.length}
               </div>
            </div>
            <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500 ease-out" 
                    style={{ width: `${((safeIndex + 1) / slides.length) * 100}%` }}
                />
            </div>
        </div>
      </div>
      
    </div>
  );
}   