
import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, User, Mail, Sparkles } from 'lucide-react';

const InquiryForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Personal Therapy',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 800);
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#F7EBD3] rounded-[40px] md:rounded-[60px] p-10 md:p-20 text-center shadow-2xl border border-white/10 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-terracotta/20 text-terracotta rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-3xl md:text-4xl font-black mb-6 serif text-intel-dark">Inquiry Received</h3>
        <p className="text-lg md:text-xl text-intel-dark/70 max-w-md mx-auto leading-relaxed mb-10 font-light">
          Thank you for reaching out. One of our specialists will review your message and get back to you within 24 hours.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="text-terracotta font-black uppercase tracking-[0.2em] text-xs hover:opacity-70 transition-opacity"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F7EBD3] rounded-[40px] md:rounded-[60px] p-8 md:p-16 text-intel-dark shadow-2xl relative z-10 border border-white/10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-intel-dark/5 border border-black/5 text-terracotta text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles size={12} />
            Reach Out Today
          </div>
          <h3 className="text-3xl md:text-5xl font-black serif leading-tight">Begin your inquiry.</h3>
        </div>
        <p className="text-intel-dark/60 text-base md:text-lg max-w-sm font-light text-center md:text-left">
          Have questions about our services or need guidance on where to start? We're here to listen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">
              <User size={12} /> Full Name
            </label>
            <input 
              required
              type="text" 
              placeholder="Your name"
              className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-base outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">
              <Mail size={12} /> Email Address
            </label>
            <input 
              required
              type="email" 
              placeholder="you@example.com"
              className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-base outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">
            Interested Service
          </label>
          <select 
            className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-base outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all appearance-none cursor-pointer"
            value={formData.service}
            onChange={(e) => setFormData({...formData, service: e.target.value})}
          >
            <option>Personal Therapy</option>
            <option>Student Growth</option>
            <option>Corporate Wellness</option>
            <option>General Inquiry</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">
            <MessageSquare size={12} /> How can we help?
          </label>
          <textarea 
            required
            rows={4}
            placeholder="Tell us a little about what you're looking for..."
            className="w-full bg-white border border-black/5 rounded-2xl px-6 py-4 text-base outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all resize-none"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>
        </div>

        <div className="pt-4 flex flex-col md:flex-row items-center gap-6">
          <button 
            type="submit"
            className="w-full md:w-auto bg-terracotta text-white px-12 py-5 rounded-2xl font-black text-base hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-3 group"
          >
            Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
          <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.15em] italic">
            Your privacy is our priority. All inquiries are strictly confidential.
          </p>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
