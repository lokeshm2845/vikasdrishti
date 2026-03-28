import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { translateService } from '../../services/translationService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { FaCamera, FaMapMarkerAlt, FaLanguage } from 'react-icons/fa';
import { supabase } from '../../services/supabaseClient';

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
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setFormData({...formData, photo: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }, [formData]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxFiles: 1
    });

    const getCurrentLocation = () => {
        setGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    });
                    toast.success('Location captured!');
                    setGettingLocation(false);
                },
                (error) => {
                    toast.error('Could not get location. Please enter manually.');
                    setGettingLocation(false);
                }
            );
        } else {
            toast.error('Geolocation not supported');
            setGettingLocation(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData) {
            toast.error('Please login first');
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            // Detect language if not specified
            const detectedLang = translateService.detectLanguage(formData.description);

            // Generate unique complaint ID
            const complaintId = `CMP${Date.now()}${Math.floor(Math.random() * 1000)}`;

            // Prepare complaint data with proper geometry format
            const complaintData = {
                complaint_id: complaintId,
                user_id: userData.id,
                title: formData.title,
                description: formData.description,
                category: formData.category,
                severity: formData.severity,
                original_language: detectedLang,
                status: 'pending'
            };

            // Handle location - FIXED: Proper geometry format for PostGIS
            if (formData.location && formData.location.lat && formData.location.lng) {
                complaintData.latitude = formData.location.lat;
                complaintData.longitude = formData.location.lng;
                // POINT format: longitude first, then latitude (this is the correct format for PostGIS)
                const pointWKT = `POINT(${formData.location.lng} ${formData.location.lat})`;
                complaintData.location = pointWKT;
            }

            // Handle photo
            if (photoPreview) {
                complaintData.photo_url = photoPreview;
            }

            console.log('Submitting complaint:', complaintData);

            // Insert directly into Supabase
            const { data, error } = await supabase
                .from('complaints')
                .insert([complaintData])
                .select();

            if (error) {
                console.error('Supabase error:', error);
                
                // Show specific error message for geometry issues
                if (error.message && error.message.includes('geometry')) {
                    toast.error('Location format error. Please try getting location again.');
                } else {
                    toast.error(error.message || 'Failed to raise complaint');
                }
                return;
            }

            toast.success('Complaint raised successfully!');
            navigate('/user/my-complaints');
            
        } catch (error) {
            console.error('Error details:', error);
            toast.error(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📢 Raise a Complaint</h1>
                <p style={styles.subtitle}>
                    Report issues in your area - we'll notify the concerned leader
                </p>
            </div>

            <div style={styles.card}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Language Selector */}
                    <div style={styles.languageSelector}>
                        <FaLanguage style={styles.icon} />
                        <select
                            value={formData.language}
                            onChange={(e) => setFormData({...formData, language: e.target.value})}
                            style={styles.select}
                        >
                            <option value="hi">हिन्दी (Hindi)</option>
                            <option value="en">English</option>
                            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                            <option value="bn">বাংলা (Bengali)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                        </select>
                    </div>

                    {/* Category */}
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        style={styles.input}
                        required
                    >
                        <option value="pothole">🕳️ Pothole / गड्ढा</option>
                        <option value="streetlight">💡 Streetlight / स्ट्रीट लाइट</option>
                        <option value="garbage">🗑️ Garbage / कचरा</option>
                        <option value="sewage">💧 Sewage / सीवेज</option>
                        <option value="water">🚰 Water Supply / पानी</option>
                        <option value="road">🛣️ Road Damage / सड़क</option>
                        <option value="other">📌 Other / अन्य</option>
                    </select>

                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Title / शीर्षक"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        style={styles.input}
                        required
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Describe the problem in your language / अपनी भाषा में समस्या बताएं"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        style={styles.textarea}
                        rows="5"
                        required
                    />

                    {/* Severity */}
                    <div style={styles.severityContainer}>
                        <label style={styles.label}>Severity / गंभीरता:</label>
                        <div style={styles.severityOptions}>
                            <label style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="severity"
                                    value="low"
                                    checked={formData.severity === 'low'}
                                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                                />
                                Low / कम
                            </label>
                            <label style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="severity"
                                    value="medium"
                                    checked={formData.severity === 'medium'}
                                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                                />
                                Medium / मध्यम
                            </label>
                            <label style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="severity"
                                    value="high"
                                    checked={formData.severity === 'high'}
                                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                                />
                                High / गंभीर
                            </label>
                        </div>
                    </div>

                    {/* Location */}
                    <div style={styles.locationContainer}>
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={gettingLocation}
                            style={styles.locationButton}
                        >
                            <FaMapMarkerAlt /> 
                            {gettingLocation ? 'Getting location...' : 'Get Current Location'}
                        </button>
                        {formData.location && (
                            <span style={styles.locationSuccess}>
                                ✅ Location captured: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                            </span>
                        )}
                    </div>

                    {/* Photo Upload */}
                    <div {...getRootProps()} style={styles.dropzone}>
                        <input {...getInputProps()} />
                        {photoPreview ? (
                            <div style={styles.previewContainer}>
                                <img src={photoPreview} alt="Preview" style={styles.preview} />
                                <p style={styles.previewText}>Click to change photo</p>
                            </div>
                        ) : (
                            <div style={styles.dropzoneContent}>
                                <FaCamera size={40} color="#999" />
                                <p>Drag & drop a photo, or click to select</p>
                                <p style={styles.dropzoneHint}>Upload photo of the problem</p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={loading ? styles.buttonDisabled : styles.button}
                    >
                        {loading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    title: {
        color: '#FF9933',
        fontSize: '32px',
        marginBottom: '10px'
    },
    subtitle: {
        color: '#666',
        fontSize: '16px'
    },
    card: {
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    languageSelector: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#f8f9fa',
        padding: '10px',
        borderRadius: '8px'
    },
    icon: {
        color: '#666'
    },
    select: {
        flex: 1,
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '15px'
    },
    input: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.3s'
    },
    textarea: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.3s',
        resize: 'vertical',
        fontFamily: 'inherit'
    },
    severityContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    label: {
        fontSize: '15px',
        color: '#333',
        fontWeight: '500'
    },
    severityOptions: {
        display: 'flex',
        gap: '20px'
    },
    radioLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '14px',
        color: '#666'
    },
    locationContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap'
    },
    locationButton: {
        padding: '12px 20px',
        background: '#138808',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    locationSuccess: {
        color: '#138808',
        fontSize: '14px'
    },
    dropzone: {
        border: '2px dashed #ddd',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.3s',
        background: '#f8f9fa'
    },
    dropzoneContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
    },
    dropzoneHint: {
        color: '#999',
        fontSize: '13px'
    },
    previewContainer: {
        position: 'relative'
    },
    preview: {
        maxWidth: '100%',
        maxHeight: '200px',
        borderRadius: '8px'
    },
    previewText: {
        marginTop: '10px',
        color: '#666',
        fontSize: '14px'
    },
    button: {
        background: '#FF9933',
        color: 'white',
        padding: '15px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s',
        marginTop: '10px'
    },
    buttonDisabled: {
        background: '#ccc',
        color: '#666',
        padding: '15px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'not-allowed',
        marginTop: '10px'
    }
};

export default RaiseComplaint;