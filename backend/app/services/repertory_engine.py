from typing import List, Dict, Any

# Demo Repertory Database (Educational / Research module)
DEMO_REPERTORY_DATABASE = [
    # Mind
    {"id": 1, "chapter": "Mind", "rubric": "Anxiety with restlessness", "remedies": {"Arsenicum album": 3, "Aconitum": 3, "Rhus tox": 2, "Nux vomica": 1}},
    {"id": 2, "chapter": "Mind", "rubric": "Irritability, impatient, workaholic", "remedies": {"Nux vomica": 3, "Bryonia": 2, "Chamomilla": 3, "Lycopodium": 2}},
    {"id": 3, "chapter": "Mind", "rubric": "Weeping easily, desires consolation", "remedies": {"Pulsatilla": 3, "Ignatia": 2, "Natrum mur": 1, "Sepia": 1}},
    {"id": 4, "chapter": "Mind", "rubric": "Anticipatory anxiety before events", "remedies": {"Gelsemium": 3, "Argentum nit": 3, "Lycopodium": 2}},

    # Head
    {"id": 5, "chapter": "Head", "rubric": "Headache, right-sided, throbbing", "remedies": {"Belladonna": 3, "Sanguinaria": 3, "Lycopodium": 2, "Nux vomica": 1}},
    {"id": 6, "chapter": "Head", "rubric": "Headache, aggravated by slightest motion", "remedies": {"Bryonia": 3, "Nux vomica": 2, "Belladonna": 2}},
    {"id": 7, "chapter": "Head", "rubric": "Headache, congestive, sun exposure", "remedies": {"Glonoinum": 3, "Natrum mur": 2, "Belladonna": 2}},
    {"id": 8, "chapter": "Head", "rubric": "Headache, relieved by tight bandaging / pressure", "remedies": {"Bryonia": 3, "Pulsatilla": 2, "Argentum nit": 2}},

    # Stomach / Digestion
    {"id": 9, "chapter": "Stomach", "rubric": "Acidity and heartburn after rich/spicy food", "remedies": {"Nux vomica": 3, "Pulsatilla": 2, "Carbo veg": 2, "Arsenicum album": 1}},
    {"id": 10, "chapter": "Stomach", "rubric": "Bloating and flatulence aggravated 4 PM to 8 PM", "remedies": {"Lycopodium": 3, "Carbo veg": 2, "Nux vomica": 1}},
    {"id": 11, "chapter": "Stomach", "rubric": "Burning pain relieved by warm drinks", "remedies": {"Arsenicum album": 3, "Nux vomica": 2, "Lycopodium": 2}},
    {"id": 12, "chapter": "Stomach", "rubric": "Thirstless with dry mouth", "remedies": {"Pulsatilla": 3, "Apis mel": 3, "Gelsemium": 2}},

    # Extremities / Joints
    {"id": 13, "chapter": "Extremities", "rubric": "Joint pain aggravated on first movement, better continuous motion", "remedies": {"Rhus tox": 3, "Ruta": 2, "Calc fluor": 1}},
    {"id": 14, "chapter": "Extremities", "rubric": "Joint pain aggravated by any motion, better absolute rest", "remedies": {"Bryonia": 3, "Colchicum": 2, "Ledum": 1}},
    {"id": 15, "chapter": "Extremities", "rubric": "Sciatic pain right sided, radiating down leg", "remedies": {"Colocynthis": 3, "Magnesia phos": 3, "Gnaphalium": 2}},

    # Generalities / Modalities
    {"id": 16, "chapter": "Generalities", "rubric": "Complaints worse in cold, damp weather", "remedies": {"Rhus tox": 3, "Dulcamara": 3, "Natrum sulph": 2, "Arsenicum album": 1}},
    {"id": 17, "chapter": "Generalities", "rubric": "Complaints worse in warm, closed room; better open air", "remedies": {"Pulsatilla": 3, "Apis mel": 2, "Kali bich": 1}},
    {"id": 18, "chapter": "Generalities", "rubric": "Chilly patient, sensitive to draft of air", "remedies": {"Nux vomica": 3, "Arsenicum album": 3, "Hepar sulph": 3, "Psorinum": 2}}
]

def calculate_repertorization(selected_rubric_ids: List[int]) -> Dict[str, Any]:
    """
    Computes remedy totals and grading scores based on selected rubrics.
    Clearly designated as Decision Support.
    """
    if not selected_rubric_ids:
        return {"remedies": [], "total_rubrics": 0}

    selected_rubrics = [r for r in DEMO_REPERTORY_DATABASE if r["id"] in selected_rubric_ids]
    total_rubrics_count = len(selected_rubrics)

    # Remedy accumulator: {remedy_name: {"total_score": int, "rubrics_covered": int, "covered_names": []}}
    remedy_stats = {}

    for rub in selected_rubrics:
        for rem_name, grade in rub["remedies"].items():
            if rem_name not in remedy_stats:
                remedy_stats[rem_name] = {
                    "remedy": rem_name,
                    "total_score": 0,
                    "rubrics_covered": 0,
                    "covered_rubrics": []
                }
            remedy_stats[rem_name]["total_score"] += grade
            remedy_stats[rem_name]["rubrics_covered"] += 1
            remedy_stats[rem_name]["covered_rubrics"].append(rub["rubric"])

    # Calculate match percentage
    results = []
    max_possible_score = total_rubrics_count * 3
    for rem, data in remedy_stats.items():
        pct = round((data["total_score"] / max_possible_score) * 100, 1) if max_possible_score > 0 else 0
        results.append({
            "remedy": rem,
            "total_score": data["total_score"],
            "rubrics_covered": data["rubrics_covered"],
            "coverage_percentage": round((data["rubrics_covered"] / total_rubrics_count) * 100, 1),
            "match_score": min(pct, 100.0),
            "covered_rubrics": data["covered_rubrics"]
        })

    # Sort primarily by rubrics covered, then by total score
    results.sort(key=lambda x: (x["rubrics_covered"], x["total_score"]), reverse=True)

    return {
        "selected_rubrics_count": total_rubrics_count,
        "remedies": results,
        "disclaimer": "Educational/research decision-support module. Final remedy selection remains with the qualified practitioner."
    }
