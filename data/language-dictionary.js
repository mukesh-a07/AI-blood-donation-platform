// Bilingual Language Dictionary (English/Tamil)
// Used for seamless language switching across the platform

const LANGUAGE_DICT = {
    en: {
        // Navigation
        "home": "Home",
        "register": "Register as Donor",
        "requests": "Blood Requests",
        "findDonors": "Find Donors",
        "chatbot": "AI Assistant",
        
        "home": "Home",
        "register": "Register",
        "requests": "Requests",
        "findDonors": "Find Donors",
        "bloodBanks": "Blood Banks", // New
        "bloodBanksTitle": "Nearby Blood Banks", // New
        "bloodBanksSubtitle": "Find Government & Private Blood Banks", // New
        "noBanksFound": "No blood banks found in this area.", // New
        "address": "Address",
        // Common
        "name": "Name",
        "contact": "Contact",
        "email": "Email",
        "bloodType": "Blood Type",
        "location": "Location",
        "district": "District",
        "union": "Union",
        "gender": "Gender",
        "male": "Male",
        "female": "Female",
        "other": "Other",
        "weight": "Weight (kg)",
        "age": "Age",
        "submit": "Submit",
        "search": "Search",
        "cancel": "Cancel",
        "delete": "Delete",
        "edit": "Edit",
        "save": "Save",
        
        // Registration
        "registerTitle": "Register as a Blood Donor",
        "registerSubtitle": "Join our community of life-savers",
        "registrationDate": "Registration Date",
        "registerSuccess": "Donor registered successfully!",
        "registerError": "Please fill in all required fields.",
        
        // Search
        "searchTitle": "Find Blood Donors",
        "searchSubtitle": "Search by blood type, district, and union",
        "searchBloodType": "Select Blood Type",
        "searchDistrict": "Select District",
        "searchUnion": "Select Union",
        "noDonorsFound": "No donors found matching your criteria.",
        "donorsFound": "donors found",
        
        // Emergency Requests
        "emergencyTitle": "Emergency Blood Requests",
        "requestBlood": "Request Blood",
        "hospital": "Hospital",
        "hospitalContact": "Hospital Contact",
        "urgent": "Urgent",
        "addRequest": "Add Request",
        "noRequests": "No emergency requests at the moment.",
        
        // Chatbot
        "chatbotTitle": "AI Blood Donation Assistant",
        "chatbotSubtitle": "Ask me anything about blood donation",
        "chatbotPlaceholder": "Type your question here...",
        "send": "Send",
        "chatbotGreeting": "Hello! I'm your AI assistant. I can help you with:\n• Donor eligibility\n• Blood group compatibility\n• Emergency procedures\n• Location-based search\n• General blood donation information",
        
        // Benefits
        "whyDonate": "Why Donate Blood?",
        "benefit1": "Saves lives and helps patients in need",
        "benefit2": "Promotes heart health and lowers cancer risk",
        "benefit3": "Burns calories and rejuvenates the body",
        "benefit4": "Free mini-health checkup every donation",
        
        // Admin
        "adminLogin": "Admin Login",
        "adminLogout": "Logout",
        "username": "Username",
        "password": "Password",
        "login": "Login",
        "invalidCredentials": "Invalid credentials",
        "loginSuccess": "Admin logged in successfully!",
        
        // Stats
        "totalDonors": "Total Donors",
        "livesSaved": "Lives Saved",
        "emergencyRequests": "Emergency Requests",
        
        // Blood Types
        "selectBloodType": "Select Blood Type",
        "A+": "A+",
        "A-": "A-",
        "B+": "B+",
        "B-": "B-",
        "O+": "O+",
        "O-": "O-",
        "AB+": "AB+",
        "AB-": "AB-",

        // Districts (Thaenglish transliteration)
        "Ariyalur": "Ariyalur",
        "Perambalur": "Perambalur",
        "Coimbatore": "Coimbatore",
        "Chengalpattu": "Chengalpattu",
        "Dharmapuri": "Dharmapuri",
        "Dindigul": "Dindigul",
        "Erode": "Erode",
        "Kanchipuram": "Kanchipuram",
        "Kanyakumari": "Kanyakumari",
        "Karur": "Karur",
        "Krishnagiri": "Krishnagiri",
        "Madurai": "Madurai",
        "Thanjavur": "Thanjavur",
        "Nagapattinam": "Nagapattinam",
        "Tiruvarur": "Tiruvarur",
        "Mayiladuthurai": "Mayiladuthurai",
        "Namakkal": "Namakkal",
        "Pudukkottai": "Pudukkottai",
        "Ramanathapuram": "Ramanathapuram",
        "Salem": "Salem",
        "Sivaganga": "Sivaganga",
        "Theni": "Theni",
        "Nilgiris": "Nilgiris",
        "Tirunelveli": "Tirunelveli",
        "Tenkasi": "Tenkasi",
        "Tiruvallur": "Tiruvallur",
        "Tiruvannamalai": "Tiruvannamalai",
        "Thoothukudi": "Thoothukudi",
        "Tiruchirappalli": "Tiruchirappalli",
        "Tiruppur": "Tiruppur",
        "Vellore": "Vellore",
        "Ranipet": "Ranipet",
        "Tirupathur": "Tirupathur",
        "Viluppuram": "Viluppuram",
        "Kallakurichi": "Kallakurichi",
        "Virudhunagar": "Virudhunagar",
        "Chennai": "Chennai",
        "Cuddalore": "Cuddalore"
        },
        ta: {
        // Navigation
        "home": "முகப்பு",
        "register": "தானம் செய்பவராக பதிவு செய்ய",
        "requests": "இரத்த கோரிக்கைகள்",
        "findDonors": "தானம் செய்பவர்களை கண்டுபிடி",
        "chatbot": "AI உதவியாளர்",
        
        "home": "முகப்பு",
        "register": "பதிவு",
        "requests": "கோரிக்கைகள்",
        "findDonors": "தேடல்",
        "bloodBanks": "இரத்த வங்கிகள்", // New
        "bloodBanksTitle": "அருகிலுள்ள இரத்த வங்கிகள்", // New
        "bloodBanksSubtitle": "அரசு மற்றும் தனியார் இரத்த வங்கிகளைக் கண்டறியவும்", // New
        "noBanksFound": "இப்பகுதியில் இரத்த வங்கிகள் எதுவும் இல்லை.", // New
        "address": "முகப்பு", // New
        // Common
        "name": "பெயர்",
        "contact": "தொடர்பு",
        "email": "மின்னஞ்சல்",
        "bloodType": "இரத்த வகை",
        "location": "இடம்",
        "district": "மாவட்டம்",
        "union": "ஒன்றியம்",
        "gender": "பாலினம்",
        "male": "ஆண்",
        "female": "பெண்",
        "other": "மற்றவை",
        "weight": "எடை (கிலோ)",
        "age": "வயது",
        "submit": "சமர்ப்பி",
        "search": "தேடு",
        "cancel": "ரத்துசெய்",
        "delete": "நீக்கு",
        "edit": "திருத்து",
        "save": "சேமி",
        
        // Registration
        "registerTitle": "இரத்த தானம் செய்பவராக பதிவு செய்ய",
        "registerSubtitle": "வாழ்க்கையை காப்பாற்றுபவர்களின் சமூகத்தில் சேரவும்",
        "registrationDate": "பதிவு தேதி",
        "registerSuccess": "தானம் செய்பவர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்!",
        "registerError": "தயவுசெய்து அனைத்து தேவையான புலங்களையும் நிரப்பவும்.",
        
        // Search
        "searchTitle": "இரத்த தானம் செய்பவர்களை கண்டுபிடி",
        "searchSubtitle": "இரத்த வகை, மாவட்டம் மற்றும் ஒன்றியம் மூலம் தேடு",
        "searchBloodType": "இரத்த வகையை தேர்ந்தெடு",
        "searchDistrict": "மாவட்டத்தை தேர்ந்தெடு",
        "searchUnion": "ஒன்றியத்தை தேர்ந்தெடு",
        "noDonorsFound": "உங்கள் அளவுகோல்களுக்கு பொருந்தும் தானம் செய்பவர்கள் எவரும் இல்லை.",
        "donorsFound": "தானம் செய்பவர்கள் கண்டறியப்பட்டனர்",
        
        // Emergency Requests
        "emergencyTitle": "அவசர இரத்த கோரிக்கைகள்",
        "requestBlood": "இரத்தம் கோரி",
        "hospital": "மருத்துவமனை",
        "hospitalContact": "மருத்துவமனை தொடர்பு",
        "urgent": "அவசர",
        "addRequest": "கோரிக்கையை சேர்",
        "noRequests": "இப்போது அவசர கோரிக்கைகள் எதுவும் இல்லை.",
        
        // Chatbot
        "chatbotTitle": "AI இரத்த தானம் உதவியாளர்",
        "chatbotSubtitle": "இரத்த தானம் பற்றி எதையும் கேளுங்கள்",
        "chatbotPlaceholder": "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...",
        "send": "அனுப்பு",
        "chatbotGreeting": "வணக்கம்! நான் உங்கள் AI உதவியாளர். நான் உங்களுக்கு உதவ முடியும்:\n• தானம் செய்பவர் தகுதி\n• இரத்த வகை பொருந்தக்கூடிய தன்மை\n• அவசர நடைமுறைகள்\n• இட அடிப்படையிலான தேடல்\n• பொதுவான இரத்த தானம் தகவல்",
        
        // Benefits
        "whyDonate": "ஏன் இரத்தம் தானம் செய்ய வேண்டும்?",
        "benefit1": "வாழ்க்கைகளை காப்பாற்றுகிறது மற்றும் தேவைப்படும் நோயாளிகளுக்கு உதவுகிறது",
        "benefit2": "இதய ஆரோக்கியத்தை மேம்படுத்துகிறது மற்றும் புற்றுநோய் அபாயத்தை குறைக்கிறது",
        "benefit3": "கலோரிகளை எரிக்கிறது மற்றும் உடலை புதுப்பிக்கிறது",
        "benefit4": "ஒவ்வொரு தானத்திலும் இலவச சிறிய ஆரோக்கிய பரிசோதனை",
        
        // Admin
        "adminLogin": "நிர்வாகி உள்நுழைவு",
        "adminLogout": "வெளியேறு",
        "username": "பயனர்பெயர்",
        "password": "கடவுச்சொல்",
        "login": "உள்நுழை",
        "invalidCredentials": "தவறான சான்றுகள்",
        "loginSuccess": "நிர்வாகி வெற்றிகரமாக உள்நுழைந்தார்!",
        
        // Stats
        "totalDonors": "மொத்த தானம் செய்பவர்கள்",
        "livesSaved": "காப்பாற்றப்பட்ட வாழ்க்கைகள்",
        "emergencyRequests": "அவசர கோரிக்கைகள்",
        
        // Blood Types
        "selectBloodType": "இரத்த வகையை தேர்ந்தெடு",
        "A+": "A+",
        "A-": "A-",
        "B+": "B+",
        "B-": "B-",
        "O+": "O+",
        "O-": "O-",
        "AB+": "AB+",
        "AB-": "AB-",

        "Ariyalur": "அரியலூர்",
        "Perambalur": "பெரம்பலூர்",
        "Coimbatore": "கோயம்புத்தூர்",
        "Chengalpattu": "செங்கல்பட்டு",
        "Dharmapuri": "தர்மபுரி",
        "Dindigul": "திண்டுக்கல்",
        "Erode": "ஈரோடு",
        "Kanchipuram": "காஞ்சிபுரம்",
        "Kanyakumari": "கன்னியாகுமரி",
        "Karur": "கரூர்",
        "Krishnagiri": "கிருஷ்ணகிரி",
        "Madurai": "மதுரை",
        "Thanjavur": "தஞ்சாவூர்",
        "Nagapattinam": "நாகப்பட்டினம்",
        "Tiruvarur": "திருவாரூர்",
        "Mayiladuthurai": "மயிலாடுதுறை",
        "Namakkal": "நாமக்கல்",
        "Pudukkottai": "புதுக்கோட்டை",
        "Ramanathapuram": "இராமநாதபுரம்",
        "Salem": "சேலம்",
        "Sivaganga": "சிவகங்கை",
        "Theni": "தேனி",
        "Nilgiris": "நீலகிரி",
        "Tirunelveli": "திருநெல்வேலி",
        "Tenkasi": "தென்காசி",
        "Tiruvallur": "திருவள்ளூர்",
        "Tiruvannamalai": "திருவண்ணாமலை",
        "Thoothukudi": "தூத்துக்குடி",
        "Tiruchirappalli": "திருச்சிராப்பள்ளி",
        "Tiruppur": "திருப்பூர்",
        "Vellore": "வேலூர்",
        "Ranipet": "இராணிப்பேட்டை",
        "Tirupathur": "திருப்பத்தூர்",
        "Viluppuram": "விழுப்புரம்",
        "Kallakurichi": "கள்ளக்குறிச்சி",
        "Virudhunagar": "விருதுநகர்",
        "Chennai": "சென்னை",
        "Cuddalore": "கடலூர்"
    }
};

// Language switching utility
let currentLanguage = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updatePageLanguage();
    
    // Update chatbot language if available
    if (typeof chatbot !== 'undefined') {
        chatbot.setLanguage(lang);
    }
    
    // Refresh district-union dropdowns with new language
    if (typeof refreshDistrictUnionDropdowns === 'function') {
        refreshDistrictUnionDropdowns();
    }
}

function t(key) {
    if (!LANGUAGE_DICT[currentLanguage]) {
        currentLanguage = 'en'; // Fallback to English
    }
    return LANGUAGE_DICT[currentLanguage][key] || key;
}

function updatePageLanguage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // Update titles
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = t(key);
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LANGUAGE_DICT, setLanguage, t, updatePageLanguage };
}
