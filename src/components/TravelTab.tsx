import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Calculator, 
  MapPin, 
  Calendar, 
  Clock, 
  Check, 
  CheckCircle2, 
  Building2, 
  Users, 
  Phone, 
  Compass, 
  ShieldCheck, 
  ArrowRight, 
  Plane, 
  Navigation,
  Share2,
  Info,
  Search,
  ChevronRight,
  Award,
  Globe,
  Mail,
  HeartHandshake,
  ExternalLink
} from 'lucide-react';

import khatuShyamImg from '../assets/images/khatu_shyam_darshan_1787833741004.jpg';
import salasarBalajiImg from '../assets/images/salasar_balaji_darshan_1787833756920.jpg';
import jeenMataImg from '../assets/images/jeen_mata_temple_1787833774099.jpg';
import raniSatiImg from '../assets/images/rani_sati_temple_1787833791913.jpg';
import sakambhariMataImg from '../assets/images/sakambhari_mata_idol_1787833807755.jpg';
import innovaCrystaImg from '../assets/images/innova_crysta_tour_1787833823611.jpg';

interface TravelTabProps {
  onTravelEnquiry: (details: string) => void;
}

interface ShrineCard {
  id: string;
  calcId: string;
  name: string;
  hindiName: string;
  blessingHindi: string;
  location: string;
  distance: string;
  headerBg: string;
  headerText: string;
  borderColor: string;
  badgeColor: string;
  image: string;
}

const SHRINE_CARDS: ShrineCard[] = [
  {
    id: 'khatushyam',
    calcId: 'khatu',
    name: 'KHATU SHYAM JI',
    hindiName: 'बाबा खाटू श्याम जी',
    blessingHindi: 'बाबा खाटू श्याम जी के दर्शन करें और पाएं आशीर्वाद एवं सुख-समृद्धि।',
    location: 'Ringas / Khatu',
    distance: '45 km from Sikar',
    headerBg: 'bg-[#932717]',
    headerText: 'text-white',
    borderColor: 'border-[#932717]',
    badgeColor: 'bg-red-50 text-[#932717] border-red-200',
    image: khatuShyamImg
  },
  {
    id: 'jeenmata',
    calcId: 'jeenmata',
    name: 'JEEN MATA',
    hindiName: 'जीणमाता मंदिर',
    blessingHindi: 'जीणमाता मंदिर में दर्शन कर पाएं मनोकामना पूर्ण होने का वरदान।',
    location: 'Rewasa / Sikar',
    distance: '28 km from Sikar',
    headerBg: 'bg-[#1b6b45]',
    headerText: 'text-white',
    borderColor: 'border-[#1b6b45]',
    badgeColor: 'bg-emerald-50 text-[#1b6b45] border-emerald-200',
    image: jeenMataImg
  },
  {
    id: 'salasar',
    calcId: 'salasar',
    name: 'SALASAR BALAJI',
    hindiName: 'सालासर धाम',
    blessingHindi: 'बालाजी महाराज (सालासर धाम) के दर्शन से जीवन में खुशहाली।',
    location: 'Salasar, Churu',
    distance: '53 km from Sikar',
    headerBg: 'bg-[#c66b1a]',
    headerText: 'text-white',
    borderColor: 'border-[#c66b1a]',
    badgeColor: 'bg-amber-50 text-[#c66b1a] border-amber-200',
    image: salasarBalajiImg
  },
  {
    id: 'ranisati',
    calcId: 'ranisati',
    name: 'RAANI SATI MANDIR',
    hindiName: 'राणी सती माता',
    blessingHindi: 'राणी सती माता के दर्शन करें और शक्ति एवं साहस का आशीर्वाद लें।',
    location: 'Jhunjhunu',
    distance: '70 km from Sikar',
    headerBg: 'bg-[#4c317b]',
    headerText: 'text-white',
    borderColor: 'border-[#4c317b]',
    badgeColor: 'bg-purple-50 text-[#4c317b] border-purple-200',
    image: raniSatiImg
  },
  {
    id: 'sakambhari',
    calcId: 'sakambhari',
    name: 'SAKAMBHARI MATA',
    hindiName: 'सकाम्भरी माता',
    blessingHindi: 'सकाम्भरी माता के दर्शन से सभी कष्टों का निवारण होता है।',
    location: 'Sakambhari Hills',
    distance: '48 km from Sikar',
    headerBg: 'bg-[#0f647c]',
    headerText: 'text-white',
    borderColor: 'border-[#0f647c]',
    badgeColor: 'bg-cyan-50 text-[#0f647c] border-cyan-200',
    image: sakambhariMataImg
  },
  {
    id: 'mansamata',
    calcId: 'sakambhari',
    name: 'MANSA MATA',
    hindiName: 'मानसा माता',
    blessingHindi: 'मानसा माता के दर्शन से हर मनोकामना होती है पूरी।',
    location: 'Aravalli Hills',
    distance: '55 km from Sikar',
    headerBg: 'bg-[#8c223c]',
    headerText: 'text-white',
    borderColor: 'border-[#8c223c]',
    badgeColor: 'bg-rose-50 text-[#8c223c] border-rose-200',
    image: sakambhariMataImg
  }
];

const DESTINATIONS = [
  { id: 'khatu', name: 'Khatu Shyam Ji', location: 'Ringas / Khatu', distanceFromSikar: '45 km', significance: 'Sacred shrine of Barbarika / Shyam Baba' },
  { id: 'salasar', name: 'Salasar Balaji', location: 'Salasar, Churu', distanceFromSikar: '53 km', significance: 'Famous miraculous Hanuman Ji temple' },
  { id: 'jeenmata', name: 'Jeen Mata', location: 'Rewasa, Sikar', distanceFromSikar: '28 km', significance: 'Ancient Shaktipeeth Goddess temple' },
  { id: 'harsh', name: 'Harsh Parvat', location: 'Harshnath, Sikar', distanceFromSikar: '14 km', significance: 'Historic 10th century Lord Shiva hill shrine' },
  { id: 'ranisati', name: 'Rani Sati Mandir', location: 'Jhunjhunu', distanceFromSikar: '70 km', significance: 'Largest temple complex dedicated to Narayani Bai' },
  { id: 'sakambhari', name: 'Mansa Mata (Sakambhari)', location: 'Sakambhari Hill', distanceFromSikar: '48 km', significance: 'Serene forested Shakti temple in Aravalli' },
  { id: 'lohargal', name: 'Lohargal Ji', location: 'Nawalgarh / Sikar', distanceFromSikar: '65 km', significance: 'Holy Suryakund pilgrimage of Mahabharata fame' },
];

const PICKUP_HUBS = [
  { id: 'jai_airport', label: 'Jaipur International Airport (JAI)', distanceFactor: 600 },
  { id: 'jai_junction', label: 'Jaipur Junction Railway Station', distanceFactor: 500 },
  { id: 'ringas_junction', label: 'Ringas Junction Railway Station', distanceFactor: 0 },
  { id: 'sikar_junction', label: 'Sikar Junction Railway Station', distanceFactor: 0 },
  { id: 'delhi_hub', label: 'Delhi Airport / Railway Station', distanceFactor: 4200 },
];

const VEHICLE_OPTIONS = [
  { id: 'sedan', name: 'Sedan (Dzire / Etios)', seats: '4 Seats + Driver', basePrice: 2800, extraDestPrice: 350 },
  { id: 'suv', name: 'SUV (Innova Crysta / Ertiga)', seats: '6-7 Seats + Driver', basePrice: 4200, extraDestPrice: 500 },
  { id: 'tempo', name: 'Tempo Traveller', seats: '12-20 Seats Group', basePrice: 7500, extraDestPrice: 800 },
];

const HOTEL_OPTIONS = [
  { id: 'none', label: 'No Hotel Required (Transport Only)', price: 0, desc: 'Same day return or self-managed stay' },
  { id: 'standard', label: 'Standard AC Hotel Room', price: 1200, desc: 'Clean, sanitized AC room with attached bath' },
  { id: 'deluxe', label: 'Deluxe Hotel Room (Near Temple)', price: 2200, desc: 'Premium comfort within 5 mins walking to shrine' },
  { id: 'premium', label: 'Premium Suite / Resort Stay', price: 3800, desc: 'Luxury stay with breakfast and special darshan support' },
];

export default function TravelTab({ onTravelEnquiry }: TravelTabProps) {
  // Calculator States
  const [selectedHub, setSelectedHub] = useState(PICKUP_HUBS[0].id);
  const [travelDateTime, setTravelDateTime] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(['khatu', 'salasar']);
  const [vehicleType, setVehicleType] = useState('suv');
  const [hotelStay, setHotelStay] = useState('none');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Flight Finder states
  const [showFlightSearch, setShowFlightSearch] = useState(false);
  const [flightType, setFlightType] = useState<'round' | 'oneway'>('round');
  const [fromCity, setFromCity] = useState('Delhi (DEL)');
  const [toCity, setToCity] = useState('Jaipur (JAI)');
  const [departureDate, setDepartureDate] = useState('2026-09-10');
  const [simulatedFlights, setSimulatedFlights] = useState<any[] | null>(null);
  const [isSearchingFlights, setIsSearchingFlights] = useState(false);

  // Toggle destination selection
  const toggleDestination = (id: string) => {
    setSelectedDestinations(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectSingleDestinationAndScroll = (calcId: string) => {
    setSelectedDestinations([calcId]);
    scrollToSection('custom-fare-calculator');
  };

  const selectAllDestinations = () => {
    if (selectedDestinations.length === DESTINATIONS.length) {
      setSelectedDestinations(['khatu']);
    } else {
      setSelectedDestinations(DESTINATIONS.map(d => d.id));
    }
  };

  // Dynamic Fare Calculation
  const calculation = useMemo(() => {
    const selectedVeh = VEHICLE_OPTIONS.find(v => v.id === vehicleType) || VEHICLE_OPTIONS[0];
    const hub = PICKUP_HUBS.find(h => h.id === selectedHub) || PICKUP_HUBS[0];
    const hotel = HOTEL_OPTIONS.find(h => h.id === hotelStay) || HOTEL_OPTIONS[0];

    const destCount = Math.max(1, selectedDestinations.length);
    const extraDestCost = destCount > 2 ? (destCount - 2) * selectedVeh.extraDestPrice : 0;
    const transportTotal = selectedVeh.basePrice + hub.distanceFactor + extraDestCost;
    const hotelTotal = hotel.price;
    const grandTotal = transportTotal + hotelTotal;

    return {
      transportTotal,
      hotelTotal,
      grandTotal,
      destCount,
      vehicleName: selectedVeh.name,
      hubLabel: hub.label,
      hotelLabel: hotel.label
    };
  }, [selectedHub, selectedDestinations, vehicleType, hotelStay]);

  const handleCalculatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDestinations.length === 0) {
      alert('Please select at least one destination for your pilgrimage tour.');
      return;
    }

    const destNames = selectedDestinations
      .map(id => DESTINATIONS.find(d => d.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const summaryText = `Custom Pilgrimage Tour Booking: ${destNames} | Pickup: ${calculation.hubLabel} | Vehicle: ${calculation.vehicleName} | Stay: ${calculation.hotelLabel} | Est. Fare: ₹${calculation.grandTotal.toLocaleString('en-IN')}${travelDateTime ? ` | Date/Time: ${travelDateTime}` : ''}`;
    
    onTravelEnquiry(summaryText);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 6000);
  };

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingFlights(true);
    setTimeout(() => {
      setSimulatedFlights([
        { airline: "IndiGo", depTime: "06:40", arrTime: "07:45", price: "₹2,499", duration: "1h 05m", stops: "Non-stop" },
        { airline: "Air India", depTime: "10:30", arrTime: "11:40", price: "₹3,150", duration: "1h 10m", stops: "Non-stop" },
        { airline: "SpiceJet", depTime: "17:15", arrTime: "18:25", price: "₹2,780", duration: "1h 10m", stops: "Non-stop" }
      ]);
      setIsSearchingFlights(false);
    }, 1000);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="travel-page-container" className="animate-fade-in space-y-12 pb-12">
      
      {/* 1. HOLY SHRINE TOUR CARDS (WITH SACRED DARSHAN IMAGES) */}
      <section id="divine-temple-showcase" className="space-y-8">
        
        {/* 6 Divine Temple Cards with Color-Matched Archways */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {SHRINE_CARDS.map((shrine) => (
            <div 
              key={shrine.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${shrine.borderColor} flex flex-col justify-between group hover:-translate-y-1.5`}
            >
              {/* Card Arch Header */}
              <div className={`${shrine.headerBg} ${shrine.headerText} py-2.5 px-3 text-center`}>
                <span className="text-xs font-black tracking-wider uppercase block">{shrine.name}</span>
                <span className="text-[11px] opacity-90 block mt-0.5">{shrine.hindiName}</span>
              </div>

              {/* Temple Photo */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <img 
                  src={shrine.image} 
                  alt={shrine.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  {shrine.distance}
                </span>
              </div>

              {/* Blessing Quote & Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-gray-700 font-medium leading-relaxed min-h-[44px]">
                  {shrine.blessingHindi}
                </p>

                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md block text-center border ${shrine.badgeColor}`}>
                    {shrine.location}
                  </span>
                  
                  <button 
                    onClick={() => selectSingleDestinationAndScroll(shrine.calcId)}
                    className="w-full py-2 bg-gray-900 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Book Trip</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. SAFETY & SERVICE GUARANTEE STRIP (DIRECT FROM POSTER) */}
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-2xl border-2 border-amber-200 p-6 md:p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Seal & Headline */}
            <div className="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-amber-200 pb-5 lg:pb-0 lg:pr-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white flex flex-col items-center justify-center p-2 text-center shadow-md shrink-0">
                <Award size={22} className="text-amber-300 mb-0.5" />
                <span className="text-[8px] font-black uppercase leading-tight">100% Verified</span>
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">KML Trust Seal</span>
                <h3 className="text-lg font-black text-gray-900 leading-tight">
                  Comfortable, Safe & Reliable Journey
                </h3>
                <p className="text-xs text-gray-500 mt-1">Dedicated fleet for family, elderly & group tours</p>
              </div>
            </div>

            {/* 4 Feature Badges */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Car size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Comfortable Vehicles</span>
                  <span className="text-[10px] text-gray-500">Innova, Dzire & Tempo</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Experienced Drivers</span>
                  <span className="text-[10px] text-gray-500">Temple Route Specialists</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Safe & Secure Travel</span>
                  <span className="text-[10px] text-gray-500">GPS Tracked & Sanitized</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block">On Time Service</span>
                  <span className="text-[10px] text-gray-500">24/7 Airport / Station</span>
                </div>
              </div>
            </div>

            {/* Innova Tour Car Showcase Image */}
            <div className="lg:col-span-3 text-center">
              <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200">
                <img 
                  src={innovaCrystaImg} 
                  alt="Toyota Innova Crysta Tour Vehicle" 
                  referrerPolicy="no-referrer"
                  className="w-full h-28 object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                  Toyota Innova Crysta
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 4. POSTER FOOTER CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-amber-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-500/20">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
              <HeartHandshake size={15} />
              KML TRAVEL • Your Journey, Our Responsibility
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              एक यात्रा आस्था की ओर
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Call or WhatsApp our pilgrimage desk for immediate customized bookings.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href="tel:+917977479299"
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-black px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Phone size={18} />
              <span>+91 7977479299</span>
            </a>

            <button 
              onClick={() => scrollToSection('custom-fare-calculator')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl text-sm border border-white/20 backdrop-blur-sm transition-colors cursor-pointer"
            >
              Calculate Live Fare
            </button>
          </div>
        </div>

      </section>

      {/* 3. DYNAMIC FARE & HOTEL CALCULATOR */}
      <section 
        id="custom-fare-calculator" 
        className="max-w-4xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 relative scroll-mt-24"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mb-3 shadow-inner">
            <Calculator size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Calculate Custom Fare & Book
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Choose pickup hub, temple circuit, vehicle type, and optional hotel accommodation for instant transparent pricing
          </p>
        </div>

        {bookingSuccess && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
            <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
            <div className="text-sm font-medium">
              <p className="font-bold">Tour booking request recorded successfully!</p>
              <p className="text-xs text-emerald-700">Our tour specialist will call / WhatsApp you at +91 7977479299 to coordinate pickup time, driver details, and darshan assistance.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleCalculatorSubmit} className="space-y-7">
          
          {/* Pickup Point & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Pickup Hub (Airport / Railway Station)
              </label>
              <select 
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="w-full border border-gray-300 p-3.5 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 text-sm font-medium text-gray-800 bg-white outline-none transition-all cursor-pointer"
              >
                {PICKUP_HUBS.map(hub => (
                  <option key={hub.id} value={hub.id}>
                    {hub.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Travel Date & Pickup Time
              </label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  value={travelDateTime}
                  onChange={(e) => setTravelDateTime(e.target.value)}
                  className="w-full border border-gray-300 p-3.5 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 text-sm font-medium text-gray-800 bg-white outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Destinations Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Select Destinations to Visit ({selectedDestinations.length} Selected)
              </label>
              <button
                type="button"
                onClick={selectAllDestinations}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
              >
                {selectedDestinations.length === DESTINATIONS.length ? 'Reset Selection' : 'Select All 7 Sacred Shrines'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {DESTINATIONS.map((dest) => {
                const isChecked = selectedDestinations.includes(dest.id);
                return (
                  <label 
                    key={dest.id}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked 
                        ? 'border-amber-600 bg-amber-50/80 shadow-sm text-amber-950 font-semibold ring-1 ring-amber-600' 
                        : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => toggleDestination(dest.id)}
                      className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm block leading-tight font-bold">{dest.name}</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5 truncate">{dest.location} ({dest.distanceFromSikar})</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Vehicle & Stay Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Select Vehicle Type
              </label>
              <select 
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full border border-gray-300 p-3.5 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 text-sm font-medium text-gray-800 bg-white outline-none transition-all cursor-pointer"
              >
                {VEHICLE_OPTIONS.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.seats})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Hotel Stay Accommodation
              </label>
              <select 
                value={hotelStay}
                onChange={(e) => setHotelStay(e.target.value)}
                className="w-full border border-gray-300 p-3.5 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 text-sm font-medium text-gray-800 bg-white outline-none transition-all cursor-pointer"
              >
                {HOTEL_OPTIONS.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.label} {h.price > 0 ? `(+₹${h.price.toLocaleString('en-IN')})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Total Fare Display Box */}
          <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 border border-amber-200/80 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Estimated Total (Transport + Stay + Driver Charges)
              </p>
              <p className="text-gray-600 text-xs mt-0.5">
                Includes all tolls, parking charges, fuel, AC driver allowance & temple route coordination
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <span className="text-xs text-gray-500 block">All-Inclusive Fixed Fare</span>
              <p className="text-3xl sm:text-4xl font-black text-amber-700 tracking-tight">
                ₹ {calculation.grandTotal.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Submit Action */}
          <div className="space-y-3">
            <button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg hover:shadow-amber-600/25 transition-all text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 size={20} />
              Proceed to Pay & Confirm Booking
            </button>
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <Info size={14} className="text-amber-600" />
              Instant WhatsApp confirmation & 24/7 dedicated local assistance throughout your pilgrimage.
            </p>
          </div>

        </form>
      </section>

      {/* 4. PRE-PACKAGED POPULAR TOUR PACKAGES */}
      <section id="tour-packages-section" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-wider text-amber-700 uppercase bg-amber-100 px-3 py-1 rounded-full">
            Fixed Circuits
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Popular Tour Packages
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Expertly crafted sacred itineraries featuring VIP darshan support, comfortable AC vehicles, and verified hotels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Package Card 1 */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col justify-between group">
            <div className="p-6 sm:p-7">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                1 Day Express
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-3 mb-2 group-hover:text-amber-600 transition-colors">
                Khatu Shyam & Salasar Circuit
              </h3>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                Pickup and drop from Jaipur / Ringas. Direct darshan coverage with AC Sedan.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Package Inclusions</p>
                <ul className="text-sm space-y-2.5 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>Khatu Shyam Ji Temple Darshan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>Salasar Balaji Temple Aarti</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>Toll & Driver Allowance Included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>Dedicated AC Sedan (Dzire / Etios)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-500 font-medium block">Starts from</span>
                <p className="text-2xl font-black text-amber-600">₹ 2,999</p>
              </div>
              <button 
                onClick={() => onTravelEnquiry('Booking 1 Day Express: Khatu Shyam & Salasar Circuit (₹2,999)')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-amber-600/20 transition-all cursor-pointer"
              >
                Select & Pay
              </button>
            </div>
          </div>

          {/* Package Card 2 */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-amber-500/40 relative flex flex-col justify-between group">
            <div className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
              Most Popular
            </div>

            <div className="p-6 sm:p-7">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                2 Days / 1 Night
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-3 mb-2 group-hover:text-amber-600 transition-colors">
                Shekhawati Sacred 5-Temple Tour
              </h3>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                Includes AC transport and 1 night stay at Sikar / Khatu Shyam.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Package Inclusions</p>
                <ul className="text-sm space-y-2.5 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>Khatu Shyam, Salasar, Jeen Mata</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>Harsh Parvat & Rani Sati Mandir</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>Deluxe Hotel Stay Included (1 Night)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>Full AC Vehicle for 2 Days</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-500 font-medium block">Starts from</span>
                <p className="text-2xl font-black text-amber-600">₹ 6,499</p>
              </div>
              <button 
                onClick={() => onTravelEnquiry('Booking 2 Days / 1 Night: Shekhawati Sacred 5-Temple Tour (₹6,499)')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-amber-600/20 transition-all cursor-pointer"
              >
                Select & Pay
              </button>
            </div>
          </div>

          {/* Package Card 3 */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col justify-between group">
            <div className="p-6 sm:p-7">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                3 Days / 2 Nights
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-3 mb-2 group-hover:text-amber-600 transition-colors">
                Grand Shekhawati Pilgrimage
              </h3>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                Complete package covering all 7 major destinations seamlessly.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Package Inclusions</p>
                <ul className="text-sm space-y-2.5 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>All 7 Holy Temple Locations Included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>2 Nights Premium Hotel Accommodation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>Dedicated SUV Transport (Innova / Ertiga)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0" />
                    <span>VIP Darshan & Prasad Assistance</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-500 font-medium block">Starts from</span>
                <p className="text-2xl font-black text-amber-600">₹ 11,999</p>
              </div>
              <button 
                onClick={() => onTravelEnquiry('Booking 3 Days / 2 Nights: Grand Shekhawati Pilgrimage (₹11,999)')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-amber-600/20 transition-all cursor-pointer"
              >
                Select & Pay
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. NEAREST TRANSPORT HUBS QUICK TABLE */}
      <section id="nearest-hubs-section" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Nearest Railway Station & Airport Distances
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Quick reference guide for planning your train or flight connections to holy shrines
          </p>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-50 text-amber-900 text-xs uppercase tracking-wider font-extrabold border-b border-amber-100">
                <th className="p-4 sm:p-5">Destination</th>
                <th className="p-4 sm:p-5">Nearest Railway Station</th>
                <th className="p-4 sm:p-5">Nearest Airport</th>
                <th className="p-4 sm:p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <tr className="hover:bg-amber-50/40 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-gray-800">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-amber-600 shrink-0" />
                    <span>Khatu Shyam Ji</span>
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-gray-600 font-medium">Ringas Junction (17 km)</td>
                <td className="p-4 sm:p-5 text-gray-600 font-medium">Jaipur (JAI - 80 km)</td>
                <td className="p-4 sm:p-5 text-right">
                  <button 
                    onClick={() => selectSingleDestinationAndScroll('khatu')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    Calculate Cab
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-amber-50/40 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-gray-800">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-amber-600 shrink-0" />
                    <span>Salasar Balaji</span>
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-gray-600 font-medium">Sujangarh (25 km) / Sikar (45 km)</td>
                <td className="p-4 sm:p-5 text-gray-600 font-medium">Jaipur (JAI - 175 km)</td>
                <td className="p-4 sm:p-5 text-right">
                  <button 
                    onClick={() => selectSingleDestinationAndScroll('salasar')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    Calculate Cab
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-amber-50/40 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-gray-800">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-amber-600 shrink-0" />
                    <span>Jeen Mata & Harsh Parvat</span>
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-gray-600 font-medium">Sikar Junction (28 km)</td>
                <td className="p-4 sm:p-5 text-gray-600 font-medium">Jaipur (JAI - 115 km)</td>
                <td className="p-4 sm:p-5 text-right">
                  <button 
                    onClick={() => {
                      setSelectedDestinations(['jeenmata', 'harsh']);
                      scrollToSection('custom-fare-calculator');
                    }}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    Calculate Cab
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-amber-50/40 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-gray-800">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-amber-600 shrink-0" />
                    <span>Rani Sati Mandir</span>
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-gray-600 font-medium">Jhunjhunu (3 km)</td>
                <td className="p-4 sm:p-5 text-gray-600 font-medium">Jaipur (JAI - 180 km)</td>
                <td className="p-4 sm:p-5 text-right">
                  <button 
                    onClick={() => selectSingleDestinationAndScroll('ranisati')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    Calculate Cab
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-amber-50/40 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-gray-800">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-amber-600 shrink-0" />
                    <span>Lohargal & Mansa Mata Sakambhari</span>
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-gray-600 font-medium">Nawalgarh / Sikar</td>
                <td className="p-4 sm:p-5 text-gray-600 font-medium">Jaipur (JAI - 140 km)</td>
                <td className="p-4 sm:p-5 text-right">
                  <button 
                    onClick={() => {
                      setSelectedDestinations(['lohargal', 'sakambhari']);
                      scrollToSection('custom-fare-calculator');
                    }}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    Calculate Cab
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. FLIGHT & DOMESTIC/INTERNATIONAL TOURS TOGGLE */}
      <div className="border-t border-gray-200 pt-8">
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase">
              <Plane size={14} /> Also Planning Flights & International Holidays?
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Flight Tickets, Visa Support & Leisure Tours
            </h3>
            <p className="text-gray-600 text-sm max-w-xl">
              We also handle flight bookings, express visa filings, and holiday packages for Dubai, Bali, Kashmir, Kerala, and Europe.
            </p>
          </div>

          <button 
            onClick={() => setShowFlightSearch(!showFlightSearch)}
            className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            {showFlightSearch ? 'Hide Flight Search' : 'Open Flight Search & Deals'}
            <ChevronRight size={16} className={`transform transition-transform ${showFlightSearch ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {showFlightSearch && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-md p-6 animate-fade-in space-y-6">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-lg">
              <Plane size={20} />
              <h4>Live Flight Fare Finder</h4>
            </div>

            <form onSubmit={handleFlightSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Trip Type</label>
                <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
                  <button 
                    type="button"
                    onClick={() => setFlightType('round')}
                    className={`flex-1 py-1 text-xs font-bold rounded cursor-pointer transition-all ${flightType === 'round' ? 'bg-amber-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Round
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFlightType('oneway')}
                    className={`flex-1 py-1 text-xs font-bold rounded cursor-pointer transition-all ${flightType === 'oneway' ? 'bg-amber-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
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
                  disabled={isSearchingFlights}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all text-sm cursor-pointer shadow-md shadow-amber-600/10"
                >
                  {isSearchingFlights ? 'Searching...' : 'Find Flights'}
                  <Search size={16} />
                </button>
              </div>
            </form>

            {simulatedFlights && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Available Flights for {fromCity} → {toCity}</p>
                <div className="space-y-2">
                  {simulatedFlights.map((fl, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-sm font-bold text-gray-900 block">{fl.airline}</span>
                        <span className="text-xs text-gray-400">{fl.stops} • {fl.duration}</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 block">{fl.depTime} - {fl.arrTime}</span>
                        <span className="text-xs text-gray-400">{fromCity} to {toCity}</span>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-base font-extrabold text-amber-600">{fl.price}</span>
                        <button 
                          onClick={() => onTravelEnquiry(`Flight Booking: ${fl.airline} from ${fromCity} to ${toCity} on ${departureDate}`)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-4 rounded-lg text-xs cursor-pointer"
                        >
                          Book Ticket
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
