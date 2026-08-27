import json
import os

messages_dir = r"c:\Users\Kumar.Gaurav2\Desktop\temp\Sakhi-AI-frontend\messages"
locales = ['en', 'hi', 'mr', 'bn', 'ta', 'te', 'kn', 'gu', 'pa', 'or']

new_keys = {
  "checkin": {
    "title": "Daily Check-in",
    "subtitle": "Take a moment to record how you're feeling today.",
    "save": "Save check-in",
    "saving": "Saving...",
    "cancel": "Cancel"
  },
  "mood": {
    "question": "How is your mood today?",
    "options": {
      "HAPPY": "Happy",
      "CALM": "Calm",
      "NEUTRAL": "Neutral",
      "SAD": "Sad",
      "IRRITATED": "Irritated",
      "ANXIOUS": "Anxious",
      "STRESSED": "Stressed",
      "LOW": "Low",
      "ENERGETIC": "Energetic",
      "OTHER": "Other"
    }
  },
  "energy": {
    "question": "What is your energy level?",
    "options": {
      "VERY_LOW": "Very Low",
      "LOW": "Low",
      "MEDIUM": "Medium",
      "HIGH": "High",
      "VERY_HIGH": "Very High"
    }
  },
  "symptoms": {
    "question": "Any symptoms today?",
    "categories": {
      "PAIN": "Pain",
      "MENSTRUAL": "Menstrual",
      "DIGESTIVE": "Digestive",
      "GENERAL": "General",
      "SKIN": "Skin"
    },
    "options": {
      "headache": "Headache",
      "back_pain": "Back Pain",
      "pelvic_pain": "Pelvic Pain",
      "body_pain": "Body Pain",
      "cramps": "Cramps",
      "period_pain": "Period Pain",
      "spotting": "Spotting",
      "bloating": "Bloating",
      "nausea": "Nausea",
      "constipation": "Constipation",
      "diarrhea": "Diarrhea",
      "fatigue": "Fatigue",
      "dizziness": "Dizziness",
      "weakness": "Weakness",
      "fever": "Fever",
      "acne": "Acne",
      "skin_changes": "Skin Changes"
    }
  },
  "severity": {
    "options": {
      "NONE": "None",
      "MILD": "Mild",
      "MODERATE": "Moderate",
      "SEVERE": "Severe"
    }
  },
  "history": {
    "title": "Symptoms History",
    "subtitle": "Your logged symptoms over time.",
    "noData": "You haven't logged any symptoms yet."
  },
  "dashboard": {
    "title": "Your Wellness Today",
    "greeting": "Good morning, {name} 🌸",
    "noCheckinTitle": "How are you feeling today?",
    "noCheckinAction": "Check in",
    "checkinComplete": "Today's check-in complete",
    "updateAction": "Update",
    "cycleTitle": "Cycle",
    "cycleDay": "Cycle Day {day}",
    "nextPeriod": "Estimated next period",
    "ovulation": "Estimated ovulation",
    "fertileWindow": "Fertile window",
    "lowConfidence": "Low confidence estimate",
    "keepTracking": "Keep tracking your periods to get personalized cycle estimates.",
    "viewCycle": "View cycle",
    "symptoms": {
      "title": "Today's symptoms",
      "noSymptoms": "No symptoms logged today.",
      "viewAll": "View all symptoms"
    },
    "moodEnergy": {
      "title": "Mood & Energy",
      "mood": "Mood",
      "energy": "Energy",
      "notLogged": "Not logged",
      "addMood": "Add mood",
      "addEnergy": "Add energy"
    },
    "tracking": {
      "title": "Today's wellness",
      "checkin": "Check-in",
      "cycle": "Cycle",
      "symptoms": "Symptoms",
      "notLogged": "Not logged:",
      "nutrition": "Nutrition — Coming soon",
      "activity": "Activity — Coming soon"
    },
    "trendsTitle": "Recent Wellness",
    "symptomSummary": "Over the last {days} days, you logged symptoms on {count} days and completed {checkins} check-ins.",
    "welcomeNewTitle": "Welcome to your Wellness Hub 🌸",
    "welcomeNewDesc": "Track what matters to you and build a clearer picture of your wellness over time.",
    "setupProfile": "Set up Health Profile",
    "incompleteProfile": "Complete your health profile",
    "incompleteProfileDesc": "This helps personalize your wellness features.",
    "unableToLoad": "Unable to load your wellness data right now.",
    "healthHub": "Health Hub"
  }
}

for locale in locales:
    file_path = os.path.join(messages_dir, f"{locale}.json")
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    if locale == 'en':
        data['Wellness'] = new_keys
    else:
        # Deep copy and prefix with [NEEDS_REVIEW]
        def prefix(obj):
            if isinstance(obj, dict):
                return {k: prefix(v) for k, v in obj.items()}
            elif isinstance(obj, str):
                return "[NEEDS_REVIEW] " + obj if "[NEEDS_REVIEW]" not in obj else obj
            return obj
            
        data['Wellness'] = prefix(new_keys)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Updated {locale}.json")
