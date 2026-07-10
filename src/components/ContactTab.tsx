import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Globe, 
  ClipboardCheck, 
  Loader2, 
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface ContactTabProps {
  leadForm: {
    name: string;
    phone: string;
    service: string;
    city: string;
  };
  setLeadForm: React.Dispatch<React.SetStateAction<{
    name: string;
    phone: string;
    service: string;
    city: string;
  }>>;
  isSubmittingLead: boolean;
  leadStatusMsg: string;
  formSubmitted: boolean;
  handleLeadSubmit: (e: React.FormEvent) => void;
}

export default function ContactTab({
  leadForm,
  setLeadForm,
  isSubmittingLead,
  leadStatusMsg,
  formSubmitted,
  handleLeadSubmit
}: ContactTabProps) {

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 79774 79299",
      href: "tel:+917977479299",
      desc: "Instant connection with our advisory hotline",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Chat",
      value: "+91 79774 79299",
      href: "https://wa.me/917977479299",
      desc: "Send documents or request fast quotes",
      color: "bg-green-50 text-green-600 border-green-100"
    },
    {
      icon: Mail,
      title: "Email Assistance",
      value: "kml.finance.1@gmail.com",
      href: "mailto:kml.finance.1@gmail.com",
      desc: "Send corporate proposals or travel RFPs",
      color: "bg-purple-50 text-purple-600 border-purple-100"
    }
  ];

  return (
    <div id="contact-tab-view" className="animate-fade-in space-y-16 py-8">
      {/* Header section */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white p-8 md:p-12 overflow-hidden shadow-xl border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.08),transparent_40%)]" />
        <div className="relative z-10 max-w-3xl space-y-4 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/15 text-brand-gold border border-brand-gold/25">
            <Building size={12} />
            Contact & Support
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Let's Get in Touch
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Have questions about interest rates, document eligibility, premium quotes, or holiday schedules? Reach out to our advisors via your preferred channel or submit your details below.
          </p>
        </div>
      </div>

      {/* Grid of Contact channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {contactMethods.map((cm, idx) => {
          const Icon = cm.icon;
          return (
            <a 
              key={idx} 
              href={cm.href} 
              target="_blank" 
              rel="noreferrer"
              className={`border p-6 rounded-2xl hover:shadow-md transition-shadow block relative overflow-hidden group ${cm.color}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-current shadow-sm shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base leading-tight">{cm.title}</h3>
                  <p className="font-extrabold text-sm mt-1">{cm.value}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">{cm.desc}</p>
            </a>
          );
        })}
      </div>

      {/* Two-column intake form & maps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
        {/* Intake form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-md p-6 md:p-8 flex flex-col justify-center relative">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h3 className="font-bold text-brand-blue text-lg">Send Online Enquiry</h3>
            <p className="text-xs text-gray-400 mt-0.5">Submit your query to receive a callback within 2 hours</p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-bold text-brand-blue">Submission Successful!</h3>
              <p className="text-gray-600 max-w-md mx-auto text-sm">
                Your requirements have been logged successfully. A KML Finance senior advisor is reviewing your request and will call you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name" 
                    value={leadForm.name}
                    onChange={e => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-colors text-sm"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="Enter phone number" 
                    value={leadForm.phone}
                    onChange={e => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-colors text-sm"
                  />
                </div>

                {/* Service */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service Required</label>
                  <div className="relative">
                    <select 
                      value={leadForm.service}
                      onChange={e => setLeadForm(prev => ({ ...prev, service: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-colors appearance-none text-gray-700 text-sm font-medium"
                    >
                      <option value="">Select Service</option>
                      <option value="loans">Loans</option>
                      <option value="insurance">Insurance</option>
                      <option value="forex">Forex</option>
                      <option value="travel">Tour & Travel</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <ChevronRight className="transform rotate-90" size={16} />
                    </div>
                  </div>
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
                  <input 
                    type="text" 
                    placeholder="Your city" 
                    value={leadForm.city}
                    onChange={e => setLeadForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmittingLead}
                className="w-full bg-brand-gold hover:bg-yellow-400 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-brand-blue font-bold py-3.5 rounded-xl mt-4 flex items-center justify-center transition-all duration-300 shadow-md shadow-brand-gold/15 cursor-pointer active:scale-[0.98] text-sm"
              >
                {isSubmittingLead ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin text-brand-blue" size={18} />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <>
                    Submit My Requirements
                    <ClipboardCheck className="ml-2" size={18} />
                  </>
                )}
              </button>

              {leadStatusMsg && (
                <p className={`text-xs font-semibold mt-2 text-center ${leadStatusMsg.startsWith('Error') ? 'text-red-600' : 'text-brand-blue animate-pulse'}`}>
                  {leadStatusMsg}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Map Placeholder or Embed */}
        <div className="lg:col-span-5 bg-[#0b132c] text-white rounded-2xl border border-white/5 p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.06),transparent_40%)]" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-2.5">
              <MapPin className="text-brand-gold" size={20} />
              <h3 className="font-bold text-white text-lg">Location Details</h3>
            </div>
            
            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <Building size={16} className="text-brand-gold shrink-0 mt-0.5" />
                <span>
                  First Floor, Shop No 7,<br />
                  Near Allen Coaching, Piprali Road,<br />
                  Sikar Rajasthan-332001
                </span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <Clock size={16} className="text-brand-gold shrink-0" />
                <span>Monday - Saturday: 9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <Globe size={16} className="text-brand-gold shrink-0" />
                <span>www.kmlfinance.com</span>
              </div>
            </div>
          </div>

          {/* Simple, interactive, highly polished visual map card */}
          <div className="mt-8 rounded-xl border border-white/10 overflow-hidden h-44 bg-slate-900 relative">
            {/* Visual map effect using tailwind styling rather than actual heavyweight iframe blocks */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-blue flex items-center justify-center animate-bounce shadow-lg">
                <MapPin size={18} />
              </div>
              <span className="text-white font-bold text-xs mt-2.5">KML Finance - Sikar</span>
              <span className="text-gray-400 text-[10px] mt-0.5">Piprali Road Near Allen Coaching</span>
              <a 
                href="https://maps.google.com/?q=Piprali+Road+Sikar"
                target="_blank"
                rel="noreferrer"
                className="mt-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold px-3 py-1 rounded text-[10px] transition-all"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
