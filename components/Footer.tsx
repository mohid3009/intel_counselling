
import React from 'react';
import { Heart, Mail, Phone, MapPin, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F1E1B] text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-1.5 bg-terracotta rounded-lg text-white">
                <Heart size={20} fill="currentColor" />
              </div>
              <span className="font-bold text-2xl tracking-tight">Intel Counselling</span>
            </div>
            <p className="text-white/60 leading-relaxed mb-8">
              Dedicated to providing compassionate, research-driven mental health care. My counselling practice covers the emotional needs of individuals across different life stages – from children and adolescents to adults and senior citizens.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={18} />} label="Twitter" />
              <SocialIcon icon={<Instagram size={18} />} label="Instagram" />
              <SocialIcon icon={<Facebook size={18} />} label="Facebook" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-8">Clinic</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-terracotta transition-colors duration-300">Our Approach</a></li>
              <li><a href="#" className="hover:text-terracotta transition-colors duration-300">Practitioners</a></li>
              <li><a href="#" className="hover:text-terracotta transition-colors duration-300">Therapy Services</a></li>
              <li><a href="#" className="hover:text-terracotta transition-colors duration-300">Self-Assessment</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-8">Resources</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-terracotta transition-colors duration-300">Wellness Blog</a></li>
              <li><a href="#" className="hover:text-terracotta transition-colors duration-300">Crisis Support</a></li>
              <li><a href="#" className="hover:text-terracotta transition-colors duration-300">Patient Portal</a></li>
              <li><a href="#" className="hover:text-terracotta transition-colors duration-300">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-8">Contact</h4>
            <ul className="space-y-4 text-white/60">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-terracotta shrink-0 mt-1" />
                <span>address<br />144, Seetha Patabi Nagar,<br /> Maruthi Nagar, Ayappakkam,<br /> Chennai, Tamil Nadu 600077,<br /> India.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-terracotta shrink-0" />
                <span>+91 63698 30134</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-terracotta shrink-0" />
                <span>rpriyanka327@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 text-sm text-white/40">
           <div className="mb-8">
              <h5 className="font-bold text-white/60 uppercase tracking-widest text-[10px] mb-4">Disclaimer</h5>
              <p className="leading-relaxed">
                All assessments provided by Intell Counselling are screening and guidance tools designed to enhance self-understanding and developmental planning. They are not diagnostic instruments and do not replace clinical evaluation or standardized psychological testing. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
                <br /><br />
                If you are experiencing a mental health crisis or emergency, please call your local emergency services or the National Suicide Prevention Lifeline at 988 immediately.
              </p>
           </div>
           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             <p>© 2026 Intel Counselling. All rights reserved.</p>
             <div className="flex gap-8">
               <a href="#" className="hover:text-white transition-colors duration-300 underline underline-offset-4 decoration-white/10 hover:decoration-white">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors duration-300 underline underline-offset-4 decoration-white/10 hover:decoration-white">Terms of Service</a>
             </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <a 
    href="#" 
    aria-label={label}
    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-terracotta hover:scale-115 hover:shadow-[0_0_20px_rgba(120,160,131,0.4)] transition-all duration-300 ease-out active:scale-90"
  >
    <div className="transition-transform duration-300 group-hover:rotate-6">
      {icon}
    </div>
  </a>
);

export default Footer;
