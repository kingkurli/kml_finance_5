import { useState, FormEvent, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Menu, 
  X, 
  Timer, 
  Percent, 
  ShieldCheck, 
  Headphones, 
  HandCoins, 
  Shield, 
  Coins, 
  Plane, 
  CircleCheck, 
  ArrowRight, 
  MessageCircle, 
  Calculator, 
  Quote, 
  Star,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  LogOut,
  Loader2,
  Settings
} from 'lucide-react';
import { googleSignIn, initAuth, logout, db } from './lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { saveLoanApplicationToSheets, saveConsultationToSheets, saveToGoogleAppsScript } from './lib/sheetsService';
import { LoanApplication, ConsultationApplication } from './types';
import { User } from 'firebase/auth';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [serviceFilter, setServiceFilter] = useState('');
  
  // Google Auth & Sheets integration states
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // Apply Loan Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [loanForm, setLoanForm] = useState({
    name: '',
    age: '',
    contactNo: '',
    occupation: 'Salary' as 'Salary' | 'Business',
    loanType: 'Personal' as 'Personal' | 'Business' | 'Housing' | 'Education',
    income: ''
  });
  const [isSubmittingLoan, setIsSubmittingLoan] = useState(false);
  const [sheetStatusMsg, setSheetStatusMsg] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const [loanSubmitted, setLoanSubmitted] = useState(false);
  
  // Consultation Form state
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadStatusMsg, setLeadStatusMsg] = useState('');

  // Google Sheets Integration Settings states
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [googleScriptUrl, setGoogleScriptUrl] = useState(() => {
    return localStorage.getItem('kml_google_script_url') || ((import.meta as any).env.VITE_GOOGLE_SCRIPT_URL as string) || '';
  });
  const [integrationMode, setIntegrationMode] = useState<'central' | 'individual'>(() => {
    const savedMode = localStorage.getItem('kml_sheets_mode');
    if (savedMode === 'central' || savedMode === 'individual') return savedMode;
    return 'central';
  });
  const [loanSpreadsheetIdOrUrl, setLoanSpreadsheetIdOrUrl] = useState(() => {
    return localStorage.getItem('kml_spreadsheet_id_loan') || '';
  });
  const [consultSpreadsheetIdOrUrl, setConsultSpreadsheetIdOrUrl] = useState(() => {
    return localStorage.getItem('kml_spreadsheet_id_consultation') || '';
  });

  // Local temporary settings state for the modal
  const [tempScriptUrl, setTempScriptUrl] = useState('');
  const [tempIntegrationMode, setTempIntegrationMode] = useState<'central' | 'individual'>('central');
  const [tempLoanSpreadsheetIdOrUrl, setTempLoanSpreadsheetIdOrUrl] = useState('');
  const [tempConsultSpreadsheetIdOrUrl, setTempConsultSpreadsheetIdOrUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{ status: 'success' | 'error' | null, message: string }>({ status: null, message: '' });

  // Sync temp state with actual state when modal opens
  useEffect(() => {
    if (isSettingsModalOpen) {
      setTempScriptUrl(googleScriptUrl);
      setTempIntegrationMode(integrationMode);
      setTempLoanSpreadsheetIdOrUrl(loanSpreadsheetIdOrUrl);
      setTempConsultSpreadsheetIdOrUrl(consultSpreadsheetIdOrUrl);
      setConnectionTestResult({ status: null, message: '' });
    }
  }, [isSettingsModalOpen, googleScriptUrl, integrationMode, loanSpreadsheetIdOrUrl, consultSpreadsheetIdOrUrl]);

  const handleSaveSettings = async () => {
    if (tempIntegrationMode === 'central') {
      const cleanUrl = tempScriptUrl.trim();
      if (!cleanUrl) {
        alert("Please paste your Google Apps Script Web App URL first.");
        return;
      }
      if (cleanUrl.includes('/edit') || cleanUrl.includes('/home')) {
        alert("Wait! It looks like you pasted the Google Script Editor link (ending with '/edit'). Please redeploy and copy the 'Web App URL' ending with '/exec' from the deployment popup.");
        return;
      }
      if (!cleanUrl.startsWith('https://script.google.com/')) {
        alert("Invalid URL. The Web App URL must start with 'https://script.google.com/'. Please verify and paste the correct Web App URL ending with '/exec'.");
        return;
      }
    }
    
    const finalUrl = tempScriptUrl.trim();
    const finalLoanId = tempLoanSpreadsheetIdOrUrl.trim();
    const finalConsultId = tempConsultSpreadsheetIdOrUrl.trim();
    
    localStorage.setItem('kml_google_script_url', finalUrl);
    localStorage.setItem('kml_sheets_mode', tempIntegrationMode);
    localStorage.setItem('kml_spreadsheet_id_loan', finalLoanId);
    localStorage.setItem('kml_spreadsheet_id_consultation', finalConsultId);
    
    setGoogleScriptUrl(finalUrl);
    setIntegrationMode(tempIntegrationMode);
    setLoanSpreadsheetIdOrUrl(finalLoanId);
    setConsultSpreadsheetIdOrUrl(finalConsultId);

    // Persist to Cloud Firestore for global synchronization across all visitor browsers
    if (user && user.email === 'kml.finance.1@gmail.com') {
      try {
        const configDocRef = doc(db, 'settings', 'sheetsConfig');
        await setDoc(configDocRef, {
          googleScriptUrl: finalUrl,
          integrationMode: tempIntegrationMode,
          loanSpreadsheetIdOrUrl: finalLoanId,
          consultSpreadsheetIdOrUrl: finalConsultId,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        alert("Settings successfully saved and synchronized to the Cloud Database! Visitors will now write to this sheets configuration automatically.");
      } catch (err: any) {
        console.error("Failed to sync Sheets configuration to Firestore:", err);
        alert(`Settings saved locally, but failed to sync to the Cloud Database: ${err.message || 'Permission denied'}. Make sure you are signed in with the correct Admin account (kml.finance.1@gmail.com) to save to the Cloud Database.`);
      }
    } else {
      alert("Settings saved in your browser, but NOT synced to the Cloud Database because you are not signed in as the administrator (kml.finance.1@gmail.com). Please sign in using the 'Log In with Google' button inside the Sheets Admin panel to authorize cloud synchronization for all website visitors.");
    }
    
    setIsSettingsModalOpen(false);
  };

  const handleTestConnection = async () => {
    if (!tempScriptUrl) {
      setConnectionTestResult({ status: 'error', message: 'Please enter a Google Apps Script Web App URL first.' });
      return;
    }
    
    const targetUrl = tempScriptUrl.trim();
    if (targetUrl.includes('/edit') || targetUrl.includes('/home')) {
      setConnectionTestResult({ 
        status: 'error', 
        message: 'Invalid URL. You pasted the script editor link instead of the deployed "/exec" Web App URL.' 
      });
      return;
    }
    if (!targetUrl.startsWith('https://script.google.com/')) {
      setConnectionTestResult({ 
        status: 'error', 
        message: 'Invalid URL. The URL must start with https://script.google.com/' 
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionTestResult({ status: null, message: 'Sending test ping to Google Apps Script...' });

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          type: 'ping',
          data: {
            spreadsheetId: tempLoanSpreadsheetIdOrUrl
          }
        })
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData && resData.status === 'success') {
          setConnectionTestResult({
            status: 'success',
            message: resData.message || 'Connection successful!'
          });
        } else {
          setConnectionTestResult({
            status: 'error',
            message: resData.message || 'Google Script returned an error response.'
          });
        }
      } else {
        throw new Error(`Google Web App returned error status ${response.status}: ${response.statusText}`);
      }
    } catch (err: any) {
      console.warn("CORS ping failed, attempting no-cors fallback...", err);
      try {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify({
            type: 'ping',
            data: {}
          })
        });

        setConnectionTestResult({
          status: 'success',
          message: 'Connection ping sent successfully via fallback channel! However, standard CORS was blocked. This means either: 1. Your Google Web App is correctly receiving data but does not support direct JSON feedback (safe to use). 2. Or, you forgot to authorize "Who has access: Anyone" in the deployment settings. Please make sure "Who has access" is set to "Anyone" so visitors can write data!'
        });
      } catch (fallbackErr: any) {
        setConnectionTestResult({
          status: 'error',
          message: `Connection failed: ${err.message || 'Network error'}. Please verify you deployed with "Who has access: Anyone" and copied the correct URL ending with "/exec".`
        });
      }
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Check URL query parameters to allow the admin to open Google Sheets Settings without website buttons
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('setup') === 'true' || params.get('sheets') === 'true') {
      setIsSettingsModalOpen(true);
    }
  }, []);

  // Synchronize Google Sheets settings with cloud Firestore so that published visitors load it automatically
  useEffect(() => {
    const fetchCloudSettings = async () => {
      try {
        const configDocRef = doc(db, 'settings', 'sheetsConfig');
        const docSnap = await getDoc(configDocRef);
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          if (cloudData.googleScriptUrl) {
            setGoogleScriptUrl(cloudData.googleScriptUrl);
            localStorage.setItem('kml_google_script_url', cloudData.googleScriptUrl);
          }
          if (cloudData.integrationMode) {
            setIntegrationMode(cloudData.integrationMode);
            localStorage.setItem('kml_sheets_mode', cloudData.integrationMode);
          }
          if (cloudData.loanSpreadsheetIdOrUrl) {
            setLoanSpreadsheetIdOrUrl(cloudData.loanSpreadsheetIdOrUrl);
            localStorage.setItem('kml_spreadsheet_id_loan', cloudData.loanSpreadsheetIdOrUrl);
          }
          if (cloudData.consultSpreadsheetIdOrUrl) {
            setConsultSpreadsheetIdOrUrl(cloudData.consultSpreadsheetIdOrUrl);
            localStorage.setItem('kml_spreadsheet_id_consultation', cloudData.consultSpreadsheetIdOrUrl);
          }
        }
      } catch (err) {
        console.warn("Failed to load Google Sheets config from Firestore. Falling back to localStorage:", err);
      }
    };
    fetchCloudSettings();
  }, []);

  useEffect(() => {
    // Safety fallback timeout to prevent getting stuck in checking state inside iframe
    const fallbackTimer = setTimeout(() => {
      setIsAuthChecking(false);
    }, 1500);

    const unsubscribe = initAuth(
      (currentUser, token) => {
        clearTimeout(fallbackTimer);
        setUser(currentUser);
        setAccessToken(token);
        setIsAuthChecking(false);
      },
      () => {
        clearTimeout(fallbackTimer);
        setUser(null);
        setAccessToken(null);
        setIsAuthChecking(false);
      }
    );
    return () => {
      clearTimeout(fallbackTimer);
      unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleLoanSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loanForm.name || !loanForm.age || !loanForm.contactNo || !loanForm.income) {
      alert("Please fill in all the required fields.");
      return;
    }

    const application: LoanApplication = {
      name: loanForm.name,
      age: Number(loanForm.age),
      contactNo: loanForm.contactNo,
      occupation: loanForm.occupation,
      loanType: loanForm.loanType,
      income: Number(loanForm.income),
      enquiredDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    setIsSubmittingLoan(true);
    setSheetStatusMsg("Submitting application...");
    setSheetUrl("");

    try {
      if (integrationMode === 'central') {
        if (!googleScriptUrl) {
          throw new Error("Google Sheets integration is not configured yet. Click the 'Sheets Admin' button in the very bottom footer (or add '?setup=true' to the website URL) to paste your Google Web App URL.");
        }
        const enrichedApplication = {
          ...application,
          spreadsheetId: loanSpreadsheetIdOrUrl
        };
        await saveToGoogleAppsScript('loan', enrichedApplication, googleScriptUrl);
        setSheetStatusMsg("Loan application details saved successfully!");
      } else {
        if (!user || !accessToken) {
          throw new Error("Please connect your Google Account first to store details in Google Sheets.");
        }
        setSheetStatusMsg("Locating or updating Google Sheet...");
        const result = await saveLoanApplicationToSheets(application, accessToken, loanSpreadsheetIdOrUrl);
        setSheetStatusMsg("Loan application details saved successfully!");
        if (result.webViewLink) {
          setSheetUrl(result.webViewLink);
        }
      }
      
      setLoanSubmitted(true);
      
      // Clear form
      setLoanForm({
        name: '',
        age: '',
        contactNo: '',
        occupation: 'Salary',
        loanType: 'Personal',
        income: ''
      });
    } catch (err: any) {
      console.error("Failed to save loan application:", err);
      setSheetStatusMsg(`Error: ${err.message || 'Failed to save application to Google Sheet'}`);
    } finally {
      setIsSubmittingLoan(false);
    }
  };
  
  // EMI Calculator State
  const [amount, setAmount] = useState(1000000); // 10 Lakh default
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% default
  const [tenure, setTenure] = useState(5); // 5 Years default

  // Lead Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    service: '',
    city: ''
  });

  // Calculate EMI
  const monthlyInterestRate = interestRate / 12 / 100;
  const numberOfMonths = tenure * 12;
  const emi = amount > 0 && monthlyInterestRate > 0 && numberOfMonths > 0
    ? Math.round(
        (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1)
      )
    : 0;
  const totalAmountPayable = emi * numberOfMonths;
  const totalInterestPayable = totalAmountPayable - amount;

  // Format currency in Indian Rupees
  const formatINR = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      alert('Please enter your Name and Phone Number');
      return;
    }

    const consultation: ConsultationApplication = {
      name: leadForm.name,
      phone: leadForm.phone,
      service: leadForm.service,
      city: leadForm.city || 'N/A',
      enquiredDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    setIsSubmittingLead(true);
    setLeadStatusMsg("Submitting requirements...");

    try {
      if (integrationMode === 'central') {
        if (!googleScriptUrl) {
          throw new Error("Google Sheets integration is not configured yet. Click the 'Sheets Admin' button in the very bottom footer (or add '?setup=true' to the website URL) to paste your Google Web App URL.");
        }
        const enrichedConsultation = {
          ...consultation,
          spreadsheetId: consultSpreadsheetIdOrUrl
        };
        await saveToGoogleAppsScript('consultation', enrichedConsultation, googleScriptUrl);
      } else {
        if (!user || !accessToken) {
          throw new Error("Please connect your Google Account first to store details in Google Sheets.");
        }
        setLeadStatusMsg("Locating or updating Google Sheet...");
        await saveConsultationToSheets(consultation, accessToken, consultSpreadsheetIdOrUrl);
      }
      
      setFormSubmitted(true);
      setLeadStatusMsg("Details submitted successfully!");
      setLeadForm({ name: '', phone: '', service: '', city: '' });
      setTimeout(() => {
        setFormSubmitted(false);
        setLeadStatusMsg("");
      }, 5000);
    } catch (err: any) {
      console.error("Failed to save consultation:", err);
      setLeadStatusMsg(`Error: ${err.message || 'Failed to save application to Google Sheet'}`);
      setTimeout(() => {
        setLeadStatusMsg("");
      }, 7000);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const selectServiceAndScroll = (serviceKey: string) => {
    setLeadForm(prev => ({ ...prev, service: serviceKey }));
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const testimonials = [
    {
      id: 1,
      name: "Girish Jangid",
      location: "Sikar",
      text: "Very fast loan approval process. Highly recommended!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      id: 2,
      name: "Nishant Nehra",
      location: "Jaipur",
      text: "Got the best health insurance for my family at affordable price.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      id: 3,
      name: "Mishal Tripathi",
      location: "Mumbai",
      text: "Best forex rates and excellent customer service.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com" },
    { icon: Instagram, href: "https://instagram.com" },
    { icon: Linkedin, href: "https://linkedin.com" },
    { icon: MessageCircle, href: "https://wa.me/917977479299" }
  ];

  return (
    <div className="min-h-screen flex flex-col w-full antialiased text-gray-900 bg-white font-sans selection:bg-brand-gold selection:text-brand-blue">
      
      {/* 1. TOPBAR */}
      <div className="bg-[#1A1A1A] text-gray-300 py-2.5 text-xs hidden md:block border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="tel:+917977479299" className="flex items-center space-x-2 hover:text-brand-gold transition-colors">
              <Phone size={14} className="text-brand-gold" />
              <span>+91 79774 79299</span>
            </a>
            <a href="mailto:kml.finance.1@gmail.com" className="flex items-center space-x-2 hover:text-brand-gold transition-colors">
              <Mail size={14} className="text-brand-gold" />
              <span>kml.finance.1@gmail.com</span>
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock size={14} className="text-brand-gold" />
              <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
            </div>
            <div className="flex items-center space-x-3">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={idx} 
                    href={social.href} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:text-white transition-colors p-1 bg-white/5 rounded-full hover:bg-white/15"
                  >
                    <Icon size={13} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR */}
      <nav className="bg-brand-blue text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-transparent border-2 border-brand-gold rounded-full flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <div className="absolute inset-0 bg-brand-gold/15 transform rotate-45 scale-150" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-brand-gold transform rotate-[-45deg] translate-y-[-4px]" />
                  <div className="w-4 h-4 border-t-2 border-brand-gold absolute bottom-2 left-2" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-wider text-brand-gold leading-none">KML</h1>
                  <p className="text-[10px] tracking-[0.25em] text-white mt-1 uppercase">Finance</p>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex space-x-7">
                {[
                  { name: "Home", href: "#" },
                  { name: "Loans", onClick: () => selectServiceAndScroll('loans') },
                  { name: "Insurance", onClick: () => selectServiceAndScroll('insurance') },
                  { name: "Forex", onClick: () => selectServiceAndScroll('forex') },
                  { name: "Travel", onClick: () => selectServiceAndScroll('travel') },
                  { name: "About Us", onClick: () => document.getElementById('why-choose')?.scrollIntoView({ behavior: 'smooth' }) },
                  { name: "Contact Us", onClick: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.onClick}
                    className={`text-sm font-medium hover:text-brand-gold cursor-pointer transition-colors relative py-1 ${
                      idx === 0 ? "text-brand-gold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-gold" : "text-gray-200"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-brand-gold hover:bg-yellow-400 text-brand-blue font-semibold py-2.5 px-6 rounded transition-all duration-300 transform active:scale-95 shadow-md shadow-brand-gold/10 text-sm"
              >
                Get Free Consultation
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-white/5"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-blue border-t border-gray-800 absolute w-full left-0 shadow-xl">
            <div className="px-4 pt-3 pb-6 space-y-4">
              <div className="space-y-2">
                {[
                  { name: "Home", onClick: () => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
                  { name: "Loans", onClick: () => selectServiceAndScroll('loans') },
                  { name: "Insurance", onClick: () => selectServiceAndScroll('insurance') },
                  { name: "Forex", onClick: () => selectServiceAndScroll('forex') },
                  { name: "Travel", onClick: () => selectServiceAndScroll('travel') },
                  { name: "About Us", onClick: () => { setMobileMenuOpen(false); document.getElementById('why-choose')?.scrollIntoView({ behavior: 'smooth' }); } },
                  { name: "Contact Us", onClick: () => { setMobileMenuOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); } }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.onClick}
                    className="block w-full text-left px-3 py-2.5 rounded-md text-base font-medium hover:bg-blue-950 hover:text-brand-gold transition-all"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <button 
                  onClick={() => { setMobileMenuOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-blue font-semibold py-3 px-4 rounded transition-colors text-center shadow-lg text-sm"
                >
                  Get Free Consultation
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        
        {/* 3. HERO SECTION */}
        <div className="relative bg-brand-blue min-h-[580px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/90 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" 
              alt="Family and finance background" 
              className="w-full h-full object-cover opacity-35 mix-blend-overlay"
            />
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-brand-blue/15 to-transparent z-10 mix-blend-multiply" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-16 md:py-24 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Hero Copy & Value Prop */}
              <div className="lg:col-span-6 text-white space-y-6">
                <div className="text-sm md:text-base font-semibold tracking-wider uppercase text-brand-gold">
                  Loans | Insurance | Forex | Travel
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-tight">
                  Your Trusted Partner for<br />
                  <span className="text-brand-gold">LOANS, INSURANCE</span><br />
                  <span className="text-brand-gold">& TRAVEL</span> SOLUTIONS
                </h1>
                <p className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
                  Quick approvals, best interest rates, and complete financial and trip planning support under one roof.
                </p>

                {/* USP List */}
                <div className="grid grid-cols-2 gap-4 max-w-xl">
                  {[
                    { icon: Timer, text: "Fast Approvals" },
                    { icon: Percent, text: "Best Interest Rates" },
                    { icon: ShieldCheck, text: "Trusted Partners" },
                    { icon: Headphones, text: "End-to-End Support" }
                  ].map((usp, idx) => {
                    const Icon = usp.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className="p-1 bg-brand-gold/10 border border-brand-gold/20 rounded">
                          <Icon size={18} className="text-brand-gold" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium leading-tight text-gray-200">{usp.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button 
                    onClick={() => {
                      setLoanForm(prev => ({ ...prev, loanType: 'Personal' }));
                      setLoanSubmitted(false);
                      setIsApplyModalOpen(true);
                    }}
                    className="bg-brand-gold hover:bg-yellow-400 text-brand-blue font-bold py-3.5 px-8 rounded-lg flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer hover:shadow-brand-gold/15"
                  >
                    Apply for Loan
                    <ArrowRight className="ml-2" size={18} />
                  </button>
                  <button 
                    onClick={() => selectServiceAndScroll('insurance')}
                    className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-3.5 px-8 rounded-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                  >
                    Get Insurance Quote
                    <ArrowRight className="ml-2" size={18} />
                  </button>
                </div>
              </div>

              {/* Right Column: Hero EMI Calculator Card */}
              <div className="lg:col-span-6 w-full max-w-lg mx-auto lg:mr-0">
                <div className="bg-[#0b132c]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                  <div className="bg-gradient-to-r from-brand-blue to-blue-950 px-6 py-4 border-b border-white/5 flex items-center gap-2">
                    <Calculator className="text-brand-gold" size={20} />
                    <h3 className="text-lg font-bold text-white">Interactive EMI Calculator</h3>
                  </div>
                  
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Amount Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <label className="text-gray-300 font-medium">Loan Amount</label>
                        <span className="text-brand-gold font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10">
                          {formatINR(amount)}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="100000" 
                        max="10000000" 
                        step="100000" 
                        value={amount} 
                        onChange={e => setAmount(Number(e.target.value))} 
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>₹1 Lakh</span>
                        <span>₹1 Crore</span>
                      </div>
                    </div>

                    {/* Interest Rate Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <label className="text-gray-300 font-medium">Interest Rate (p.a.)</label>
                        <span className="text-brand-gold font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10">
                          {interestRate}%
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="25" 
                        step="0.1" 
                        value={interestRate} 
                        onChange={e => setInterestRate(Number(e.target.value))} 
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>5%</span>
                        <span>25%</span>
                      </div>
                    </div>

                    {/* Tenure Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <label className="text-gray-300 font-medium">Loan Tenure (Years)</label>
                        <span className="text-brand-gold font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10">
                          {tenure} Yrs
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="30" 
                        step="1" 
                        value={tenure} 
                        onChange={e => setTenure(Number(e.target.value))} 
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>1 Yr</span>
                        <span>30 Yrs</span>
                      </div>
                    </div>

                    {/* Result Card */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
                      <div className="text-center pb-3 border-b border-white/10">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Monthly EMI</p>
                        <h4 className="text-2xl sm:text-3xl font-extrabold text-brand-gold">
                          {formatINR(emi)}
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-gray-400 block">Total Interest</span>
                          <span className="text-white font-semibold">{formatINR(totalInterestPayable > 0 ? totalInterestPayable : 0)}</span>
                        </div>
                        <div className="space-y-1 border-l border-white/10 pl-4">
                          <span className="text-gray-400 block">Total Payable</span>
                          <span className="text-white font-semibold">{formatINR(totalAmountPayable > 0 ? totalAmountPayable : 0)}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setLoanForm(prev => ({ ...prev, loanType: 'Personal' }));
                        setLoanSubmitted(false);
                        setIsApplyModalOpen(true);
                      }}
                      className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-blue font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md shadow-brand-gold/10 active:scale-95 cursor-pointer text-sm"
                    >
                      Apply For Loan Now
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4. OUR SERVICES */}
        <section id="services" className="py-20 bg-[#F8F9FB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-brand-gold font-bold uppercase tracking-wider text-xs sm:text-sm">Our Portfolio</span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mt-2">One Stop Solution for All Your Needs</h2>
              <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1: LOANS */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/40 rounded-bl-full -z-10 group-hover:bg-blue-50 transition-colors" />
                <div className="w-16 h-16 rounded-full bg-blue-800 flex items-center justify-center mb-6 shadow-md text-white">
                  <HandCoins size={32} />
                </div>
                <h3 className="text-xl font-bold mb-6 text-blue-800 uppercase tracking-wide">Loans</h3>
                <ul className="w-full space-y-3.5 mb-8 flex-grow">
                  {["Personal Loan", "Business Loan", "Home Loan", "Loan Against Property"].map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <CircleCheck size={18} className="text-blue-800 mr-2.5 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => {
                    setLoanForm(prev => ({ ...prev, loanType: 'Personal' }));
                    setLoanSubmitted(false);
                    setIsApplyModalOpen(true);
                  }}
                  className="w-full py-3 rounded font-semibold transition-all bg-blue-800 hover:bg-blue-900 text-white cursor-pointer active:scale-95 shadow-sm"
                >
                  Apply Now
                </button>
              </div>

              {/* Card 2: INSURANCE */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/40 rounded-bl-full -z-10 group-hover:bg-emerald-50 transition-colors" />
                <div className="w-16 h-16 rounded-full bg-brand-green flex items-center justify-center mb-6 shadow-md text-white">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold mb-6 text-brand-green uppercase tracking-wide">Insurance</h3>
                <ul className="w-full space-y-3.5 mb-8 flex-grow">
                  {["Motor Insurance", "Health Insurance", "Life Insurance", "Travel Insurance"].map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <CircleCheck size={18} className="text-brand-green mr-2.5 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => selectServiceAndScroll('insurance')}
                  className="w-full py-3 rounded font-semibold transition-all bg-brand-green hover:bg-green-700 text-white cursor-pointer active:scale-95 shadow-sm"
                >
                  Apply Now
                </button>
              </div>

              {/* Card 3: FOREX */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/40 rounded-bl-full -z-10 group-hover:bg-purple-50 transition-colors" />
                <div className="w-16 h-16 rounded-full bg-brand-purple flex items-center justify-center mb-6 shadow-md text-white">
                  <Coins size={32} />
                </div>
                <h3 className="text-xl font-bold mb-6 text-brand-purple uppercase tracking-wide">Forex</h3>
                <ul className="w-full space-y-3.5 mb-8 flex-grow">
                  {["Currency Exchange", "Travel Forex Card", "International Money Transfer"].map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <CircleCheck size={18} className="text-brand-purple mr-2.5 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => selectServiceAndScroll('forex')}
                  className="w-full py-3 rounded font-semibold transition-all bg-brand-purple hover:bg-purple-800 text-white cursor-pointer active:scale-95 shadow-sm"
                >
                  Apply Now
                </button>
              </div>

              {/* Card 4: TOUR & TRAVEL */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/40 rounded-bl-full -z-10 group-hover:bg-orange-50 transition-colors" />
                <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center mb-6 shadow-md text-white">
                  <Plane size={32} />
                </div>
                <h3 className="text-xl font-bold mb-6 text-brand-orange uppercase tracking-wide">Tour & Travel</h3>
                <ul className="w-full space-y-3.5 mb-8 flex-grow">
                  {["Flight Booking", "Holiday Packages", "Visa Assistance", "Hotel Booking"].map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <CircleCheck size={18} className="text-brand-orange mr-2.5 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => selectServiceAndScroll('travel')}
                  className="w-full py-3 rounded font-semibold transition-all bg-brand-orange hover:bg-orange-600 text-white cursor-pointer active:scale-95 shadow-sm"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </section>



        {/* 6. WHY CHOOSE KML FINANCE */}
        <section id="why-choose" className="bg-brand-blue py-20 text-white overflow-hidden relative">
          <div className="absolute top-1/2 -left-32 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
          <div className="absolute top-0 -right-32 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="text-brand-gold font-bold uppercase tracking-wider text-xs sm:text-sm">Value Proposition</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Why Choose KML Finance?</h2>
              <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  icon: Timer, 
                  title: "Fast Approval", 
                  desc: "Quick processing and instant document closing options with zero physical paperwork hassle."
                },
                { 
                  icon: Percent, 
                  title: "Best Rates", 
                  desc: "Lowest interest rates on mortgages/loans and the best market currency exchange rates."
                },
                { 
                  icon: ShieldCheck, 
                  title: "Trusted Partners", 
                  desc: "Officially associated and certified with leading public/private banks & insurance providers."
                },
                { 
                  icon: Headphones, 
                  title: "End-to-End Support", 
                  desc: "Dedicated account manager assigned to handle complete assistance and steps for you."
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-lg bg-brand-gold/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                      <Icon size={32} className="text-brand-gold" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white leading-tight">{item.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. GET STARTED TODAY FORM */}
        <section id="contact" className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col lg:flex-row relative">
              
              {/* Left Column banner */}
              <div className="p-10 lg:p-14 lg:w-2/5 flex flex-col justify-center relative bg-brand-blue text-white overflow-hidden">
                <div className="absolute inset-0 bg-blue-950/25 z-0" />
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-gold" />
                
                <div className="relative z-10 space-y-6">
                  <span className="text-brand-gold font-bold text-xs uppercase tracking-widest bg-brand-gold/10 px-3.5 py-1.5 rounded-full border border-brand-gold/25">
                    Fast Consultation
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-white">
                    Tell Us Your Requirements
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Submit your basic contact details and required service. Our advisory team will reach out within 2 hours with customized packages.
                  </p>
                  
                  <div className="pt-4 border-t border-white/10 space-y-4 text-xs sm:text-sm text-gray-300 font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center">
                        <Timer size={16} className="text-brand-gold" />
                      </div>
                      <span>Callback within 120 minutes guaranteed</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center">
                        <ShieldCheck size={16} className="text-brand-gold" />
                      </div>
                      <span>Safe, secure & confidential details</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Form */}
              <div className="p-10 lg:p-14 lg:w-3/5 bg-gray-50 flex flex-col justify-center relative">
                {formSubmitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <CircleCheck size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-blue">Thank You!</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Your requirements have been submitted successfully. A KML Finance executive will get in touch with you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="w-full space-y-5 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full bg-brand-gold hover:bg-yellow-400 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-brand-blue font-bold py-4 rounded-xl mt-4 flex items-center justify-center transition-all duration-300 shadow-md shadow-brand-gold/15 cursor-pointer active:scale-[0.98]"
                    >
                      {isSubmittingLead ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="animate-spin text-brand-blue" size={20} />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <>
                          Get Free Consultation
                          <ClipboardCheck className="ml-2" size={20} />
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

                {/* Decorative Icon */}
                <div className="hidden lg:flex absolute right-4 bottom-4 opacity-5 pointer-events-none transform translate-x-8 translate-y-8">
                  <ClipboardCheck size={220} className="text-brand-blue" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 8. TESTIMONIALS SECTION */}
        <section className="py-20 bg-[#F8F9FB] border-t border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-brand-gold font-bold uppercase tracking-wider text-xs sm:text-sm">Client Reviews</span>
              <h2 className="text-3xl font-bold text-brand-blue mt-2">Trusted by Hundreds of Happy Customers</h2>
              <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
            </div>

            <div className="relative">
              {/* Prev/Next Navigation icons (aesthetic decorators) */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 lg:-ml-12 hidden md:flex items-center justify-center">
                <button className="w-10 h-10 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-brand-blue hover:border-brand-blue transition-colors cursor-pointer">
                  <ChevronLeft size={20} />
                </button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 lg:-mr-12 hidden md:flex items-center justify-center">
                <button className="w-10 h-10 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-brand-blue hover:border-brand-blue transition-colors cursor-pointer">
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Grid of Testimonials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((test) => (
                  <div 
                    key={test.id} 
                    className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <Quote size={36} className="absolute top-6 left-6 text-gray-100 group-hover:text-gray-200/50 transition-colors" />
                    
                    <div className="relative z-10 space-y-6">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={15} className="fill-brand-gold text-brand-gold" />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 font-medium text-sm leading-relaxed min-h-[50px]">
                        "{test.text}"
                      </p>
                      
                      <div className="flex items-center gap-4 border-t border-gray-100 pt-5">
                        <img 
                          src={test.image} 
                          alt={test.name} 
                          className="w-11 h-11 rounded-full object-cover shadow-sm border border-gray-200"
                        />
                        <div>
                          <h4 className="font-bold text-brand-blue text-sm leading-tight">{test.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{test.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 9. FOOTER */}
      <footer className="bg-brand-blue text-white pt-16 border-t-[8px] border-brand-gold relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Col 1 & 2: Brand Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-transparent border-2 border-brand-gold rounded-full flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-brand-gold/15 transform rotate-45 scale-150" />
                  <div className="w-5 h-5 border-b-2 border-r-2 border-brand-gold transform rotate-[-45deg] translate-y-[-3px]" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-wider text-brand-gold leading-none">KML</h2>
                  <p className="text-[9px] tracking-[0.22em] text-white mt-1 uppercase">Finance</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Your trusted partner for Loans, Insurance, Forex & Travel. We provide tailor-made finance structures, instant documentation pre-approvals, and complete trip solutions with 24/7 client support.
              </p>

              {/* Social icons */}
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a 
                      key={idx}
                      href={social.href} 
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white/5 hover:bg-brand-gold hover:text-brand-blue w-9 h-9 rounded-full flex items-center justify-center transition-all"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Col 3: Quick Links */}
            <div>
              <h3 className="text-brand-gold font-bold text-sm tracking-wider uppercase mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "Home", href: "#" },
                  { name: "Loans", onClick: () => selectServiceAndScroll('loans') },
                  { name: "Insurance", onClick: () => selectServiceAndScroll('insurance') },
                  { name: "Forex", onClick: () => selectServiceAndScroll('forex') },
                  { name: "Tour & Travel", onClick: () => selectServiceAndScroll('travel') },
                  { name: "Contact Us", onClick: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }
                ].map((link, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={link.onClick}
                      className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Our Services */}
            <div>
              <h3 className="text-brand-gold font-bold text-sm tracking-wider uppercase mb-6">Our Services</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                {["Personal Loan", "Business Loan", "Health Insurance", "Forex Exchange", "Flight Booking", "Visa Assistance"].map((srv, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => selectServiceAndScroll(idx < 2 ? 'loans' : idx === 2 ? 'insurance' : idx === 3 ? 'forex' : 'travel')} 
                      className="hover:text-white transition-colors text-left cursor-pointer"
                    >
                      {srv}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 5: Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-brand-gold font-bold text-sm tracking-wider uppercase mb-5">Contact Us</h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li className="flex items-start gap-3">
                    <Timer size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                    <span>First Floor, Shop No 7, Near Allen Coaching, Piprali Road, Sikar Rajasthan-332001</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={18} className="text-brand-gold flex-shrink-0" />
                    <a href="tel:+917977479299" className="hover:text-white transition-colors">+91 79774 79299</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail size={18} className="text-brand-gold flex-shrink-0" />
                    <a href="mailto:kml.finance.1@gmail.com" className="hover:text-white transition-colors">kml.finance.1@gmail.com</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Globe size={18} className="text-brand-gold flex-shrink-0" />
                    <span>www.kmlfinance.com</span>
                  </li>
                </ul>
              </div>

              {/* WhatsApp Box */}
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-brand-gold font-bold text-sm tracking-wider uppercase mb-3">WhatsApp Us</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm shrink-0">
                    <MessageCircle size={20} />
                  </div>
                  <span className="text-xs text-gray-300 leading-tight">
                    Chat with us<br />on WhatsApp
                  </span>
                </div>
                <a 
                  href="https://wa.me/917977479299" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block bg-[#25D366] hover:bg-[#1ebd5a] text-white font-semibold py-2 px-5 text-xs rounded transition-all text-center"
                >
                  Chat Now
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="border-t border-white/5 py-6 bg-[#070d20]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p className="text-center md:text-left">
              © 2026 KML Finance. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              {user && user.email === 'kml.finance.1@gmail.com' && (
                <>
                  <span>|</span>
                  <button 
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="hover:text-brand-gold text-gray-500 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Settings size={13} className="text-brand-gold animate-spin-slow" />
                    <span>Sheets Admin</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Floating WhatsApp CTA */}
        <a 
          href="https://wa.me/917977479299" 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#1ebd5a] hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer animate-pulse"
        >
          <MessageCircle size={30} />
        </a>
      </footer>

      {/* Loan Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 my-8">
            {/* Header */}
            <div className="bg-brand-blue text-white px-6 py-5 flex justify-between items-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold" />
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ClipboardCheck className="text-brand-gold" size={22} />
                  Apply for Loan
                </h3>
                <p className="text-xs text-gray-300 mt-1">Get immediate processing and custom plans</p>
              </div>
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8">
              {loanSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-2">
                    <CircleCheck size={40} className="text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Application Submitted!</h4>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto">
                    Thank you for submitting your enquiry. Your application has been logged directly in our secure database.
                  </p>
                  


                  <div className="pt-4 flex gap-3 justify-center">
                    <button 
                      onClick={() => {
                        setLoanSubmitted(false);
                        setSheetUrl("");
                      }}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      Submit Another
                    </button>
                    <button 
                      onClick={() => setIsApplyModalOpen(false)}
                      className="text-sm bg-brand-blue hover:bg-blue-900 text-white font-semibold py-2 px-5 rounded-lg transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLoanSubmit} className="space-y-5">
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1 sm:col-span-2 text-left">
                      <label className="text-xs font-semibold text-gray-700 block">Full Name *</label>
                      <input 
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={loanForm.name}
                        onChange={e => setLoanForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                      />
                    </div>

                    {/* Age */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-gray-700 block">Age *</label>
                      <input 
                        type="number"
                        required
                        min="18"
                        max="100"
                        placeholder="e.g. 30"
                        value={loanForm.age}
                        onChange={e => setLoanForm(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-gray-700 block">Contact Number *</label>
                      <input 
                        type="tel"
                        required
                        placeholder="e.g. +91 9876543210"
                        value={loanForm.contactNo}
                        onChange={e => setLoanForm(prev => ({ ...prev, contactNo: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                      />
                    </div>

                    {/* Occupation */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-gray-700 block">Occupation *</label>
                      <select
                        value={loanForm.occupation}
                        onChange={e => setLoanForm(prev => ({ ...prev, occupation: e.target.value as 'Salary' | 'Business' }))}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all bg-white"
                      >
                        <option value="Salary">Salary / Professional</option>
                        <option value="Business">Business Owner / Self-employed</option>
                      </select>
                    </div>

                    {/* Loan Type */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-gray-700 block">Type of Loan *</label>
                      <select
                        value={loanForm.loanType}
                        onChange={e => setLoanForm(prev => ({ ...prev, loanType: e.target.value as 'Personal' | 'Business' | 'Housing' | 'Education' }))}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all bg-white"
                      >
                        <option value="Personal">Personal Loan</option>
                        <option value="Business">Business Loan</option>
                        <option value="Housing">Housing / Home Loan</option>
                        <option value="Education">Education Loan</option>
                      </select>
                    </div>

                    {/* Monthly Income */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-semibold text-gray-700 block">Monthly Income (INR) *</label>
                      <input 
                        type="number"
                        required
                        placeholder="e.g. 50000"
                        value={loanForm.income}
                        onChange={e => setLoanForm(prev => ({ ...prev, income: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Section */}
                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between items-center gap-3">
                    <div className="text-left w-full sm:w-auto">
                      {isSubmittingLoan && (
                        <div className="flex items-center gap-2 text-xs text-brand-blue font-medium animate-pulse">
                          <Loader2 className="animate-spin text-brand-gold" size={14} />
                          <span>{sheetStatusMsg}</span>
                        </div>
                      )}
                      {!isSubmittingLoan && sheetStatusMsg && !loanSubmitted && (
                        <p className="text-xs text-red-600 font-medium">{sheetStatusMsg}</p>
                      )}
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto justify-end">
                      <button 
                        type="button"
                        onClick={() => setIsApplyModalOpen(false)}
                        disabled={isSubmittingLoan}
                        className="w-full sm:w-auto text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmittingLoan}
                        className="w-full sm:w-auto text-sm bg-brand-blue hover:bg-blue-900 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-md shadow-blue-900/10 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmittingLoan ? 'Submitting...' : 'Apply & Save'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sheets Integration Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 my-8 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-brand-blue text-white px-6 py-5 flex justify-between items-center relative shrink-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold" />
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="text-brand-gold" size={22} />
                  Google Sheets Settings
                </h3>
                <p className="text-xs text-gray-300 mt-1">Configure where visitor enquiries are stored</p>
              </div>
              <button 
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-left text-sm text-gray-700">
              {/* Iframe warning notice for Google Sign in popup */}
              {!user && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-amber-900">
                    <span>⚠️ Google Sign-In Popup Muted / Blocked?</span>
                  </p>
                  <p className="leading-relaxed">
                    If clicking <strong>"Connect Admin Google"</strong> below does not open the Google login popup, it is because <strong>web browsers block authentication popups inside embedded preview frames (iframes)</strong>.
                  </p>
                  <p className="font-semibold text-amber-950">
                    👉 To log in successfully: Please open the application in a <strong>new browser tab</strong> by clicking the <strong>"Open in new tab"</strong> button/icon at the top-right of the preview panel, then try logging in there! Once authenticated, your settings will sync globally.
                  </p>
                </div>
              )}

              {/* Admin Cloud Authentication Banner */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-yellow-500/10 px-2 py-0.5 rounded-full mb-1 inline-block">Cloud Sync Connection</span>
                  {isAuthChecking ? (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                      <Loader2 className="animate-spin text-brand-blue" size={14} />
                      Checking admin connection status...
                    </p>
                  ) : user ? (
                    <div>
                      <p className="font-bold text-gray-800 leading-snug text-xs sm:text-sm">Connected as Admin</p>
                      <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        {user.email} (Ready to sync to cloud)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-gray-800 leading-snug text-xs sm:text-sm">Browser-Only / Offline Mode</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-normal">Settings will only be saved in your browser, and visitor submissions on the published site may fail. Log in to synchronize configurations globally.</p>
                    </div>
                  )}
                </div>
                {!isAuthChecking && (
                  user ? (
                    <button 
                      type="button"
                      onClick={handleGoogleLogout}
                      className="w-full sm:w-auto text-[11px] font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 py-2 px-3 rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 text-[11px] font-bold bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 py-2 px-3.5 rounded-lg transition-all shadow-sm cursor-pointer active:scale-[0.98] whitespace-nowrap shrink-0"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      <span>Connect Admin Google</span>
                    </button>
                  )
                )}
              </div>

              {/* Integration Mode selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Integration Mode</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mode 1 Option */}
                  <button
                    type="button"
                    onClick={() => setTempIntegrationMode('central')}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                      tempIntegrationMode === 'central' 
                        ? 'border-brand-gold bg-yellow-50/20 shadow-md shadow-brand-gold/5 ring-1 ring-brand-gold' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                        tempIntegrationMode === 'central' ? 'border-brand-gold text-brand-gold' : 'border-gray-300'
                      }`}>
                        {tempIntegrationMode === 'central' && <div className="w-2.5 h-2.5 rounded-full bg-brand-gold" />}
                      </div>
                      <span className="font-bold text-brand-blue text-sm">Option 1: Central Mode</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6.5">
                      Saves all enquiries automatically into a single company spreadsheet. <strong>Highly recommended for production websites.</strong> Visitors do not need to log in!
                    </p>
                  </button>

                  {/* Mode 2 Option */}
                  <button
                    type="button"
                    onClick={() => setTempIntegrationMode('individual')}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                      tempIntegrationMode === 'individual' 
                        ? 'border-brand-gold bg-yellow-50/20 shadow-md shadow-brand-gold/5 ring-1 ring-brand-gold' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                        tempIntegrationMode === 'individual' ? 'border-brand-gold text-brand-gold' : 'border-gray-300'
                      }`}>
                        {tempIntegrationMode === 'individual' && <div className="w-2.5 h-2.5 rounded-full bg-brand-gold" />}
                      </div>
                      <span className="font-bold text-brand-blue text-sm">Option 2: Individual Mode</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6.5">
                      Each visitor connects their own personal Google Account. The website writes enquiries directly to their Google Sheets space. Good for local testing.
                    </p>
                  </button>
                </div>
              </div>

              {/* Spreadsheet ID / URL inputs */}
              <div className="space-y-4 border-t border-gray-100 pt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                  Target Spreadsheet Links or IDs (Optional but Highly Recommended)
                </label>
                <p className="text-xs text-gray-500 leading-normal">
                  Providing these URLs ensures the app writes 100% reliably to your exact Google Sheets, bypassing any fuzzy filename search issues. Paste the full browser URL or ID of your sheets:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Loan Spreadsheet */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Loan Enquiries Spreadsheet URL / ID</label>
                    <input 
                      type="text"
                      placeholder="e.g. https://docs.google.com/spreadsheets/d/.../edit"
                      value={tempLoanSpreadsheetIdOrUrl}
                      onChange={(e) => setTempLoanSpreadsheetIdOrUrl(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    />
                  </div>

                  {/* Consultation Spreadsheet */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Consultations Spreadsheet URL / ID</label>
                    <input 
                      type="text"
                      placeholder="e.g. https://docs.google.com/spreadsheets/d/.../edit"
                      value={tempConsultSpreadsheetIdOrUrl}
                      onChange={(e) => setTempConsultSpreadsheetIdOrUrl(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Mode Specific Inputs */}
              {tempIntegrationMode === 'central' && (
                <div className="space-y-4 border-t border-gray-100 pt-5 animate-fadeIn">
                  {/* Google Web App URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex justify-between">
                      <span>Google Apps Script Web App URL</span>
                      <span className="text-brand-gold text-[10px] normal-case font-semibold">Requires Anyone setup</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="url"
                        placeholder="https://script.google.com/macros/s/.../exec"
                        value={tempScriptUrl}
                        onChange={(e) => setTempScriptUrl(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTestingConnection}
                        className="bg-brand-blue hover:bg-blue-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        {isTestingConnection ? (
                          <>
                            <Loader2 className="animate-spin" size={14} />
                            Testing...
                          </>
                        ) : 'Test Connection'}
                      </button>
                    </div>

                    {/* Test result status message */}
                    {connectionTestResult.message && (
                      <div className={`p-3.5 rounded-lg text-xs leading-relaxed border animate-fadeIn ${
                        connectionTestResult.status === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : connectionTestResult.status === 'error'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <strong>{connectionTestResult.status === 'success' ? '✓ ' : connectionTestResult.status === 'error' ? '✗ ' : '⚡ '} </strong> 
                        {connectionTestResult.message}
                      </div>
                    )}
                  </div>

                    {/* How-to Setup Segment */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-150 space-y-3.5">
                      <h4 className="font-bold text-brand-blue text-xs flex items-center gap-1.5 uppercase tracking-wider">
                        <div className="w-1.5 h-3 bg-brand-gold rounded-full" />
                        Step-by-step Setup Guide (2 Minutes)
                      </h4>
                      <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-600 leading-relaxed text-left">
                        <li>Create or locate two Google Sheets in your Google Drive named:
                          <ul className="list-disc pl-5 mt-1 font-semibold text-gray-700 space-y-1">
                            <li><code className="bg-white px-1 py-0.5 rounded border text-brand-blue">KML_Finance _Loan_Enquiries</code> (or <code className="bg-white px-1 py-0.5 rounded border text-brand-blue">KML_Finance_Loan_Enquiries</code>)</li>
                            <li><code className="bg-white px-1 py-0.5 rounded border text-brand-blue">KML_Finance_Consultations</code></li>
                          </ul>
                        </li>
                        <li>Go to Google Sheets or <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-brand-blue underline font-semibold">script.google.com</a>, create an Apps Script project.</li>
                        <li>Delete any default code, paste the script below, and save:</li>
                      </ol>

                      {/* Code Snip Container */}
                      <div className="relative rounded-lg overflow-hidden border border-gray-200">
                        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center text-[11px] text-gray-400 font-mono">
                          <span>apps_script.js</span>
                          <button 
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`function doPost(e) {
  try {
    // 1. Extract raw contents
    var postDataContents = "";
    if (e && e.postData && e.postData.contents) {
      postDataContents = e.postData.contents;
    }
    
    // 2. Parse JSON or fallback to parameters
    var data = {};
    if (postDataContents) {
      // Remove trailing '=' if it's treated as urlencoded key with empty value
      if (postDataContents.slice(-1) === '=') {
        var stripped = postDataContents.slice(0, -1);
        try {
          data = JSON.parse(stripped);
        } catch (err) {
          try {
            data = JSON.parse(decodeURIComponent(stripped));
          } catch (decErr) {
            try {
              data = JSON.parse(decodeURIComponent(postDataContents));
            } catch (origDecErr) {}
          }
        }
      }
      
      // Standard parsing
      if (!data || Object.keys(data).length === 0) {
        try {
          data = JSON.parse(postDataContents);
          if (typeof data === "string") {
            data = JSON.parse(data);
          }
        } catch (parseError) {
          try {
            var decoded = decodeURIComponent(postDataContents);
            data = JSON.parse(decoded);
          } catch (decodedError) {
            data = {};
          }
        }
      }
    }
    
    // Fallback: merge with e.parameter (useful if parsed as URL query parameters)
    if (e && e.parameter) {
      for (var key in e.parameter) {
        if (!data[key]) {
          data[key] = e.parameter[key];
        }
      }
    }

    // 3. Extract type and payload
    var type = data.type || "";
    var payload = data.data || data; // if flat JSON, payload is the root data object
    
    // Handle stringified payload
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch (e) {}
    }

    // Auto-detect type if missing
    if (!type) {
      if (payload.loanType || payload.income || payload.occupation) {
        type = "loan";
      } else if (payload.service || payload.phone || payload.city) {
        type = "consultation";
      } else if (data.name) {
        type = "consultation";
      }
    }
    
    // Normalize type
    type = String(type).toLowerCase().trim();

    if (type === "ping") {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        message: "Connection test successful! Your Google Apps Script Web App is online and configured correctly." 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!payload || Object.keys(payload).length === 0) {
      throw new Error("Missing payload data inside POST request. Received keys: " + Object.keys(data).join(", "));
    }
    
    var fileNamesToTry = [];
    var headers = [];
    var rowData = [];
    
    if (type === "loan") {
      fileNamesToTry = ["KML_Finance_Loan_Enquiries", "KML_Finance _Loan_Enquiries", "KML Finance Loan Enquiries"];
      headers = ['Name', 'Age', 'Contact Number', 'Occupation', 'Loan Type', 'Monthly Income (₹)', 'Enquiry Date'];
      rowData = [
        payload.name || payload.Name || "N/A",
        payload.age || payload.Age || "N/A",
        payload.contactNo || payload.contact || payload.phone || "N/A",
        payload.occupation || "N/A",
        payload.loanType || "N/A",
        payload.income || "N/A",
        payload.enquiredDate || new Date().toLocaleString()
      ];
    } else if (type === "consultation") {
      fileNamesToTry = ["KML_Finance_Consultations", "KML_Finance _Consultations", "KML Finance Consultations"];
      headers = ['Name', 'Phone Number', 'Service Required', 'City', 'Enquiry Date'];
      rowData = [
        payload.name || payload.Name || "N/A",
        payload.phone || payload.Phone || payload.contactNo || "N/A",
        payload.service || payload.Service || "General",
        payload.city || payload.City || "N/A",
        payload.enquiredDate || new Date().toLocaleString()
      ];
    } else {
      throw new Error("Invalid or unrecognized application type: '" + type + "'. Expected 'loan' or 'consultation'. Received keys: " + Object.keys(data).join(", "));
    }
    
    if (rowData.length === 0) {
      throw new Error("Row data to append is empty for type: '" + type + "'");
    }
    
    // Check if an explicit spreadsheet ID or URL was provided
    var explicitTarget = payload.spreadsheetId || data.spreadsheetId || "";
    var ss = null;
    var spreadsheetName = fileNamesToTry[0];
    
    if (explicitTarget) {
      var sheetId = explicitTarget.trim();
      var matches = sheetId.match(/\\/spreadsheets\\/d\\/([a-zA-Z0-9-_]+)/);
      if (matches && matches[1]) {
        sheetId = matches[1];
      }
      try {
        ss = SpreadsheetApp.openById(sheetId);
        spreadsheetName = ss.getName();
      } catch (openErr) {
        Logger.log("Failed to open spreadsheet by ID: " + openErr.toString());
      }
    }
    
    // Fallback: search by filenames
    if (!ss) {
      for (var i = 0; i < fileNamesToTry.length; i++) {
        var files = DriveApp.getFilesByName(fileNamesToTry[i]);
        if (files.hasNext()) {
          var file = files.next();
          ss = SpreadsheetApp.open(file);
          spreadsheetName = fileNamesToTry[i];
          break;
        }
      }
    }
    
    if (!ss) {
      ss = SpreadsheetApp.create(spreadsheetName);
    }
    
    var sheet = ss.getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Data successfully saved to spreadsheet: " + spreadsheetName 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`);
                              setIsCopied(true);
                              setTimeout(() => setIsCopied(false), 2000);
                            }}
                            className="text-brand-gold hover:text-yellow-400 cursor-pointer font-bold focus:outline-none"
                          >
                            {isCopied ? 'Copied ✓' : 'Copy Code'}
                          </button>
                        </div>
                        <pre className="p-3 bg-gray-950 text-gray-300 font-mono text-[10px] overflow-x-auto max-h-40 leading-relaxed text-left">
{`function doPost(e) {
  try {
    // 1. Extract raw contents
    var postDataContents = "";
    if (e && e.postData && e.postData.contents) {
      postDataContents = e.postData.contents;
    }
    
    // 2. Parse JSON or fallback to parameters
    var data = {};
    if (postDataContents) {
      // Remove trailing '=' if it's treated as urlencoded key with empty value
      if (postDataContents.slice(-1) === '=') {
        var stripped = postDataContents.slice(0, -1);
        try {
          data = JSON.parse(stripped);
        } catch (err) {
          try {
            data = JSON.parse(decodeURIComponent(stripped));
          } catch (decErr) {
            try {
              data = JSON.parse(decodeURIComponent(postDataContents));
            } catch (origDecErr) {}
          }
        }
      }
      
      // Standard parsing
      if (!data || Object.keys(data).length === 0) {
        try {
          data = JSON.parse(postDataContents);
          if (typeof data === "string") {
            data = JSON.parse(data);
          }
        } catch (parseError) {
          try {
            var decoded = decodeURIComponent(postDataContents);
            data = JSON.parse(decoded);
          } catch (decodedError) {
            data = {};
          }
        }
      }
    }
    
    // Fallback: merge with e.parameter (useful if parsed as URL query parameters)
    if (e && e.parameter) {
      for (var key in e.parameter) {
        if (!data[key]) {
          data[key] = e.parameter[key];
        }
      }
    }

    // 3. Extract type and payload
    var type = data.type || "";
    var payload = data.data || data; // if flat JSON, payload is the root data object
    
    // Handle stringified payload
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch (e) {}
    }

    // Auto-detect type if missing
    if (!type) {
      if (payload.loanType || payload.income || payload.occupation) {
        type = "loan";
      } else if (payload.service || payload.phone || payload.city) {
        type = "consultation";
      } else if (data.name) {
        type = "consultation";
      }
    }
    
    // Normalize type
    type = String(type).toLowerCase().trim();

    if (type === "ping") {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        message: "Connection test successful! Your Google Apps Script Web App is online and configured correctly." 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!payload || Object.keys(payload).length === 0) {
      throw new Error("Missing payload data inside POST request. Received keys: " + Object.keys(data).join(", "));
    }
    
    var fileNamesToTry = [];
    var headers = [];
    var rowData = [];
    
    if (type === "loan") {
      fileNamesToTry = ["KML_Finance_Loan_Enquiries", "KML_Finance _Loan_Enquiries", "KML Finance Loan Enquiries"];
      headers = ['Name', 'Age', 'Contact Number', 'Occupation', 'Loan Type', 'Monthly Income (₹)', 'Enquiry Date'];
      rowData = [
        payload.name || payload.Name || "N/A",
        payload.age || payload.Age || "N/A",
        payload.contactNo || payload.contact || payload.phone || "N/A",
        payload.occupation || "N/A",
        payload.loanType || "N/A",
        payload.income || "N/A",
        payload.enquiredDate || new Date().toLocaleString()
      ];
    } else if (type === "consultation") {
      fileNamesToTry = ["KML_Finance_Consultations", "KML_Finance _Consultations", "KML Finance Consultations"];
      headers = ['Name', 'Phone Number', 'Service Required', 'City', 'Enquiry Date'];
      rowData = [
        payload.name || payload.Name || "N/A",
        payload.phone || payload.Phone || payload.contactNo || "N/A",
        payload.service || payload.Service || "General",
        payload.city || payload.City || "N/A",
        payload.enquiredDate || new Date().toLocaleString()
      ];
    } else {
      throw new Error("Invalid or unrecognized application type: '" + type + "'. Expected 'loan' or 'consultation'. Received keys: " + Object.keys(data).join(", "));
    }
    
    if (rowData.length === 0) {
      throw new Error("Row data to append is empty for type: '" + type + "'");
    }
    
    // Check if an explicit spreadsheet ID or URL was provided
    var explicitTarget = payload.spreadsheetId || data.spreadsheetId || "";
    var ss = null;
    var spreadsheetName = fileNamesToTry[0];
    
    if (explicitTarget) {
      var sheetId = explicitTarget.trim();
      var matches = sheetId.match(/\\/spreadsheets\\/d\\/([a-zA-Z0-9-_]+)/);
      if (matches && matches[1]) {
        sheetId = matches[1];
      }
      try {
        ss = SpreadsheetApp.openById(sheetId);
        spreadsheetName = ss.getName();
      } catch (openErr) {
        Logger.log("Failed to open spreadsheet by ID: " + openErr.toString());
      }
    }
    
    // Fallback: search by filenames
    if (!ss) {
      for (var i = 0; i < fileNamesToTry.length; i++) {
        var files = DriveApp.getFilesByName(fileNamesToTry[i]);
        if (files.hasNext()) {
          var file = files.next();
          ss = SpreadsheetApp.open(file);
          spreadsheetName = fileNamesToTry[i];
          break;
        }
      }
    }
    
    if (!ss) {
      ss = SpreadsheetApp.create(spreadsheetName);
    }
    
    var sheet = ss.getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Data successfully saved to spreadsheet: " + spreadsheetName 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`}
                        </pre>
                      </div>

                      <ol className="list-decimal pl-5 space-y-3 text-xs text-gray-600 leading-relaxed text-left" start={4}>
                        <li>Click the <strong>Deploy</strong> button in top-right, and select <strong>New Deployment</strong>.</li>
                        <li>Click the gear icon (Select type) next to "Deploy", choose <strong>Web App</strong>.</li>
                        <li>Set <em>Execute as:</em> <strong>Me (your-email@gmail.com)</strong>.</li>
                        <li>
                          Set <em>Who has access:</em> <strong>Anyone</strong>.
                          <div className="mt-2 bg-amber-50 p-3.5 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
                            <p className="font-bold">⚠️ Cannot see the "Anyone" option?</p>
                            <p>If you are logged into a Google Workspace / Business account, your company's IT administrator has restricted external access. To fix this:</p>
                            <ul className="list-disc pl-4 space-y-1 mt-1">
                              <li>Deploy using a <strong>personal @gmail.com account</strong> instead (this is highly recommended!), OR</li>
                              <li>Ask your Google Workspace IT administrator to enable external sharing for Apps Script.</li>
                            </ul>
                          </div>
                        </li>
                        <li>Click <strong>Deploy</strong>, authorize required permissions (if Google warns you, click <em>Advanced</em> &rarr; <em>Go to Untitled project (unsafe)</em>), and copy the <strong>Web App URL</strong> (which must end with <code className="bg-white px-1 py-0.5 rounded border text-red-600 font-mono">/exec</code>).</li>
                      </ol>
                  </div>
                </div>
              )}

              {tempIntegrationMode === 'individual' && (
                <div className="space-y-4 animate-fadeIn border-t border-gray-100 pt-5">
                  <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 space-y-3">
                    <h4 className="font-bold text-brand-blue text-xs uppercase tracking-wider flex items-center gap-1.5">
                      💡 Individual Mode Authorization
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed text-left">
                      Under individual mode, please connect your Google account directly using the <strong>Cloud Sync Connection</strong> banner at the top of this panel. This website will then securely search for and save records to your pre-created sheets inside your connected Google Drive:
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-600 pl-2 font-semibold space-y-1 text-left">
                      <li>KML_Finance _Loan_Enquiries (or KML_Finance_Loan_Enquiries)</li>
                      <li>KML_Finance_Consultations</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
              <button 
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-xs font-semibold border border-gray-300 hover:bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSaveSettings}
                className="text-xs font-bold bg-brand-blue hover:bg-blue-900 text-white py-2.5 px-5 rounded-lg transition-colors shadow-md cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
