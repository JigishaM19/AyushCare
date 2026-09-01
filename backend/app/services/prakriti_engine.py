from typing import Dict, List, Any

# Standard Ayurvedic Prakriti Questionnaire Definition
PRAKRITI_QUESTIONS = [
    {
        "id": "body_frame",
        "category": "Physical",
        "title": "Body Frame & Build (Sharira Rachana)",
        "options": [
            {"id": "v1", "text": "Slim, slender, prominent joints, difficulty gaining weight", "vata": 3, "pitta": 0, "kapha": 0},
            {"id": "p1", "text": "Medium build, proportionate, muscular, moderate weight", "vata": 0, "pitta": 3, "kapha": 0},
            {"id": "k1", "text": "Broad frame, heavy, sturdy, tends to gain weight easily", "vata": 0, "pitta": 0, "kapha": 3}
        ]
    },
    {
        "id": "skin_nature",
        "category": "Physical",
        "title": "Skin Texture & Temperature (Twak)",
        "options": [
            {"id": "v2", "text": "Dry, rough, thin, cool, cracks easily in winter", "vata": 3, "pitta": 0, "kapha": 0},
            {"id": "p2", "text": "Warm, reddish, prone to moles, freckles, acne, sensitive", "vata": 0, "pitta": 3, "kapha": 0},
            {"id": "k2", "text": "Thick, soft, oily, cool, smooth, radiant", "vata": 0, "pitta": 0, "kapha": 3}
        ]
    },
    {
        "id": "hair_type",
        "category": "Physical",
        "title": "Hair Characteristics (Kesha)",
        "options": [
            {"id": "v3", "text": "Dry, brittle, frizzy, thin, dark/dull", "vata": 3, "pitta": 0, "kapha": 0},
            {"id": "p3", "text": "Fine, straight, soft, early greying or balding, reddish/blonde tint", "vata": 0, "pitta": 3, "kapha": 0},
            {"id": "k3", "text": "Thick, lustrous, wavy/curly, abundant, dark, oily", "vata": 0, "pitta": 0, "kapha": 3}
        ]
    },
    {
        "id": "appetite",
        "category": "Physiological",
        "title": "Appetite & Digestion (Agni & Koshtha)",
        "options": [
            {"id": "v4", "text": "Irregular (Vishamagni) - hungry at odd times, quick bloating", "vata": 3, "pitta": 0, "kapha": 0},
            {"id": "p4", "text": "Sharp & intense (Tikshnagni) - cannot tolerate hunger, strong thirst", "vata": 0, "pitta": 3, "kapha": 0},
            {"id": "k4", "text": "Slow & steady (Mandagni) - can easily skip meals, feels heavy after eating", "vata": 0, "pitta": 0, "kapha": 3}
        ]
    },
    {
        "id": "sleep_pattern",
        "category": "Physiological",
        "title": "Sleep Pattern (Nidra)",
        "options": [
            {"id": "v5", "text": "Light, interrupted, 5-6 hours, waking up feeling anxious", "vata": 3, "pitta": 0, "kapha": 0},
            {"id": "p5", "text": "Moderate, sound, 6-7 hours, can awaken easily, vivid dreams", "vata": 0, "pitta": 3, "kapha": 0},
            {"id": "k5", "text": "Deep, heavy, 8+ hours, hard to wake up in the morning", "vata": 0, "pitta": 0, "kapha": 3}
        ]
    },
    {
        "id": "bowel_habit",
        "category": "Physiological",
        "title": "Bowel Habits (Purisha)",
        "options": [
            {"id": "v6", "text": "Dry, hard stools, tendency towards constipation, gas/flatulence", "vata": 3, "pitta": 0, "kapha": 0},
            {"id": "p6", "text": "Soft, loose, frequent (2-3 times/day), burning sensation", "vata": 0, "pitta": 3, "kapha": 0},
            {"id": "k6", "text": "Regular, well-formed, heavy, moderate speed, rare constipation", "vata": 0, "pitta": 0, "kapha": 3}
        ]
    },
    {
        "id": "weather_tolerance",
        "category": "Physiological",
        "title": "Climatic Preference (Satmyata)",
        "options": [
            {"id": "v7", "text": "Dislikes cold, wind, dry weather; loves warmth and sun", "vata": 3, "pitta": 0, "kapha": 0},
            {"id": "p7", "text": "Dislikes heat, sun, hot weather; loves cool air and cold drinks", "vata": 0, "pitta": 3, "kapha": 0},
            {"id": "k7", "text": "Dislikes damp, cold, humid weather; loves dry, warm climate", "vata": 0, "pitta": 0, "kapha": 3}
        ]
    },
    {
        "id": "mind_decision",
        "category": "Psychological",
        "title": "Decision Making & Speed of Action (Buddhi)",
        "options": [
            {"id": "v8", "text": "Quick to decide, changes mind frequently, impulsive, restless", "vata": 3, "pitta": 0, "kapha": 0},
            {"id": "p8", "text": "Analytical, precise, decisive, goal-driven, organized", "vata": 0, "pitta": 3, "kapha": 0},
            {"id": "k8", "text": "Takes time to decide, methodical, firm, steady, resistant to change", "vata": 0, "pitta": 0, "kapha": 3}
        ]
    },
    {
        "id": "stress_response",
        "category": "Psychological",
        "title": "Response to Stress & Emotion (Manasika Bhava)",
        "options": [
            {"id": "v9", "text": "Anxiety, worry, fear, nervousness, racing thoughts", "vata": 3, "pitta": 0, "kapha": 0},
            {"id": "p9", "text": "Irritation, anger, impatience, frustration, critical", "vata": 0, "pitta": 3, "kapha": 0},
            {"id": "k9", "text": "Calm, withdraws, placid, passive, holds on to feelings", "vata": 0, "pitta": 0, "kapha": 3}
        ]
    },
    {
        "id": "memory_pattern",
        "category": "Psychological",
        "title": "Memory & Learning (Smriti / Medha)",
        "options": [
            {"id": "v10", "text": "Grasps quickly, forgets quickly, short-term recall strong", "vata": 3, "pitta": 0, "kapha": 0},
            {"id": "p10", "text": "Sharp intellect, clear retention, systematic recall", "vata": 0, "pitta": 3, "kapha": 0},
            {"id": "k10", "text": "Slow to grasp, but retains for life, excellent long-term memory", "vata": 0, "pitta": 0, "kapha": 3}
        ]
    }
]

def calculate_prakriti_scores(responses: Dict[str, str]) -> Dict[str, Any]:
    """
    Transparent rule-based scoring engine for Prakriti.
    Calculates exact points for Vata, Pitta, Kapha, normalizes to 100%,
    and identifies primary and secondary constitution.
    """
    vata_total = 0.0
    pitta_total = 0.0
    kapha_total = 0.0

    # Build question lookup
    q_map = {q["id"]: {opt["id"]: opt for opt in q["options"]} for q in PRAKRITI_QUESTIONS}

    for q_id, opt_id in responses.items():
        if q_id in q_map and opt_id in q_map[q_id]:
            opt = q_map[q_id][opt_id]
            vata_total += opt.get("vata", 0)
            pitta_total += opt.get("pitta", 0)
            kapha_total += opt.get("kapha", 0)

    total_points = vata_total + pitta_total + kapha_total
    if total_points == 0:
        # Default neutral baseline if empty
        return {
            "vata_score": 0.0,
            "pitta_score": 0.0,
            "kapha_score": 0.0,
            "vata_percent": 33.3,
            "pitta_percent": 33.3,
            "kapha_percent": 33.4,
            "primary_prakriti": "Tridoshaja (Balanced)",
            "secondary_prakriti": None,
            "radar_data": [
                {"subject": "Vata (Air/Ether)", "A": 33.3, "fullMark": 100},
                {"subject": "Pitta (Fire/Water)", "A": 33.3, "fullMark": 100},
                {"subject": "Kapha (Water/Earth)", "A": 33.4, "fullMark": 100},
            ]
        }

    v_pct = round((vata_total / total_points) * 100, 1)
    p_pct = round((pitta_total / total_points) * 100, 1)
    k_pct = round((kapha_total / total_points) * 100, 1)

    # Sort doshas by percentage
    doshas = [("Vata", v_pct), ("Pitta", p_pct), ("Kapha", k_pct)]
    doshas.sort(key=lambda x: x[1], reverse=True)

    d1_name, d1_val = doshas[0]
    d2_name, d2_val = doshas[1]
    d3_name, d3_val = doshas[2]

    # Classification logic
    if d1_val >= 60.0:
        primary = f"{d1_name}ja (Ekadoshaja)"
        secondary = None
    elif abs(d1_val - d2_val) <= 12.0:
        primary = f"{d1_name}-{d2_name} (Dwandvaja)"
        secondary = f"{d3_name} Anubandha"
    else:
        primary = f"{d1_name} Pradhana ({d1_name}-{d2_name})"
        secondary = d2_name

    radar_data = [
        {"subject": "Vata (Air/Ether)", "A": v_pct, "fullMark": 100},
        {"subject": "Pitta (Fire/Water)", "A": p_pct, "fullMark": 100},
        {"subject": "Kapha (Water/Earth)", "A": k_pct, "fullMark": 100},
    ]

    return {
        "vata_score": vata_total,
        "pitta_score": pitta_total,
        "kapha_score": kapha_total,
        "vata_percent": v_pct,
        "pitta_percent": p_pct,
        "kapha_percent": k_pct,
        "primary_prakriti": primary,
        "secondary_prakriti": secondary,
        "radar_data": radar_data
    }

def calculate_vikriti_scores(symptoms_data: List[Dict[str, Any]], ashtavidha_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates current pathological dosha imbalance (Vikriti)
    derived from active symptoms, pain characteristics, and Ashtavidha findings.
    """
    v_points = 10.0
    p_points = 10.0
    k_points = 10.0

    # Analyze symptoms
    for s in symptoms_data:
        name = s.get("name", "").lower()
        severity = s.get("severity", 5)
        
        # Vata symptoms: Pain, joint pain, dryness, headache, insomnia, constipation, anxiety
        if any(w in name for w in ["headache", "joint", "back", "pain", "insomnia", "anxiety", "constipation", "sciatica", "tremor", "dry"]):
            v_points += (severity * 3.5)
        # Pitta symptoms: Acidity, burning, fever, inflammation, skin redness, anger, diarrhea
        if any(w in name for w in ["acidity", "burning", "fever", "inflammation", "rash", "skin", "ulcer", "gastritis", "pitta"]):
            p_points += (severity * 3.5)
        # Kapha symptoms: Cough, congestion, heaviness, lethargy, swelling, obesity, mucus
        if any(w in name for w in ["cough", "cold", "congestion", "fatigue", "heaviness", "swelling", "edema", "mucus", "weight"]):
            k_points += (severity * 3.5)

    # Analyze Ashtavidha findings
    nadi = str(ashtavidha_data.get("nadi", "")).lower()
    if "vata" in nadi:
        v_points += 15.0
    if "pitta" in nadi:
        p_points += 15.0
    if "kapha" in nadi:
        k_points += 15.0

    total = v_points + p_points + k_points
    v_pct = round((v_points / total) * 100, 1)
    p_pct = round((p_points / total) * 100, 1)
    k_pct = round((k_points / total) * 100, 1)

    scores = [("Vata", v_pct), ("Pitta", p_pct), ("Kapha", k_pct)]
    scores.sort(key=lambda x: x[1], reverse=True)

    dominant = f"{scores[0][0]} Dushti (Imbalance)"
    if abs(scores[0][1] - scores[1][1]) <= 10.0:
        dominant = f"{scores[0][0]}-{scores[1][0]} Samsarga (Dual Imbalance)"

    return {
        "vata_score": v_points,
        "pitta_score": p_points,
        "kapha_score": k_points,
        "vata_percent": v_pct,
        "pitta_percent": p_pct,
        "kapha_percent": k_pct,
        "dominant_pattern": dominant,
        "dosha_distribution": [
            {"name": "Vata", "percentage": v_pct, "fill": "#8B5CF6"},
            {"name": "Pitta", "percentage": p_pct, "fill": "#EF4444"},
            {"name": "Kapha", "percentage": k_pct, "fill": "#10B981"}
        ]
    }
