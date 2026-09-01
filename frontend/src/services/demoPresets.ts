export interface DemoCasePreset {
  id: string;
  name: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female';
  chiefComplaint: string;
  symptoms: Array<{
    name: string;
    duration: string;
    severity: number;
    frequency: string;
    onset: string;
    aggravating_factors: string;
    relieving_factors: string;
  }>;
  socrates: {
    site: string;
    onset: string;
    character: string;
    radiation: string;
    associated: string;
    timing: string;
    exacerbating: string;
    severity: number;
  };
  hpiNarrative: string;
  pastHistory: string;
  familyHistory: string;
  personalHistory: {
    diet: string;
    appetite: string;
    sleep: string;
    bowel: string;
    stress: string;
    activity: string;
  };
  ashtavidha: {
    nadi: { rate: string; rhythm: string; dominant_dosha: string; gati: string; notes: string };
    mutra: { color: string; frequency: string; burning: string; quantity: string; notes: string };
    mala: { consistency: string; frequency: string; regularity: string; notes: string };
    jihva: { color: string; coating: string; moisture: string; texture: string; notes: string };
    shabda: { quality: string; speech: string; respiratory_sound: string; notes: string };
    sparsha: { temperature: string; texture: string; moisture: string; notes: string };
    druk: { appearance: string; sclera_color: string; vision_complaint: string; notes: string };
    akruti: { build: string; general_appearance: string; posture: string; gait: string; notes: string };
  };
  prakritiResponses: Record<string, string>;
  prescriptionItems: Array<{
    formulation: string;
    form: string;
    dosage: string;
    frequency: string;
    duration: string;
    timing: string;
    anupana: string;
    instructions: string;
  }>;
  generalAdvice: string;
  dietPathya: string;
  dietApathya: string;
}

export const DEMO_CASE_PRESETS: DemoCasePreset[] = [
  {
    id: 'case-shirahshoola',
    name: 'Throbbing Headache / Shirahshoola (Vata-Pitta)',
    patientName: 'Aarav Sharma',
    age: 34,
    gender: 'Male',
    chiefComplaint: 'Throbbing right-sided temporal headache (Shirahshoola) with mild nausea for 3 weeks.',
    symptoms: [
      {
        name: 'Throbbing Headache (Shirahshoola)',
        duration: '3 weeks',
        severity: 7,
        frequency: 'Intermittent, 3-4 times/week',
        onset: 'Gradual in morning',
        aggravating_factors: 'Prolonged computer screen time, direct sunlight, skipping lunch',
        relieving_factors: 'Rest in a quiet dark room, gentle forehead massage'
      },
      {
        name: 'Mild Nausea & Retrosternal Warmth',
        duration: '10 days',
        severity: 4,
        frequency: 'Episodic',
        onset: 'Gradual',
        aggravating_factors: 'Empty stomach, stress',
        relieving_factors: 'Cool milk, sips of water'
      }
    ],
    socrates: {
      site: 'Right temporal and frontal region',
      onset: 'Gradual over 2-3 hours upon waking',
      character: 'Throbbing, pulsating, sharp ache',
      radiation: 'Radiates towards right retro-orbital area and occiput',
      associated: 'Photophobia, phonophobia, mild nausea',
      timing: 'Peaks around 2 PM to 4 PM (Pitta kala)',
      exacerbating: 'Bright light, skipping meals, mental stress',
      severity: 7
    },
    hpiNarrative: '34-year-old software engineer presents with 3-week history of recurrent unilateral throbbing headache. Triggered noticeably by irregular meal schedules and 10+ hours daily screen exposure. No history of aura or focal neuro deficits.',
    pastHistory: 'History of occasional acidity and seasonal dust allergy. No surgeries.',
    familyHistory: 'Maternal history of episodic tension headache.',
    personalHistory: {
      diet: 'Vegetarian, irregular meal timings, fond of spicy/caffeinated snacks',
      appetite: 'Irregular (Vishamagni)',
      sleep: 'Disturbed, 5-6 hours/night due to late work',
      bowel: 'Dry, hard stools, tendency towards mild constipation',
      stress: 'High corporate deadline pressure',
      activity: 'Sedentary, minimal daily exercise'
    },
    ashtavidha: {
      nadi: { rate: '74 bpm', rhythm: 'Regular', dominant_dosha: 'Vata-Pitta', gati: 'Sarpa-Manduka (Wavy with occasional jump)', notes: 'Vata-Pitta dominance palpated at Vata/Pitta sthana' },
      mutra: { color: 'Peeta (Pale Amber)', frequency: '4-5 times/day', burning: 'Mild burning in late afternoon', quantity: 'Normal', notes: 'Moderate concentrated urine' },
      mala: { consistency: 'Dry / Pellet-like (Ruksha)', frequency: 'Once daily', regularity: 'Irregular', notes: 'Mild Apana Vata obstruction' },
      jihva: { color: 'Pink with white coating at root', coating: 'Alpa Sama (Mild coated)', moisture: 'Dry (Ruksha)', texture: 'Normal with minor central furrows', notes: 'Indicates mild digestive sluggishness (Mandagni)' },
      shabda: { quality: 'Clear, rapid speech', speech: 'Fluent', respiratory_sound: 'Normal vesicular', notes: 'Vata-type rapid articulation' },
      sparsha: { temperature: 'Forehead warm, hands/feet cool', texture: 'Dry (Ruksha)', moisture: 'Low', notes: 'Classic Vata-Pitta tactile signature' },
      druk: { appearance: 'Mild scleral redness / injection', sclera_color: 'Slightly reddish', vision_complaint: 'Photophobia during headache', notes: 'Pitta involvement in Netra' },
      akruti: { build: 'Madhyama (Medium/Slender)', general_appearance: 'Tired, strained facies', posture: 'Erect with slight neck tension', gait: 'Steady', notes: 'Madhyama Samhanana' }
    },
    prakritiResponses: {
      body_frame: 'v1',
      skin_nature: 'p2',
      hair_type: 'v3',
      appetite: 'v4',
      sleep_pattern: 'v5',
      bowel_habit: 'v6',
      weather_tolerance: 'v7',
      mind_decision: 'v8',
      stress_response: 'v9',
      memory_pattern: 'p10'
    },
    prescriptionItems: [
      {
        formulation: 'Saraswatarishta',
        form: 'Asava/Arishta',
        dosage: '20 ml',
        frequency: 'Twice daily (BD)',
        duration: '14 days',
        timing: 'After Food',
        anupana: 'Equal quantity warm water',
        instructions: 'Mix 20ml with 20ml lukewarm water after lunch and dinner.'
      },
      {
        formulation: 'Brahmi Vati',
        form: 'Vati/Tablet',
        dosage: '1 tablet (250mg)',
        frequency: 'Twice daily (BD)',
        duration: '14 days',
        timing: 'After Food',
        anupana: 'Warm Water / Cow Milk',
        instructions: 'Take 1 tablet after meals to calm Pitta-Vata nervous agitation.'
      },
      {
        formulation: 'Avipattikar Churna',
        form: 'Churna',
        dosage: '3 g',
        frequency: 'Twice daily (BD)',
        duration: '14 days',
        timing: 'Before Food',
        anupana: 'Warm Water',
        instructions: 'Take 3g with warm water 20 minutes prior to meals.'
      }
    ],
    generalAdvice: 'Establish regular sleep schedule by 10:30 PM. Take 5-minute screen breaks every hour. Nightly Shiroabhyanga with Ksheerabala Taila.',
    dietPathya: 'Pomegranate, soaked raisins, warm mung dal khichdi with 1 tsp cow ghee, coconut water.',
    dietApathya: 'Avoid skipping breakfast, excessive black coffee/tea, deep-fried foods, late-night heavy meals.'
  },
  {
    id: 'case-sandhigata',
    name: 'Knee Joint Pain / Sandhigata Vata (Vata Dominant)',
    patientName: 'Meera Patil',
    age: 42,
    gender: 'Female',
    chiefComplaint: 'Bilateral knee joint pain (Sandhishoola) with morning stiffness for 6 months.',
    symptoms: [
      {
        name: 'Bilateral Knee Joint Pain (Sandhigata Vata)',
        duration: '6 months',
        severity: 6,
        frequency: 'Constant, worse in morning',
        onset: 'Gradual',
        aggravating_factors: 'Climbing stairs, squatting, cold weather',
        relieving_factors: 'Warm fomentation, rest, oil massage'
      }
    ],
    socrates: {
      site: 'Bilateral knee joints (Medial compartment)',
      onset: 'Insidious onset 6 months ago',
      character: 'Dull aching, crepitus on flexion',
      radiation: 'Localized to knee joint',
      associated: 'Morning joint stiffness for ~25 minutes',
      timing: 'Worse upon waking and after prolonged sitting',
      exacerbating: 'Cold breeze, climbing stairs',
      severity: 6
    },
    hpiNarrative: '42-year-old female homemaker reports bilateral knee discomfort and mild crepitus worsening over winter months. Able to walk on level ground but stairs provoke pain.',
    pastHistory: 'No major illnesses. Mild vitamin D deficiency on supplements.',
    familyHistory: 'Father had osteoarthritis.',
    personalHistory: {
      diet: 'Mixed vegetarian, regular meals',
      appetite: 'Normal (Samagni)',
      sleep: 'Sound, 7 hours',
      bowel: 'Regular',
      stress: 'Mild household stress',
      activity: 'Moderate household activity'
    },
    ashtavidha: {
      nadi: { rate: '72 bpm', rhythm: 'Regular', dominant_dosha: 'Vata', gati: 'Sarpa Gati (Wavy)', notes: 'Vata dominance' },
      mutra: { color: 'Prakruta (Normal Pale Yellow)', frequency: '5 times/day', burning: 'Nil', quantity: 'Normal', notes: 'Normal' },
      mala: { consistency: 'Formed', frequency: 'Once daily', regularity: 'Regular', notes: 'Normal' },
      jihva: { color: 'Pinkish', coating: 'Nirama (Clear)', moisture: 'Normal', texture: 'Smooth', notes: 'Nirama tongue' },
      shabda: { quality: 'Clear', speech: 'Normal', respiratory_sound: 'Normal', notes: 'Normal' },
      sparsha: { temperature: 'Cooler around knees', texture: 'Slightly dry', moisture: 'Normal', notes: 'Mild localized tenderness' },
      druk: { appearance: 'Normal', sclera_color: 'Normal', vision_complaint: 'None', notes: 'Normal' },
      akruti: { build: 'Madhyama-Sthula', general_appearance: 'Healthy', posture: 'Slight antalgic gait', gait: 'Mild bilateral antalgic gait', notes: 'Knee crepitus' }
    },
    prakritiResponses: {
      body_frame: 'v1',
      skin_nature: 'v2',
      hair_type: 'v3',
      appetite: 'v4',
      sleep_pattern: 'v5',
      bowel_habit: 'v6',
      weather_tolerance: 'v7',
      mind_decision: 'k8',
      stress_response: 'v9',
      memory_pattern: 'k10'
    },
    prescriptionItems: [
      {
        formulation: 'Yograj Guggulu',
        form: 'Vati/Tablet',
        dosage: '2 tablets (500mg each)',
        frequency: 'Twice daily (BD)',
        duration: '30 days',
        timing: 'After Food',
        anupana: 'Warm Water / Rasnadi Kwatha',
        instructions: 'Take 2 tablets after lunch and dinner.'
      },
      {
        formulation: 'Maharasnadi Kwatha',
        form: 'Kwatha',
        dosage: '20 ml',
        frequency: 'Twice daily (BD)',
        duration: '30 days',
        timing: 'Before Food',
        anupana: 'Equal parts warm water',
        instructions: 'Take 20ml with 20ml warm water in morning and evening.'
      }
    ],
    generalAdvice: 'Daily local Janu Abhyanga with Mahanarayana Taila followed by hot water bag fomentation. Avoid floor sitting/squatting.',
    dietPathya: 'Warm sesame seeds, cow milk with pinch of turmeric, garlic cooked in ghee, soups.',
    dietApathya: 'Avoid cold water, dry bakery biscuits, refrigerated foods, chickpea/chana overload.'
  }
];
