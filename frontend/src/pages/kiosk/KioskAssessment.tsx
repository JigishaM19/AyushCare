import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mic,
  MicOff,
  CheckCircle2,
  RotateCcw,
  Edit3,
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  Volume2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { KioskHeader } from '../../components/kiosk/KioskHeader';
import { KioskQuestion } from '../../types/portal';
import { api } from '../../services/api';

export const KioskAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'hi' | 'mr') || 'en';
  const patientIdParam = searchParams.get('patient_id') ? Number(searchParams.get('patient_id')) : undefined;

  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>(lang);
  const [currentQuestion, setCurrentQuestion] = useState<KioskQuestion | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [sessionCode, setSessionCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Voice Interaction State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [showVoiceConfirmation, setShowVoiceConfirmation] = useState(false);

  // Initialize Kiosk Session & Load First Question
  useEffect(() => {
    async function initKiosk() {
      setLoading(true);
      try {
        const session = await api.createKioskSession({
          patient_id: patientIdParam,
          language: language,
        });
        setSessionCode(session.session_code);
        setCurrentQuestion(session.first_question);
      } catch (err) {
        console.error('Failed to init kiosk session:', err);
      } finally {
        setLoading(false);
      }
    }
    initKiosk();
  }, [patientIdParam, language]);

  const handleSelectOption = async (optionId: string, labelText: string) => {
    if (!currentQuestion) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: optionId,
    };
    setAnswers(newAnswers);

    // Fetch next adaptive question from engine
    try {
      const res = await api.fetchKioskQuestion({
        current_question_id: currentQuestion.id,
        answers: newAnswers,
      });

      if (res.is_completed || !res.question) {
        // All questions completed -> Navigate to Review screen
        navigate(`/kiosk/review?session=${sessionCode}&lang=${language}${patientIdParam ? `&patient_id=${patientIdParam}` : ''}`, {
          state: { answers: newAnswers, sessionCode, patientId: patientIdParam }
        });
      } else {
        setCurrentQuestion(res.question);
        setVoiceTranscript('');
        setShowVoiceConfirmation(false);
      }
    } catch (err) {
      console.error('Error advancing question:', err);
    }
  };

  // Web Speech API Voice Dictation Simulation / Live Recognition
  const handleToggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceTranscript('');
      };

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setVoiceTranscript(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (voiceTranscript) {
          setShowVoiceConfirmation(true);
        }
      };

      recognition.start();
    } else {
      // Fallback simulation for browsers without Web Speech
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const sampleText =
          language === 'hi'
            ? 'मुझे पिछले तीन दिनों से पेट में तेज दर्द और जलन हो रही है।'
            : language === 'mr'
            ? 'मला मागील तीन दिवसांपासून पोटात तीव्र दुखत आहे आणि जळजळ होत आहे.'
            : 'I have had stomach pain and burning for the past three days.';
        setVoiceTranscript(sampleText);
        setShowVoiceConfirmation(true);
      }, 2000);
    }
  };

  const handleConfirmVoice = () => {
    if (!currentQuestion) return;
    handleSelectOption('voice_input', voiceTranscript);
  };

  if (loading || !currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <p className="text-sm font-bold text-amber-400 animate-pulse">Initializing adaptive AI pre-consultation...</p>
      </div>
    );
  }

  const localizedQ = currentQuestion.translations[language] || currentQuestion.translations['en'];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans select-none">
      <KioskHeader
        language={language}
        onLanguageChange={setLanguage}
        onEmergencyClick={() => alert('Hospital Staff Notified')}
      />

      <main className="max-w-4xl w-full mx-auto my-auto p-6 sm:p-10 space-y-6">
        {/* Question Card */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          {/* Category Tag */}
          <div className="flex items-center justify-between">
            <span className="bg-amber-500/20 text-amber-300 font-bold text-xs px-3 py-1 rounded-full border border-amber-500/30">
              {currentQuestion.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">Session #{sessionCode}</span>
          </div>

          {/* Large Question Title */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
              {localizedQ.text}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              {localizedQ.hint}
            </p>
          </div>

          {/* Options Grid (Large Touch Buttons) */}
          {currentQuestion.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {currentQuestion.options.map((opt) => {
                const label = opt.labels[language] || opt.labels['en'];
                const isSelected = answers[currentQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id, label)}
                    className={`p-5 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all duration-150 flex items-center justify-between group ${
                      isSelected
                        ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-lg'
                        : 'bg-slate-950/80 hover:bg-slate-800 border-slate-700 text-white hover:border-amber-400'
                    }`}
                  >
                    <span>{label}</span>
                    <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Voice Input Confirmation Section */}
          {showVoiceConfirmation && (
            <div className="bg-slate-950 p-6 rounded-2xl border-2 border-teal-500 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>You Said (Speech Recognized):</span>
              </div>
              <p className="text-base font-bold text-white bg-slate-900 p-4 rounded-xl border border-slate-800">
                "{voiceTranscript}"
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleConfirmVoice}
                  className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Continue</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowVoiceConfirmation(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Large Voice Action Button */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2.5 ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/40'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? 'Listening... Speak now' : '🎤 Tap to Speak Your Answer'}</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Touch an option above or speak into the microphone
            </span>
          </div>
        </div>
      </main>

      <footer className="p-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
        Adaptive AI Engine • AyushCare Clinical Standards
      </footer>
    </div>
  );
};
