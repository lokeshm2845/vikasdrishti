/**
 * SpeechToTextService - On-Device Voice Complaint Filing Engine
 * Uses Android Native / Web Speech API with Offline Regional Speech Models.
 */

class SpeechToTextEngine {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.initRecognition();
    }

    initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.maxAlternatives = 1;
        } else {
            console.warn('Speech Recognition API not supported natively on this browser window.');
        }
    }

    isSupported() {
        return !!this.recognition;
    }

    /**
     * Listens to speech input in target Indian language
     * @param {string} langCode - 'hi-IN', 'mr-IN', 'en-IN', 'ta-IN', 'te-IN', etc.
     * @param {Function} onTranscript - Callback for interim/final result
     * @param {Function} onError - Error callback
     */
    startListening(langCode = 'hi-IN', onTranscript, onError) {
        if (!this.recognition) {
            if (onError) onError('Speech Recognition is not available on this device');
            return;
        }

        this.recognition.lang = langCode;
        this.isListening = true;

        this.recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            if (onTranscript) {
                onTranscript({
                    transcript,
                    isFinal: event.results[event.results.length - 1].isFinal
                });
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            if (onError) onError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };

        try {
            this.recognition.start();
            console.log(`🎙️ Voice Recognition started in ${langCode}`);
        } catch (e) {
            console.error('Error starting recognition:', e);
            if (onError) onError(e.message);
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            console.log('🎙️ Voice Recognition stopped.');
        }
    }
}

export const speechToTextService = new SpeechToTextEngine();
