import { useState } from 'react';
import { 
  Coins, 
  CircleCheck, 
  ArrowLeftRight, 
  Plane, 
  Briefcase, 
  GraduationCap, 
  Sparkles,
  ArrowRight,
  FileText,
  BadgeAlert,
  Globe2
} from 'lucide-react';

interface ForexTabProps {
  onForexRequest: (serviceType: string) => void;
}

export default function ForexTab({ onForexRequest }: ForexTabProps) {
  // Local Currency Estimator State
  const [exchangeType, setExchangeType] = useState<'buy' | 'sell'>('buy');
  const [foreignCurrency, setForeignCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD' | 'CAD'>('USD');
  const [currencyAmount, setCurrencyAmount] = useState(1000);

  // Exchange rates relative to INR (aesthetic estimates)
  const exchangeRates = {
    USD: { buy: 84.50, sell: 83.10 },
    EUR: { buy: 91.20, sell: 89.60 },
    GBP: { buy: 107.80, sell: 105.50 },
    AED: { buy: 23.10, sell: 22.40 },
    SGD: { buy: 62.80, sell: 61.20 },
    CAD: { buy: 62.10, sell: 60.50 }
  };

  const currentRate = exchangeRates[foreignCurrency][exchangeType];
  const calculatedTotal = currencyAmount * currentRate;

  const formatINR = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(num);
  };

  const forexServices = [
    {
      id: "exchange",
      icon: Coins,
      title: "Currency Exchange (Buy & Sell)",
      color: "from-purple-600 to-indigo-600",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
      desc: "Buy or sell physical foreign cash currencies. We guarantee the best currency exchange rates in Rajasthan with instant cash availability.",
      features: [
        "Major world currencies available (USD, EUR, GBP, AED, SAR, THB)",
        "Fully genuine, counterfeit-scanned physical notes",
        "Home delivery of currency in Sikar & Jaipur areas",
        "Sell back your leftover travel currency at competitive rates"
      ]
    },
    {
      id: "card",
      icon: Plane,
      title: "Multi-Currency Forex Cards",
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
      desc: "Travel cashless and safe. Lock in your exchange rates beforehand with our multi-currency prepaid contactless cards.",
      features: [
        "Load up to 16 currencies in a single chip card",
        "Protected from real-time market currency rate fluctuations",
        "Safe chip-and-PIN structure with instant SMS alerts",
        "Zero cross-currency markup on loaded funds at stores"
      ]
    },
    {
      id: "remit",
      icon: Globe2,
      title: "Outward University Remittance",
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50",
      desc: "Send money abroad safely for university fees, visa applications, family maintenance, or medical care according to LRS guidelines.",
      features: [
        "Direct transfers to global university bank accounts within 24 hours",
        "Lowest telegraphic transfer (TT) and banking transaction charges",
        "Fully compliant with Reserve Bank of India LRS regulations",
        "Assistance with A2 application form filing"
      ]
    }
  ];

  return (
    <div id="forex-tab-view" className="animate-fade-in space-y-16 py-8">
      {/* Header section */}
      <div className="relative rounded-2xl bg-gradient-to-r from-purple-900 via-purple-950 to-slate-900 text-white p-8 md:p-12 overflow-hidden shadow-xl border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_40%)]" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/15 text-brand-gold border border-brand-gold/25">
            <Sparkles size={12} />
            Best Exchange Rates Guaranteed
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Reliable Foreign Exchange Services
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Fast, secure, and fully licensed foreign exchange options for corporate travel, family holidays, or overseas student admissions. We save you from high airport exchange margins.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg flex items-center gap-2">
              <ArrowLeftRight size={16} className="text-brand-gold" />
              <span className="text-sm font-medium">No Hidden Service Fees</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg flex items-center gap-2">
              <Globe2 size={16} className="text-brand-gold" />
              <span className="text-sm font-medium">Licensed Under RBI Guidelines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Forex Products */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue">Foreign Exchange Solutions</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">We handle currency requirements for education, migration, corporate travel, and leisure tours smoothly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {forexServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div key={srv.id} className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
                <div className={`p-6 bg-gradient-to-r ${srv.color} text-white flex justify-between items-center`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base leading-tight">{srv.title}</h3>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-6">
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{srv.desc}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Core Features</h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {srv.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <CircleCheck size={14} className={`${srv.textColor} mr-2 mt-0.5 shrink-0`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => onForexRequest(srv.id)}
                      className={`w-full py-2.5 rounded font-bold text-xs uppercase tracking-wider text-center transition-all bg-gray-50 hover:bg-gray-100 ${srv.textColor} border border-gray-200 cursor-pointer active:scale-95`}
                    >
                      Enquire For Rates
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Section: Currency Estimator & LRS Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Currency Converter/Estimator */}
        <div className="lg:col-span-7 bg-[#0b132c] text-white rounded-2xl border border-white/5 overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <ArrowLeftRight className="text-brand-gold" size={20} />
            <h3 className="text-lg font-bold">Real-time Currency Estimator</h3>
          </div>
          
          <div className="p-6 sm:p-8 space-y-6">
            {/* Buy vs Sell */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setExchangeType('buy')}
                className={`flex-1 py-2.5 text-center text-sm font-bold rounded-lg cursor-pointer transition-all ${exchangeType === 'buy' ? 'bg-brand-gold text-brand-blue shadow-md' : 'text-gray-300 hover:text-white'}`}
              >
                I want to BUY (Outward Trip)
              </button>
              <button 
                onClick={() => setExchangeType('sell')}
                className={`flex-1 py-2.5 text-center text-sm font-bold rounded-lg cursor-pointer transition-all ${exchangeType === 'sell' ? 'bg-brand-gold text-brand-blue shadow-md' : 'text-gray-300 hover:text-white'}`}
              >
                I want to SELL (Inward Cash)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Foreign Currency Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Currency</label>
                <select 
                  value={foreignCurrency}
                  onChange={e => setForeignCurrency(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium outline-none text-sm focus:border-brand-gold"
                >
                  <option className="bg-[#0b132c]" value="USD">USD - US Dollar</option>
                  <option className="bg-[#0b132c]" value="EUR">EUR - Euro</option>
                  <option className="bg-[#0b132c]" value="GBP">GBP - British Pound</option>
                  <option className="bg-[#0b132c]" value="AED">AED - UAE Dirham</option>
                  <option className="bg-[#0b132c]" value="SGD">SGD - Singapore Dollar</option>
                  <option className="bg-[#0b132c]" value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>

              {/* Amount input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Foreign Currency Amount</label>
                <input 
                  type="number" 
                  min="10"
                  max="100000"
                  value={currencyAmount} 
                  onChange={e => setCurrencyAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-bold outline-none text-sm focus:border-brand-gold"
                />
              </div>
            </div>

            {/* Quote details */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Applicable Conversion Rate</span>
                <span className="text-lg font-bold text-white mt-1 block">1 {foreignCurrency} = {formatINR(currentRate)}</span>
              </div>
              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Total Payable in Indian Rupees</span>
                <span className="text-2xl font-extrabold text-brand-gold mt-1 block">{formatINR(calculatedTotal)}</span>
              </div>
            </div>

            <button 
              onClick={() => onForexRequest(exchangeType === 'buy' ? `Buy ${currencyAmount} ${foreignCurrency}` : `Sell ${currencyAmount} ${foreignCurrency}`)}
              className="w-full py-3.5 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-blue font-bold tracking-wide transition-all cursor-pointer text-sm uppercase text-center"
            >
              Lock in this rate & Request Forex
            </button>
          </div>
        </div>

        {/* LRS Guidelines */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-md space-y-6">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-brand-blue text-lg">Regulatory Guidelines</h3>
              <p className="text-gray-400 text-xs mt-0.5">Under FEMA / Reserve Bank of India</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                <BadgeAlert size={14} className="text-purple-700" /> Mandatory Documents
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                As per RBI regulations, physical currency purchases or remittances require:
              </p>
              <ul className="space-y-1 text-xs text-gray-700 mt-2 font-medium list-disc list-inside">
                <li>Valid Indian Passport</li>
                <li>Valid tourist/student visa or flight ticket</li>
                <li>PAN Card copy (linked with Aadhaar)</li>
                <li>Self-signed A2 application form</li>
              </ul>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600 leading-relaxed">
              <p>
                <strong>LRS Limit:</strong> Resident individuals can remit up to <strong>USD 250,000</strong> per financial year for permitted current or capital account transactions.
              </p>
              <p className="mt-2 text-[11px] text-gray-400">
                * Note: TCS (Tax Collected at Source) is applicable on foreign exchange transactions above ₹7 Lakhs as per Union Budget guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
