import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mic,
  Volume2,
  Heart,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  User,
  Globe
} from 'lucide-react';
import { getActivePatient, api } from '../../services/api';
import { VoiceInput } from '../../components/common/VoiceInput';

export const PatientOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const activePatient = getActivePatient();

  const [step, setStep] = useState<number>(1);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Identity
    full_name: activePatient.name || 'Aarav Sharma',
    age: activePatient.age || 34,
    gender: activePatient.gender || 'Male',
    preferred_language: 'Hindi',

    // Step 2: Reason for Visit
    chief_reason: 'Stomach problem / Acidity',
    chief_notes: '',

    // Step 3: Chronology
    duration: 'A few weeks ago',
    progression: 'Getting worse',

    // Step 4: Medical History
    diagnosed_conditions: ['High blood pressure (BP)'] as string[],

    // Step 5: Surgeries & Medications
    had_surgery: 'No',
    taking_medicines: 'Yes (Amlodipine 5mg OD)',

    // Step 6: Allergies
    allergy_type: 'Sulfa medicine allergy',

    // Step 7: Lifestyle & Personal Habits
    diet: 'Vegetarian',
    sleep: 'Sometimes disturbed',
    bowels: 'Occasional Constipation',
    physical_activity: 'Moderate',
  });

  const totalSteps = 8;

  const handleToggleCondition = (cond: string) => {
    if (formData.diagnosed_conditions.includes(cond)) {
      setFormData({
        ...formData,
        diagnosed_conditions: formData.diagnosed_conditions.filter((c) => c !== cond),
      });
    } else {
      setFormData({
        ...formData,
        diagnosed_conditions: [...formData.diagnosed_conditions, cond],
      });
    }
  };

  const handleFinishOnboarding = async () => {
    setSubmitting(true);
    try {
      await api.savePatientOnboarding({
        patient_id: activePatient.id,
        answers: {
          q_chief_complaint: formData.chief_reason + (formData.chief_notes ? ` - ${formData.chief_notes}` : ''),
          q_duration: formData.duration,
          q_progression: formData.progression,
          q_medical_conditions: formData.diagnosed_conditions.join(', '),
          q_medications: formData.taking_medicines,
          q_allergies: formData.allergy_type,
          q_lifestyle_habits: `${formData.diet} diet, ${formData.sleep} sleep, ${formData.bowels}`
        }
      });
      navigate('/patient/dashboard');
    } catch (err) {
      console.error('Failed to save onboarding:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-50 text-teal-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-teal-200">
              First-Time Health Profile
            </span>
            <span className="text-xs text-slate-400">Step {step} of {totalSteps}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Let's create your health profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your answers will help create your initial health record and prepare information for your doctor.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              language === 'en' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              language === 'hi' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-teal-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Content Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* STEP 1: Basic Identity */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">1. Confirm Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preferred Consultation Language</label>
                <select
                  value={formData.preferred_language}
                  onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                >
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="English">English</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Main Reason for Visit */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'आज आप अस्पताल किस मुख्य समस्या के लिए आए हैं?' : 'What is the main reason for your visit today?'}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                'Stomach problem / Acidity',
                'Headache / Head pain',
                'Joint pain / Backache',
                'Fever / Cold',
                'Skin itching / Rash',
                'Weakness / Fatigue',
                'Sleep problem',
                'General Checkup'
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setFormData({ ...formData, chief_reason: reason })}
                  className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    formData.chief_reason === reason
                      ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Additional Details (Voice or Type):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.chief_notes}
                  onChange={(e) => setFormData({ ...formData, chief_notes: e.target.value })}
                  placeholder="e.g. Pain increases after eating spicy food..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900"
                />
                <VoiceInput
                  onTranscript={(text) => setFormData({ ...formData, chief_notes: text })}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Chronology */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'यह समस्या कब से शुरू हुई और कैसी चल रही है?' : 'When did this problem start and how is it progressing?'}
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">When did it start?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {['Today / Yesterday', 'A few days ago', 'A few weeks ago', 'A few months ago', 'Longer than 6 months', 'Not sure'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: d })}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      formData.duration === d
                        ? 'bg-teal-50 border-teal-500 text-teal-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-700 block">Is it getting better, worse, or same?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['Getting worse', 'Staying the same', 'Getting better', 'Comes and goes'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, progression: p })}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      formData.progression === p
                        ? 'bg-teal-50 border-teal-500 text-teal-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Medical History */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'क्या आपको पहले से इनमें से कोई बीमारी है?' : 'Have you ever been diagnosed with any medical condition?'}
            </h2>
            <p className="text-xs text-slate-500">Select all that apply</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                'Diabetes (Sugar)',
                'High blood pressure (BP)',
                'Asthma / Respiratory',
                'Thyroid condition',
                'Heart condition',
                'Kidney condition',
                'None of the above'
              ].map((cond) => {
                const isSelected = formData.diagnosed_conditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => handleToggleCondition(cond)}
                    className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cond}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Medications & Surgeries */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'दवाइयां और पिछली सर्जरी का विवरण' : 'Current Medications & Previous Surgeries'}
            </h2>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Are you currently taking any medicines regularly?
              </label>
              <input
                type="text"
                value={formData.taking_medicines}
                onChange={(e) => setFormData({ ...formData, taking_medicines: e.target.value })}
                placeholder="e.g. Yes, taking BP tablet daily or No"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900"
              />
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Have you had any surgery or hospital admission in the past?
              </label>
              <input
                type="text"
                value={formData.had_surgery}
                onChange={(e) => setFormData({ ...formData, had_surgery: e.target.value })}
                placeholder="e.g. No, or Appendectomy in 2018"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900"
              />
            </div>
          </div>
        )}

        {/* STEP 6: Allergies */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'क्या आपको किसी दवाई या भोजन से एलर्जी है?' : 'Do you have any known allergies?'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'No known allergies (None)',
                'Sulfa medicine allergy',
                'Penicillin allergy',
                'Food / Dust allergy',
                'Not sure'
              ].map((allg) => (
                <button
                  key={allg}
                  type="button"
                  onClick={() => setFormData({ ...formData, allergy_type: allg })}
                  className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    formData.allergy_type === allg
                      ? 'bg-teal-50 border-teal-500 text-teal-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {allg}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: Lifestyle Habits */}
        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'दिनचर्या और खान-पान का विवरण' : 'Diet & Lifestyle Habits'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Diet Pattern</label>
                <select
                  value={formData.diet}
                  onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sleep Pattern</label>
                <select
                  value={formData.sleep}
                  onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900"
                >
                  <option value="Good regular sleep">Good regular sleep</option>
                  <option value="Sometimes disturbed">Sometimes disturbed</option>
                  <option value="Frequently disturbed / Insomnia">Frequently disturbed / Insomnia</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bowel Habits</label>
                <select
                  value={formData.bowels}
                  onChange={(e) => setFormData({ ...formData, bowels: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900"
                >
                  <option value="Regular normal">Regular normal</option>
                  <option value="Occasional Constipation">Occasional Constipation</option>
                  <option value="Irregular">Irregular</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Physical Activity</label>
                <select
                  value={formData.physical_activity}
                  onChange={(e) => setFormData({ ...formData, physical_activity: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900"
                >
                  <option value="Low (Sedentary)">Low (Sedentary)</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High (Active exercise)">High (Active exercise)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Review & Confirmation */}
        {step === 8 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Review Your Health Profile</span>
            </h2>
            <p className="text-xs text-slate-500">
              Please check your information before saving it to your longitudinal health record.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <p><strong>Patient:</strong> {formData.full_name}, {formData.age} yrs ({formData.gender})</p>
              <p><strong>Main Reason:</strong> {formData.chief_reason} ({formData.duration})</p>
              <p><strong>Medical Conditions:</strong> {formData.diagnosed_conditions.join(', ') || 'None'}</p>
              <p><strong>Current Medications:</strong> {formData.taking_medicines}</p>
              <p><strong>Allergies:</strong> {formData.allergy_type}</p>
              <p><strong>Lifestyle:</strong> {formData.diet} diet, {formData.sleep} sleep, {formData.bowels}</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleFinishOnboarding}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Saving Profile...' : 'Save & Open Dashboard'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
