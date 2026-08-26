import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { translateService } from '../../services/translationService';
import { speechToTextService } from '../../services/speechToTextService';
import { tfliteClassifier } from '../../services/tfliteClassifier';
import { nativeDeviceService } from '../../services/nativeDeviceService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { FaCamera, FaMapMarkerAlt, FaLanguage, FaMicrophone, FaRobot, FaWifi } from 'react-icons/fa';

const RaiseComplaint = () => {
    const { userData } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'pothole',
        severity: 'medium',
        language: 'hi',
        location: null,
        photo: null
    });

    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoMetadata, setPhotoMetadata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [aiCategoryResult, setAiCategoryResult] = useState(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // On-device TFLite auto categorization whenever text changes
    useEffect(() => {
        if (formData.description.length > 5) {
            tfliteClassifier.classifyText(formData.description).then(res => {
                setAiCategoryResult(res);
                if (res.confidence > 0.70 && res.category !== 'other') {
                    setFormData(prev => ({ ...prev, category: res.category }));
                }
            });
        }
    }, [formData.description]);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setFormData(prev => ({ ...prev, photo: file }));
        const processed = await nativeDeviceService.processCameraImage(file);
        setPhotoPreview(processed.compressedDataUrl);
        setPhotoMetadata(processed);
        toast.success(`📸 Photo captured via iQOO 50MP Camera (${processed.compressedSizeMb}MB compressed)`);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
        maxFiles: 1
    });

    const getCurrentLocation = async () => {
        setGettingLocation(true);
        try {
            const loc = await nativeDeviceService.getHighPrecisionLocation();
            setFormData(prev => ({
                ...prev,
                location: { lat: loc.latitude, lng: loc.longitude, accuracy: loc.accuracy }
            }));
            toast.success(`🎯 Dual-GPS Location Captured (±${loc.accuracy}m)!`);
        } catch (err) {
            toast.error('Location error: ' + err.message);
        } finally {
            setGettingLocation(false);
        }
    };

    const toggleVoiceInput = () => {
        if (isListening) {
            speechToTextService.stopListening();
            setIsListening(false);
        } else {
            const langCode = formData.language === 'hi' ? 'hi-IN' : formData.language === 'mr' ? 'mr-IN' : 'en-IN';
            setIsListening(true);
            toast('🎙️ Speak now in your language...');
            speechToTextService.startListening(
                langCode,
                (res) => {
                    setFormData(prev => ({
                        ...prev,
                        description: prev.description + (prev.description ? ' ' : '') + res.transcript,
                        title: prev.title || res.transcript.substring(0, 40)
                    }));
                    if (res.isFinal) setIsListening(false);
                },
                (err) => {
                    toast.error('Voice input error: ' + err);
                    setIsListening(false);
                }
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const detectedLang = translateService.detectLanguage(formData.description);

            const complaintData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                severity: formData.severity,
                language: detectedLang,
                latitude: formData.location ? formData.location.lat : null,
                longitude: formData.location ? formData.location.lng : null,
                photoUrl: photoPreview
            };

            const result = await complaintService.raiseComplaint(complaintData, userData || { id: 'offline_user' });

            if (result.success) {
                if (result.isOffline) {
                    toast.success('📱 Offline Mode: Saved to iQOO 15 Local Storage. Will sync when online!', { duration: 5000 });
                } else {
                    toast.success('🎉 Complaint raised successfully!');
                }
                navigate('/user/my-complaints');
            } else {
                toast.error(result.error || 'Failed to raise complaint');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📢 Raise a Complaint (iQOO 15 AI-Native)</h1>
                <p style={styles.subtitle}>Phone-First Governance Platform • Works 100% Offline</p>

                {isOffline ? (
                    <div style={styles.offlineBadge}>
                        <FaWifi style={{ transform: 'rotate(45deg)' }} /> 📱 Offline Mode Active • iQOO 15 Local SQLite/IndexedDB Storage
                    </div>
                ) : (
                    <div style={styles.onlineBadge}>
                        <FaWifi /> 🌐 Online • Supabase Sync Active
                    </div>
                )}
            </div>

            <div style={styles.card}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.languageSelector}>
                        <FaLanguage style={styles.icon} />
                        <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} style={styles.select}>
                            <option value="hi">हिन्दी (Hindi - Bhashini Offline)</option>
                            <option value="mr">मराठी (Marathi - Bhashini Offline)</option>
                            <option value="gu">ગુજરાતી (Gujarati)</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="en">English</option>
                        </select>
                    </div>

                    <div style={styles.categoryHeader}>
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={styles.input} required>
                            <option value="pothole">🕳️ Pothole / खड्डा / गड्ढा</option>
                            <option value="streetlight">💡 Streetlight / पथदिवे / स्ट्रीट लाइट</option>
                            <option value="garbage">🗑️ Garbage / कचरा</option>
                            <option value="sewage">💧 Sewage / सीवेज / गटार</option>
                            <option value="water">🚰 Water Supply / पानी</option>
                            <option value="road">🛣️ Road Damage / सड़क</option>
                            <option value="other">📌 Other / अन्य</option>
                        </select>

                        {aiCategoryResult && (
                            <div style={styles.aiBadge}>
                                <FaRobot /> TFLite Auto-Categorized: <b>{aiCategoryResult.category}</b> ({aiCategoryResult.processingTimeMs}ms)
                            </div>
                        )}
                    </div>

                    <input type="text" placeholder="Title / शीर्षक" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={styles.input} required />

                    <div style={styles.voiceTextContainer}>
                        <textarea placeholder="Describe the issue... (Click microphone for offline voice filing)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={styles.textarea} rows="4" required />
                        <button type="button" onClick={toggleVoiceInput} style={isListening ? styles.micActiveBtn : styles.micBtn} title="Click to talk (Offline STT)">
                            <FaMicrophone size={20} /> {isListening ? 'Listening...' : 'Voice AI'}
                        </button>
                    </div>

                    <div style={styles.severityContainer}>
                        <label style={styles.label}>Severity / गंभीरता:</label>
                        <div style={styles.severityOptions}>
                            <label style={styles.radioLabel}><input type="radio" name="severity" value="low" checked={formData.severity === 'low'} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} /> Low / कम</label>
                            <label style={styles.radioLabel}><input type="radio" name="severity" value="medium" checked={formData.severity === 'medium'} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} /> Medium / मध्यम</label>
                            <label style={styles.radioLabel}><input type="radio" name="severity" value="high" checked={formData.severity === 'high'} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} /> High / गंभीर</label>
                        </div>
                    </div>

                    <div style={styles.locationContainer}>
                        <button type="button" onClick={getCurrentLocation} disabled={gettingLocation} style={styles.locationButton}>
                            <FaMapMarkerAlt /> {gettingLocation ? 'Acquiring GPS...' : 'iQOO Dual-GPS Location'}
                        </button>
                        {formData.location && (
                            <span style={styles.locationSuccess}>
                                🎯 Lat: {formData.location.lat.toFixed(4)}, Lng: {formData.location.lng.toFixed(4)} (±{formData.location.accuracy}m)
                            </span>
                        )}
                    </div>

                    <div {...getRootProps()} style={styles.dropzone}>
                        <input {...getInputProps()} />
                        {photoPreview ? (
                            <div style={styles.previewContainer}>
                                <img src={photoPreview} alt="Preview" style={styles.preview} />
                                {photoMetadata && (
                                    <p style={styles.previewMeta}>
                                        📷 Sensor: {photoMetadata.cameraSensor} • Size: {photoMetadata.compressedSizeMb}MB
                                    </p>
                                )}
                                <p style={styles.previewText}>Click to retake / change photo</p>
                            </div>
                        ) : (
                            <div style={styles.dropzoneContent}>
                                <FaCamera size={36} color="#0066CC" />
                                <p style={{ fontWeight: 'bold' }}>Capture Photo (50MP iQOO Camera)</p>
                                <p style={styles.dropzoneHint}>Auto client-side compression & EXIF geolocation tagging</p>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={loading} style={loading ? styles.buttonDisabled : styles.button}>
                        {loading ? 'Processing on iQOO 15...' : isOffline ? 'Save Offline (iQOO 15 Local Storage)' : 'Submit Complaint (Cloud Sync)'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '15px', maxWidth: '750px', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '20px' },
    title: { color: '#FF9933', fontSize: '26px', marginBottom: '6px' },
    subtitle: { color: '#666', fontSize: '14px' },
    offlineBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffeeba', color: '#856404', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginTop: '8px' },
    onlineBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#d4edda', color: '#155724', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginTop: '8px' },
    card: { background: 'white', borderRadius: '15px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    languageSelector: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f9fa', padding: '10px', borderRadius: '8px' },
    icon: { color: '#666' },
    select: { flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
    categoryHeader: { display: 'flex', flexDirection: 'column', gap: '6px' },
    aiBadge: { fontSize: '12px', background: '#e3f2fd', color: '#0d47a1', padding: '5px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
    input: { padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' },
    voiceTextContainer: { position: 'relative', display: 'flex', flexDirection: 'column' },
    textarea: { padding: '12px', paddingRight: '120px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' },
    micBtn: { position: 'absolute', right: '10px', top: '10px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
    micActiveBtn: { position: 'absolute', right: '10px', top: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', animation: 'pulse 1s infinite' },
    severityContainer: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '14px', color: '#333', fontWeight: '500' },
    severityOptions: { display: 'flex', gap: '20px' },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: '#666' },
    locationContainer: { display: 'flex', flexDirection: 'column', gap: '8px' },
    locationButton: { padding: '12px 18px', background: '#138808', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' },
    locationSuccess: { color: '#138808', fontSize: '13px', fontWeight: '500' },
    dropzone: { border: '2px dashed #0066CC', borderRadius: '10px', padding: '18px', textAlign: 'center', cursor: 'pointer', background: '#f4f8ff' },
    dropzoneContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
    dropzoneHint: { color: '#666', fontSize: '12px' },
    previewContainer: { position: 'relative' },
    preview: { maxWidth: '100%', maxHeight: '180px', borderRadius: '8px' },
    previewMeta: { fontSize: '12px', color: '#138808', fontWeight: 'bold', marginTop: '6px' },
    previewText: { marginTop: '4px', color: '#666', fontSize: '12px' },
    button: { background: '#FF9933', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' },
    buttonDisabled: { background: '#ccc', color: '#666', padding: '14px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'not-allowed', marginTop: '8px' }
};

export default RaiseComplaint;