import React, { useState } from 'react';
import {
  HeartPulse,
  Droplets,
  Activity,
  Smile,
  Volume2,
  Hand,
  Eye,
  UserCheck,
  CheckCircle2,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { AshtavidhaData } from '../../types/case';

interface Step4AshtavidhaProps {
  data: AshtavidhaData;
  onChangeData: (data: AshtavidhaData) => void;
}

export const Step4Ashtavidha: React.FC<Step4AshtavidhaProps> = ({ data, onChangeData }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Helper updater for each examination card
  const updateSection = (section: keyof AshtavidhaData, values: any) => {
    const prevSection = (typeof data[section] === 'object' && data[section] !== null) ? data[section] : {};
    onChangeData({
      ...data,
      [section]: {
        ...(prevSection as object),
        ...values,
      },
    });
  };

  // Quick fill all with standard normal or typical patterns
  const handleQuickFillNormal = () => {
    onChangeData({
      nadi: { rate: '72 bpm', rhythm: 'Regular', dominant_dosha: 'Vata-Pitta', gati: 'Sarpa-Manduka Gati', notes: 'Moderate pulse, regular rhythm' },
      mutra: { color: 'Pale Yellow (Peeta)', frequency: '4-5 times/day', burning: 'Nil', quantity: 'Normal', notes: 'Prakruta Mutra' },
      mala: { consistency: 'Formed / Soft', frequency: 'Once daily', regularity: 'Regular', notes: 'Prakruta Mala' },
      jihva: { color: 'Pinkish', coating: 'Alpa Sama (Mild coated)', moisture: 'Normal', texture: 'Smooth', notes: 'Slight posterior coating' },
      shabda: { quality: 'Clear & Audible', speech: 'Normal pace', respiratory_sound: 'Normal vesicular', notes: 'Prakruta Shabda' },
      sparsha: { temperature: 'Warm / Normal', texture: 'Smooth (Snigdha)', moisture: 'Normal', notes: 'Samadosha sparsha' },
      druk: { appearance: 'Clear, bright', sclera_color: 'Normal white', vision_complaint: 'None', notes: 'Prakruta Druk' },
      akruti: { build: 'Madhyama (Medium)', general_appearance: 'Healthy', posture: 'Erect', gait: 'Normal steady', notes: 'Madhyama Samhanana' },
      notes: 'Overall Ashtavidha examination completed.'
    });
  };

  const parikshaCards = [
    {
      id: 'nadi',
      title: '1. Nadi (Pulse Examination)',
      sanskrit: 'नाड़ी परीक्षा',
      icon: HeartPulse,
      color: 'emerald',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pulse Rate & Rhythm</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={data.nadi?.rate || ''}
                  onChange={(e) => updateSection('nadi', { rate: e.target.value })}
                  placeholder="e.g. 74 bpm"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                />
                <select
                  value={data.nadi?.rhythm || 'Regular'}
                  onChange={(e) => updateSection('nadi', { rhythm: e.target.value })}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                >
                  <option value="Regular">Regular (Sama)</option>
                  <option value="Irregular">Irregular (Visham)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dosha Dominance in Nadi</label>
              <select
                value={data.nadi?.dominant_dosha || 'Vata-Pitta'}
                onChange={(e) => updateSection('nadi', { dominant_dosha: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
              >
                <option value="Vata">Vata (Index finger dominance)</option>
                <option value="Pitta">Pitta (Middle finger dominance)</option>
                <option value="Kapha">Kapha (Ring finger dominance)</option>
                <option value="Vata-Pitta">Vata-Pitta (Dual dominance)</option>
                <option value="Pitta-Kapha">Pitta-Kapha (Dual dominance)</option>
                <option value="Vata-Kapha">Vata-Kapha (Dual dominance)</option>
                <option value="Tridosha (Sannipata)">Tridosha (Sannipata / All three)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nadi Gati (Movement Pattern)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Sarpa Gati (Snake/Wavy - Vata)', val: 'Sarpa Gati (Vata)' },
                { label: 'Manduka Gati (Frog/Jumping - Pitta)', val: 'Manduka Gati (Pitta)' },
                { label: 'Hamsa Gati (Swan/Slow - Kapha)', val: 'Hamsa Gati (Kapha)' },
                { label: 'Sarpa-Manduka (Mixed V-P)', val: 'Sarpa-Manduka (Mixed)' }
              ].map((g) => (
                <button
                  key={g.val}
                  type="button"
                  onClick={() => updateSection('nadi', { gati: g.val })}
                  className={`p-2 rounded-lg border text-left text-[11px] font-medium transition-all ${
                    data.nadi?.gati === g.val
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mutra',
      title: '2. Mutra (Urine Examination)',
      sanskrit: 'मूत्र परीक्षा',
      icon: Droplets,
      color: 'blue',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Color (Varna)</label>
            <select
              value={data.mutra?.color || 'Pale Yellow (Peeta)'}
              onChange={(e) => updateSection('mutra', { color: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Pale Yellow (Peeta)">Pale Yellow (Prakruta Peeta)</option>
              <option value="Clear / White (Shweta - Kapha)">Clear / White (Shweta - Kapha)</option>
              <option value="Deep Yellow / Reddish (Rakta/Haridra - Pitta)">Deep Yellow / Reddish (Pitta)</option>
              <option value="Smoky / Frothy (Dhoomra - Vata)">Smoky / Frothy (Dhoomra - Vata)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Frequency & Burning (Daha)</label>
            <select
              value={data.mutra?.burning || 'Nil'}
              onChange={(e) => updateSection('mutra', { burning: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Nil">No Burning (Prakruta)</option>
              <option value="Mild burning (Alpa Daha)">Mild burning (Alpa Daha - Pitta)</option>
              <option value="Severe burning / Dysuria (Teevra Daha)">Severe burning / Dysuria</option>
              <option value="High frequency / Urgency">High frequency / Urgency</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Daily Frequency</label>
            <input
              type="text"
              value={data.mutra?.frequency || ''}
              onChange={(e) => updateSection('mutra', { frequency: e.target.value })}
              placeholder="e.g. 4-6 times/day"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            />
          </div>
        </div>
      )
    },
    {
      id: 'mala',
      title: '3. Mala (Stool Examination)',
      sanskrit: 'मल परीक्षा',
      icon: Activity,
      color: 'amber',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Consistency (Rupa)</label>
            <select
              value={data.mala?.consistency || 'Formed / Soft'}
              onChange={(e) => updateSection('mala', { consistency: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Formed / Soft">Formed / Normal (Prakruta)</option>
              <option value="Dry / Hard pellets (Ruksha/Grathita - Vata)">Dry / Hard pellets (Vata)</option>
              <option value="Loose / Semi-solid (Drava/Bhinna - Pitta)">Loose / Semi-solid (Pitta)</option>
              <option value="Heavy / Mucus laden (Picchila/Sama - Kapha)">Heavy / Mucus laden (Kapha/Ama)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Regularity & Evacuation</label>
            <select
              value={data.mala?.regularity || 'Regular'}
              onChange={(e) => updateSection('mala', { regularity: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Regular">Regular once daily</option>
              <option value="Constipation (Vibandha)">Constipation (Vibandha)</option>
              <option value="Frequent 2-3 times/day">Frequent 2-3 times/day</option>
              <option value="Incomplete feeling (Asantushta)">Incomplete feeling (Asantushta)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observations / Ama Presence</label>
            <input
              type="text"
              value={data.mala?.notes || ''}
              onChange={(e) => updateSection('mala', { notes: e.target.value })}
              placeholder="e.g. Sinks in water (Sama), Floats (Nirama)"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            />
          </div>
        </div>
      )
    },
    {
      id: 'jihva',
      title: '4. Jihva (Tongue Examination)',
      sanskrit: 'जिह्वा परीक्षा',
      icon: Smile,
      color: 'rose',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Color & Moisture</label>
            <select
              value={data.jihva?.color || 'Pinkish / Normal'}
              onChange={(e) => updateSection('jihva', { color: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Pinkish / Normal">Pinkish / Normal (Prakruta)</option>
              <option value="Red / Inflamed (Rakta - Pitta)">Red / Inflamed (Rakta - Pitta)</option>
              <option value="Pale / Dry (Shweta/Ruksha - Vata)">Pale / Dry (Shweta/Ruksha - Vata)</option>
              <option value="Bluish / Dark (Shyama)">Bluish / Dark (Shyama)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Coating (Lepa / Ama State)</label>
            <select
              value={data.jihva?.coating || 'Nirama (Clear)'}
              onChange={(e) => updateSection('jihva', { coating: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Nirama (Clear)">Nirama (Clear, uncoated)</option>
              <option value="Alpa Sama (Mild white coating)">Alpa Sama (Mild white coating)</option>
              <option value="Bahula Sama (Thick white coating - Kapha)">Bahula Sama (Thick white coating - Kapha)</option>
              <option value="Peeta Lepa (Yellowish coating - Pitta)">Peeta Lepa (Yellowish coating - Pitta)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Texture / Cracks</label>
            <select
              value={data.jihva?.cracks || 'Smooth'}
              onChange={(e) => updateSection('jihva', { cracks: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Smooth">Smooth / Intact</option>
              <option value="Central fissure / Cracks (Sphutita - Vata)">Central fissure / Cracks (Vata)</option>
              <option value="Teeth indentations on margins">Teeth indentations on margins</option>
              <option value="Papillary redness / ulcers (Pitta)">Papillary redness / ulcers (Pitta)</option>
            </select>
          </div>
        </div>
      )
    },
    {
      id: 'shabda',
      title: '5. Shabda (Voice & Respiratory Sound)',
      sanskrit: 'शब्द परीक्षा',
      icon: Volume2,
      color: 'purple',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Voice Quality (Swara)</label>
            <select
              value={data.shabda?.quality || 'Clear & Resonant'}
              onChange={(e) => updateSection('shabda', { quality: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Clear & Resonant">Clear & Resonant (Prakruta)</option>
              <option value="Hoarse / Low-pitched (Kshina/Kharaswara - Vata)">Hoarse / Low-pitched (Vata)</option>
              <option value="High-pitched / Sharp (Tikshna - Pitta)">High-pitched / Sharp (Pitta)</option>
              <option value="Deep / Heavy (Gambhira/Guru - Kapha)">Deep / Heavy (Guru - Kapha)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Speech Flow & Articulation</label>
            <input
              type="text"
              value={data.shabda?.speech || ''}
              onChange={(e) => updateSection('shabda', { speech: e.target.value })}
              placeholder="e.g. Fluent, rapid, hesitant"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Respiratory Sounds</label>
            <input
              type="text"
              value={data.shabda?.respiratory_sound || ''}
              onChange={(e) => updateSection('shabda', { respiratory_sound: e.target.value })}
              placeholder="e.g. Normal vesicular, wheeze, stridor"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            />
          </div>
        </div>
      )
    },
    {
      id: 'sparsha',
      title: '6. Sparsha (Touch & Skin Examination)',
      sanskrit: 'स्पर्श परीक्षा',
      icon: Hand,
      color: 'teal',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Temperature (Ushnata)</label>
            <select
              value={data.sparsha?.temperature || 'Warm / Normal'}
              onChange={(e) => updateSection('sparsha', { temperature: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Warm / Normal">Warm / Normal (Sama Ushna)</option>
              <option value="Hot / Burning (Ushna - Pitta)">Hot / Burning (Ushna - Pitta)</option>
              <option value="Cool / Cold extremities (Sheeta - Vata)">Cool / Cold extremities (Sheeta - Vata)</option>
              <option value="Cold & Clammy (Sheeta-Snigdha - Kapha)">Cold & Clammy (Kapha)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Texture & Moisture (Twak)</label>
            <select
              value={data.sparsha?.texture || 'Smooth / Normal'}
              onChange={(e) => updateSection('sparsha', { texture: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Smooth / Normal">Smooth / Normal (Snigdha)</option>
              <option value="Rough / Dry (Ruksha/Khara - Vata)">Rough / Dry (Ruksha - Vata)</option>
              <option value="Soft / Moist / Sweating (Pitta)">Soft / Moist / Sweating (Pitta)</option>
              <option value="Oily / Thick (Snigdha/Guru - Kapha)">Oily / Thick (Kapha)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tenderness (Sparsha Asahyata)</label>
            <input
              type="text"
              value={data.sparsha?.tenderness || ''}
              onChange={(e) => updateSection('sparsha', { tenderness: e.target.value })}
              placeholder="e.g. Local joint tenderness, neck trigger points"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            />
          </div>
        </div>
      )
    },
    {
      id: 'druk',
      title: '7. Druk (Eye & Vision Examination)',
      sanskrit: 'दृक् परीक्षा',
      icon: Eye,
      color: 'cyan',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Scleral Color & Appearance</label>
            <select
              value={data.druk?.sclera_color || 'Normal White'}
              onChange={(e) => updateSection('druk', { sclera_color: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Normal White">Normal White (Prakruta)</option>
              <option value="Red / Bloodshot (Rakta - Pitta)">Red / Bloodshot (Rakta - Pitta)</option>
              <option value="Yellowish / Icteric (Peeta - Pitta)">Yellowish / Icteric (Pitta)</option>
              <option value="Dull / Dark rings (Dhoomra - Vata)">Dull / Dark rings (Vata)</option>
              <option value="Lustrous / Swollen (Shweta/Snigdha - Kapha)">Lustrous / Swollen (Kapha)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vision / Photophobia</label>
            <input
              type="text"
              value={data.druk?.vision_complaint || ''}
              onChange={(e) => updateSection('druk', { vision_complaint: e.target.value })}
              placeholder="e.g. Photophobia during headache, blurred vision"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Eye Lids / Lacrimation</label>
            <input
              type="text"
              value={data.druk?.appearance || ''}
              onChange={(e) => updateSection('druk', { appearance: e.target.value })}
              placeholder="e.g. Dryness, excessive watering, periorbital puffiness"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            />
          </div>
        </div>
      )
    },
    {
      id: 'akruti',
      title: '8. Akruti (Build, Posture & Gait)',
      sanskrit: 'आकृति परीक्षा',
      icon: UserCheck,
      color: 'slate',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Body Build (Samhanana)</label>
            <select
              value={data.akruti?.build || 'Madhyama (Medium)'}
              onChange={(e) => updateSection('akruti', { build: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Madhyama (Medium build)">Madhyama (Medium build)</option>
              <option value="Krisha (Slender / Lean - Vata)">Krisha (Slender / Lean - Vata)</option>
              <option value="Sthula (Heavy / Broad - Kapha)">Sthula (Heavy / Broad - Kapha)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Posture & Gait (Gati)</label>
            <input
              type="text"
              value={data.akruti?.gait || ''}
              onChange={(e) => updateSection('akruti', { gait: e.target.value })}
              placeholder="e.g. Steady, antalgic gait, stooped posture"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">General Demeanor / Facies</label>
            <input
              type="text"
              value={data.akruti?.general_appearance || ''}
              onChange={(e) => updateSection('akruti', { general_appearance: e.target.value })}
              placeholder="e.g. Anxious expression, tired facies, relaxed"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-600" />
            <span>Ashtavidha Pariksha (अष्टविध परीक्षा)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Eight-fold traditional clinical examination for qualitative systemic assessment.
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickFillNormal}
          className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-300 transition-colors shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Quick Pre-fill Normal Findings</span>
        </button>
      </div>

      {/* Grid of 8 Examination Cards */}
      <div className="space-y-4">
        {parikshaCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-emerald-300"
            >
              <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{card.title}</h3>
                    <span className="text-[10px] text-slate-400 font-serif">{card.sanskrit}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Card {idx + 1} of 8
                </span>
              </div>

              <div className="p-4">{card.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
