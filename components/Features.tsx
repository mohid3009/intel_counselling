
import React, { useState } from 'react';
import { Activity, Lock, HelpCircle, ChevronRight, Brain, Shield, Leaf } from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import FadeIn from './FadeIn';
import SplitText from './SplitText';

const Features: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const approaches = [
    {
      icon: <Activity className="text-terracotta" size={32} />,
      subIcon: <Brain size={22} />,
      title: "Evidence-Based Care",
      desc: "Clinical techniques grounded in the latest psychological research.",
      details: ["CBT & DBT Integration", "Research-Backed Protocols", "Customized Care Plans"]
    },
    {
      icon: <Lock className="text-terracotta" size={32} />,
      subIcon: <Shield size={22} />,
      title: "Patient Privacy",
      desc: "Your safety and confidentiality are our highest priorities.",
      details: ["Discreet Consultation", "Bank-Level Security", "Total Confidentiality"]
    },
    {
      icon: <HelpCircle className="text-terracotta" size={32} />,
      subIcon: <Leaf size={22} />,
      title: "Holistic Wellness",
      desc: "Addressing the mind, body, and spirit in your healing process.",
      details: ["Mind-Body Connection", "Wellness Integration", "Sustained Vitality"]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-6">
      {/* Static Subtle Background Accents */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-[10%] w-[40%] h-[40%] bg-terracotta/5 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-0 right-[10%] w-[40%] h-[40%] bg-terracotta/5 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="text-center relative z-10">
        <FadeIn delay={100}>
          <div className="mb-6 flex justify-center">
            <span className="text-terracotta font-bold text-[8px] md:text-[10px] tracking-widest uppercase bg-white/5 px-4 md:px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm shadow-xl">
              Our Methodology
            </span>
          </div>
        </FadeIn>
        
        <SplitText 
          text="Scientific, Yet Human."
          className="text-2xl md:text-7xl font-black text-white mb-6 md:mb-8 leading-tight serif tracking-tighter text-center justify-center"
          delay={300}
          animationDelay={150}
        />

        <FadeIn delay={800}>
          <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-xl mb-8 md:mb-24 leading-relaxed font-light text-center px-4">
            We bridge the gap between clinical excellence and compassionate understanding.
          </p>
        </FadeIn>

        {/* Updated grid to stay 3-columns always */}
        <div className="grid grid-cols-3 gap-3 md:gap-8 lg:gap-12">
          {approaches.map((item, idx) => (
            <FadeIn key={idx} delay={1000 + (idx * 200)}>
              <div 
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                className="h-full"
              >
                <SpotlightCard className="h-full bg-white/[0.02] border-white/5 hover:bg-white/[0.05] transition-all duration-700 p-4 md:p-8 rounded-xl sm:rounded-3xl md:rounded-[48px]">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6 md:mb-14" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="w-12 h-12 md:w-24 md:h-24 bg-white/5 rounded-2xl md:rounded-[32px] flex items-center justify-center border border-white/5 transition-all duration-[800ms] group-hover:scale-110 group-hover:bg-terracotta/10 group-hover:border-terracotta/30 group-hover:rotate-[15deg]">
                        <div className="transition-transform duration-700 group-hover:scale-110 scale-75 md:scale-100">
                          {item.icon}
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 md:-bottom-4 md:-right-4 w-6 h-6 md:w-12 md:h-12 bg-intel-dark border border-white/10 rounded-lg md:rounded-2xl flex items-center justify-center text-white/40 transition-all duration-700 delay-75 group-hover:text-terracotta group-hover:scale-125 group-hover:-translate-x-3 group-hover:-translate-y-3 shadow-2xl overflow-hidden">
                        <span className="scale-[0.5] md:scale-100">{item.subIcon}</span>
                      </div>
                    </div>

                    <h3 className="text-sm md:text-3xl font-black text-white mb-2 md:mb-6 serif tracking-tight line-clamp-2 min-h-[2.5em] md:min-h-0">
                      {item.title}
                    </h3>
                    
                    <div className="relative w-full overflow-hidden min-h-[60px] md:min-h-[140px]">
                      <p className={`text-white/40 leading-tight md:leading-relaxed text-[10px] md:text-lg font-light transition-all duration-500 ${activeIdx === idx ? 'opacity-0 -translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
                        {item.desc}
                      </p>

                      <div className={`absolute inset-0 transition-all duration-700 flex flex-col items-center justify-center ${activeIdx === idx ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-90 pointer-events-none'}`}>
                        <ul className="space-y-1 md:space-y-4 w-full">
                          {item.details.map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-center justify-center gap-1 md:gap-3 text-white/80 text-[8px] md:text-base font-bold">
                              <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-terracotta shadow-[0_0_8px_rgba(120,160,131,0.8)]"></div>
                              <span className="truncate">{detail}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 md:mt-8 hidden md:flex items-center gap-2 text-[8px] md:text-[10px] font-black text-terracotta uppercase tracking-[0.4em] group/btn cursor-pointer hover:text-white transition-colors duration-300">
                          Learn More <ChevronRight size={14} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
