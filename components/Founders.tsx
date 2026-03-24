
import React, { useState } from 'react';
import { Linkedin, Twitter, Mail, Target, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import FadeIn from './FadeIn';

interface Founder {
  name: string;
  title: string;
  desc: string;
  img: string;
  detailedBio: string;
  specialties: string[];
  philosophy: string;
  socials: { icon: React.ReactNode; label: string }[];
}

interface FoundersProps {
  onExpandChange?: (isExpanded: boolean) => void;
}

const Founders: React.FC<FoundersProps> = ({ onExpandChange }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const founders: Founder[] = [
    {
      name: "Priyanka R.",
      title: "COUNSELING PSYCHOLOGIST & SENIOR STUDENT COUNSELOR",
      desc: "Founder of Intell Counselling with 5+ years of experience, Priyanka supports students with a calm presence.",
      img: "https://intelcounselling.com/wp-content/uploads/2026/01/priyan-1.png",
      detailedBio: "With over 5 years of dedicated clinical experience, Priyanka R. is the founder of Intell Counselling. She currently serves as a Senior Student Counselor at Rajalakshmi Engineering College. Her calm presence and deep listening make people feel safe, seen, and supported, allowing for genuine emotional breakthroughs.",
      specialties: ["Anxiety", "Depression", "Academic Stress", "Addiction"],
      philosophy: "To help people feel lighter, think clearer, and live fuller.",
      socials: [
        { icon: <Linkedin size={16} />, label: "LinkedIn" },
        { icon: <Twitter size={16} />, label: "Twitter" },
        { icon: <Mail size={16} />, label: "Email" }
      ]
    },
    {
      name: "Dr. K. Senthilkumar",
      title: "CO-FOUNDER & CHIEF STRATEGY OFFICER",
      desc: "Dr. K. Senthilkumar drives the strategic vision and operational excellence of Intell Counselling.",
      img: "https://intelcounselling.com/wp-content/uploads/2026/01/my-photo.png",
      detailedBio: "As Co-Founder, Dr. K. Senthilkumar drives the strategic vision and operational excellence of Intell Counselling. He oversees the organization’s digital infrastructure and marketing outreach. His role ensures that professional mental healthcare remains accessible and secure.",
      specialties: ["Digital Strategy", "Operations", "Strategic Growth"],
      philosophy: "To ensure professional mental healthcare remains accessible and client-focused for everyone.",
      socials: [
        { icon: <Linkedin size={16} />, label: "LinkedIn" },
        { icon: <Twitter size={16} />, label: "Twitter" },
        { icon: <Mail size={16} />, label: "Email" }
      ]
    }
  ];

  const toggleExpand = (idx: number) => {
    const nextIdx = expandedIdx === idx ? null : idx;
    setExpandedIdx(nextIdx);
    if (onExpandChange) {
      onExpandChange(nextIdx !== null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-6 py-12 md:py-32">
      <FadeIn>
        <div className="text-center md:text-left mb-10 md:mb-16 px-4">
          <h2 className="text-2xl md:text-6xl font-black mb-4 md:mb-6 text-[#1F1E1B] serif">The Minds Behind Intel.</h2>
          <p className="text-xs md:text-xl text-[#1F1E1B]/60 leading-relaxed font-light max-w-2xl">
            Our founders combine clinical rigor with radical empathy to redefine the modern therapy experience.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-2 gap-2 sm:gap-6 md:gap-10 items-start">
        {founders.map((f, idx) => {
          const isExpanded = expandedIdx === idx;
          
          return (
            <FadeIn key={idx} delay={idx * 300}>
              <div 
                onClick={() => toggleExpand(idx)}
                className={`bg-[#2A2825] rounded-2xl sm:rounded-[40px] md:rounded-[48px] p-3 sm:p-6 md:p-10 shadow-2xl border border-white/5 hover:border-white/10 transition-all duration-700 group relative overflow-hidden flex flex-col cursor-pointer ${
                  isExpanded ? 'ring-4 ring-terracotta/20 scale-[1.01] md:scale-105 z-50' : 'z-10'
                }`}
              >
                {/* Decorative Accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-bl-[60px] md:rounded-bl-[100px] -mr-8 -mt-8 md:-mr-10 md:-mt-10 transition-all duration-1000 ${isExpanded ? 'opacity-0 scale-150' : 'opacity-100 group-hover:scale-110'}`}></div>
                
                <div className={`flex transition-all duration-700 ease-in-out gap-3 sm:gap-8 mb-4 md:mb-8 ${isExpanded ? 'flex-col items-center text-center' : 'flex-row items-center'}`}>
                  {/* Image Container */}
                  <div className={`shrink-0 overflow-hidden rounded-xl sm:rounded-[30px] md:rounded-[40px] transition-all duration-700 shadow-2xl border-2 border-white/5 ${
                    isExpanded ? 'w-24 h-24 sm:w-48 sm:h-48 md:w-64 md:h-64 mb-2 md:mb-6' : 'w-12 h-12 sm:w-24 sm:h-24 md:w-32 md:h-32'
                  }`}>
                    <img 
                      src={f.img} 
                      alt={f.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                    />
                  </div>
                  
                  {/* Text Header */}
                  <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'mt-0' : ''}`}>
                    <h3 className={`font-black text-white serif leading-tight transition-all duration-700 truncate ${isExpanded ? 'text-lg sm:text-3xl md:text-4xl' : 'text-sm sm:text-2xl md:text-3xl'}`}>
                      {f.name}
                    </h3>
                    <p className="text-[6px] sm:text-[9px] md:text-xs font-bold text-terracotta tracking-[0.1em] sm:tracking-[0.2em] uppercase mt-1 md:mt-2 mb-1 md:mb-3">
                      {f.title}
                    </p>
                  </div>
                </div>

                <div className="flex-grow">
                  <p className={`text-white/60 leading-snug md:leading-relaxed text-[9px] sm:text-sm md:text-base font-light transition-all duration-500 ${isExpanded ? 'text-center max-w-lg mx-auto mb-4 md:mb-8 text-[11px] sm:text-lg' : 'mb-3 md:mb-6 line-clamp-2 md:line-clamp-3'}`}>
                    {isExpanded ? f.detailedBio : f.desc}
                  </p>
                  
                  {/* Expandable Section */}
                  <div className={`overflow-hidden transition-all duration-1000 ease-in-out ${isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-4 md:space-y-10 pt-4 md:pt-8 border-t border-white/10 animate-fade-in">
                      <div>
                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
                          <Target size={14} className="text-terracotta sm:w-5 sm:h-5" />
                          <h4 className="font-bold text-white text-[8px] sm:text-xs uppercase tracking-widest">
                            {idx === 1 ? 'Focus' : 'Expertise'}
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {f.specialties.map((s, i) => (
                            <span key={i} className="text-[8px] sm:text-[11px] font-bold bg-white/5 px-2 py-1 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-white/80 border border-white/5 hover:border-terracotta/40 transition-colors">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white/[0.03] p-4 md:p-8 rounded-xl md:rounded-3xl border border-white/5">
                        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
                          <Heart size={14} className="text-terracotta sm:w-5 sm:h-5" />
                          <h4 className="font-bold text-white text-[8px] sm:text-xs uppercase tracking-widest">Philosophy</h4>
                        </div>
                        <p className="text-xs sm:text-lg md:text-xl text-white/70 italic leading-snug md:leading-relaxed serif font-medium">
                          "{f.philosophy}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center justify-between transition-all duration-700 ${isExpanded ? 'mt-4 sm:mt-8 pt-4 sm:pt-8 border-t border-white/10' : 'mt-2 sm:mt-4 pt-3 sm:pt-6'}`}>
                  <div className="flex items-center gap-1 sm:gap-3">
                    {f.socials.map((social, sIdx) => (
                      <button 
                        key={sIdx}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={social.label}
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/5 text-white/70 rounded-lg sm:rounded-2xl flex items-center justify-center hover:bg-terracotta hover:text-white transition-all duration-300 border border-white/5"
                      >
                        {/* Fix: Use React.isValidElement and cast to React.ReactElement<any> to allow 'size' prop passed by Lucide icons */}
                        {React.isValidElement(social.icon) && React.cloneElement(social.icon as React.ReactElement<any>, { size: 12 })}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-terracotta font-black text-[7px] sm:text-[10px] uppercase tracking-wider sm:tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                    {isExpanded ? (
                      <span className="flex items-center gap-1 sm:gap-2 truncate">Collapse <ChevronUp size={12} className="sm:w-4 sm:h-4" /></span>
                    ) : (
                      <span className="flex items-center gap-1 sm:gap-2 truncate">Profile <ChevronDown size={12} className="sm:w-4 sm:h-4" /></span>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};

export default Founders;
