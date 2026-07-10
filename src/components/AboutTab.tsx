import { 
  Sparkles, 
  CircleCheck, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Building,
  Target,
  Award
} from 'lucide-react';

export default function AboutTab() {
  const milestones = [
    { label: "Years of Trust", value: "5+ Years" },
    { label: "Happy Clients Served", value: "1,500+" },
    { label: "Total Loan Disbursals", value: "₹50 Cr+" },
    { label: "Banking & Insurance Partners", value: "25+ Top Brands" }
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Absolute Integrity",
      desc: "We prioritize complete transparency. No hidden charges, no false promises, and full upfront communication on interest charges."
    },
    {
      icon: TrendingUp,
      title: "Client-Centric Approach",
      desc: "Our business depends on your growth. We customize loan, insurance, and travel templates specifically around your individual cashflow requirements."
    },
    {
      icon: Clock,
      title: "Efficiency & Speed",
      desc: "In finance, delay is expense. We optimize document workflows, enabling pre-approvals and instant disbursals within tight deadlines."
    }
  ];

  return (
    <div id="about-tab-view" className="animate-fade-in space-y-16 py-8">
      {/* Header section */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 md:p-12 overflow-hidden shadow-xl border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.08),transparent_40%)]" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/15 text-brand-gold border border-brand-gold/25">
            <Sparkles size={12} />
            Established in Sikar
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            About KML Finance
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Rajasthan’s reliable and multi-faceted advisory hub. We bridge the gap between financial complexities and smooth executions, offering complete support for credit funding, lifestyle insurances, foreign exchanges, and global tours.
          </p>
        </div>
      </div>

      {/* Stats milestones bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {milestones.map((st, idx) => (
          <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
            <span className="text-2xl md:text-3xl font-black text-brand-blue block">{st.value}</span>
            <span className="text-xs text-gray-500 font-medium mt-1.5 block">{st.label}</span>
          </div>
        ))}
      </div>

      {/* Main Copy columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-left">
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Our Background</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue leading-tight">One Advisor. Infinite Possibilities.</h2>
          <div className="w-12 h-1 bg-brand-gold rounded-full" />
          
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            KML Finance was founded with a singular, client-first vision: to provide a simplified, highly consolidated financial ecosystem. We recognized that individuals and business owners waste hundreds of hours navigating multiple agencies—going to one broker for home loans, another for business working capital, a separate portal for health insurance, and different outlets for travel visas and currencies.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            By establishing deep, institutional integrations with top public/private banking sectors and global insurance providers, we brought all these complex products under one clean, premium roof in Sikar, Rajasthan. Our end-to-end guided assistance saves client effort, avoids unnecessary application rejections, and delivers lowest-cost terms.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative space-y-6 overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center shrink-0">
              <Target size={24} />
            </div>
            <div>
              <h3 className="font-bold text-brand-blue text-lg">Our Mission</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                To simplify access to secure finance, insurance, and travel packages, enabling local entrepreneurs and households across Rajasthan to grow, travel, and shield their future without administrative friction.
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200/60">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-brand-green flex items-center justify-center shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h3 className="font-bold text-brand-blue text-lg">Our Vision</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                To become Rajasthan’s premier digital-and-physical consulting platform, recognized for absolute compliance, rapid approval cycles, and dedicated, highly-personalized advisory relationships.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Behavioral Code</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mt-1">Our Core Values</h2>
          <div className="w-12 h-1 bg-brand-gold mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {values.map((vl, idx) => {
            const Icon = vl.icon;
            return (
              <div key={idx} className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-brand-blue text-lg mb-3 leading-tight">{vl.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{vl.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sikar Office details */}
      <div className="bg-[#0b132c] text-white p-8 md:p-12 rounded-2xl flex flex-col lg:flex-row gap-10 items-center justify-between text-left border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.06),transparent_40%)]" />
        <div className="space-y-4 max-w-xl relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs text-brand-gold font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <Building size={12} /> Visit Our Regional Office
          </span>
          <h3 className="text-2xl font-bold leading-tight">Welcome to Our Sikar Head Office</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Have physical documents or need a direct, face-to-face consultation with a Senior Credit Analyst? Drop by our comfortable regional office in Piprali Road, Sikar. Our doors are open Monday to Saturday.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4 relative z-10 shrink-0 w-full lg:w-96 text-xs text-gray-200">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-brand-gold shrink-0 mt-0.5" />
            <span>First Floor, Shop No 7, Near Allen Coaching, Piprali Road, Sikar Rajasthan-332001</span>
          </div>
          <div className="flex items-center gap-3 border-t border-white/5 pt-3">
            <Phone size={16} className="text-brand-gold shrink-0" />
            <a href="tel:+917977479299" className="hover:text-brand-gold transition-colors">+91 79774 79299</a>
          </div>
          <div className="flex items-center gap-3 border-t border-white/5 pt-3">
            <Mail size={16} className="text-brand-gold shrink-0" />
            <a href="mailto:kml.finance.1@gmail.com" className="hover:text-brand-gold transition-colors">kml.finance.1@gmail.com</a>
          </div>
          <div className="flex items-center gap-3 border-t border-white/5 pt-3 text-[11px] text-gray-400">
            <Clock size={16} className="text-brand-gold shrink-0" />
            <span>Mon - Sat: 9:00 AM - 7:00 PM (Sunday Closed)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
