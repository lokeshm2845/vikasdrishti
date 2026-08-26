import { bhashiniOfflineService } from './bhashiniOfflineService';

export const translateService = {
    async translateToHindi(text) {
        if (!navigator.onLine) {
            const res = await bhashiniOfflineService.translate(text, 'hi', 'en');
            return res.translatedText;
        }
        const res = await bhashiniOfflineService.translate(text, 'hi', 'en');
        return res.translatedText;
    },

    async translate(text, targetLang = 'hi', sourceLang = 'en') {
        const res = await bhashiniOfflineService.translate(text, targetLang, sourceLang);
        return res.translatedText;
    },

    getCategoryInLanguage(category, language) {
        if (!category || language === 'en') return category;

        const categoryMap = {
            'pothole': { 'hi': 'गड्ढा', 'mr': 'खड्डा', 'pa': 'ਟੋਆ', 'bn': 'গর্ত', 'te': 'గుంత', 'gu': 'ખાડો' },
            'streetlight': { 'hi': 'स्ट्रीट लाइट', 'mr': 'पथदिवे', 'pa': 'ਸਟਰੀਟ ਲਾਈਟ', 'bn': 'রাস্তার বাতি', 'te': 'వీధి దీపం' },
            'garbage': { 'hi': 'कचरा', 'mr': 'कचरा', 'pa': 'ਕੂੜਾ', 'bn': 'আবর্জনা', 'te': 'చెత్త' },
            'sewage': { 'hi': 'सीवेज', 'mr': 'गटार', 'pa': 'ਸੀਵਰੇਜ', 'bn': 'নর্দমা', 'te': 'మురుగునీరు' },
            'water_supply': { 'hi': 'पानी की आपूर्ति', 'mr': 'पाणी पुरवठा', 'pa': 'ਪਾਣੀ', 'bn': 'জল সরবরাহ' }
        };

        const langMap = categoryMap[category];
        return (langMap && langMap[language]) ? langMap[language] : category;
    },

    detectLanguage(text) {
        if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Hindi / Marathi Devanagari script
        if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'; // Punjabi
        if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
        if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
        if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
        if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'; // Gujarati

        return 'en';
    }
};