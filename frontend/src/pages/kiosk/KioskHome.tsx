import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  UserCheck,
  QrCode,
  HelpCircle,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  PhoneCall,
  X
} from 'lucide-react';
import { KioskHeader } from '../../components/kiosk/KioskHeader';

export const KioskHome: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const t = {
    en: {
      welcome: "Welcome to AyushCare",
      subtitle: "Let's prepare your health information before you meet the doctor.",
      newPatient: "I am a new patient",
      newDesc: "Register and start pre-consultation intake",
      existingPatient: "I already have an account",
      existingDesc: "Lookup with mobile number or patient ID",
      scanQr: "Scan my Patient QR",
      scanDesc: "Hold your phone QR up to the scanner",
      needHelp: "I need help / Assistance",
      needHelpDesc: "Request a hospital volunteer assistant",
      emergencyAlert: "Urgent symptoms? Please inform hospital reception staff immediately."
    },
    hi: {
      welcome: "आयुषकेयर में आपका स्वागत है",
      subtitle: "डॉक्टर से मिलने से पहले आइए आपकी स्वास्थ्य जानकारी तैयार करें।",
      newPatient: "मैं नया मरीज हूँ (New Patient)",
      newDesc: "नया पंजीकरण और जांच विवरण शुरू करें",
      existingPatient: "मेरा पहले से खाता है",
      existingDesc: "मोबाइल नंबर या मरीज आईडी से खोजें",
      scanQr: "मरीज QR कोड स्कैन करें",
      scanDesc: "अपने फोन का QR कोड स्कैनर के सामने लाएं",
      needHelp: "मुझे सहायता चाहिए",
      needHelpDesc: "अस्पताल सहायक से मदद प्राप्त करें",
      emergencyAlert: "आपातकालीन स्थिति में तुरंत अस्पताल स्टाफ से संपर्क करें।"
    },
    mr: {
      welcome: "आयुषकेअर मध्ये आपले स्वागत आहे",
      subtitle: "डॉक्टरांना भेटण्यापूर्वी आपली आरोग्य माहिती तयार करूया.",
      newPatient: "मी नवीन रुग्ण आहे",
      newDesc: "नवीन नोंदणी आणि तपासणी सुरू करा",
      existingPatient: "माझे आधीच खाते आहे",
      existingDesc: "मोबाईल नंबर किंवा पेशंट आयडीने शोधा",
      scanQr: "रुग्ण QR कोड स्कॅन करा",
      scanDesc: "आपल्या फोनमधील QR कोड स्कॅनरसमोर धरा",
      needHelp: "मला मदत हवी आहे",
      needHelpDesc: "रुग्णालय सहाय्यकाची मदत घ्या",
      emergencyAlert: "तातडीच्या परिस्थितीत त्वरित रुग्णालय कर्मचाऱ्यांशी संपर्क साधा."
    }
  }[language];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans select-none">
      {/* Kiosk Header */}
      <KioskHeader
        language={language}
        onLanguageChange={setLanguage}
        onEmergencyClick={() => setShowEmergencyModal(true)}
      />

      {/* Main Kiosk Touch Screen Viewport */}
      <main className="max-w-5xl w-full mx-auto my-auto p-6 sm:p-10 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="bg-amber-500/20 text-amber-300 font-bold text-xs px-3.5 py-1 rounded-full border border-amber-500/30 inline-block">
            Reception Self-Service Kiosk
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {t.welcome}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* 4 Large Touch Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: New Patient */}
          <button
            onClick={() => navigate(`/kiosk/assessment?lang=${language}&mode=new`)}
            className="p-8 bg-slate-900 hover:bg-slate-850 border-3 border-emerald-500/60 hover:border-emerald-400 rounded-3xl text-left transition-all duration-200 hover:scale-[1.02] shadow-xl hover:shadow-emerald-500/20 flex items-start gap-5 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <UserPlus className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300">
                {t.newPatient}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {t.newDesc}
              </p>
            </div>
          </button>

          {/* Card 2: Existing Patient */}
          <button
            onClick={() => navigate(`/kiosk/identify?lang=${language}`)}
            className="p-8 bg-slate-900 hover:bg-slate-850 border-3 border-teal-500/60 hover:border-teal-400 rounded-3xl text-left transition-all duration-200 hover:scale-[1.02] shadow-xl hover:shadow-teal-500/20 flex items-start gap-5 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <UserCheck className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-teal-300">
                {t.existingPatient}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {t.existingDesc}
              </p>
            </div>
          </button>

          {/* Card 3: Scan QR */}
          <button
            onClick={() => navigate(`/kiosk/identify?lang=${language}&mode=qr`)}
            className="p-8 bg-slate-900 hover:bg-slate-850 border-3 border-amber-500/60 hover:border-amber-400 rounded-3xl text-left transition-all duration-200 hover:scale-[1.02] shadow-xl hover:shadow-amber-500/20 flex items-start gap-5 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <QrCode className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300">
                {t.scanQr}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {t.scanDesc}
              </p>
            </div>
          </button>

          {/* Card 4: Need Help */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-8 bg-slate-900 hover:bg-slate-850 border-3 border-indigo-500/60 hover:border-indigo-400 rounded-3xl text-left transition-all duration-200 hover:scale-[1.02] shadow-xl hover:shadow-indigo-500/20 flex items-start gap-5 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-indigo-300">
                {t.needHelp}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {t.needHelpDesc}
              </p>
            </div>
          </button>
        </div>
      </main>

      {/* Emergency Call Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-red-500 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center mx-auto animate-bounce">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Hospital Staff Notified</h3>
              <p className="text-sm text-slate-300">
                Please remain seated at Kiosk #3. A hospital triage nurse is arriving to assist you.
              </p>
            </div>

            <button
              onClick={() => setShowEmergencyModal(false)}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl text-base shadow-lg transition-all"
            >
              Close & Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Kiosk Assistance</h3>
              <p className="text-sm text-slate-300">
                You can answer the questions either by speaking into the microphone or by touching the large buttons on the screen.
              </p>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl text-base shadow-lg transition-all"
            >
              I Understand — Start Intake
            </button>
          </div>
        </div>
      )}

      {/* Footer Banner */}
      <footer className="p-4 bg-slate-900/80 border-t border-slate-800 text-center text-xs text-slate-400">
        AyushCare Kiosk System • Inactivity timeout active • Secure session resets after completion
      </footer>
    </div>
  );
};
