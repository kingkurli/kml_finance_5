import { useState } from 'react';
import { 
  Shield, 
  CircleCheck, 
  HeartPulse, 
  Car, 
  Heart, 
  Plane, 
  Sparkles,
  ArrowRight,
  Activity,
  Award,
  Users
} from 'lucide-react';

interface InsuranceTabProps {
  onQuoteClick: (serviceType: string) => void;
}

export default function InsuranceTab({ onQuoteClick }: InsuranceTabProps) {
  // Local Premium Calculator State
  const [insuranceType, setInsuranceType] = useState<'health' | 'life'>('health');
  const [userAge, setUserAge] = useState(30);
  const [coverageSize, setCoverageSize] = useState(500000); // 5 Lakh default for health, or 50L for life
  const [includeCriticalIllness, setIncludeCriticalIllness] = useState(false);
  const [includeAccidentalCover, setIncludeAccidentalCover] = useState(false);

  // Live premium calculation based on simple rules
  let calculatedPremium = 0;
  if (insuranceType === 'health') {
    // Health Insurance: Base rate for 5 Lakh is roughly ₹8,000/year at age 30.
    // Scale with age (approx +2% per year over 18) and coverage size (proportional).
    const baseRate = 6000;
    const ageFactor = 1 + (userAge - 18) * 0.03;
    const coverageFactor = coverageSize / 500000;
    calculatedPremium = baseRate * ageFactor * coverageFactor;
    if (includeCriticalIllness) calculatedPremium += 1200 * coverageFactor;
    if (includeAccidentalCover) calculatedPremium += 800;
  } else {
    // Term Life: Base rate for 1 Crore (10000000) is roughly ₹12,000/year at age 30.
    // Life coverage slider represents term cover. Let's adapt coverage factor.
    const baseRate = 8000;
    const ageFactor = 1 + (userAge - 18) * 0.045;
    const coverageFactor = coverageSize / 5000000; // relative to 50 Lakh
    calculatedPremium = baseRate * ageFactor * coverageFactor;
    if (includeCriticalIllness) calculatedPremium += 2500;
    if (includeAccidentalCover) calculatedPremium += 1500;
  }

  const formatINR = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const insuranceProducts = [
    {
      id: "health",
      icon: HeartPulse,
      title: "Health Insurance",
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50",
      claimRatio: "99.1% Claim Settlement",
      tagline: "Secure your family's health against unforeseen medical expenses.",
      bulletPoints: [
        "Cashless hospitalization in 10,000+ network hospitals",
        "Pre and post hospitalization costs covered up to 60/180 days",
        "No-claim bonus rewards (up to 100% sum insured multiplier)",
        "Tax deductions on premiums paid under Section 80D"
      ]
    },
    {
      id: "motor",
      icon: Car,
      title: "Motor Insurance",
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
      claimRatio: "Instant Cashless Repairs",
      tagline: "Comprehensive car & bike protection from road damages & third-party liability.",
      bulletPoints: [
        "Paperless instant renewal with active no-claim transfers",
        "Add-ons: Zero Depreciation, Engine Protection, Roadside Assistance",
        "Over 5,000+ cashless garage networks across India",
        "Up to 50% discount on NCB transfer from prior insurers"
      ]
    },
    {
      id: "life",
      icon: Heart,
      title: "Life / Term Insurance",
      color: "from-purple-600 to-violet-600",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
      claimRatio: "99.4% Claim Settled",
      tagline: "Protect your family's future lifestyle & debts in your absence.",
      bulletPoints: [
        "High cover term insurance of ₹1 Crore at minimal premium cost",
        "Optional riders: Accidental Death Benefit, Waiver of Premium",
        "Guaranteed payout directly to nominees with fast processing",
        "Income tax deduction benefits under Section 80C"
      ]
    },
    {
      id: "travel",
      icon: Plane,
      title: "Travel Insurance",
      color: "from-orange-600 to-amber-600",
      textColor: "text-orange-600",
      bgLight: "bg-orange-50",
      claimRatio: "Global Emergency Medicals",
      tagline: "Worry-free overseas trips with instant international insurance policies.",
      bulletPoints: [
        "Coverage for medical emergencies and emergency evacuations",
        "Compensations for flight delays, passport loss, or baggage loss",
        "Includes Covid-19 hospitalization cover abroad",
        "Meets all Schengen and European visa requirements"
      ]
    }
  ];

  return (
    <div id="insurance-tab-view" className="animate-fade-in space-y-16 py-8">
      {/* Header section */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white p-8 md:p-12 overflow-hidden shadow-xl border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_40%)]" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/15 text-brand-gold border border-brand-gold/25">
            <Sparkles size={12} />
            Instant & Paperless Quotes
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Protect What Matters Most with KML Insurance
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            We simplify insurance, offering handpicked plans from the nation's top insurers with high claim settlement ratios, smooth hassle-free documentation, and 24/7 support during claims.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg flex items-center gap-2">
              <Activity size={16} className="text-brand-gold" />
              <span className="text-sm font-medium">100% Cashless Medical Hospitalization</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg flex items-center gap-2">
              <Award size={16} className="text-brand-gold" />
              <span className="text-sm font-medium">Top Rated Claim Support Officers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Insurance Packages */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue">Insurance Portfolio</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Custom policies curated to secure your household, health, transport, and international travels.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {insuranceProducts.map((prod) => {
            const Icon = prod.icon;
            return (
              <div key={prod.id} className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
                <div className={`p-6 bg-gradient-to-r ${prod.color} text-white flex justify-between items-center`}>
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg leading-tight">{prod.title}</h3>
                      <p className="text-white/80 text-xs mt-0.5">{prod.claimRatio}</p>
                    </div>
                  </div>
                  <Shield size={20} className="text-white/30" />
                </div>

                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-6">
                  <div>
                    <p className="text-gray-700 font-semibold text-sm mb-4">{prod.tagline}</p>
                    <ul className="space-y-2.5 text-xs text-gray-600">
                      {prod.bulletPoints.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start">
                          <CircleCheck size={14} className={`${prod.textColor} mr-2 mt-0.5 shrink-0`} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400">Section 80D tax benefits</span>
                    <button 
                      onClick={() => onQuoteClick(prod.id)}
                      className={`inline-flex items-center gap-1 text-sm font-bold ${prod.textColor} hover:underline cursor-pointer`}
                    >
                      Get Quick Quote
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Section: Premium Calculator & Benefits Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Premium Calculator Card */}
        <div className="lg:col-span-7 bg-[#0b132c] text-white rounded-2xl border border-white/5 overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <Shield className="text-brand-gold" size={20} />
            <h3 className="text-lg font-bold">Quick Premium Calculator</h3>
          </div>
          
          <div className="p-6 sm:p-8 space-y-6">
            {/* Tab switch */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => {
                  setInsuranceType('health');
                  setCoverageSize(500000);
                }}
                className={`flex-1 py-2.5 text-center text-sm font-bold rounded-lg cursor-pointer transition-all ${insuranceType === 'health' ? 'bg-brand-gold text-brand-blue shadow-md' : 'text-gray-300 hover:text-white'}`}
              >
                Health Insurance
              </button>
              <button 
                onClick={() => {
                  setInsuranceType('life');
                  setCoverageSize(10000000);
                }}
                className={`flex-1 py-2.5 text-center text-sm font-bold rounded-lg cursor-pointer transition-all ${insuranceType === 'life' ? 'bg-brand-gold text-brand-blue shadow-md' : 'text-gray-300 hover:text-white'}`}
              >
                Term Life Insurance
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Age Slider */}
              <div className="space-y-2 bg-white/5 border border-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300">Age of Applicant</span>
                  <span className="text-brand-gold font-bold">{userAge} Years</span>
                </div>
                <input 
                  type="range" 
                  min="18" 
                  max="65" 
                  value={userAge} 
                  onChange={e => setUserAge(Number(e.target.value))} 
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
                />
                <div className="flex justify-between text-[8px] text-gray-400">
                  <span>18 Yrs</span>
                  <span>65 Yrs</span>
                </div>
              </div>

              {/* Coverage size Slider */}
              <div className="space-y-2 bg-white/5 border border-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300">Sum Insured Coverage</span>
                  <span className="text-brand-gold font-bold">{formatINR(coverageSize)}</span>
                </div>
                {insuranceType === 'health' ? (
                  <input 
                    type="range" 
                    min="200000" 
                    max="5000000" 
                    step="100000"
                    value={coverageSize} 
                    onChange={e => setCoverageSize(Number(e.target.value))} 
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
                  />
                ) : (
                  <input 
                    type="range" 
                    min="2500000" 
                    max="20000000" 
                    step="500000"
                    value={coverageSize} 
                    onChange={e => setCoverageSize(Number(e.target.value))} 
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
                  />
                )}
                <div className="flex justify-between text-[8px] text-gray-400">
                  {insuranceType === 'health' ? (
                    <>
                      <span>₹2 Lakhs</span>
                      <span>₹50 Lakhs</span>
                    </>
                  ) : (
                    <>
                      <span>₹25 Lakhs</span>
                      <span>₹2 Crores</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Riders */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Optional Riders & Add-ons</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 bg-white/5 border border-white/5 hover:border-white/10 p-3.5 rounded-lg cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeCriticalIllness}
                    onChange={e => setIncludeCriticalIllness(e.target.checked)}
                    className="accent-brand-gold w-4 h-4" 
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold block text-white">Critical Illness Rider</span>
                    <span className="text-[10px] text-gray-400">Payout on 36 core ailments</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 bg-white/5 border border-white/5 hover:border-white/10 p-3.5 rounded-lg cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeAccidentalCover}
                    onChange={e => setIncludeAccidentalCover(e.target.checked)}
                    className="accent-brand-gold w-4 h-4" 
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold block text-white">Accidental Disability Cover</span>
                    <span className="text-[10px] text-gray-400">Dual payout on accidental crashes</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Estimated Quote results */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Estimated Annual Premium (excl. GST)</p>
              <h4 className="text-3xl font-extrabold text-brand-gold">
                {formatINR(calculatedPremium)}
              </h4>
              <p className="text-[10px] text-gray-400 mt-2">
                Approx. {formatINR(Math.round(calculatedPremium / 12))}/month. Final rates are based on your health assessment logs.
              </p>
            </div>

            <button 
              onClick={() => onQuoteClick(insuranceType)}
              className="w-full py-3.5 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-blue font-bold tracking-wide transition-all cursor-pointer text-sm uppercase text-center"
            >
              Request Custom Policy Proposal
            </button>
          </div>
        </div>

        {/* Benefits details panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-md space-y-6">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-brand-blue text-lg">Why Curate with KML?</h3>
              <p className="text-gray-400 text-xs mt-0.5">We don't sell blindly. We advisory-match.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">Unbiased Advisory Matching</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">We analyze premium rates across 15+ companies to recommend the highest cashless network in your locality.</p>
              </div>
            </div>

            <div className="flex gap-4 pt-3 border-t border-gray-50">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">Assigned Claims Helpdesk</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">No need to argue with third-party administrators. In case of hospitalizations, our dedicated claims desk coordinates with the insurer directly.</p>
              </div>
            </div>

            <div className="flex gap-4 pt-3 border-t border-gray-50">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">Active Renewal Protection</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">We track policy renewals, ensuring you transfer your pre-existing No-Claim Bonus (NCB) safely without lapses.</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-xs text-emerald-800">
            <span className="font-bold block mb-1">Tax Benefits Warning:</span>
            <span>You can claim deductions up to ₹25,000 for self/family, and an additional ₹50,000 for senior citizen parents under Section 80D of the Income Tax Act.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
