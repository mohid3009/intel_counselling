
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ChevronRight, ArrowLeft, Calendar, Clock, Video, ShieldCheck, HelpCircle, MessageSquare, AlertCircle, MapPin, Monitor } from 'lucide-react';

const SERVICES = [
  { id: 'anxiety', name: 'Anxiety & Stress', price: 1 },
  { id: 'depression', name: 'Depression', price: 1 },
  { id: 'relationships', name: 'Relationship Issues', price: 1 },
  { id: 'addiction', name: 'Addiction Recovery', price: 1 },
  { id: 'education', name: 'Education & Career Related', price: 1 },
  { id: 'unaware', name: 'I am not sure / General Consultation', price: 1 },
];

const getAvailableSlots = (date: string) => [
  '09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'
];

interface BookingModalProps {
  onClose: () => void;
}

const loadCashfreeScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CashfreePaymentStep: React.FC<{ 
  bookingDetails: any, 
  onSuccess: (gmeetLink: string) => void, 
  onBack: () => void 
}> = ({ bookingDetails, onSuccess, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleCashfreePayment = async () => {
    setIsProcessing(true);
    setError(null);
    const isLoaded = await loadCashfreeScript();
    if (!isLoaded) {
      setError("Failed to load Cashfree. Please check your internet connection.");
      setIsProcessing(false);
      return;
    }

    try {
      // Fetch a payment session ID from your Cashfree backend integration via Vercel Serverless Function
      const response = await fetch('/api/create-cashfree-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: bookingDetails.service.price,
          serviceName: bookingDetails.service.name,
          customerName: bookingDetails.name,
          customerEmail: bookingDetails.email,
          customerPhone: '9999999999' // Hardcoded phone for demo, could be from user details
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment order.");
      }

      // Initialize Cashfree SDK Drop-in
      const cashfree = await (window as any).Cashfree({
        mode: "production", 
      });

      let checkoutOptions = {
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then((result: any) => {
        if(result.error){
            setError(result.error.message || "Payment has failed.");
            setIsProcessing(false);
        } else if(result.redirect) {
            console.log("Payment will be redirected");
        } else if(result.paymentDetails) {
            // Once the payment succeeds in the modal!
            const gmeetId = Math.random().toString(36).substring(2, 12);
            const gmeetLink = `https://meet.google.com/mock-${gmeetId}`;
            setIsProcessing(false);
            onSuccess(gmeetLink);
        }
      });
    } catch (err: any) {
      setError(err.message || "Failed to start Cashfree checkout.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="bg-white/50 p-6 rounded-2xl border border-black/5 space-y-5">
        <div className="flex justify-between items-center text-sm font-medium border-b border-black/5 pb-4">
          <span className="text-black/60">Total Amount:</span>
          <span className="text-xl font-bold text-serene-green">₹{bookingDetails.service.price}.00</span>
        </div>
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
             <ShieldCheck size={32} />
           </div>
           <div>
             <h4 className="font-bold text-lg text-intel-dark mb-1">Secure Checkout via Cashfree</h4>
             <p className="text-xs text-black/50 mx-auto">Standard encryption applies.</p>
           </div>
        </div>
      </div>
      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
      <div className="flex gap-4">
        <button type="button" onClick={onBack} className="px-6 py-4 rounded-xl font-bold text-intel-dark border border-black/10 flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
        <button onClick={handleCashfreePayment} disabled={isProcessing} className="flex-1 bg-serene-green text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50">
          {isProcessing ? "Processing..." : "Pay & Book"}
        </button>
      </div>
    </div>
  );
};

const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [meetLink, setMeetLink] = useState('');
  const [details, setDetails] = useState({
    name: '',
    email: '',
    serviceId: '',
    sessionMode: '' as 'online' | 'inperson' | '',
    date: '',
    time: '',
    acceptedDisclaimer: false
  });

  const selectedService = SERVICES.find(s => s.id === details.serviceId);
  const availableSlots = details.date ? getAvailableSlots(details.date) : [];

  const handleBookingSuccess = async (link: string) => {
    setMeetLink(link);
    setStep(4);

    const isOnline = details.sessionMode === 'online';

    try {
      await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toName: details.name,
          customerEmail: details.email,
          serviceName: selectedService?.name,
          appointmentDate: details.date,
          appointmentTime: details.time,
          sessionMode: isOnline ? 'Online (Virtual)' : 'In-Person',
          meetLink: isOnline ? link : null,
          rescheduleInfo: 'If you need to change your timing, please reply to this email to reschedule at least 24 hours in advance.',
        }),
      });
      console.log("Confirmation emails sent via Brevo.");
    } catch (error) {
      console.error("Failed to send confirmation emails:", error);
    }
  };

  const steps = ["Session Type", "Details", "Payment", "Success"];

  return (
    <div className="w-full max-w-2xl bg-main rounded-[40px] shadow-2xl overflow-hidden border border-white/20 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="p-8 md:p-12">
        
        {/* Progress Bar */}
        {step < 4 && (
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {steps.slice(0, 3).map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-2 w-1/3 text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1 ? 'bg-serene-green text-white' : step === i + 1 ? 'border-2 border-serene-green text-serene-green' : 'border-2 border-black/10 text-black/20'}`}>
                    {step > i + 1 ? <CheckCircle2 size={16} /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${step === i + 1 ? 'text-serene-green' : 'text-black/20'}`}>{s}</span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-serene-green transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in slide-in-from-left duration-300">
            <h3 className="text-3xl font-bold mb-2 serif text-intel-dark">What's your concern?</h3>
            <p className="text-black/60 mb-8 font-light">Select the primary reason for your visit today.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider text-intel-dark">Type of Session</label>
                <div className="relative">
                  <select 
                    value={details.serviceId} 
                    onChange={e => setDetails({...details, serviceId: e.target.value})}
                    className="w-full bg-white border border-black/10 rounded-2xl px-6 py-5 text-intel-dark font-medium outline-none focus:border-serene-green appearance-none shadow-sm"
                  >
                    <option value="">Choose a concern...</option>
                    {SERVICES.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-black/20">
                    <ChevronRight className="rotate-90" size={20} />
                  </div>
                </div>
              </div>

              {details.serviceId && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider text-intel-dark">Session Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDetails({...details, sessionMode: 'online'})}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all font-bold text-sm ${
                        details.sessionMode === 'online'
                          ? 'border-serene-green bg-serene-green/10 text-serene-green'
                          : 'border-black/10 bg-white text-intel-dark hover:border-serene-green/40'
                      }`}
                    >
                      <Monitor size={24} />
                      Online
                      <span className="text-[10px] font-normal opacity-60">Via Google Meet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetails({...details, sessionMode: 'inperson'})}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all font-bold text-sm ${
                        details.sessionMode === 'inperson'
                          ? 'border-serene-green bg-serene-green/10 text-serene-green'
                          : 'border-black/10 bg-white text-intel-dark hover:border-serene-green/40'
                      }`}
                    >
                      <MapPin size={24} />
                      In-Person
                      <span className="text-[10px] font-normal opacity-60">At our clinic</span>
                    </button>
                  </div>
                </div>
              )}

              {details.serviceId && details.sessionMode && (
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-intel-dark text-[#F4EFE6] py-5 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4"
                >
                  Continue to Details <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <form className="space-y-6 animate-in slide-in-from-right duration-300" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Full Name</label>
                <input required type="text" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} className="w-full bg-white border border-black/10 rounded-xl px-4 py-3.5 outline-none focus:border-serene-green" placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Email</label>
                <input required type="email" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} className="w-full bg-white border border-black/10 rounded-xl px-4 py-3.5 outline-none focus:border-serene-green" placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Date</label>
                <input required type="date" value={details.date} onChange={e => setDetails({...details, date: e.target.value})} className="w-full bg-white border border-black/10 rounded-xl px-4 py-3.5 outline-none focus:border-serene-green" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Preferred Time</label>
                <select required value={details.time} onChange={e => setDetails({...details, time: e.target.value})} className="w-full bg-white border border-black/10 rounded-xl px-4 py-3.5 outline-none focus:border-serene-green">
                  <option value="">Select a slot</option>
                  {availableSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-intel-dark/5 p-6 rounded-2xl border border-black/5">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle size={20} className="text-serene-green mt-1 shrink-0" />
                <div className="text-xs text-intel-dark/70 leading-relaxed font-medium">
                  <strong>Disclaimer:</strong> Appointments are for screening and guidance. In case of emergencies, please contact emergency services. Cancellation requires 24h notice.
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input required type="checkbox" checked={details.acceptedDisclaimer} onChange={e => setDetails({...details, acceptedDisclaimer: e.target.checked})} className="w-5 h-5 rounded border-black/10 text-serene-green focus:ring-serene-green" />
                <span className="text-xs font-bold text-intel-dark">I agree to the terms and privacy policy</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-intel-dark border border-black/10">Back</button>
              <button type="submit" className="flex-1 bg-intel-dark text-[#F4EFE6] py-4 rounded-xl font-bold">Continue to Payment</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <CashfreePaymentStep 
            bookingDetails={{ ...details, service: selectedService }} 
            onSuccess={(link) => handleBookingSuccess(details.sessionMode === 'online' ? link : '')} 
            onBack={() => setStep(2)} 
          />
        )}

        {step === 4 && (
          <div className="text-center py-12 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-serene-green/10 text-serene-green rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-4xl font-bold mb-4 serif text-intel-dark">Booking Confirmed!</h3>
            <p className="text-black/60 mb-10 max-w-sm mx-auto font-light leading-relaxed">Your session is secured. Check your email for details{details.sessionMode === 'online' ? ' and the meeting link' : ''}.</p>
            <div className="bg-white p-6 rounded-3xl border border-black/5 mb-10 text-left flex items-start gap-4 shadow-sm">
              <div className="bg-terracotta/10 p-4 rounded-full text-terracotta">
                {details.sessionMode === 'online' ? <Video size={24} /> : <MapPin size={24} />}
              </div>
              <div className="overflow-hidden">
                {details.sessionMode === 'online' ? (
                  <>
                    <h5 className="font-bold text-intel-dark">Virtual Session Link</h5>
                    <p className="text-serene-green text-sm truncate font-medium">{meetLink}</p>
                  </>
                ) : (
                  <>
                    <h5 className="font-bold text-intel-dark">In-Person Session</h5>
                    <p className="text-black/60 text-sm font-medium">Our team will send you the clinic address via email.</p>
                  </>
                )}
              </div>
            </div>
            <button onClick={onClose} className="w-full bg-intel-dark text-white py-5 rounded-2xl font-bold shadow-xl active:scale-95 transition-all">Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
