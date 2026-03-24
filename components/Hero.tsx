import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkle, ArrowRight, ShieldCheck } from 'lucide-react';
import Spotlight from './Spotlight';
import SplitText from './SplitText';
import LightWaves from './LightWaves';

interface HeroProps {
  onStartTest: () => void;
  onLearnMore: () => void;
}

const MagneticButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  className: string;
}> = ({ children, onClick, className }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    const strength = 0.25; // Smoother magnetic pull
    setPosition({ x: distanceX * strength, y: distanceY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={`${className} transition-transform duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)] relative`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

const ImageBlob: React.FC<{ 
  mouseX: number; 
  mouseY: number; 
  color?: string; 
  opacity?: number; 
  radiusOffset?: number; 
  speedFactor?: number;
  rotationDuration?: string;
  reverse?: boolean;
}> = ({ 
  mouseX, 
  mouseY, 
  color = "#78A083", 
  opacity = 0.15,
  radiusOffset = 0,
  speedFactor = 1,
  rotationDuration = "20s",
  reverse = false
}) => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    let frameId: number;
    const animate = (t: number) => {
      setTime(t / 1000 * speedFactor);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [speedFactor]);

  const pointsCount = 10;
  const baseRadius = 145 + radiusOffset;
  const distortionAmount = 12; // Slightly subtler

  const mainPath = useMemo(() => {
    const coords = [];
    for (let i = 0; i < pointsCount; i++) {
      const angle = (i / pointsCount) * Math.PI * 2;
      
      const wobbleX = Math.cos(time + i * 1.5) * distortionAmount;
      const wobbleY = Math.sin(time * 0.8 + i * 1.5) * distortionAmount;
      
      const mX = mouseX * 25; 
      const mY = mouseY * 25;
      
      const r = baseRadius + (wobbleX + wobbleY) * 0.5;
      const px = 250 + (r + mX) * Math.cos(angle);
      const py = 250 + (r + mY) * Math.sin(angle);
      
      coords.push({ x: px, y: py });
    }

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < pointsCount; i++) {
      const p1 = coords[i];
      const p2 = coords[(i + 1) % pointsCount];
      
      const cp1x = p1.x + (p2.x - coords[(i - 1 + pointsCount) % pointsCount].x) / 6;
      const cp1y = p1.y + (p2.y - coords[(i - 1 + pointsCount) % pointsCount].y) / 6;
      const cp2x = p2.x - (coords[(i + 2) % pointsCount].x - p1.x) / 6;
      const cp2y = p2.y - (coords[(i + 2) % pointsCount].y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [time, mouseX, mouseY, baseRadius, distortionAmount]);

  return (
    <svg 
      viewBox="0 0 500 500" 
      className={`absolute inset-[-150px] w-[calc(100%+300px)] h-[calc(100%+300px)] pointer-events-none z-0 ${reverse ? 'animate-spin-reverse' : 'animate-spin-slow'}`}
      style={{ 
        filter: radiusOffset > 0 ? 'blur(50px)' : 'blur(0px)',
        animationDuration: rotationDuration,
        willChange: 'transform'
      } as React.CSSProperties}
    >
      <path 
        d={mainPath} 
        fill={color} 
        style={{ opacity }}
        className="transition-all duration-500 ease-linear"
      />
    </svg>
  );
};

const Hero: React.FC<HeroProps> = ({ onStartTest, onLearnMore }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      setMousePos({ x, y });
    };

    if (window.innerWidth > 768) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getTransform = (factor: number) => {
    return `translate(${mousePos.x * factor}px, ${mousePos.y * factor}px)`;
  };

  return (
    <section 
      id="hero"
      ref={containerRef}
      className="relative w-full overflow-hidden flex flex-col justify-start min-h-[90vh] md:min-h-screen"
    >
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <LightWaves 
          className="opacity-100 w-full h-full" 
          themeColors={["#A2D2A4", "#86BA90"]} 
        />
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#78A083" />
        
        <div 
          className="absolute top-[20%] left-[10%] w-64 h-64 bg-terracotta/10 rounded-full blur-[90px] transition-transform duration-1000 ease-out" 
          style={{ transform: getTransform(35) }}
        ></div>
        <div 
          className="absolute bottom-[25%] right-[10%] w-72 h-72 bg-[#78A083]/15 rounded-full blur-[110px] transition-transform duration-1000 ease-out" 
          style={{ transform: getTransform(-50) }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-24 pb-24 md:pt-32 md:pb-40 lg:pt-40 lg:pb-52 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-28 text-center lg:text-left">
        
        <div 
          className="flex-1 lg:flex-[1.2] w-full max-w-xl lg:max-w-2xl transition-transform duration-1000 ease-[cubic-bezier(0.16, 1, 0.3, 1)]" 
          style={{ transform: getTransform(12) }}
        >
          <div className="mb-8 animate-fade-in flex justify-center lg:justify-start items-center gap-4">
            <span className="px-5 py-2 rounded-full bg-intel-dark text-white text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] inline-flex items-center gap-2 shadow-sm border border-black/5">
              <Sparkle size={14} className="opacity-80 text-terracotta" />
              Personalized Therapy
            </span>
          </div>
          
          <div className="mb-10 flex flex-col items-center lg:items-start">
            <SplitText 
              text="Find Peace with"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black leading-[1.08] text-intel-dark serif justify-center lg:justify-start"
              delay={200}
              animationDelay={80}
            />
            <SplitText 
              text="Intel Counselling"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black leading-[1.08] text-serene-green serif justify-center lg:justify-start mt-2"
              delay={450}
              animationDelay={80}
            />
          </div>
          
          <p className="text-base sm:text-lg text-intel-dark/70 mb-12 max-w-md mx-auto lg:mx-0 leading-relaxed animate-slide-up delay-200 font-light">
            We offer a safe, supportive, and confidential space where your well-being comes first. In both online and offline sessions, we aim to listen with care and support you in building lasting emotional balance and inner strength at your own pace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:justify-center lg:justify-start animate-slide-up delay-300">
            <MagneticButton 
              onClick={onStartTest}
              className="btn-premium group w-full sm:w-auto min-w-[200px] lg:min-w-[240px] bg-intel-dark text-[#F4EFE6] px-8 py-[18px] rounded-full font-medium tracking-wide text-sm md:text-base flex items-center justify-center gap-3 whitespace-nowrap"
            >
              Start Free Tests
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton 
              onClick={onLearnMore}
              className="btn-premium group w-full sm:w-auto min-w-[200px] lg:min-w-[240px] px-8 py-[18px] bg-serene-green text-white rounded-full font-medium tracking-wide text-sm md:text-base hover:shadow-lg flex items-center justify-center whitespace-nowrap"
            >
              Learn More
            </MagneticButton>
          </div>
        </div>

        <div 
          className="flex-1 lg:flex-[0.8] relative flex justify-center lg:justify-end animate-fade-in delay-200 w-full"
          style={{ 
            perspective: '1400px',
            transform: getTransform(-6) 
          }}
        >
          <div 
            className="relative w-[210px] h-[210px] sm:w-[270px] sm:h-[270px] md:w-[310px] md:h-[310px] lg:w-[350px] lg:h-[350px] transition-transform duration-1000 ease-[cubic-bezier(0.16, 1, 0.3, 1)]"
            style={{ 
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Multi-layered blob layers for depth */}
            <ImageBlob 
              mouseX={mousePos.x} 
              mouseY={mousePos.y} 
              color="#78A083" 
              opacity={0.06} 
              radiusOffset={35} 
              speedFactor={0.12} 
              rotationDuration="70s" 
            />
            <ImageBlob 
              mouseX={mousePos.x} 
              mouseY={mousePos.y} 
              color="#78A083" 
              opacity={0.08} 
              radiusOffset={12} 
              speedFactor={0.35} 
              rotationDuration="45s"
              reverse={true} 
            />
            <ImageBlob 
              mouseX={mousePos.x} 
              mouseY={mousePos.y} 
              color="#1F1E1B" 
              opacity={0.95} 
              speedFactor={0.2}
              rotationDuration="55s" 
            />

            {/* The Main Circle Frame */}
            <div 
              className="absolute inset-0 bg-[#2A2825] rounded-full border-[8px] md:border-[12px] border-[#2A2825] shadow-[0_20px_70px_rgba(0,0,0,0.45)] overflow-hidden flex items-center justify-center transition-all duration-1000 group z-10"
              style={{ transform: 'translateZ(45px)' }}
            >
               <img 
                src="https://intelcounselling.com/wp-content/uploads/2026/01/Gemini_Generated_Image_pt02ezpt02ezpt02-1-1.png" 
                alt="Psychiatrist Appointment" 
                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-108"
              />
               <div className="absolute inset-0 bg-gradient-to-tr from-terracotta/15 to-transparent opacity-30"></div>
            </div>

            <div 
              className="absolute -inset-8 border-2 border-terracotta/15 rounded-full animate-spin-slow pointer-events-none opacity-30"
              style={{ transform: 'translateZ(15px)', animationDuration: '20s' } as React.CSSProperties}
            ></div>

            {/* Floating Privacy/Trust Badge */}
            <div 
              className="absolute -bottom-3 -left-3 md:-bottom-6 md:-left-6 bg-white/95 backdrop-blur-xl p-3 md:p-5 rounded-3xl shadow-2xl z-20 border border-black/5 flex items-center gap-3 animate-float-slow"
              style={{ transform: 'translateZ(80px)' }}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-terracotta/20 rounded-xl flex items-center justify-center text-terracotta">
                <ShieldCheck size={20} className="animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-[8px] md:text-[10px] font-bold text-terracotta uppercase tracking-wider">Privacy</div>
                <div className="text-xs md:text-sm font-black text-serene-green">Safe & Confidential</div>
              </div>
            </div>

            <div className="absolute -z-10 top-[-5%] right-[-5%] w-full h-full bg-[#78A083]/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-slow { 
          0%, 100% { transform: translateZ(80px) translateY(0); } 
          50% { transform: translateZ(80px) translateY(-10px); } 
        }
        .animate-float-slow { animation: float-slow 6.5s cubic-bezier(0.16, 1, 0.3, 1) infinite; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow var(--duration, 60s) linear infinite; }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse { animation: spin-reverse var(--duration, 80s) linear infinite; }
      `}</style>
    </section>
  );
};

export default Hero;