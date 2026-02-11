// AI Chatbot with Rule-Based NLP - Enhanced with Google Sheets Integration
// Knowledge base can be loaded from Google Sheets or use fallback

// Fallback knowledge base (used if Google Sheets is not available)
const FALLBACK_KNOWLEDGE_BASE = {
    // Donor Eligibility
    eligibility: {
        keywords: [
            "eligible", "eligibility", "qualify", "requirements", "age", "weight", "health",
            "conditions", "disease", "medication", "தகுதி", "வயது", "எடை", "ஆரோக்கியம்",
            "நோய்", "மருந்து", "தானம் செய்ய", "யார் தானம் செய்யலாம்"
        ],
        responses: {
            en: "To be eligible to donate blood, you must:\n• Be between 18-65 years old\n• Weigh at least 45 kg\n• Be in good health\n• Not have any infectious diseases\n• Not be on certain medications\n• Have adequate hemoglobin levels (12.5 g/dL for females, 13.0 g/dL for males)\n• Wait 56 days between donations (males) or 84 days (females)\n• Not have donated in the last 3 months\n• No tattoos or piercings in last 6 months",
            ta: "இரத்தம் தானம் செய்ய தகுதியாக இருக்க:\n• 18-65 வயதுக்குள் இருக்க வேண்டும்\n• குறைந்தது 45 கிலோ எடை இருக்க வேண்டும்\n• நல்ல ஆரோக்கியத்தில் இருக்க வேண்டும்\n• தொற்று நோய்கள் இருக்கக்கூடாது\n• சில மருந்துகள் எடுக்கக்கூடாது\n• போதுமான ஹீமோகுளோபின் அளவு இருக்க வேண்டும் (பெண்கள்: 12.5 g/dL, ஆண்கள்: 13.0 g/dL)\n• தானங்களுக்கு இடையில் 56 நாட்கள் (ஆண்கள்) அல்லது 84 நாட்கள் (பெண்கள்) காத்திருக்க வேண்டும்\n• கடந்த 3 மாதங்களில் தானம் செய்யாதிருக்க வேண்டும்\n• கடந்த 6 மாதங்களில் பச்சை அல்லது குத்துவதில்லை"
        }
    },

    // Blood Group Compatibility
    compatibility: {
        keywords: [
            "compatible", "compatibility", "receive", "give", "donate to", "accept from",
            "blood group", "type", "பொருந்தக்கூடிய", "எந்த இரத்த வகை", "எடுக்கலாம்",
            "கொடுக்கலாம்", "இரத்த வகை"
        ],
        responses: {
            en: "Blood Group Compatibility:\n• O- can donate to: All (Universal Donor)\n• O+ can donate to: O+, A+, B+, AB+\n• A- can donate to: A-, A+, AB-, AB+\n• A+ can donate to: A+, AB+\n• B- can donate to: B-, B+, AB-, AB+\n• B+ can donate to: B+, AB+\n• AB- can donate to: AB-, AB+\n• AB+ can donate to: AB+ (Universal Recipient)\n• AB+ can receive from: All blood types",
            ta: "இரத்த வகை பொருந்தக்கூடிய தன்மை:\n• O- தானம் செய்ய முடியும்: அனைவருக்கும் (உலகளாவிய தானம் செய்பவர்)\n• O+ தானம் செய்ய முடியும்: O+, A+, B+, AB+\n• A- தானம் செய்ய முடியும்: A-, A+, AB-, AB+\n• A+ தானம் செய்ய முடியும்: A+, AB+\n• B- தானம் செய்ய முடியும்: B-, B+, AB-, AB+\n• B+ தானம் செய்ய முடியும்: B+, AB+\n• AB- தானம் செய்ய முடியும்: AB-, AB+\n• AB+ தானம் செய்ய முடியும்: AB+ (உலகளாவிய பெறுநர்)\n• AB+ எடுக்க முடியும்: அனைத்து இரத்த வகைகளிலிருந்தும்"
        }
    },

    // Emergency Procedures - Enhanced
    emergency: {
        keywords: [
            "emergency", "urgent", "need blood", "request", "how to", "procedure", "process",
            "steps", "அவசர", "தேவை", "கோரிக்கை", "எப்படி", "நடைமுறை", "படிகள்",
            "இரத்தம் தேவை", "அவசரமாக", "உடனடி"
        ],
        responses: {
            en: "Emergency Blood Request Procedure:\n1. Click on 'Blood Requests' in the navigation\n2. Fill in the required details:\n   - Blood type needed\n   - Hospital name and location\n   - District and Union (for precise matching)\n   - Contact information\n3. Submit the request (Admin login required)\n4. The system will automatically search for matching donors\n5. Matching donors will be notified via email\n6. Contact donors directly using provided contact details\n7. For immediate help, call emergency services: 108\n8. You can also search for donors directly on 'Find Donors' page",
            ta: "அவசர இரத்த கோரிக்கை நடைமுறை:\n1. வழிசெலுத்தலில் 'இரத்த கோரிக்கைகள்' என்பதை கிளிக் செய்யவும்\n2. தேவையான விவரங்களை நிரப்பவும்:\n   - தேவையான இரத்த வகை\n   - மருத்துவமனை பெயர் மற்றும் இடம்\n   - மாவட்டம் மற்றும் ஒன்றியம் (துல்லியமான பொருத்தத்திற்கு)\n   - தொடர்பு தகவல்\n3. கோரிக்கையை சமர்ப்பிக்கவும் (நிர்வாகி உள்நுழைவு தேவை)\n4. கணினி தானாக பொருந்தக்கூடிய தானம் செய்பவர்களை தேடும்\n5. பொருந்தக்கூடிய தானம் செய்பவர்களுக்கு மின்னஞ்சல் மூலம் அறிவிக்கப்படும்\n6. வழங்கப்பட்ட தொடர்பு விவரங்களைப் பயன்படுத்தி தானம் செய்பவர்களை நேரடியாக தொடர்பு கொள்ளவும்\n7. உடனடி உதவிக்கு, அவசர சேவைகளை அழைக்கவும்: 108\n8. நீங்கள் 'தானம் செய்பவர்களை கண்டுபிடி' பக்கத்தில் நேரடியாக தேடலாம்"
        }
    },

    // Location Search
    location: {
        keywords: [
            "search", "find", "location", "district", "union", "nearby", "where",
            "how to search", "தேடு", "கண்டுபிடி", "இடம்", "மாவட்டம்", "ஒன்றியம்",
            "அருகில்", "எங்கே", "எப்படி தேடுவது"
        ],
        responses: {
            en: "How to Search for Donors by Location:\n1. Go to 'Find Donors' page\n2. Select your blood type requirement\n3. Choose the district from dropdown (38 districts available)\n4. Select the union within that district (388 unions total)\n5. Click 'Search'\n6. View matching donors with contact details\n7. The system uses Tamil Nadu's district-union structure for precise location matching\n8. You can search by blood type only, or combine with location for better results",
            ta: "இடத்தின் அடிப்படையில் தானம் செய்பவர்களை எவ்வாறு தேடுவது:\n1. 'தானம் செய்பவர்களை கண்டுபிடி' பக்கத்திற்கு செல்லவும்\n2. உங்கள் இரத்த வகை தேவையை தேர்ந்தெடுக்கவும்\n3. டிராப்டவுனிலிருந்து மாவட்டத்தை தேர்ந்தெடுக்கவும் (38 மாவட்டங்கள் கிடைக்கின்றன)\n4. அந்த மாவட்டத்திற்குள் ஒன்றியத்தை தேர்ந்தெடுக்கவும் (மொத்தம் 388 ஒன்றியங்கள்)\n5. 'தேடு' என்பதை கிளிக் செய்யவும்\n6. தொடர்பு விவரங்களுடன் பொருந்தக்கூடிய தானம் செய்பவர்களை பார்க்கவும்\n7. கணினி துல்லியமான இட பொருத்தத்திற்கு தமிழ்நாட்டின் மாவட்ட-ஒன்றிய அமைப்பைப் பயன்படுத்துகிறது\n8. நீங்கள் இரத்த வகை மட்டும் தேடலாம் அல்லது சிறந்த முடிவுகளுக்கு இடத்துடன் இணைக்கலாம்"
        }
    },

    // General Information
    general: {
        keywords: [
            "what", "information", "about", "blood donation", "benefits", "why", "importance",
            "help", "என்ன", "தகவல்", "பற்றி", "இரத்த தானம்", "நன்மைகள்", "ஏன்",
            "முக்கியத்துவம்", "உதவி"
        ],
        responses: {
            en: "Blood Donation - General Information:\n• Blood donation saves lives and helps patients in critical need\n• One donation can save up to 3 lives\n• Regular donation promotes heart health and reduces cancer risk\n• It's a safe process with minimal side effects\n• Donors receive a free health checkup (BP, hemoglobin, etc.)\n• The body replenishes donated blood within 24-48 hours\n• You can donate every 56 days (males) or 84 days (females)\n• No risk of contracting diseases - sterile equipment is used\n• Join our platform to become a registered donor and help save lives!\n• Your donation makes a real difference in someone's life",
            ta: "இரத்த தானம் - பொதுவான தகவல்:\n• இரத்த தானம் வாழ்க்கைகளை காப்பாற்றுகிறது மற்றும் முக்கிய தேவையில் உள்ள நோயாளிகளுக்கு உதவுகிறது\n• ஒரு தானம் 3 வாழ்க்கைகளை வரை காப்பாற்ற முடியும்\n• வழக்கமான தானம் இதய ஆரோக்கியத்தை மேம்படுத்துகிறது மற்றும் புற்றுநோய் அபாயத்தை குறைக்கிறது\n• இது குறைந்த பக்க விளைவுகளுடன் பாதுகாப்பான செயல்முறை\n• தானம் செய்பவர்கள் இலவச ஆரோக்கிய பரிசோதனையைப் பெறுகிறார்கள் (BP, ஹீமோகுளோபின், முதலியன)\n• உடல் 24-48 மணி நேரத்திற்குள் தானம் செய்யப்பட்ட இரத்தத்தை நிரப்புகிறது\n• நீங்கள் ஒவ்வொரு 56 நாட்களுக்கும் (ஆண்கள்) அல்லது 84 நாட்களுக்கும் (பெண்கள்) தானம் செய்யலாம்\n• நோய்களைப் பெறுவதற்கான அபாயம் இல்லை - மலட்டு உபகரணங்கள் பயன்படுத்தப்படுகின்றன\n• பதிவு செய்யப்பட்ட தானம் செய்பவராக மாறி வாழ்க்கைகளை காப்பாற்ற உதவ எங்கள் தளத்தில் சேரவும்!\n• உங்கள் தானம் ஒருவரின் வாழ்க்கையில் உண்மையான மாற்றத்தை ஏற்படுத்துகிறது"
        }
    },

    // After Donation Care
    afterDonation: {
        keywords: [
            "after donation", "care", "what to do", "recovery", "rest", "food", "drink",
            "தானத்திற்கு பிறகு", "பராமரிப்பு", "என்ன செய்ய", "மீட்பு", "ஓய்வு", "உணவு", "குடிக்க"
        ],
        responses: {
            en: "After Blood Donation Care:\n• Rest for 10-15 minutes after donation\n• Drink plenty of fluids (water, juice)\n• Avoid heavy lifting for 24 hours\n• Keep the bandage on for 4-6 hours\n• Avoid alcohol for 24 hours\n• Eat iron-rich foods (leafy greens, beans, meat)\n• If you feel dizzy, lie down with feet elevated\n• Contact the blood bank if you experience any complications\n• You can resume normal activities after resting",
            ta: "இரத்த தானத்திற்கு பிறகு பராமரிப்பு:\n• தானத்திற்கு பிறகு 10-15 நிமிடங்கள் ஓய்வெடுக்கவும்\n• நிறைய திரவங்கள் குடிக்கவும் (நீர், சாறு)\n• 24 மணி நேரம் கனமான எடையைத் தூக்குவதைத் தவிர்க்கவும்\n• 4-6 மணி நேரம் பேண்டேஜை வைத்திருங்கள்\n• 24 மணி நேரம் மது அருந்துவதைத் தவிர்க்கவும்\n• இரும்பு நிறைந்த உணவுகளை சாப்பிடவும் (இலை காய்கறிகள், பீன்ஸ், இறைச்சி)\n• தலைசுற்றல் இருந்தால், கால்களை உயர்த்தி படுத்துக்கொள்ளுங்கள்\n• எந்த சிக்கல்களும் ஏற்பட்டால் இரத்த வங்கியைத் தொடர்பு கொள்ளவும்\n• ஓய்வெடுத்த பிறகு நீங்கள் சாதாரண செயல்பாடுகளை மீண்டும் தொடங்கலாம்"
        }
    },

    // Registration Help
    registration: {
        keywords: [
            "register", "registration", "sign up", "how to register", "become donor",
            "பதிவு", "பதிவு செய்ய", "எப்படி பதிவு", "தானம் செய்பவராக", "சேர"
        ],
        responses: {
            en: "How to Register as a Blood Donor:\n1. Click on 'Register as Donor' in the navigation\n2. Fill in all required fields:\n   - Name, Contact, Email\n   - Blood Type, Gender, Age, Weight\n   - Select your District and Union\n3. Click 'Submit'\n4. You'll receive a confirmation email\n5. Your registration will be saved in our database\n6. You can now be found by people searching for your blood type\n7. Thank you for joining our life-saving community!",
            ta: "இரத்த தானம் செய்பவராக பதிவு செய்வது எப்படி:\n1. வழிசெலுத்தலில் 'தானம் செய்பவராக பதிவு செய்ய' என்பதை கிளிக் செய்யவும்\n2. அனைத்து தேவையான புலங்களையும் நிரப்பவும்:\n   - பெயர், தொடர்பு, மின்னஞ்சல்\n   - இரத்த வகை, பாலினம், வயது, எடை\n   - உங்கள் மாவட்டம் மற்றும் ஒன்றியத்தை தேர்ந்தெடுக்கவும்\n3. 'சமர்ப்பி' என்பதை கிளிக் செய்யவும்\n4. உங்களுக்கு உறுதிப்படுத்தல் மின்னஞ்சல் வரும்\n5. உங்கள் பதிவு எங்கள் தரவுத்தளத்தில் சேமிக்கப்படும்\n6. உங்கள் இரத்த வகையை தேடும் மக்களால் இப்போது கண்டுபிடிக்க முடியும்\n7. எங்கள் வாழ்க்கை காப்பாற்றும் சமூகத்தில் சேர்ந்ததற்கு நன்றி!"
        }
    },

    // Default/Greeting
    greeting: {
        keywords: [
            "hello", "hi", "hey", "help", "start", "வணக்கம்", "ஹலோ", "உதவி",
            "தொடங்க", "என்ன உதவி"
        ],
        responses: {
            en: "Hello! 👋 I'm your AI Blood Donation Assistant. I can help you with:\n\n• Donor eligibility requirements\n• Blood group compatibility\n• Emergency blood request procedures\n• Location-based donor search\n• Registration process\n• After-donation care\n• General blood donation information\n\nWhat would you like to know? Just ask me in English or Tamil!",
            ta: "வணக்கம்! 👋 நான் உங்கள் AI இரத்த தானம் உதவியாளர். நான் உங்களுக்கு உதவ முடியும்:\n\n• தானம் செய்பவர் தகுதி தேவைகள்\n• இரத்த வகை பொருந்தக்கூடிய தன்மை\n• அவசர இரத்த கோரிக்கை நடைமுறைகள்\n• இட அடிப்படையிலான தானம் செய்பவர் தேடல்\n• பதிவு செயல்முறை\n• தானத்திற்கு பிறகு பராமரிப்பு\n• பொதுவான இரத்த தானம் தகவல்\n\nநீங்கள் என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்? ஆங்கிலம் அல்லது தமிழில் என்னிடம் கேளுங்கள்!"
        }
    }
};

// Chatbot class with Google Sheets integration
class BloodDonationChatbot {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.conversationHistory = [];
        this.knowledgeBase = FALLBACK_KNOWLEDGE_BASE;
        this.loadKnowledgeFromSheets();
    }

    // Load knowledge base from Google Sheets
    async loadKnowledgeFromSheets() {
        if (typeof apiClient === 'undefined') {
            console.warn("Chatbot: apiClient is undefined, using fallback.");
            return;
        }

        try {
            const response = await apiClient.getChatbotKnowledge();

            // Check if response is valid and has knowledge
            if (response && response.success && response.knowledge && Object.keys(response.knowledge).length > 0) {
                this.knowledgeBase = response.knowledge;
                console.log("Chatbot: Knowledge loaded from Sheets");
            } else {
                // FAIL SILENTLY: Keep using the fallback knowledge base
                console.warn("Chatbot: Using local fallback knowledge (API returned empty)");
            }
        } catch (error) {
            console.error("Chatbot: API Error, using fallback.", error);
            // Do nothing, so it stays on FALLBACK_KNOWLEDGE_BASE
        }
    }

    // Detect if query is in Tamil
    isTamilQuery(query) {
        const tamilPattern = /[\u0B80-\u0BFF]/;
        return tamilPattern.test(query);
    }

    // Analyze user query using keyword matching (supports both languages)
    analyzeQuery(query) {
        const lowerQuery = query.toLowerCase().trim();

        // Auto-detect language from query
        if (this.isTamilQuery(query)) {
            this.currentLanguage = 'ta';
        }

        // Check each knowledge base category
        for (const [category, data] of Object.entries(this.knowledgeBase)) {
            for (const keyword of data.keywords) {
                if (lowerQuery.includes(keyword.toLowerCase()) || query.includes(keyword)) {
                    return category;
                }
            }
        }

        return 'greeting'; // Default response
    }

    // Get response based on category
    getResponse(query) {
        const category = this.analyzeQuery(query);
        const response = this.knowledgeBase[category].responses[this.currentLanguage] ||
            this.knowledgeBase[category].responses['en'];

        // Store in conversation history
        this.conversationHistory.push({
            query: query,
            response: response,
            category: category,
            timestamp: new Date().toISOString()
        });

        return response;
    }

    // Set language
    setLanguage(lang) {
        this.currentLanguage = lang;
    }

    // Get conversation history
    getHistory() {
        return this.conversationHistory;
    }

    // Clear history
    clearHistory() {
        this.conversationHistory = [];
    }
}

// Initialize chatbot
const chatbot = new BloodDonationChatbot();

// Chatbot UI functions
function initChatbot() {
    const chatContainer = document.getElementById('chatbot-container');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn = document.getElementById('chatbot-close');

    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessageToChat(message, 'user');
        chatInput.value = '';

        // Get bot response
        setTimeout(() => {
            const response = chatbot.getResponse(message);
            addMessageToChat(response, 'bot');
        }, 500);
    }

    // Add message to chat
    function addMessageToChat(text, sender) {
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;

        // Preserve line breaks
        textDiv.style.whiteSpace = 'pre-line';

        messageDiv.appendChild(textDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Event listeners
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Toggle chatbot
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (chatContainer) {
                chatContainer.classList.toggle('hidden');
                if (!chatContainer.classList.contains('hidden')) {
                    chatInput?.focus();
                }
            }
        });
    }

    // Close chatbot
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (chatContainer) {
                chatContainer.classList.add('hidden');
            }
        });
    }

    // Initialize with greeting
    if (chatMessages && chatMessages.children.length === 0) {
        const greeting = chatbot.knowledgeBase.greeting.responses[chatbot.currentLanguage];
        addMessageToChat(greeting, 'bot');
    }

    // Hook into global language switcher
    if (typeof window.setLanguage === 'function') {
        const originalSetLanguage = window.setLanguage;
        window.setLanguage = function (lang) {
            originalSetLanguage(lang);
            chatbot.setLanguage(lang);
        };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}
