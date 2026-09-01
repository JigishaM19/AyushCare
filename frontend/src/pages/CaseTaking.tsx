import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  FileCheck2,
  HelpCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Patient } from '../types/patient';
import { Symptom, AshtavidhaData, SocratesPain, Encounter } from '../types/case';
import { PrakritiResult, VikritiResult } from '../types/prakriti';
import { PrescriptionItem } from '../types/prescription';
import { api } from '../services/api';
import { DEMO_CASE_PRESETS, DemoCasePreset } from '../services/demoPresets';

import { StepProgress } from '../components/case/StepProgress';
import { Step1Patient } from '../components/case/Step1Patient';
import { Step2ChiefComplaint } from '../components/case/Step2ChiefComplaint';
import { Step3History } from '../components/case/Step3History';
import { Step4Ashtavidha } from '../components/case/Step4Ashtavidha';
import { Step5Prakriti } from '../components/case/Step5Prakriti';
import { Step6Vikriti } from '../components/case/Step6Vikriti';
import { Step7Summary } from '../components/case/Step7Summary';
import { Step8Prescription } from '../components/case/Step8Prescription';
import { Modal } from '../components/common/Modal';

const STEPS = [
  { label: 'Patient Verification', shortLabel: 'Patient' },
  { label: 'Chief Complaint', shortLabel: 'Complaints' },
  { label: 'Clinical History', shortLabel: 'History' },
  { label: 'Ashtavidha Pariksha', shortLabel: 'Ashtavidha' },
  { label: 'Prakriti Assessment', shortLabel: 'Prakriti' },
  { label: 'Vikriti Imbalance', shortLabel: 'Vikriti' },
  { label: 'Case Summary', shortLabel: 'Summary' },
  { label: 'Digital Prescription', shortLabel: 'Prescription' },
];

export const CaseTaking: React.FC = () => {
  const { caseId } = useParams<{ caseId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Case Clinical State
  const [encounterId, setEncounterId] = useState<number | undefined>(
    caseId ? Number(caseId) : undefined
  );
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [chiefComplaintSummary, setChiefComplaintSummary] = useState('');
  const [hpiNarrative, setHpiNarrative] = useState('');
  const [socrates, setSocrates] = useState<SocratesPain>({
    site: '',
    onset: '',
    character: '',
    radiation: '',
    associated: '',
    timing: '',
    exacerbating: '',
    severity: 5,
  });
  const [pastHistory, setPastHistory] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [personalHistory, setPersonalHistory] = useState({
    diet: 'Vegetarian (Shakahari)',
    appetite: 'Samagni (Balanced digestion)',
    sleep: 'Sound Sleep (6-8 hours)',
    bowel: 'Madhyama Koshtha (Regular, formed daily)',
    stress: 'Normal / Calm',
    activity: 'Moderate daily walk / Yoga',
  });

  const [ashtavidha, setAshtavidha] = useState<AshtavidhaData>({
    nadi: { rate: '72 bpm', rhythm: 'Regular', dominant_dosha: 'Vata-Pitta', gati: 'Sarpa Gati' },
    mutra: { color: 'Pale Yellow (Peeta)', burning: 'Nil', frequency: '4-5 times/day' },
    mala: { consistency: 'Formed / Soft', regularity: 'Regular', frequency: 'Once daily' },
    jihva: { color: 'Pinkish', coating: 'Nirama (Clear)', moisture: 'Normal' },
    shabda: { quality: 'Clear & Audible', speech: 'Normal' },
    sparsha: { temperature: 'Warm / Normal', texture: 'Smooth (Snigdha)' },
    druk: { appearance: 'Clear', sclera_color: 'Normal White' },
    akruti: { build: 'Madhyama (Medium)', posture: 'Erect', gait: 'Normal' },
  });

  const [prakritiResponses, setPrakritiResponses] = useState<Record<string, string>>({});
  const [prakritiResult, setPrakritiResult] = useState<PrakritiResult | null>(null);
  const [vikritiResult, setVikritiResult] = useState<VikritiResult | null>(null);

  const [structuredSummary, setStructuredSummary] = useState('');
  const [practitionerNotes, setPractitionerNotes] = useState('');

  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);
  const [generalAdvice, setGeneralAdvice] = useState('');
  const [dietPathya, setDietPathya] = useState('');
  const [dietApathya, setDietApathya] = useState('');
  const [followUpDate, setFollowUpDate] = useState('14 days (After two weeks)');

  // UI / Autosave State
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'offline'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Quick Register Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // 1. Initial Load of Patients & Parameters
  useEffect(() => {
    async function loadPatients() {
      try {
        const patients = await api.getPatients();
        setAllPatients(patients);

        const patientIdParam = searchParams.get('patientId');
        const demoParam = searchParams.get('demo');

        if (patientIdParam) {
          const match = patients.find((p) => p.id === Number(patientIdParam));
          if (match) setSelectedPatient(match);
        } else if (patients.length > 0 && !selectedPatient) {
          setSelectedPatient(patients[0]);
        }

        if (demoParam) {
          applyPreset(demoParam);
        }
      } catch (err) {
        console.error('Failed to load patients for case-taking:', err);
      }
    }
    loadPatients();
  }, [searchParams]);

  // 2. Load Existing Encounter if caseId is passed
  useEffect(() => {
    async function loadExistingCase() {
      if (!caseId) return;
      try {
        const enc = await api.getEncounter(Number(caseId));
        if (enc) {
          setEncounterId(enc.id);
          setChiefComplaintSummary(enc.chief_complaint || '');
          setHpiNarrative(enc.hpi || '');
          setPastHistory(enc.past_history || '');
          setFamilyHistory(enc.family_history || '');
          setStructuredSummary(enc.structured_summary || '');
          setPractitionerNotes(enc.practitioner_notes || '');
          if (enc.symptoms) setSymptoms(enc.symptoms);

          if (enc.pain_socrates) {
            try {
              setSocrates(JSON.parse(enc.pain_socrates));
            } catch (e) {}
          }
          if (enc.personal_history) {
            try {
              setPersonalHistory(JSON.parse(enc.personal_history));
            } catch (e) {}
          }
        }

        // Load Ashtavidha
        const ash = await api.getAshtavidha(Number(caseId)).catch(() => null);
        if (ash) {
          setAshtavidha({
            nadi: ash.nadi ? JSON.parse(ash.nadi) : undefined,
            mutra: ash.mutra ? JSON.parse(ash.mutra) : undefined,
            mala: ash.mala ? JSON.parse(ash.mala) : undefined,
            jihva: ash.jihva ? JSON.parse(ash.jihva) : undefined,
            shabda: ash.shabda ? JSON.parse(ash.shabda) : undefined,
            sparsha: ash.sparsha ? JSON.parse(ash.sparsha) : undefined,
            druk: ash.druk ? JSON.parse(ash.druk) : undefined,
            akruti: ash.akruti ? JSON.parse(ash.akruti) : undefined,
            notes: ash.notes,
          });
        }

        // Load Prakriti
        const prak = await api.getPrakriti(Number(caseId)).catch(() => null);
        if (prak) {
          setPrakritiResult(prak);
          if (prak.responses_json) {
            try {
              setPrakritiResponses(JSON.parse(prak.responses_json));
            } catch (e) {}
          }
        }

        // Load Prescription
        const rx = await api.getPrescription(Number(caseId)).catch(() => null);
        if (rx) {
          setPrescriptionItems(rx.items || []);
          setGeneralAdvice(rx.general_advice || '');
          setDietPathya(rx.diet_pathya || '');
          setDietApathya(rx.diet_apathya || '');
          setFollowUpDate(rx.follow_up_date || '14 days');
        }
      } catch (err) {
        console.error('Failed to load existing case:', err);
      }
    }
    loadExistingCase();
  }, [caseId]);

  // Apply Demo Preset for 4-Minute Presentation
  const applyPreset = (presetId: string) => {
    const preset = DEMO_CASE_PRESETS.find((p) => p.id === presetId) || DEMO_CASE_PRESETS[0];
    if (!preset) return;

    setChiefComplaintSummary(preset.chiefComplaint);
    setSymptoms(preset.symptoms);
    setSocrates(preset.socrates);
    setHpiNarrative(preset.hpiNarrative);
    setPastHistory(preset.pastHistory);
    setFamilyHistory(preset.familyHistory);
    setPersonalHistory(preset.personalHistory);
    setAshtavidha(preset.ashtavidha);
    setPrakritiResponses(preset.prakritiResponses);
    setPrescriptionItems(preset.prescriptionItems);
    setGeneralAdvice(preset.generalAdvice);
    setDietPathya(preset.dietPathya);
    setDietApathya(preset.dietApathya);

    // Trigger Prakriti scoring
    api
      .calculatePrakriti({
        encounter_id: encounterId,
        responses: preset.prakritiResponses,
      })
      .then((res) => setPrakritiResult(res))
      .catch((e) => console.error(e));

    // Trigger Vikriti scoring
    api
      .calculateVikriti({
        encounter_id: encounterId,
        symptoms: preset.symptoms,
        ashtavidha: preset.ashtavidha,
      })
      .then((res) => setVikritiResult(res))
      .catch((e) => console.error(e));

    setStructuredSummary(
      `34-year-old presenting with ${preset.chiefComplaint}\n\nAshtavidha: Nadi shows ${preset.ashtavidha.nadi.dominant_dosha} (${preset.ashtavidha.nadi.gati}). Jihva: ${preset.ashtavidha.jihva.coating}.\nPrakriti: Vata-Pitta Constitution. Active Vikriti: Vata-Pitta Samsarga Dushti.\n\nAdvised classical Shamana line of treatment.`
    );
  };

  // Autosave Draft effect
  const autosaveTimeoutRef = useRef<any>(null);
  useEffect(() => {
    // Save draft locally
    const draftData = {
      patientId: selectedPatient?.id,
      symptoms,
      hpiNarrative,
      socrates,
      ashtavidha,
      prakritiResponses,
      prescriptionItems,
      generalAdvice,
      dietPathya,
      dietApathya,
    };
    try {
      localStorage.setItem('ayushcare_case_draft', JSON.stringify(draftData));
      setAutosaveStatus('saved');
    } catch (e) {
      setAutosaveStatus('offline');
    }

    // Debounced API save if encounter exists
    if (encounterId) {
      if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = setTimeout(async () => {
        setAutosaveStatus('saving');
        try {
          await api.updateEncounter(encounterId, {
            chief_complaint: symptoms.map((s) => s.name).join(', '),
            hpi: hpiNarrative,
            pain_socrates: JSON.stringify(socrates),
            past_history: pastHistory,
            family_history: familyHistory,
            personal_history: JSON.stringify(personalHistory),
            structured_summary: structuredSummary,
            practitioner_notes: practitionerNotes,
            symptoms: symptoms,
          });
          setAutosaveStatus('saved');
        } catch (err) {
          setAutosaveStatus('offline');
        }
      }, 2500);
    }
  }, [
    symptoms,
    hpiNarrative,
    socrates,
    ashtavidha,
    prakritiResponses,
    prescriptionItems,
    generalAdvice,
    dietPathya,
    dietApathya,
    encounterId,
  ]);

  // Master Save / Complete Case Handler
  const handleSaveCompleteCase = async () => {
    if (!selectedPatient) {
      alert('Please select or register a patient first.');
      return;
    }

    setIsSaving(true);
    try {
      let activeEncId = encounterId;

      const encounterPayload = {
        patient_id: selectedPatient.id,
        chief_complaint:
          symptoms.map((s) => `${s.name} (${s.duration || 'recent'})`).join('; ') ||
          'Ayush Clinical Consultation',
        hpi: hpiNarrative,
        pain_socrates: JSON.stringify(socrates),
        past_history: pastHistory,
        family_history: familyHistory,
        personal_history: JSON.stringify(personalHistory),
        structured_summary: structuredSummary,
        practitioner_notes: practitionerNotes,
        status: 'Completed',
        symptoms: symptoms,
      };

      if (!activeEncId) {
        const created = await api.createEncounter(encounterPayload);
        activeEncId = created.id;
        setEncounterId(created.id);
      } else {
        await api.updateEncounter(activeEncId, encounterPayload);
      }

      // Save Ashtavidha
      if (activeEncId) {
        await api.saveAshtavidha({
          encounter_id: activeEncId,
          nadi: JSON.stringify(ashtavidha.nadi || {}),
          mutra: JSON.stringify(ashtavidha.mutra || {}),
          mala: JSON.stringify(ashtavidha.mala || {}),
          jihva: JSON.stringify(ashtavidha.jihva || {}),
          shabda: JSON.stringify(ashtavidha.shabda || {}),
          sparsha: JSON.stringify(ashtavidha.sparsha || {}),
          druk: JSON.stringify(ashtavidha.druk || {}),
          akruti: JSON.stringify(ashtavidha.akruti || {}),
          notes: ashtavidha.notes,
        });

        // Save Prakriti
        if (Object.keys(prakritiResponses).length > 0) {
          await api.calculatePrakriti({
            encounter_id: activeEncId,
            responses: prakritiResponses,
          });
        }

        // Save Prescription
        if (prescriptionItems.length > 0) {
          await api.savePrescription({
            encounter_id: activeEncId,
            follow_up_date: followUpDate,
            general_advice: generalAdvice,
            diet_pathya: dietPathya,
            diet_apathya: dietApathya,
            status: 'Active',
            items: prescriptionItems,
          });
        }
      }

      setSaveSuccessMessage('Case record successfully finalized and saved to EHR!');
      setTimeout(() => {
        navigate(`/patients/${selectedPatient.id}`);
      }, 1200);
    } catch (err: any) {
      console.error('Failed to finalize case:', err);
      alert('Case draft preserved locally. Status: Saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-28">
      {/* Multi-Step Stepper Header */}
      <StepProgress
        currentStep={currentStep}
        onStepClick={(idx) => {
          setCurrentStep(idx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        steps={STEPS}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Autosave & Quick Action Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">
              Active Case: {selectedPatient ? selectedPatient.name : 'Select Patient'}
            </span>
            {encounterId && (
              <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                #ENC-{encounterId}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Autosave status indicator */}
            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
              {autosaveStatus === 'saving' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Autosaving draft...</span>
                </>
              ) : autosaveStatus === 'saved' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Draft saved just now</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Draft saved locally</span>
                </>
              )}
            </div>

            {/* Quick Demo Preload Dropdown for Judges */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold text-[11px]">Demo:</span>
              <button
                type="button"
                onClick={() => applyPreset('case-shirahshoola')}
                className="bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-1 rounded border border-purple-200 transition-colors"
                title="Load sample headache migraine case"
              >
                Headache (V-P)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('case-sandhigata')}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-1 rounded border border-emerald-200 transition-colors"
                title="Load sample osteoarthritis knee case"
              >
                Joint Pain (Vata)
              </button>
            </div>
          </div>
        </div>

        {/* Save Success Banner */}
        {saveSuccessMessage && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 p-4 rounded-xl flex items-center gap-2 font-bold text-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* Step Views */}
        {currentStep === 0 && (
          <Step1Patient
            patient={selectedPatient}
            allPatients={allPatients}
            onSelectPatient={setSelectedPatient}
            onOpenNewPatientModal={() => setShowRegisterModal(true)}
          />
        )}

        {currentStep === 1 && (
          <Step2ChiefComplaint
            symptoms={symptoms}
            onChangeSymptoms={setSymptoms}
            chiefComplaintSummary={chiefComplaintSummary}
            onChangeSummary={setChiefComplaintSummary}
          />
        )}

        {currentStep === 2 && (
          <Step3History
            hpiNarrative={hpiNarrative}
            onChangeHpiNarrative={setHpiNarrative}
            socrates={socrates}
            onChangeSocrates={setSocrates}
            pastHistory={pastHistory}
            onChangePastHistory={setPastHistory}
            familyHistory={familyHistory}
            onChangeFamilyHistory={setFamilyHistory}
            personalHistory={personalHistory}
            onChangePersonalHistory={setPersonalHistory}
            symptoms={symptoms}
          />
        )}

        {currentStep === 3 && (
          <Step4Ashtavidha data={ashtavidha} onChangeData={setAshtavidha} />
        )}

        {currentStep === 4 && (
          <Step5Prakriti
            responses={prakritiResponses}
            onChangeResponses={setPrakritiResponses}
            result={prakritiResult}
            onChangeResult={setPrakritiResult}
            encounterId={encounterId}
          />
        )}

        {currentStep === 5 && (
          <Step6Vikriti
            result={vikritiResult}
            onChangeResult={setVikritiResult}
            symptoms={symptoms}
            ashtavidha={ashtavidha}
            encounterId={encounterId}
            practitionerNotes={practitionerNotes}
            onChangeNotes={setPractitionerNotes}
          />
        )}

        {currentStep === 6 && (
          <Step7Summary
            patient={selectedPatient}
            symptoms={symptoms}
            hpiNarrative={hpiNarrative}
            socrates={socrates}
            pastHistory={pastHistory}
            familyHistory={familyHistory}
            personalHistory={personalHistory}
            ashtavidha={ashtavidha}
            prakritiResult={prakritiResult}
            vikritiResult={vikritiResult}
            structuredSummary={structuredSummary}
            onChangeStructuredSummary={setStructuredSummary}
            practitionerNotes={practitionerNotes}
            onChangePractitionerNotes={setPractitionerNotes}
            onNavigateStep={setCurrentStep}
          />
        )}

        {currentStep === 7 && (
          <Step8Prescription
            patient={selectedPatient}
            encounterId={encounterId}
            items={prescriptionItems}
            onChangeItems={setPrescriptionItems}
            generalAdvice={generalAdvice}
            onChangeGeneralAdvice={setGeneralAdvice}
            dietPathya={dietPathya}
            onChangeDietPathya={setDietPathya}
            dietApathya={dietApathya}
            onChangeDietApathya={setDietApathya}
            followUpDate={followUpDate}
            onChangeFollowUpDate={setFollowUpDate}
            onSaveCase={handleSaveCompleteCase}
            isSaving={isSaving}
          />
        )}
      </div>

      {/* Sticky Bottom Action Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-slate-200 px-6 py-3.5 z-30 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <span className="hidden sm:inline text-xs text-slate-500 font-medium pl-2">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].label}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveCompleteCase}
            disabled={isSaving}
            className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-300 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-sm transition-all"
            >
              <span>Continue to Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveCompleteCase}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Finalizing Case...' : 'Finalize & Save Case Record'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
