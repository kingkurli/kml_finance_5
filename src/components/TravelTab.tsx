import { useState } from 'react';
import { 
  Plane, 
  CircleCheck, 
  Sparkles,
  ArrowRight,
  Globe2,
  Calendar,
  Compass,
  MapPin,
  Palmtree,
  ShieldCheck,
  Search
} from 'lucide-react';

interface TravelTabProps {
  onTravelEnquiry: (details: string) => void;
}

export default function TravelTab({ onTravelEnquiry }: TravelTabProps) {
  // Flight simulation states
  const [flightType, setFlightType] = useState<'round' | 'oneway'>('round');
  const [fromCity, setFromCity] = useState('Delhi (DEL)');
  const [toCity, setToCity] = useState('Dubai (DXB)');
  const [departureDate, setDepartureDate] = useState('2026-08-15');
  const [passengers, setPassengers] = useState(1);
  const [simulatedFlights, setSimulatedFlights] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const popularPackages = [
    {
      id: "pkg1",
      title: "Exotic Dubai Getaway",
      duration: "5 Nights / 6 Days",
      price: "₹45,999 onwards",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600&h=400",
      highlights: ["Burj Khalifa Entry", "Desert Safari with Dinner", "Dubai Marina Dhow Cruise", "Daily Breakfast & Visa Included"]
    },
    {
      id: "pkg2",
      title: "Splendid Kashmir Valley Tour",
      duration: "6 Nights / 7 Days",
      price: "₹24,500 onwards",
      image: "https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&q=80&w=600&h=400",
      highlights: ["Srinagar Houseboat Stay", "Gondola ride in Gulmarg", "Pahalgam Valley Tour", "Private Sedan Transfers"]
    },
    {
      id: "pkg3",
      title: "Amazing Bali Leisure Pack",
      duration: "5 Nights / 6 Days",
      price: "₹38,000 onwards",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600&h=400",
      highlights: ["Ubud Private Pool Villa", "Kintamani Volcano Trek", "Sunset Tanah Lot Temple", "Airport Pick & Drop"]
    },
    {
      id: "pkg4",
      title: "Magical Kerala Backwaters",
      duration: "4 Nights / 5 Days",
      price: "₹18,500 onwards",
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600&h=400",
      highlights: ["Munnar Tea Gardens", "Alleppey Houseboat Cruise", "Thekkady Spice Plantation", "All Transfers Included"]
    }
  ];

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      // Simulate realistic flight suggestions
      setSimulatedFlights([
        { airline: "IndiGo", depTime: "07:15", arrTime: "09:45", price: "₹12,499", duration: "3h 30m", stops: "Non-stop" },
        { airline: "Emirates", depTime: "11:20", arrTime: "13:30", price: "₹21,800", duration: "3h 40m", stops: "Non-stop" },
        { airline: "Air India", depTime: "18:40", arrTime: "21:10", price: "₹14,200", duration: "3h 30m", stops: "Non-stop" }
      ]);
      setIsSearching(false);
    }, 1200);
  };

  return (
    <div id="travel-tab-view" className="animate-fade-in space-y-16 py-8">
      {/* Header section */}
      <div className="relative rounded-2xl bg-gradient-to-r from-orange-900 via-orange-950 to-slate-900 text-white p-8 md:p-12 overflow-hidden shadow-xl border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_40%)]" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/15 text-brand-gold border border-brand-gold/25">
            <Sparkles size={12} />
            Complete Trip Planners
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Crafting Memorable Journeys
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            From quick domestic flights to grand international holidays, visa filings, and hotel reservations. KML Travel takes care of all the complex logistics while you create memories.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg flex items-center gap-2">
              <Compass size={16} className="text-brand-gold" />
              <span className="text-sm font-medium">Customizable Holiday Itineraries</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand-gold" />
              <span className="text-sm font-medium">Verified Fast Visa Assistance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Search Widget & simulated results */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
        <div className="bg-brand-orange text-white px-6 py-4 flex items-center gap-2.5">
          <Plane size={20} />
          <h3 className="font-bold">Real-time Flight Finder</h3>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleFlightSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Trip Type</label>
              <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
                <button 
                  type="button"
                  onClick={() => setFlightType('round')}
                  className={`flex-1 py-1 text-xs font-bold rounded cursor-pointer transition-all ${flightType === 'round' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Round
                </button>
                <button 
                  type="button"
                  onClick={() => setFlightType('oneway')}
                  className={`flex-1 py-1 text-xs font-bold rounded cursor-pointer transition-all ${flightType === 'oneway' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  One-way
                </button>
              </div>
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Leaving From</label>
              <input 
                type="text" 
                value={fromCity}
                onChange={e => setFromCity(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white font-medium outline-none"
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Going To</label>
              <input 
                type="text" 
                value={toCity}
                onChange={e => setToCity(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white font-medium outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Departure Date</label>
              <input 
                type="date" 
                value={departureDate}
                onChange={e => setDepartureDate(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-xs bg-white font-medium outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <button 
                type="submit"
                disabled={isSearching}
                className="w-full bg-brand-orange hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all text-sm cursor-pointer shadow-md shadow-brand-orange/10"
              >
                {isSearching ? 'Searching...' : 'Find Flights'}
                <Search size={16} />
              </button>
            </div>
          </form>

          {simulatedFlights && (
            <div className="pt-6 border-t border-gray-100 animate-slide-up space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Simulated Flight Deals for {fromCity} → {toCity}</h4>
              <div className="space-y-2.5">
                {simulatedFlights.map((fl, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-orange/20 transition-all">
                    <div>
                      <span className="text-sm font-bold text-gray-800 block">{fl.airline}</span>
                      <span className="text-xs text-gray-400 mt-0.5 block">{fl.stops} • {fl.duration}</span>
                    </div>
                    <div className="text-left sm:text-center">
                      <span className="text-sm font-bold text-gray-800 block">{fl.depTime} - {fl.arrTime}</span>
                      <span className="text-xs text-gray-400 mt-0.5 block">{fromCity.split(' ')[0]} to {toCity.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                      <div>
                        <span className="text-xs text-gray-400 block">Starting Fare</span>
                        <span className="text-lg font-extrabold text-brand-orange">{fl.price}</span>
                      </div>
                      <button 
                        onClick={() => onTravelEnquiry(`Flight ticket from ${fromCity} to ${toCity} on ${departureDate}`)}
                        className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded text-xs transition-all cursor-pointer"
                      >
                        Book Flight
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Holiday Packages Portfolio */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue">Curated Holiday Packages</h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Handpicked itineraries covering sightseeing, local guide transfers, dining, and premium hotels.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {popularPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row group">
              <div className="md:w-2/5 h-48 md:h-full min-h-[180px] relative overflow-hidden shrink-0">
                <img 
                  src={pkg.image} 
                  alt={pkg.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-brand-orange text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  Best Seller
                </div>
              </div>

              <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-extrabold text-brand-blue text-base sm:text-lg leading-tight">{pkg.title}</h3>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400 mt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-brand-orange" /> {pkg.duration}
                    </span>
                  </div>

                  <ul className="space-y-1.5 mt-4">
                    {pkg.highlights.map((hlt, hIdx) => (
                      <li key={hIdx} className="flex items-start text-xs text-gray-600">
                        <CircleCheck size={13} className="text-brand-orange mr-2 mt-0.5 shrink-0" />
                        <span>{hlt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Price Guide</span>
                    <span className="text-sm font-extrabold text-brand-orange">{pkg.price}</span>
                  </div>
                  <button 
                    onClick={() => onTravelEnquiry(`Holiday package: ${pkg.title} (${pkg.duration})`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline cursor-pointer"
                  >
                    Send Enquiry
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom trip planning block */}
      <div className="bg-amber-50 rounded-2xl border border-amber-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-2xl text-left">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Palmtree size={12} /> Custom Itinerary
          </span>
          <h3 className="text-xl font-bold text-brand-blue">Want to design your own customized trip package?</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Tell us your travel destinations, number of travelers, budget per head, and required travel style. Our destination experts will formulate a personalized day-wise plan within 3 hours.
          </p>
        </div>
        <button 
          onClick={() => onTravelEnquiry('Requesting a custom holiday itinerary')}
          className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-lg text-sm shrink-0 shadow-md shadow-brand-orange/10 transition-all cursor-pointer"
        >
          Customize My Holiday
        </button>
      </div>
    </div>
  );
}
