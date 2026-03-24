
import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle, User, GraduationCap, Briefcase, Calendar, ShieldCheck, Heart, Brain, Zap, Monitor, Users, Sparkles } from 'lucide-react';
import { ViewType } from '../App';
import personalHero from '../assets/imgs/image.png';

interface Specialization {
  category: string;
  icon: React.ReactNode;
  items: string[];
}

interface ServiceDetailProps {
  view: ViewType;
  onBack: () => void;
  onBook: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ view, onBack, onBook }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  const content = {
    personal: {
      title: "Personal Therapy",
      tagline: "Individual Healing & Discovery",
      icon: <User size={40} />,
      hero: personalHero,
      isCompact: true, 
      intro: "Our individual sessions are a sanctuary for your mind. We combine modern clinical techniques with deep compassion to help you unravel complex emotions and build a foundation of lasting peace.",
      specializations: [
        {
          category: "Emotional & Behavioral",
          icon: <Brain className="text-serene-green" size={24} />,
          items: ["Adolescent Counseling (Peer pressure, Self-image)", "Depression & Anxiety", "Stress Management"]
        },
        {
          category: "Career & Academic",
          icon: <GraduationCap className="text-serene-green" size={24} />,
          items: ["Career Path Selection (10th & 12th)", "Overcoming Academic Burnout", "Exam Fear & Performance Anxiety"]
        },
        {
          category: "Addiction & Digital Habits",
          icon: <Monitor className="text-serene-green" size={24} />,
          items: ["Screen & Mobile Addiction", "Online Gaming Impulse Control", "Healthy Daily Routine Building"]
        },
        {
          category: "Family & Relationships",
          icon: <Users className="text-serene-green" size={24} />,
          items: ["Resolving Relationship Conflicts", "Parental Counseling & Discipline", "Healing from Emotional Trauma"]
        }
      ],
      features: [
        "One-on-one confidential counseling",
        "Cognitive Behavioral Therapy (CBT)",
        "Trauma-informed recovery plans",
        "Anxiety & depression management",
        "Emotional resilience building"
      ]
    },
    student: {
      title: "Student Growth",
      tagline: "Navigating Academic Life",
      icon: <GraduationCap size={40} />,
      hero: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
      isCompact: false,
      intro: "Academic pressure shouldn't define your youth. Our specialized student packages provide the tools to manage exam anxiety, social transitions, and the unique stresses of educational environments.",
      specializations: [],
      features: [
        "Specialized student pricing",
        "Exam anxiety workshops",
        "Social transition support",
        "Time management & focus tools",
        "Class-friendly scheduling"
      ]
    },
    hr: {
      title: "Corporate Wellness",
      tagline: "Building Resilient Teams",
      icon: <Briefcase size={40} />,
      hero: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
      isCompact: false,
      intro: "A healthy workplace culture starts with mental health. We partner with HR leaders to implement systemic support, crisis management, and leadership training that prioritizes human well-being.",
      specializations: [],
      features: [
        "Employee Assistance Programs (EAP)",
        "Leadership mental health training",
        "Strategic stress audits",
        "Crisis intervention support",
        "Corporate workshops & seminars"
      ]
    }
  }[view as 'personal' | 'student' | 'hr'];

  if (!content) return null;

  return (
    <div className="relative min-h-screen bg-transparent pt-32 pb-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-sm rounded-[2rem] pr-6 pl-2 py-2 md:py-3 shadow-md border border-black/5 text-intel-dark/80 hover:text-intel-dark font-black hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mb-12 uppercase tracking-[0.25em] text-[9px] md:text-[10px]"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-intel-dark/5 flex items-center justify-center group-hover:bg-terracotta group-hover:text-white transition-colors duration-300">
            <ArrowLeft size={16} />
          </div>
          Back to Overview
        </button>

        <div className={`relative rounded-[40px] md:rounded-[60px] overflow-hidden mb-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] ${content.isCompact ? 'h-[250px] md:h-[350px]' : 'h-[450px] md:h-[600px]'} transition-all duration-700 group/hero`}>
          <img 
            src={content.hero} 
            alt={content.title} 
            className="w-full h-full object-cover opacity-90 transition-transform duration-[2000ms] group-hover/hero:scale-105" 
          />
          {/* Lighter gradient overlay for dark text legibility */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <div className="bg-intel-dark/95 backdrop-blur-md inline-flex items-center gap-4 md:gap-6 p-4 md:p-7 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-white/10 w-fit">
              <div className="w-12 h-12 md:w-20 md:h-20 bg-serene-green rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white shadow-lg shrink-0">
                {content.icon}
              </div>
              <div className="pr-4 md:pr-8">
                <span className="text-white/50 font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-1 block leading-none">{content.tagline}</span>
                <h1 className="text-2xl md:text-5xl font-black text-white serif leading-tight">{content.title}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 md:gap-20 items-start">
          <div className="lg:col-span-8">
            <div className="mb-12">
              <h2 className="text-2xl md:text-4xl font-black text-intel-dark serif mb-6">Our Approach to Healing</h2>
              <p className="text-intel-dark/70 text-lg md:text-xl leading-relaxed font-light">
                {content.intro}
              </p>
            </div>

            {content.specializations.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <Sparkles size={20} className="text-serene-green" />
                  <h3 className="text-xl md:text-2xl font-black text-intel-dark serif uppercase tracking-tight">Areas of Specialization</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {content.specializations.map((spec, i) => (
                    <div key={i} className="bg-white/60 p-8 rounded-[40px] border border-white/80 shadow-sm hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-intel-dark/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-serene-green/10 transition-colors">
                        {spec.icon}
                      </div>
                      <h4 className="text-lg md:text-xl font-black text-intel-dark serif mb-4">{spec.category}</h4>
                      <ul className="space-y-3">
                        {spec.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-intel-dark/60 font-medium leading-relaxed">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-serene-green/40 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-8 bg-intel-dark/5 rounded-[40px] border border-black/5 flex flex-col gap-4 transition-transform hover:scale-[1.02]">
                <ShieldCheck className="text-serene-green" size={28} />
                <h4 className="font-bold text-intel-dark">Safe & Secure</h4>
                <p className="text-sm text-intel-dark/60 font-medium leading-relaxed">Fully confidential and encrypted sessions for your absolute peace of mind.</p>
              </div>
              <div className="p-8 bg-intel-dark/5 rounded-[40px] border border-black/5 flex flex-col gap-4 transition-transform hover:scale-[1.02]">
                <Heart className="text-serene-green" size={28} />
                <h4 className="font-bold text-intel-dark">Radical Empathy</h4>
                <p className="text-sm text-intel-dark/60 font-medium leading-relaxed">We listen with care and without judgment, fostering a truly supportive environment.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-intel-dark rounded-[40px] md:rounded-[50px] p-8 md:p-12 shadow-2xl relative overflow-hidden group/card">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 group-hover/card:scale-150 transition-transform duration-1000 opacity-50"></div>
              
              <h3 className="font-black text-white uppercase tracking-[0.3em] text-[10px] mb-8 opacity-60">Package Benefits</h3>
              <ul className="space-y-5 mb-10">
                {content.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-4 text-white/80">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-serene-green/20 flex items-center justify-center text-serene-green mt-0.5">
                      <CheckCircle size={12} />
                    </div>
                    <span className="font-medium text-xs md:text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-8 border-t border-white/10 flex flex-col gap-6">
                 <button 
                  onClick={onBook}
                  className="w-full bg-serene-green text-white font-black py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-[0.98] shadow-xl text-sm md:text-base"
                >
                  Book Session <Calendar size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
