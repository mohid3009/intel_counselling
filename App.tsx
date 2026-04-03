import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Founders from './components/Founders';
import Assessment from './components/Assessment';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import ClickSpark from './components/ClickSpark';
import InteractiveBackground from './components/InteractiveBackground';
import Services from './components/Services';
import ServiceDetail from './components/ServiceDetail';
import InquiryForm from './components/InquiryForm';
import TestOptions from './components/TestOptions';

const Layer: React.FC<{
  children: React.ReactNode;
  id?: string;
  className?: string;
  zIndex: number;
  noFade?: boolean;
  scrollAnimateIn?: boolean;
}> = ({ children, id, className = '', zIndex, noFade = false, scrollAnimateIn = false }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top <= 0) {
        if (noFade) {
          setOpacity(1);
          setScale(1);
          return;
        }
        const exitProgress = Math.min(Math.abs(rect.top) / windowHeight, 1);
        const fadeThreshold = 0.90; 
        if (exitProgress > fadeThreshold) {
          const normalizedFade = (exitProgress - fadeThreshold) / (1 - fadeThreshold);
          setOpacity(1 - normalizedFade); 
          setScale(1 - normalizedFade * 0.04);
        } else {
          setOpacity(1);
          setScale(1);
        }
      } 
      else if (scrollAnimateIn && rect.top < windowHeight) {
        const entryProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight * 0.6)));
        setOpacity(entryProgress);
        setScale(0.95 + (entryProgress * 0.05));
      }
      else if (scrollAnimateIn && rect.top >= windowHeight) {
        setOpacity(0);
        setScale(0.95);
      }
      else {
        setOpacity(1);
        setScale(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [noFade, scrollAnimateIn]);

  return (
    <section 
      ref={sectionRef}
      id={id} 
      className={`stacking-section scroll-mt-20 md:scroll-mt-28 ${className}`}
      style={{ 
        zIndex,
        opacity: noFade ? 1 : opacity,
        transform: noFade ? 'none' : `scale(${scale})`
      }}
    >
      {children}
    </section>
  );
};

const ApproachLayer: React.FC<{
  children: React.ReactNode;
  id?: string;
  zIndex: number;
}> = ({ children, id, zIndex }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [exitProgress, setExitProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < 0) {
        const rawProgress = Math.min(Math.abs(rect.top) / windowHeight, 1);
        const delayThreshold = 0.8;
        const adjustedProgress = rawProgress < delayThreshold 
          ? 0 
          : (rawProgress - delayThreshold) / (1 - delayThreshold);
          
        setExitProgress(adjustedProgress);
      } else {
        setExitProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const blurValue = exitProgress * 25;
  const scaleValue = 1 - (exitProgress * 0.12);
  const opacityValue = 1 - (exitProgress * 1.2); 

  return (
    <section 
      ref={sectionRef}
      id={id} 
      className="relative z-10 bg-[#1F1E1B] py-16 md:py-32 scroll-mt-20 overflow-hidden"
      style={{ 
        zIndex,
        filter: `blur(${blurValue}px)`,
        transform: `scale(${scaleValue})`,
        opacity: Math.max(0, opacityValue),
        willChange: 'filter, transform, opacity'
      }}
    >
      {children}
    </section>
  );
};

export type ViewType = 'home' | 'personal' | 'student' | 'hr' | 'tests' | 'booking';

const ReadingQuote: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const quoteRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (quoteRef.current) observer.observe(quoteRef.current);
    return () => observer.disconnect();
  }, []);

  const words = [
    "\"The", "first", "step", "towards", "healing", "is", "recognizing", 
    "that", "you", "don't", "have", "to", "carry", "the", "burden", "alone.\""
  ];

  return (
    <>
      <style>{`
        @keyframes wordRead {
          0% { color: rgba(255,255,255,0.6); }
          25% { color: #C19B6C; }
          100% { color: rgba(255,255,255,0.6); }
        }
        .animate-word-read { animation: wordRead 2.5s ease-in-out forwards; }
      `}</style>
      <h2 
        ref={quoteRef} 
        className="text-3xl md:text-5xl lg:text-[3.5rem] mb-16 md:mb-24 relative z-10 leading-[1.4] text-center font-light serif px-4 max-w-4xl mx-auto flex flex-wrap justify-center gap-x-[0.22em] gap-y-1 md:gap-y-3"
      >
        {words.map((word, i) => {
          const isItalic = word === "first" || word === "step" || word === "recognizing" || word === "alone.\"";
          
          return (
            <span
              key={i}
              className={`inline-block ${
                isVisible ? 'animate-word-read' : 'text-white/60'
              } ${isItalic ? 'italic' : ''}`}
              style={{ 
                animationDelay: isVisible ? `${i * 300}ms` : '0ms',
                animationFillMode: 'both' 
              }}
            >
              {word}
            </span>
          );
        })}
      </h2>
    </>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showAssessment, setShowAssessment] = useState<{ isOpen: boolean; type: string }>({ isOpen: false, type: 'general' });
  const [isFounderExpanded, setIsFounderExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsBookingOpen(false);
        setShowAssessment({ isOpen: false, type: 'general' });
        if (currentView !== 'home') setCurrentView('home');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [currentView]);

  const isMobile = windowWidth < 768;
  const sparkRadius = isMobile ? 10 : 20;
  const sparkSize = isMobile ? 6 : 12;

  // Handle service detail pages or test page
  if (currentView !== 'home') {
    return (
      <div className="relative min-h-screen selection:bg-terracotta/40 selection:text-[#2A2825] bg-[#F7EBD3]">
        <InteractiveBackground />
        <ClickSpark sparkColor="#2A2825" sparkCount={isMobile ? 6 : 10} sparkSize={sparkSize} sparkRadius={sparkRadius} duration={500} />
        <Navbar 
          onLogoClick={() => setCurrentView('home')}
          onBookClick={() => setCurrentView('personal')}
          onAssessmentClick={() => setCurrentView('tests')}
          onLoginClick={() => alert("Portal login coming soon.")}
          forcePill
        />
        
        {currentView === 'tests' ? (
          <TestOptions onBack={() => setCurrentView('home')} onSelectTest={(type) => setShowAssessment({ isOpen: true, type })} />
        ) : currentView === 'booking' ? (
          <div className="pt-28 pb-12 px-4 md:px-6 flex items-center justify-center min-h-[80vh]">
             <BookingModal onClose={() => setCurrentView('personal')} />
          </div>
        ) : (
          <ServiceDetail view={currentView} onBack={() => setCurrentView('home')} onBook={() => setCurrentView('booking')} />
        )}

        {isBookingOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <BookingModal onClose={() => setIsBookingOpen(false)} />
          </div>
        )}
        {showAssessment.isOpen && <Assessment type={showAssessment.type} onClose={() => setShowAssessment({ isOpen: false, type: 'general' })} />}
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-terracotta/40 selection:text-[#2A2825] overflow-x-hidden bg-[#F7EBD3]">
      <InteractiveBackground />
      
      <ClickSpark 
        sparkColor="#2A2825" 
        sparkCount={isMobile ? 6 : 10} 
        sparkSize={sparkSize} 
        sparkRadius={sparkRadius} 
        duration={500} 
      />
      
      <Navbar 
        onLogoClick={() => setCurrentView('home')}
        onBookClick={() => setCurrentView('personal')}
        onAssessmentClick={() => setCurrentView('tests')}
        onLoginClick={() => alert("Portal login coming soon.")}
      />
      
      <main className="relative">
        <Layer zIndex={0} className="bg-transparent" id="top">
          <Hero 
            onStartTest={() => setCurrentView('tests')} 
            onLearnMore={() => {
              const el = document.getElementById('approach');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </Layer>

        <ApproachLayer id="approach" zIndex={10}>
          <Features />
        </ApproachLayer>

        <section id="services" className="relative z-[15] bg-[#F7EBD3] py-16 md:py-32 scroll-mt-20">
          <Services onSelectService={(view) => setCurrentView(view)} />
        </section>

        <Layer 
          id="founders" 
          zIndex={20} 
          className="bg-[#F7EBD3] shadow-[0_-50px_100px_rgba(0,0,0,0.1)]" 
          noFade={isFounderExpanded}
          scrollAnimateIn={true}
        >
          <Founders onExpandChange={setIsFounderExpanded} />
        </Layer>

        {/* Inquiry Section with Multi-font / Multi-color quote */}
        <section id="inquiry" className="relative z-30 bg-[#1F1E1B] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] min-h-screen flex items-center justify-center py-16 md:py-32 scroll-mt-20">
           <div className="w-full">
             <div className="max-w-4xl mx-auto px-6">
               <ReadingQuote />
               
               <div className="max-w-3xl mx-auto">
                <InquiryForm />
               </div>
             </div>
           </div>
        </section>

        <section className="relative z-40 bg-[#1F1E1B]">
          <Footer />
        </section>
      </main>

      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <BookingModal onClose={() => setIsBookingOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default App;