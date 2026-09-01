import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Globe2, AlertCircle, Sparkles, Check } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
  buttonLabel?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  className = '',
  buttonLabel = 'Voice Input',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [interimText, setInterimText] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            onTranscript(transcript.trim());
            setInterimText('');
          } else {
            currentTranscript += transcript;
            setInterimText(currentTranscript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access denied. Please allow microphone permission.');
        } else {
          setErrorMessage(`Speech recognition notice: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition init error:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscript]);

  const toggleRecording = () => {
    setErrorMessage(null);
    if (!isSupported) {
      setErrorMessage('Voice recognition is not supported in this browser. Please use manual entry.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = language;
          recognitionRef.current.start();
          setIsRecording(true);
        }
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setErrorMessage('Unable to start audio recording. Please check browser microphone settings.');
      }
    }
  };

  return (
    <div className={`inline-flex flex-col gap-1.5 ${className}`}>
      <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 shadow-2xs">
        {/* Record Toggle Button */}
        <button
          type="button"
          onClick={toggleRecording}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            isRecording
              ? 'bg-rose-500 text-white animate-pulse shadow-xs shadow-rose-300'
              : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200'
          }`}
          title={isRecording ? 'Click to stop voice recording' : 'Click to dictate notes'}
        >
          {isRecording ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Recording ({language === 'hi-IN' ? 'Hindi' : 'English'})...</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-emerald-600" />
              <span>{buttonLabel}</span>
            </>
          )}
        </button>

        {/* Language Selector */}
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 px-1 border-l border-slate-200">
          <Globe2 className="w-3.5 h-3.5 text-slate-400" />
          <button
            type="button"
            onClick={() => setLanguage('en-IN')}
            className={`px-1.5 py-0.5 rounded ${
              language === 'en-IN'
                ? 'bg-emerald-100 text-emerald-800 font-bold'
                : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            EN
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => setLanguage('hi-IN')}
            className={`px-1.5 py-0.5 rounded ${
              language === 'hi-IN'
                ? 'bg-emerald-100 text-emerald-800 font-bold'
                : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Live Interim Transcript Bubble */}
      {interimText && (
        <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-900 px-2.5 py-1.5 rounded-md flex items-center gap-2 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="italic truncate">"{interimText}"</span>
        </div>
      )}

      {/* Unsupported or Error Notice */}
      {errorMessage && (
        <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
