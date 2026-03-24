
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AssessmentProps {
  type?: string;
  onClose: () => void;
}

interface TestConfig {
  name: string;
  questions: string[];
  options: { label: string; value: number }[];
  maxScore: number;
}

const TEST_CONFIGS: Record<string, TestConfig> = {
  phq9: {
    name: "Depression Screening (PHQ-9)",
    questions: [
      "Little interest or pleasure in doing things?",
      "Feeling down, depressed, or hopeless?",
      "Trouble falling or staying asleep, or sleeping too much?",
      "Feeling tired or having little energy?",
      "Poor appetite or overeating?",
      "Feeling bad about yourself — or that you are a failure?",
      "Trouble concentrating on things, such as reading or watching TV?"
    ],
    options: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 }
    ],
    maxScore: 21
  },
  gad7: {
    name: "Anxiety Assessment (GAD-7)",
    questions: [
      "Feeling nervous, anxious, or on edge?",
      "Not being able to stop or control worrying?",
      "Worrying too much about different things?",
      "Trouble relaxing?",
      "Being so restless that it is hard to sit still?",
      "Becoming easily annoyed or irritable?",
      "Feeling afraid, as if something awful might happen?"
    ],
    options: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 }
    ],
    maxScore: 21
  },
  pss: {
    name: "Stress Level Test (PSS)",
    questions: [
      "Felt that you were unable to control the important things in your life?",
      "Felt confident about your ability to handle your personal problems?",
      "Felt that things were going your way?",
      "Felt that difficulties were piling up so high that you could not overcome them?"
    ],
    options: [
      { label: "Never", value: 0 },
      { label: "Almost Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Fairly Often", value: 3 },
      { label: "Very Often", value: 4 }
    ],
    maxScore: 16
  },
  who5: {
    name: "Well-being Index (WHO-5)",
    questions: [
      "I have felt cheerful and in good spirits?",
      "I have felt calm and relaxed?",
      "I have felt active and vigorous?",
      "I have woke up feeling fresh and rested?",
      "My daily life has been filled with things that interest me?"
    ],
    options: [
      { label: "At no time", value: 0 },
      { label: "Some of the time", value: 1 },
      { label: "Less than half the time", value: 2 },
      { label: "More than half the time", value: 3 },
      { label: "Most of the time", value: 4 },
      { label: "All of the time", value: 5 }
    ],
    maxScore: 25
  }
};

const Assessment: React.FC<AssessmentProps> = ({ type = 'phq9', onClose }) => {
  const config = TEST_CONFIGS[type] || TEST_CONFIGS.phq9;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < config.questions.length - 1) {
      setStep(step + 1);
    } else {
      generateResult(newAnswers);
    }
  };

  const generateResult = async (finalAnswers: number[]) => {
    setLoading(true);
    try {
      const score = finalAnswers.reduce((a, b) => a + b, 0);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A user just completed a ${config.name} screening with a score of ${score} out of ${config.maxScore}. Provide a gentle, supportive summary (max 150 words) acknowledging their situation and suggesting talking to Intel Counselling. If it is well-being (WHO-5), high scores are good, for others, high scores indicate symptoms.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setResult(response.text || "Thank you for sharing. We recommend speaking with one of our specialists for a deeper conversation.");
    } catch (error) {
      setResult("Thank you for completing the assessment. Your results suggest you might benefit from a consultation with our team.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#F7EBD3] w-full max-w-2xl max-h-[90vh] rounded-[30px] md:rounded-[40px] shadow-2xl overflow-y-auto animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-black/5 rounded-full transition-colors z-10">
          <X size={20} className="md:w-6 md:h-6" />
        </button>

        <div className="p-6 md:p-12">
          {!result && !loading ? (
            <>
              <div className="mb-8 md:mb-12 pt-4">
                <span className="text-terracotta font-bold text-[10px] md:text-xs tracking-widest uppercase">
                  {config.name} • Question {step + 1} of {config.questions.length}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mt-2 leading-tight serif">{config.questions[step]}</h3>
              </div>
              <div className="grid gap-3 md:gap-4">
                {config.options.map((opt) => (
                  <button key={opt.value} onClick={() => handleAnswer(opt.value)} className="w-full text-left p-5 md:p-6 rounded-2xl border-2 border-black/5 hover:border-terracotta hover:bg-terracotta/5 transition-all group flex justify-between items-center bg-white/50">
                    <span className="font-medium text-sm md:text-base group-hover:text-terracotta transition-colors">{opt.label}</span>
                    <ArrowRight size={16} className="md:w-5 md:h-5 opacity-0 group-hover:opacity-100 transition-all text-terracotta" />
                  </button>
                ))}
              </div>
              <div className="mt-8 md:mt-12 h-1 w-full bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-terracotta transition-all duration-500" style={{ width: `${((step + 1) / config.questions.length) * 100}%` }}></div>
              </div>
            </>
          ) : loading ? (
            <div className="py-16 md:py-20 flex flex-col items-center text-center">
              <Loader2 size={48} className="animate-spin text-terracotta mb-6" />
              <h3 className="text-xl md:text-2xl font-bold mb-2 serif">Analyzing...</h3>
              <p className="text-black/60 italic text-sm">Generating an empathetic summary just for you.</p>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 text-terracotta mb-6">
                <Sparkles size={20} />
                <span className="font-bold uppercase tracking-widest text-[10px]">A message for you</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 serif">Assessment Summary</h3>
              <div className="text-black/80 leading-relaxed text-base md:text-lg mb-8 bg-white/40 p-6 rounded-3xl border border-white/60">
                {result?.split('\n').map((line, i) => <p key={i} className="mb-4">{line}</p>)}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={onClose} className="flex-1 bg-intel-dark text-white py-4 rounded-xl font-bold text-sm md:text-base hover:opacity-90 transition-all shadow-lg uppercase tracking-widest">Book a Consultation</button>
                <button onClick={onClose} className="flex-1 border-2 border-black/10 py-4 rounded-xl font-bold text-sm md:text-base hover:bg-black/5 transition-all uppercase tracking-widest">Finish</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
