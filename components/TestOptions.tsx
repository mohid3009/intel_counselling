
import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles, Brain, Activity, Heart, Zap, ArrowRight } from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import FadeIn from './FadeIn';

interface TestOptionsProps {
  onBack: () => void;
  onSelectTest: (type: string) => void;
}

const TestOptions: React.FC<TestOptionsProps> = ({ onBack, onSelectTest }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const tests = [
    {
      id: 'phq9',
      title: 'Depression Screening',
      shortTitle: 'PHQ-9',
      desc: 'A clinical standard for assessing mood, interest, and energy levels.',
      icon: <Brain size={28} />,
      color: 'bg-terracotta'
    },
    {
      id: 'gad7',
      title: 'Anxiety Assessment',
      shortTitle: 'GAD-7',
      desc: 'Screen for generalized anxiety disorder and daily worry patterns.',
      icon: <Zap size={28} />,
      color: 'bg-[#2D6A4F]'
    },
    {
      id: 'pss',
      title: 'Stress Level Test',
      shortTitle: 'PSS',
      desc: 'Measure the degree to which situations in your life are appraised as stressful.',
      icon: <Activity size={28} />,
      color: 'bg-terracotta'
    },
    {
      id: 'who5',
      title: 'Well-being Index',
      shortTitle: 'WHO-5',
      desc: 'A brief measure of current subjective psychological well-being.',
      icon: <Heart size={28} />,
      color: 'bg-[#2D6A4F]'
    }
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-12 md:pt-32 md:pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-intel-dark/40 hover:text-terracotta font-black transition-all mb-12 md:mb-16 uppercase tracking-[0.3em] text-xs"
        >
          <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center group-hover:border-terracotta transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to Home
        </button>

        <div className="text-center mb-16 md:mb-24">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-intel-dark border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-6 shadow-xl">
              <Sparkles size={14} className="animate-pulse" />
              Free Self-Assessments
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-intel-dark serif mb-8 leading-tight">
              Start your journey <br /> to <span className="italic text-terracotta">clarity.</span>
            </h1>
            <p className="text-intel-dark/60 max-w-2xl mx-auto text-base md:text-xl font-light leading-relaxed">
              Choose from our validated screening tools to better understand your emotional landscape. Results are for guidance and do not replace clinical diagnosis.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-12">
          {tests.map((test, idx) => (
            <FadeIn key={test.id} delay={idx * 150}>
              <div 
                onClick={() => onSelectTest(test.id)}
                className="group cursor-pointer h-full"
              >
                <SpotlightCard className="bg-[#1C1F22] border border-white/10 h-full p-8 md:p-12 rounded-[40px] md:rounded-[60px] shadow-2xl transition-all duration-700 hover:scale-[1.02] flex flex-col items-start text-left">
                  <div className={`w-14 h-14 md:w-20 md:h-20 ${test.color} text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110`}>
                    {test.icon}
                  </div>
                  
                  <div className="flex-grow">
                    <span className="text-[10px] md:text-xs font-black text-terracotta uppercase tracking-[0.3em] mb-3 block font-inter">
                      {test.shortTitle}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-black text-white serif mb-4 group-hover:text-terracotta transition-colors">
                      {test.title}
                    </h3>
                    <p className="text-white/60 font-light leading-relaxed text-sm md:text-lg mb-10 group-hover:text-white/80 transition-colors">
                      {test.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-white font-black text-xs md:text-sm uppercase tracking-widest mt-auto border-b-2 border-transparent group-hover:border-terracotta transition-all">
                    Start Test <ArrowRight size={16} />
                  </div>
                </SpotlightCard>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-16 md:mt-24 p-8 md:p-16 bg-intel-dark rounded-[50px] md:rounded-[80px] text-white text-center relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[120px] -mr-32 -mt-32 opacity-40"></div>
           <div className="relative z-10">
             <h3 className="text-2xl md:text-4xl font-black serif mb-6">Need immediate support?</h3>
             <p className="text-white/60 text-sm md:text-lg font-light max-w-xl mx-auto mb-10 leading-relaxed">
               Self-assessments are a great first step, but speaking with a professional provides the depth you deserve.
             </p>
             <button className="bg-terracotta text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
               Book a Professional Session
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TestOptions;
