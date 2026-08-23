import json
import os

locales = {
    'en': {
        "symptoms": {"title": "Today's symptoms", "viewAll": "View all", "noSymptoms": "No symptoms logged today."},
        "moodEnergy": {"title": "Mood & Energy", "mood": "Mood", "energy": "Energy", "notLogged": "Not logged", "addMood": "Add mood", "addEnergy": "Add energy"},
        "tracking": {"title": "Today's wellness", "checkin": "Check-in", "cycle": "Cycle", "symptoms": "Symptoms", "notLogged": "Not logged:", "nutrition": "Nutrition — Coming soon", "activity": "Activity — Coming soon"},
        "noCheckinTitle": "How are you feeling today?", "noCheckinAction": "Check in", "checkinComplete": "Today's check-in complete", "updateAction": "Update", "mood": "Mood", "energy": "Energy", "notLogged": "Not logged"
    },
    'hi': {
        "symptoms": {"title": "आज के लक्षण", "viewAll": "सभी देखें", "noSymptoms": "आज कोई लक्षण दर्ज नहीं किया गया है।"},
        "moodEnergy": {"title": "मूड और ऊर्जा", "mood": "मूड", "energy": "ऊर्जा", "notLogged": "दर्ज नहीं है", "addMood": "मूड जोड़ें", "addEnergy": "ऊर्जा जोड़ें"},
        "tracking": {"title": "आज का स्वास्थ्य", "checkin": "चेक-इन", "cycle": "चक्र", "symptoms": "लक्षण", "notLogged": "दर्ज नहीं है:", "nutrition": "पोषण — जल्द आ रहा है", "activity": "गतिविधि — जल्द आ रहा है"},
        "noCheckinTitle": "आज आप कैसा महसूस कर रही हैं?", "noCheckinAction": "चेक-इन करें", "checkinComplete": "आज का चेक-इन पूरा हुआ", "updateAction": "अपडेट करें", "mood": "मूड", "energy": "ऊर्जा", "notLogged": "दर्ज नहीं है"
    },
    'mr': {
        "symptoms": {"title": "आजची लक्षणे", "viewAll": "सर्व पहा", "noSymptoms": "आज कोणतीही लक्षणे नोंदवली नाहीत."},
        "moodEnergy": {"title": "मूड आणि ऊर्जा", "mood": "मूड", "energy": "ऊर्जा", "notLogged": "नोंदवलेले नाही", "addMood": "मूड जोडा", "addEnergy": "ऊर्जा जोडा"},
        "tracking": {"title": "आजचे आरोग्य", "checkin": "चेक-इन", "cycle": "चक्र", "symptoms": "लक्षणे", "notLogged": "नोंदवलेले नाही:", "nutrition": "पोषण — लवकरच येत आहे", "activity": "क्रियाकलाप — लवकरच येत आहे"},
        "noCheckinTitle": "तुम्हाला आज कसे वाटत आहे?", "noCheckinAction": "चेक-इन करा", "checkinComplete": "आजचे चेक-इन पूर्ण झाले", "updateAction": "अपडेट करा", "mood": "मूड", "energy": "ऊर्जा", "notLogged": "नोंदवलेले नाही"
    },
    'bn': {
        "symptoms": {"title": "আজকের লক্ষণ", "viewAll": "সব দেখুন", "noSymptoms": "আজ কোনও লক্ষণ লগ করা হয়নি।"},
        "moodEnergy": {"title": "মেজাজ এবং শক্তি", "mood": "মেজাজ", "energy": "শক্তি", "notLogged": "লগ করা হয়নি", "addMood": "মেজাজ যোগ করুন", "addEnergy": "শক্তি যোগ করুন"},
        "tracking": {"title": "আজকের স্বাস্থ্য", "checkin": "চেক-ইন", "cycle": "চক্র", "symptoms": "লক্ষণ", "notLogged": "লগ করা হয়নি:", "nutrition": "পুষ্টি — শীঘ্রই আসছে", "activity": "কার্যকলাপ — শীঘ্রই আসছে"},
        "noCheckinTitle": "আজ আপনার কেমন লাগছে?", "noCheckinAction": "চেক-ইন করুন", "checkinComplete": "আজকের চেক-ইন সম্পূর্ণ", "updateAction": "আপডেট করুন", "mood": "মেজাজ", "energy": "শক্তি", "notLogged": "লগ করা হয়নি"
    },
    'ta': {
        "symptoms": {"title": "இன்றைய அறிகுறிகள்", "viewAll": "அனைத்தையும் காண்க", "noSymptoms": "இன்று எந்த அறிகுறிகளும் பதிவு செய்யப்படவில்லை."},
        "moodEnergy": {"title": "மனநிலை மற்றும் ஆற்றல்", "mood": "மனநிலை", "energy": "ஆற்றல்", "notLogged": "பதிவு செய்யப்படவில்லை", "addMood": "மனநிலையைச் சேர்", "addEnergy": "ஆற்றலைச் சேர்"},
        "tracking": {"title": "இன்றைய ஆரோக்கியம்", "checkin": "செக்-இன்", "cycle": "சுழற்சி", "symptoms": "அறிகுறிகள்", "notLogged": "பதிவு செய்யப்படவில்லை:", "nutrition": "ஊட்டச்சத்து — விரைவில்", "activity": "செயல்பாடு — விரைவில்"},
        "noCheckinTitle": "இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?", "noCheckinAction": "செக்-இன் செய்", "checkinComplete": "இன்றைய செக்-இன் முடிந்தது", "updateAction": "புதுப்பி", "mood": "மனநிலை", "energy": "ஆற்றல்", "notLogged": "பதிவு செய்யப்படவில்லை"
    },
    'te': {
        "symptoms": {"title": "నేటి లక్షణాలు", "viewAll": "అన్నీ చూడండి", "noSymptoms": "నేడు ఎలాంటి లక్షణాలు నమోదు కాలేదు."},
        "moodEnergy": {"title": "మూడ్ మరియు శక్తి", "mood": "మూడ్", "energy": "శక్తి", "notLogged": "నమోదు కాలేదు", "addMood": "మూడ్ జోడించండి", "addEnergy": "శక్తి జోడించండి"},
        "tracking": {"title": "నేటి ఆరోగ్యం", "checkin": "చెక్-ఇన్", "cycle": "రుతుచక్రం", "symptoms": "లక్షణాలు", "notLogged": "నమోదు కాలేదు:", "nutrition": "పోషకాహారం — త్వరలో", "activity": "కార్యకలాపాలు — త్వరలో"},
        "noCheckinTitle": "ఈ రోజు మీరు ఎలా భావిస్తున్నారు?", "noCheckinAction": "చెక్-ఇన్ చేయండి", "checkinComplete": "నేటి చెక్-ఇన్ పూర్తయింది", "updateAction": "అప్‌డేట్ చేయండి", "mood": "మూడ్", "energy": "శక్తి", "notLogged": "నమోదు కాలేదు"
    },
    'kn': {
        "symptoms": {"title": "ಇಂದಿನ ಲಕ್ಷಣಗಳು", "viewAll": "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ", "noSymptoms": "ಇಂದು ಯಾವುದೇ ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸಿಲ್ಲ."},
        "moodEnergy": {"title": "ಮನಸ್ಥಿತಿ ಮತ್ತು ಶಕ್ತಿ", "mood": "ಮನಸ್ಥಿತಿ", "energy": "ಶಕ್ತಿ", "notLogged": "ದಾಖಲಿಸಿಲ್ಲ", "addMood": "ಮನಸ್ಥಿತಿ ಸೇರಿಸಿ", "addEnergy": "ಶಕ್ತಿ ಸೇರಿಸಿ"},
        "tracking": {"title": "ಇಂದಿನ ಆರೋಗ್ಯ", "checkin": "ಚೆಕ್-ಇನ್", "cycle": "ಋತುಚಕ್ರ", "symptoms": "ಲಕ್ಷಣಗಳು", "notLogged": "ದಾಖಲಿಸಿಲ್ಲ:", "nutrition": "ಪೋಷಣೆ — ಶೀಘ್ರದಲ್ಲೇ", "activity": "ಚಟುವಟಿಕೆ — ಶೀಘ್ರದಲ್ಲೇ"},
        "noCheckinTitle": "ಇಂದು ನಿಮಗೆ ಹೇಗನಿಸುತ್ತಿದೆ?", "noCheckinAction": "ಚೆಕ್-ಇನ್ ಮಾಡಿ", "checkinComplete": "ಇಂದಿನ ಚೆಕ್-ಇನ್ ಪೂರ್ಣಗೊಂಡಿದೆ", "updateAction": "ಅಪ್‌ಡೇಟ್ ಮಾಡಿ", "mood": "ಮನಸ್ಥಿತಿ", "energy": "ಶಕ್ತಿ", "notLogged": "ದಾಖಲಿಸಿಲ್ಲ"
    },
    'gu': {
        "symptoms": {"title": "આજના લક્ષણો", "viewAll": "બધા જુઓ", "noSymptoms": "આજે કોઈ લક્ષણો નોંધાયા નથી."},
        "moodEnergy": {"title": "મૂડ અને ઉર્જા", "mood": "મૂડ", "energy": "ઉર્જા", "notLogged": "નોંધાયેલ નથી", "addMood": "મૂડ ઉમેરો", "addEnergy": "ઉર્જા ઉમેરો"},
        "tracking": {"title": "આજનું સ્વાસ્થ્ય", "checkin": "ચેક-ઇન", "cycle": "ચક્ર", "symptoms": "લક્ષણો", "notLogged": "નોંધાયેલ નથી:", "nutrition": "પોષણ — જલ્દી આવી રહ્યું છે", "activity": "પ્રવૃત્તિ — જલ્દી આવી રહ્યું છે"},
        "noCheckinTitle": "આજે તમે કેવું અનુભવી રહ્યા છો?", "noCheckinAction": "ચેક-ઇન કરો", "checkinComplete": "આજનું ચેક-ઇન પૂર્ણ થયું", "updateAction": "અપડેટ કરો", "mood": "મૂડ", "energy": "ઉર્જા", "notLogged": "નોંધાયેલ નથી"
    },
    'pa': {
        "symptoms": {"title": "ਅੱਜ ਦੇ ਲੱਛਣ", "viewAll": "ਸਾਰੇ ਦੇਖੋ", "noSymptoms": "ਅੱਜ ਕੋਈ ਲੱਛਣ ਦਰਜ ਨਹੀਂ ਕੀਤੇ ਗਏ।"},
        "moodEnergy": {"title": "ਮੂਡ ਅਤੇ ਊਰਜਾ", "mood": "ਮੂਡ", "energy": "ਊਰਜা", "notLogged": "ਦਰਜ ਨਹੀਂ ਹੈ", "addMood": "ਮੂਡ ਜੋੜੋ", "addEnergy": "ਊਰਜਾ ਜੋੜੋ"},
        "tracking": {"title": "ਅੱਜ ਦੀ ਸਿਹਤ", "checkin": "ਚੈੱਕ-ਇਨ", "cycle": "ਚੱਕਰ", "symptoms": "ਲੱਛਣ", "notLogged": "ਦਰਜ ਨਹੀਂ ਹੈ:", "nutrition": "ਪੋਸ਼ਣ — ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ", "activity": "ਗਤੀਵਿਧੀ — ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ"},
        "noCheckinTitle": "ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?", "noCheckinAction": "ਚੈੱਕ-ਇਨ ਕਰੋ", "checkinComplete": "ਅੱਜ ਦਾ ਚੈੱਕ-ਇਨ ਪੂਰਾ ਹੋਇਆ", "updateAction": "ਅੱਪਡੇਟ ਕਰੋ", "mood": "ਮੂਡ", "energy": "ਊਰਜਾ", "notLogged": "ਦਰਜ ਨਹੀਂ ਹੈ"
    },
    'or': {
        "symptoms": {"title": "ଆଜିର ଲକ୍ଷଣ", "viewAll": "ସବୁ ଦେଖନ୍ତୁ", "noSymptoms": "ଆଜି କୌଣସି ଲକ୍ଷଣ ଲଗ୍ କରାଯାଇ ନାହିଁ।"},
        "moodEnergy": {"title": "ମନୋଭାବ ଏବଂ ଶକ୍ତି", "mood": "ମନୋଭାବ", "energy": "ଶକ୍ତି", "notLogged": "ଲଗ୍ କରାଯାଇ ନାହିଁ", "addMood": "ମନୋଭାବ ଯୋଡନ୍ତୁ", "addEnergy": "ଶକ୍ତି ଯୋଡନ୍ତୁ"},
        "tracking": {"title": "ଆଜିର ସ୍ୱାସ୍ଥ୍ୟ", "checkin": "ଚେକ୍-ଇନ୍", "cycle": "ଋତୁଚକ୍ର", "symptoms": "ଲକ୍ଷଣ", "notLogged": "ଲଗ୍ କରାଯାଇ ନାହିଁ:", "nutrition": "ପୁଷ୍ଟି — ଶୀଘ୍ର ଆସୁଛି", "activity": "କାର୍ଯ୍ୟକଳାପ — ଶୀଘ୍ର ଆସୁଛି"},
        "noCheckinTitle": "ଆଜି ଆପଣ କିପରି ଅନୁଭବ କରୁଛନ୍ତି?", "noCheckinAction": "ଚେକ୍-ଇନ୍ କରନ୍ତୁ", "checkinComplete": "ଆଜିର ଚେକ୍-ଇନ୍ ସମ୍ପୂର୍ଣ୍ଣ", "updateAction": "ଅପଡେଟ୍ କରନ୍ତୁ", "mood": "ମନୋଭାବ", "energy": "ଶକ୍ତି", "notLogged": "ଲଗ୍ କରାଯାଇ ନାହିଁ"
    }
}

base_path = r"c:\Users\Kumar.Gaurav2\Desktop\temp\Sakhi-AI-frontend\messages"

for locale, strings in locales.items():
    file_path = os.path.join(base_path, f"{locale}.json")
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    if "Wellness" not in data:
        data["Wellness"] = {}
    if "dashboard" not in data["Wellness"]:
        data["Wellness"]["dashboard"] = {}
        
    for k, v in strings.items():
        data["Wellness"]["dashboard"][k] = v
        
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated i18n JSON files successfully.")
