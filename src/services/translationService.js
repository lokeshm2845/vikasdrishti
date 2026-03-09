// Simple translation service (mock for demo)
// In production, use Google Translate API or Bhashini

const translations = {
    'pothole': {
        'hi': 'गड्ढा',
        'pa': 'ਟੋਆ',
        'bn': 'গর্ত',
        'te': 'గుంత'
    },
    'streetlight': {
        'hi': 'स्ट्रीट लाइट',
        'pa': 'ਸਟਰੀਟ ਲਾਈਟ',
        'bn': 'রাস্তার বাতি',
        'te': 'వీధి దీపం'
    },
    'garbage': {
        'hi': 'कचरा',
        'pa': 'ਕੂੜਾ',
        'bn': 'আবর্জনা',
        'te': 'చెత్త'
    },
    'sewage': {
        'hi': 'सीवेज',
        'pa': 'ਸੀਵਰੇਜ',
        'bn': 'নর্দমা',
        'te': 'మురుగునీరు'
    }
};

export const translateService = {
    // Translate complaint text to Hindi (for leader)
    async translateToHindi(text) {
        // Mock translation - replace with actual API
        return text; // For demo, return original
    },

    // Translate complaint title based on category
   // Get category in local language
getCategoryInLanguage(category, language) {
    if (!category || language === 'en') return category;
    
    const categoryMap = {
        'pothole': { 'hi': 'गड्ढा', 'pa': 'ਟੋਆ', 'bn': 'গর্ত', 'te': 'గుంత' },
        'streetlight': { 'hi': 'स्ट्रीट लाइट', 'pa': 'ਸਟਰੀਟ ਲਾਈਟ', 'bn': 'রাস্তার বাতি', 'te': 'వీధి దీపం' },
        'garbage': { 'hi': 'कचरा', 'pa': 'ਕੂੜਾ', 'bn': 'আবর্জনা', 'te': 'చెత్త' },
        'sewage': { 'hi': 'सीवेज', 'pa': 'ਸੀਵਰੇਜ', 'bn': 'নর্দমা', 'te': 'మురుగునీరు' }
    };

    const langMap = categoryMap[category];
    return (langMap && langMap[language]) ? langMap[language] : category;
},

    // Detect language (simplified)
    detectLanguage(text) {
        // Check if text contains Devanagari (Hindi) characters
        if (/[\u0900-\u097F]/.test(text)) return 'hi';
        // Check if text contains Gurmukhi (Punjabi)
        if (/[\u0A00-\u0A7F]/.test(text)) return 'pa';
        // Check if text contains Bengali
        if (/[\u0980-\u09FF]/.test(text)) return 'bn';
        // Check if text contains Telugu
        if (/[\u0C00-\u0C7F]/.test(text)) return 'te';

        return 'en'; // Default to English
    }
};