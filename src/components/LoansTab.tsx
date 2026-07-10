import { useState } from 'react';
import { 
  HandCoins, 
  CircleCheck, 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Sparkles,
  Briefcase,
  Home,
  GraduationCap,
  FileText
} from 'lucide-react';

interface LoansTabProps {
  onApplyClick: (loanType: 'Personal' | 'Business' | 'Housing' | 'Education') => void;
}

export default function LoansTab({ onApplyClick }: LoansTabProps) {
  // Local EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(1500000); // 15 Lakh
  const [rateOfInterest, setRateOfInterest] = useState(8.75); // 8.75%
  const [loanTenure, setLoanTenure] = useState(7); // 7 years

  // Calculate Monthly EMI
  const monthlyRate = rateOfInterest / 12 / 100;
  const totalMonths = loanTenure * 12;
  const monthlyEmi = loanAmount > 0 && monthlyRate > 0 && totalMonths > 0
    ? Math.round(
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      )
    : 0;
  const totalPayable = monthlyEmi * totalMonths;
  const totalInterest = totalPayable - loanAmount;

  // Format currency
  const formatINR = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const loanProducts = [
    {
      id: 'Personal' as const,
      icon: HandCoins,
      title: "Personal Loan",
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
      interest: "Starting at 10.5% p.a.",
      description: "Quick personal funding for medical emergencies, home renovation, wedding expenses, or vacation planning with minimal document requirements.",
      features: [
        "Unsecured loan up to ₹25 Lakhs",
        "Flexible repayment tenures from 1 to 5 years",
        "Disbursal in 24-48 business hours",
        "No end-use restriction"
      ]
    },
    {
      id: 'Business' as const,
      icon: Briefcase,
      title: "Business Loan",
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50",
      interest: "Starting at 13.0% p.a.",
      description: "Fuel your business expansion, fund working capital, upgrade machineries, or stock up inventory with customized business credit lines.",
      features: [
        "Loans up to ₹50 Lakhs without collateral",
        "Repayment cycles customized for cashflow",
        "Minimum 1 year of business vintage required",
        "Tax benefits on interest paid"
      ]
    },
    {
      id: 'Housing' as const,
      icon: Home,
      title: "Home Loan & LAP",
      color: "from-violet-600 to-purple-600",
      textColor: "text-violet-600",
      bgLight: "bg-violet-50",
      interest: "Starting at 8.4% p.a.",
      description: "Turn your dream home into reality with low-interest home purchasing schemes, or unlock high capital with Loan Against Property (LAP).",
      features: [
        "Home purchase, construction, or extension",
        "Loan Against Property up to 70% market value",
        "Long tenures up to 30 years for home loans",
        "Easy balance transfer with low top-ups"
      ]
    },
    {
      id: 'Education' as const,
      icon: GraduationCap,
      title: "Education Loan",
      color: "from-amber-600 to-orange-600",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50",
      interest: "Starting at 9.5% p.a.",
      description: "Fund high education in India and overseas. Cover university admission fees, accommodation charges, air travel, and educational supplies.",
      features: [
        "100% funding for top-tier global universities",
        "Moratorium period (course duration + 1 year)",
        "Co-applicant models for parents/guardians",
        "Income tax deduction benefits under Sec 80E"
      ]
    }
  ];

  return (
    <div id="loans-tab-view" className="animate-fade-in space-y-16 py-8">
      {/* Page Header banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white p-8 md:p-12 overflow-hidden shadow-xl border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.12),transparent_40%)]" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/15 text-brand-gold border border-brand-gold/25">
            <Sparkles size={12} />
            Tailor-Made Loan Products
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Seamless Loan Solutions with KML Finance
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            We partner with India's leading banks & NBFCs to fetch you the lowest possible interest rates, minimal processing fees, and quick approvals with fully guided support.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg flex items-center gap-2">
              <Clock size={16} className="text-brand-gold" />
              <span className="text-sm font-medium">Quick 24h Assessment</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-gold" />
              <span className="text-sm font-medium">Interest starting at 8.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Loan Types */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue">Explore Our Loan Catalog</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Compare our interest brackets, features, and select the right financing option that suits your requirements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loanProducts.map((prod) => {
            const Icon = prod.icon;
            return (
              <div key={prod.id} className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
                <div className={`p-6 bg-gradient-to-r ${prod.color} text-white flex justify-between items-center`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg leading-tight">{prod.title}</h3>
                      <p className="text-white/80 text-xs mt-0.5">{prod.interest}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    KML Elite
                  </span>
                </div>

                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-6">
                  <p className="text-gray-600 text-sm leading-relaxed">{prod.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <CircleCheck size={14} className={prod.textColor} /> Key Benefits
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                      {prod.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 mr-2 shrink-0 ${prod.id === 'Personal' ? 'bg-blue-600' : prod.id === 'Business' ? 'bg-emerald-600' : prod.id === 'Housing' ? 'bg-violet-600' : 'bg-amber-600'}`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400">Guided Paperwork</span>
                    <button 
                      onClick={() => onApplyClick(prod.id)}
                      className={`inline-flex items-center gap-1.5 text-sm font-bold ${prod.textColor} hover:underline cursor-pointer`}
                    >
                      Apply Online
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Section: EMI Calculator & Document Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* EMI Calculator */}
        <div className="lg:col-span-7 bg-[#0b132c] text-white rounded-2xl border border-white/5 overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <Calculator className="text-brand-gold" size={20} />
            <h3 className="text-lg font-bold">Comprehensive EMI Estimator</h3>
          </div>
          
          <div className="p-6 sm:p-8 space-y-6">
            {/* Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <label className="text-gray-300 font-medium">Required Loan Amount</label>
                <span className="text-brand-gold font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10">
                  {formatINR(loanAmount)}
                </span>
              </div>
              <input 
                type="range" 
                min="100000" 
                max="20000000" 
                step="100000" 
                value={loanAmount} 
                onChange={e => setLoanAmount(Number(e.target.value))} 
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>₹1 Lakh</span>
                <span>₹2 Crores</span>
              </div>
            </div>

            {/* Interest Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <label className="text-gray-300 font-medium">Interest Bracket (p.a.)</label>
                <span className="text-brand-gold font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10">
                  {rateOfInterest}%
                </span>
              </div>
              <input 
                type="range" 
                min="6" 
                max="24" 
                step="0.05" 
                value={rateOfInterest} 
                onChange={e => setRateOfInterest(Number(e.target.value))} 
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>6%</span>
                <span>24%</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <label className="text-gray-300 font-medium">Repayment Tenure (Years)</label>
                <span className="text-brand-gold font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10">
                  {loanTenure} Years
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="1" 
                value={loanTenure} 
                onChange={e => setLoanTenure(Number(e.target.value))} 
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Calculation Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Monthly EMI</p>
                <h4 className="text-xl font-bold text-brand-gold">{formatINR(monthlyEmi)}</h4>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Total Interest</p>
                <h4 className="text-sm font-semibold text-white">{formatINR(totalInterest > 0 ? totalInterest : 0)}</h4>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Total Payable</p>
                <h4 className="text-sm font-semibold text-white">{formatINR(totalPayable > 0 ? totalPayable : 0)}</h4>
              </div>
            </div>

            <button 
              onClick={() => onApplyClick('Personal')}
              className="w-full py-3.5 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-blue font-bold tracking-wide shadow-md shadow-brand-gold/10 transition-all cursor-pointer text-sm uppercase text-center"
            >
              Start Your Application Process
            </button>
          </div>
        </div>

        {/* Document Checklist */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-md space-y-6">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-brand-blue text-lg">Documentation Guide</h3>
              <p className="text-gray-400 text-xs mt-0.5">Keep these ready to process approvals fast</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-800">1. Basic KYC (All Applicants)</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full shrink-0" />
                  <span>PAN Card (Mandatory for credit score checking)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full shrink-0" />
                  <span>Aadhaar Card or Passport (Address Proof)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full shrink-0" />
                  <span>Passport size photograph (Digital copy)</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-50">
              <h4 className="text-sm font-bold text-gray-800">2. Income Proof (Salaried)</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                  <span>Salary Slips for the last 3 consecutive months</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                  <span>6 Months bank account statement reflecting salary credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                  <span>Form 16 or ITR filings of previous year</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-50">
              <h4 className="text-sm font-bold text-gray-800">3. Business Proof (Self-Employed)</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                  <span>ITR filings with Balance Sheet & P&L for previous 2 years</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                  <span>GST registration, MSME certificate, or shop license</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                  <span>Last 12 Months primary business current bank statement</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 flex gap-2.5">
            <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p><strong>Security Note:</strong> All client documents are treated with utmost privacy. We store and transmit details under fully secure and ISO-certified infrastructure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
