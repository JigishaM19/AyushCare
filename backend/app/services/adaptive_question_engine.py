from typing import Dict, List, Any, Optional

# Adaptive Question Catalogue with Trilingual Support (EN / HI / MR)
QUESTION_CATALOGUE = [
    {
        "id": "q_chief_complaint",
        "category": "Reason for visit",
        "input_type": "single_select_or_voice",
        "translations": {
            "en": {"text": "What is the main reason you are visiting the hospital today?", "hint": "Tap an option or tap the microphone to speak"},
            "hi": {"text": "आज आप अस्पताल किस मुख्य समस्या या तकलीफ के लिए आए हैं?", "hint": "विकल्प चुनें या बोलने के लिए माइक दबाएं"},
            "mr": {"text": "आज तुम्ही कोणत्या मुख्य त्रासासाठी किंवा आजारासाठी रुग्णालयात आला आहात?", "hint": "पर्याय निवडा किंवा बोलण्यासाठी माइक दाबा"}
        },
        "options": [
            {"id": "headache", "labels": {"en": "Headache / Head pain", "hi": "सिर दर्द", "mr": "डोकेदुखी"}},
            {"id": "stomach_pain", "labels": {"en": "Stomach problem / Pain / Acidity", "hi": "पेट दर्द / एसिडिटी / अपच", "mr": "पोटदुखी / पित्त / अपचन"}},
            {"id": "joint_pain", "labels": {"en": "Joint pain / Knee pain / Backache", "hi": "जोड़ों का दर्द / कमर दर्द", "mr": "सांधेदुखी / कंबरदुखी"}},
            {"id": "fever", "labels": {"en": "Fever / Shivering", "hi": "बुखार / कंपकंपी", "mr": "ताप / थंडी वाजून येणे"}},
            {"id": "cough_cold", "labels": {"en": "Cough / Breathing difficulty", "hi": "खांसी / सांस लेने में तकलीफ", "mr": "खोकला / दम लागणे"}},
            {"id": "skin_problem", "labels": {"en": "Skin itching / Rash", "hi": "त्वचा में खुजली / दाने", "mr": "त्वचेची खाज / पुरळ"}},
            {"id": "weakness_fatigue", "labels": {"en": "Extreme weakness / Fatigue", "hi": "बहुत ज्यादा कमजोरी / थकान", "mr": "अशक्तपणा / थकवा"}},
            {"id": "sleep_problem", "labels": {"en": "Sleep problem / Stress", "hi": "नींद न आना / तनाव", "mr": "झोपेची समस्या / ताण"}},
            {"id": "other", "labels": {"en": "Other problem", "hi": "अन्य समस्या", "mr": "इतर समस्या"}}
        ],
        "next_default": "q_duration"
    },
    {
        "id": "q_duration",
        "category": "Chronology",
        "input_type": "single_select",
        "translations": {
            "en": {"text": "When did this problem start?", "hint": "Select the closest timeline"},
            "hi": {"text": "यह समस्या कब से शुरू हुई है?", "hint": "समय सीमा चुनें"},
            "mr": {"text": "हा त्रास कधीपासून सुरू झाला आहे?", "hint": "योग्य पर्याय निवडा"}
        },
        "options": [
            {"id": "today", "labels": {"en": "Today", "hi": "आज ही", "mr": "आजच"}},
            {"id": "yesterday", "labels": {"en": "Yesterday", "hi": "कल से", "mr": "कालपासून"}},
            {"id": "few_days", "labels": {"en": "A few days ago (2–5 days)", "hi": "कुछ दिन पहले (२-५ दिन)", "mr": "काही दिवसांपूर्वी (२-५ दिवस)"}},
            {"id": "few_weeks", "labels": {"en": "A few weeks ago (1–3 weeks)", "hi": "कुछ हफ्ते पहले (१-३ हफ्ते)", "mr": "काही आठवड्यांपूर्वी"}},
            {"id": "few_months", "labels": {"en": "A few months ago (1–6 months)", "hi": "कुछ महीने पहले", "mr": "काही महिन्यांपूर्वी"}},
            {"id": "chronic", "labels": {"en": "Longer than 6 months", "hi": "६ महीने से ज्यादा समय से", "mr": "६ महिन्यांपेक्षा जास्त काळ"}},
            {"id": "unsure", "labels": {"en": "Not sure", "hi": "पक्का याद नहीं", "mr": "नक्की आठवत नाही"}}
        ],
        "next_default": "q_progression"
    },
    {
        "id": "q_progression",
        "category": "Chronology",
        "input_type": "single_select",
        "translations": {
            "en": {"text": "Is this problem getting better, getting worse, or staying the same?", "hint": "Select current trend"},
            "hi": {"text": "क्या यह समस्या बढ़ रही है, कम हो रही है, या वैसी ही है?", "hint": "वर्तमान स्थिति चुनें"},
            "mr": {"text": "हा त्रास वाढत आहे, कमी होत आहे, की तसाच आहे?", "hint": "सद्यस्थिती निवडा"}
        },
        "options": [
            {"id": "worse", "labels": {"en": "Getting worse", "hi": "बढ़ रही है (तबलीग ज्यादा)", "mr": "त्रास वाढत आहे"}},
            {"id": "same", "labels": {"en": "Staying the same", "hi": "वैसी ही बनी हुई है", "mr": "तसाच आहे"}},
            {"id": "better", "labels": {"en": "Getting better", "hi": "कुछ आराम है", "mr": "कमी होत आहे"}},
            {"id": "episodic", "labels": {"en": "Comes and goes in episodes", "hi": "आती-जाती रहती है", "mr": "येत-जात राहते"}},
            {"id": "unsure", "labels": {"en": "Not sure", "hi": "स्पष्ट नहीं कह सकते", "mr": "सांगता येत नाही"}}
        ],
        "next_default": "ADAPTIVE_BRANCH"
    },
    
    # Adaptive Branch 1: Headache
    {
        "id": "q_headache_location",
        "category": "Headache Specifics",
        "trigger": "headache",
        "input_type": "single_select",
        "translations": {
            "en": {"text": "Where do you feel the headache mostly?", "hint": "Select the pain location"},
            "hi": {"text": "सिर दर्द मुख्यतः किस जगह पर महसूस होता है?", "hint": "दर्द का स्थान चुनें"},
            "mr": {"text": "डोकेदुखी प्रामुख्याने कोणत्या भागात होते?", "hint": "भागाची निवड करा"}
        },
        "options": [
            {"id": "one_side", "labels": {"en": "One side of the head (Right or Left)", "hi": "सिर के एक तरफ (आधा सीसी)", "mr": "डोक्याच्या एका बाजूला"}},
            {"id": "forehead", "labels": {"en": "Forehead and temples", "hi": "माथा और कनपटी", "mr": "कपाळ आणि कानशिले"}},
            {"id": "back_head", "labels": {"en": "Back of head and neck", "hi": "सिर के पीछे और गर्दन में", "mr": "डोक्याच्या मागील बाजूस आणि मानेत"}},
            {"id": "all_over", "labels": {"en": "All over the head / Heaviness", "hi": "पूरे सिर में भारीपन", "mr": "पूर्ण डोक्यात जडपणा"}}
        ],
        "next_default": "q_medical_conditions"
    },

    # Adaptive Branch 2: Stomach Problem
    {
        "id": "q_stomach_details",
        "category": "Stomach Specifics",
        "trigger": "stomach_pain",
        "input_type": "single_select",
        "translations": {
            "en": {"text": "What does the stomach problem feel like?", "hint": "Select description"},
            "hi": {"text": "पेट की समस्या में मुख्य रूप से क्या महसूस होता है?", "hint": "लक्षण चुनें"},
            "mr": {"text": "पोटात प्रामुख्याने काय त्रास जाणवतो?", "hint": "त्रासाचा प्रकार निवडा"}
        },
        "options": [
            {"id": "burning", "labels": {"en": "Burning sensation / Acid reflux / Sour taste", "hi": "सीने में जलन / खट्टी डकारें", "mr": "छातीत जळजळ / आंबट ढेकर"}},
            {"id": "cramping", "labels": {"en": "Cramping or twisting pain", "hi": "मरोड़ या ऐंठन वाला दर्द", "mr": "पोटात मुरडा किंवा कळ"}},
            {"id": "bloating", "labels": {"en": "Heavy bloating / Gas / Fullness", "hi": "पेट फूलना / गैस / भारीपन", "mr": "पोट फुगणे / गॅस / जडपणा"}},
            {"id": "dull_ache", "labels": {"en": "Continuous dull pain", "hi": "लगातार मीठा-मीठा दर्द", "mr": "सतत मंद दुखणे"}}
        ],
        "next_default": "q_medical_conditions"
    },

    # Adaptive Branch 3: Joint Pain
    {
        "id": "q_joint_details",
        "category": "Joint Specifics",
        "trigger": "joint_pain",
        "input_type": "single_select",
        "translations": {
            "en": {"text": "Which joints are most painful or stiff?", "hint": "Select primary joints"},
            "hi": {"text": "किन जोड़ों में सबसे ज्यादा दर्द या अकड़न है?", "hint": "जोड़ चुनें"},
            "mr": {"text": "कोणत्या सांध्यांमध्ये सर्वात जास्त वेदना किंवा ताठरता आहे?", "hint": "सांधे निवडा"}
        },
        "options": [
            {"id": "knees", "labels": {"en": "Both knees or one knee", "hi": "दोनों घुटने या एक घुटना", "mr": "दोन्ही किंवा एक गुडघा"}},
            {"id": "lower_back", "labels": {"en": "Lower back and hips", "hi": "कमर का निचला हिस्सा", "mr": "कंबर आणि खुबा"}},
            {"id": "neck_shoulder", "labels": {"en": "Neck and shoulders", "hi": "गर्दन और कंधे", "mr": "मान आणि खांदे"}},
            {"id": "small_joints", "labels": {"en": "Fingers, wrists, and small joints", "hi": "हाथ-पैरों की छोटी उंगलियां", "mr": "हात-पायांची बोटे व सांधे"}}
        ],
        "next_default": "q_medical_conditions"
    },

    # Adaptive Branch 4: Cough & Respiratory
    {
        "id": "q_cough_details",
        "category": "Respiratory Specifics",
        "trigger": "cough_cold",
        "input_type": "single_select",
        "translations": {
            "en": {"text": "Is your cough dry or with mucus/phlegm?", "hint": "Select cough nature"},
            "hi": {"text": "खांसी सूखी है या बलगम/कफ के साथ आती है?", "hint": "खांसी का प्रकार चुनें"},
            "mr": {"text": "खोकला कोरडा आहे की कफासह येतो?", "hint": "खोकल्याचा प्रकार निवडा"}
        },
        "options": [
            {"id": "dry", "labels": {"en": "Dry, irritating cough (No phlegm)", "hi": "सूखी खांसी (कफ नहीं आता)", "mr": "कोरडा खोकला (कफ नाही)"}},
            {"id": "mucus", "labels": {"en": "Productive cough with white/yellow mucus", "hi": "कफ वाली खांसी", "mr": "कफ असलेला खोकला"}},
            {"id": "breathless", "labels": {"en": "Cough with breathing difficulty/wheezing", "hi": "खांसी के साथ सांस फूलना", "mr": "खोकल्यासह दम लागणे"}}
        ],
        "next_default": "q_medical_conditions"
    },

    # Universal Question: Medical Conditions
    {
        "id": "q_medical_conditions",
        "category": "Medical History",
        "input_type": "multi_select",
        "translations": {
            "en": {"text": "Have you ever been diagnosed with any of these conditions?", "hint": "Select all that apply"},
            "hi": {"text": "क्या आपको पहले से इनमें से कोई बीमारी या समस्या है?", "hint": "लागू होने वाले सभी विकल्प चुनें"},
            "mr": {"text": "तुम्हाला पूर्वीपासून यापैकी कोणताही आजार निदान झाला आहे का?", "hint": "लागू असलेले सर्व पर्याय निवडा"}
        },
        "options": [
            {"id": "diabetes", "labels": {"en": "Diabetes (Sugar)", "hi": "मधुमेह (शुगर)", "mr": "मधुमेह (डायबिटीज)"}},
            {"id": "bp", "labels": {"en": "High Blood Pressure (BP)", "hi": "हाई ब्लड प्रेशर (बीपी)", "mr": "उच्च रक्तदाब (बीपी)"}},
            {"id": "thyroid", "labels": {"en": "Thyroid problem", "hi": "थायरॉयड की समस्या", "mr": "थायरॉईडचा त्रास"}},
            {"id": "asthma", "labels": {"en": "Asthma / Allergy", "hi": "दमा / सांस की एलर्जी", "mr": "दमा / ॲलर्जी"}},
            {"id": "heart", "labels": {"en": "Heart problem", "hi": "हृदय संबंधी समस्या", "mr": "हृदयाचा त्रास"}},
            {"id": "none", "labels": {"en": "None of these", "hi": "इनमें से कोई नहीं", "mr": "यापैकी काहीही नाही"}}
        ],
        "next_default": "q_medications"
    },

    # Universal Question: Medications
    {
        "id": "q_medications",
        "category": "Current Medications",
        "input_type": "single_select",
        "translations": {
            "en": {"text": "Are you currently taking any medicines regularly?", "hint": "Including BP, Sugar, or Ayurvedic medicines"},
            "hi": {"text": "क्या आप वर्तमान में कोई दवाइयां नियमित रूप से ले रहे हैं?", "hint": "बीपी, शुगर या आयुर्वेदिक दवाइयों सहित"},
            "mr": {"text": "तुम्ही सध्या कोणतीही औषधे नियमितपणे घेत आहात का?", "hint": "बीपी, शुगर किंवा आयुर्वेदिक औषधांसह"}
        },
        "options": [
            {"id": "yes", "labels": {"en": "Yes, taking daily medicines", "hi": "हां, नियमित दवाइयां ले रहे हैं", "mr": "होय, नियमित औषधे सुरू आहेत"}},
            {"id": "occasional", "labels": {"en": "Only occasionally (as needed)", "hi": "सिर्फ कभी-कभार (जरूरत पड़ने पर)", "mr": "फक्त गरज भासल्यास"}},
            {"id": "no", "labels": {"en": "No, not taking any medicines", "hi": "नहीं, कोई दवाई नहीं चल रही", "mr": "नाही, कोणतीही औषधे नाही"}},
            {"id": "unsure", "labels": {"en": "Not sure", "hi": "पक्का याद नहीं", "mr": "नक्की माहित नाही"}}
        ],
        "next_default": "q_allergies"
    },

    # Universal Question: Allergies
    {
        "id": "q_allergies",
        "category": "Allergies",
        "input_type": "single_select",
        "translations": {
            "en": {"text": "Do you have any known allergy to medicines or food?", "hint": "Important for safety"},
            "hi": {"text": "क्या आपको किसी दवाई या खाने की चीज़ से एलर्जी है?", "hint": "सुरक्षा के लिए आवश्यक"},
            "mr": {"text": "तुम्हाला कोणत्याही औषधाची किंवा अन्नाची ॲलर्जी आहे का?", "hint": "सुरक्षिततेसाठी महत्त्वाचे"}
        },
        "options": [
            {"id": "no", "labels": {"en": "No known allergies (None)", "hi": "नहीं, कोई एलर्जी नहीं है", "mr": "नाही, कोणतीही ॲलर्जी नाही"}},
            {"id": "medicine", "labels": {"en": "Yes, medicine allergy (e.g. Sulfa, Penicillin)", "hi": "हां, किसी दवाई से एलर्जी है", "mr": "होय, औषधाची ॲलर्जी आहे"}},
            {"id": "food_dust", "labels": {"en": "Yes, food or dust/skin allergy", "hi": "हां, खाने या धूल/त्वचा से एलर्जी है", "mr": "होय, अन्न किंवा धूळ ॲलर्जी आहे"}},
            {"id": "unsure", "labels": {"en": "Not sure", "hi": "पता नहीं", "mr": "माहित नाही"}}
        ],
        "next_default": "q_lifestyle_habits"
    },

    # Universal Question: Lifestyle / Habits
    {
        "id": "q_lifestyle_habits",
        "category": "Personal Habits",
        "input_type": "single_select",
        "translations": {
            "en": {"text": "How would you describe your diet and sleep pattern?", "hint": "Select your general routine"},
            "hi": {"text": "आपका खान-पान और नींद का सामान्य रूटीन कैसा रहता है?", "hint": "अपनी दिनचर्या चुनें"},
            "mr": {"text": "तुमचा आहार आणि झोपेची पद्धत साधारणपणे कशी आहे?", "hint": "आपली दिनचर्या निवडा"}
        },
        "options": [
            {"id": "veg_good_sleep", "labels": {"en": "Vegetarian diet, Good regular sleep", "hi": "शाकाहारी भोजन, अच्छी नियमित नींद", "mr": "शाकाहारी आहार, शांत व नियमित झोप"}},
            {"id": "veg_poor_sleep", "labels": {"en": "Vegetarian diet, Disturbed/late sleep", "hi": "शाकाहारी भोजन, कम या टूटी-फूटी नींद", "mr": "शाकाहारी आहार, अपुरी किंवा विस्कळीत झोप"}},
            {"id": "mixed_good_sleep", "labels": {"en": "Non-veg/Mixed diet, Good sleep", "hi": "मिश्रित भोजन, अच्छी नींद", "mr": "मिश्र आहार, चांगली झोप"}},
            {"id": "mixed_poor_sleep", "labels": {"en": "Non-veg/Mixed diet, Disturbed sleep", "hi": "मिश्रित भोजन, तनाव/कम नींद", "mr": "मिश्र आहार, विस्कळीत झोप"}}
        ],
        "next_default": "COMPLETE"
    }
]

def get_next_question(current_question_id: Optional[str], answers: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Evaluates trigger conditions and branches dynamically based on patient responses.
    """
    if not current_question_id:
        return QUESTION_CATALOGUE[0]

    curr = next((q for q in QUESTION_CATALOGUE if q["id"] == current_question_id), None)
    if not curr:
        return None

    next_id = curr.get("next_default")

    # Adaptive branch resolution after q_progression
    if next_id == "ADAPTIVE_BRANCH":
        chief = answers.get("q_chief_complaint", "")
        if "headache" in str(chief):
            next_id = "q_headache_location"
        elif "stomach" in str(chief):
            next_id = "q_stomach_details"
        elif "joint" in str(chief):
            next_id = "q_joint_details"
        elif "cough" in str(chief):
            next_id = "q_cough_details"
        else:
            next_id = "q_medical_conditions"

    if next_id == "COMPLETE":
        return None

    return next((q for q in QUESTION_CATALOGUE if q["id"] == next_id), None)
