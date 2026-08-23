const fs = require('fs');
const path = require('path');

const locales = ['en', 'hi', 'mr', 'bn', 'ta', 'te', 'kn', 'gu', 'pa', 'or'];
const messagesDir = path.join(__dirname, 'messages');

const newKeys = {
  checkin: {
    title: "Daily Check-in",
    subtitle: "Take a moment to record how you're feeling today.",
    save: "Save check-in",
    saving: "Saving...",
    cancel: "Cancel"
  },
  mood: {
    question: "How is your mood today?",
    options: {
      HAPPY: "Happy",
      CALM: "Calm",
      NEUTRAL: "Neutral",
      SAD: "Sad",
      IRRITATED: "Irritated",
      ANXIOUS: "Anxious",
      STRESSED: "Stressed",
      LOW: "Low",
      ENERGETIC: "Energetic",
      OTHER: "Other"
    }
  },
  energy: {
    question: "What is your energy level?",
    options: {
      VERY_LOW: "Very Low",
      LOW: "Low",
      MEDIUM: "Medium",
      HIGH: "High",
      VERY_HIGH: "Very High"
    }
  },
  symptoms: {
    question: "Any symptoms today?",
    categories: {
      PAIN: "Pain",
      MENSTRUAL: "Menstrual",
      DIGESTIVE: "Digestive",
      GENERAL: "General",
      SKIN: "Skin"
    },
    options: {
      headache: "Headache",
      back_pain: "Back Pain",
      pelvic_pain: "Pelvic Pain",
      body_pain: "Body Pain",
      cramps: "Cramps",
      period_pain": "Period Pain",
      spotting: "Spotting",
      bloating: "Bloating",
      nausea: "Nausea",
      constipation: "Constipation",
      diarrhea: "Diarrhea",
      fatigue: "Fatigue",
      dizziness: "Dizziness",
      weakness: "Weakness",
      fever: "Fever",
      acne: "Acne",
      skin_changes: "Skin Changes"
    }
  },
  severity: {
    options: {
      NONE: "None",
      MILD: "Mild",
      MODERATE: "Moderate",
      SEVERE: "Severe"
    }
  },
  history: {
    title: "Symptoms History",
    subtitle: "Your logged symptoms over time.",
    noData: "You haven't logged any symptoms yet."
  },
  dashboard: {
    title: "Your Wellness Today",
    greeting: "Good morning, {name} 🌸",
    noCheckinTitle: "How are you feeling today?",
    noCheckinAction: "Check in",
    checkinComplete: "Today's check-in complete",
    updateAction: "Update",
    cycleTitle: "Cycle",
    cycleDay: "Cycle Day {day}",
    nextPeriod: "Estimated next period",
    ovulation": "Estimated ovulation",
    fertileWindow": "Fertile window",
    lowConfidence": "Low confidence estimate",
    keepTracking": "Keep tracking your periods to get personalized cycle estimates.",
    viewCycle": "View cycle",
    symptomsTitle": "Today's symptoms",
    noSymptoms": "No symptoms logged today.",
    viewAllSymptoms": "View all symptoms",
    mood: "Mood",
    energy: "Energy",
    notLogged": "Not logged",
    addMood": "Add mood",
    addEnergy": "Add energy",
    trackingStatus": "Today's wellness",
    trendsTitle": "Recent Wellness",
    symptomSummary": "Over the last {days} days, you logged symptoms on {count} days and completed {checkins} check-ins.",
    welcomeNewTitle": "Welcome to your Wellness Hub 🌸",
    welcomeNewDesc": "Track what matters to you and build a clearer picture of your wellness over time.",
    setupProfile": "Set up Health Profile",
    incompleteProfile": "Complete your health profile",
    incompleteProfileDesc": "This helps personalize your wellness features.",
    unableToLoad": "Unable to load your wellness data right now.",
    healthHub": "Health Hub"
  }
};

const baseJson = JSON.parse(fs.readFileSync(path.join(messagesDir, 'hi.json'), 'utf8'));

locales.forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  let data;
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } else {
    data = JSON.parse(JSON.stringify(baseJson));
  }

  if (locale === 'en') {
    data.Wellness = newKeys;
  } else {
    const prefixedKeys = JSON.parse(JSON.stringify(newKeys));
    const prefix = (obj) => {
      for (let k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          prefix(obj[k]);
        } else if (typeof obj[k] === 'string' && !obj[k].includes('[NEEDS_REVIEW]')) {
          obj[k] = '[NEEDS_REVIEW] ' + obj[k];
        }
      }
    };
    prefix(prefixedKeys);
    data.Wellness = prefixedKeys;
  }

  // Restore the missing keys that were accidentally removed
  if (!data.FAQ.items.find(i => i.id === 'first-period')) {
      data.FAQ.items.splice(7, 0, {
        "id": "first-period",
        "category": "health",
        "question": "What should I know about my first period?",
        "answer": "Your first period is a normal part of growing up. It usually happens between ages 10-15, but everyone is different. Signs include breast development, vaginal discharge, and growth spurts. Keep a small kit with pads, clean underwear, and wipes. Talk to a trusted adult if you have questions."
      });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Updated ${locale}.json`);
});
