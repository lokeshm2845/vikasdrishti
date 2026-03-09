// App constants

export const APP_NAME = 'VikasDrishti';
export const APP_TAGLINE = 'Hyper-Local Governance Platform';

// User roles
export const ROLES = {
    USER: 'user',
    LEADER: 'leader'
};

// Complaint categories
export const COMPLAINT_CATEGORIES = [
    { id: 'pothole', label: 'Pothole', icon: '🕳️', color: '#FF9933' },
    { id: 'streetlight', label: 'Streetlight', icon: '💡', color: '#FFD700' },
    { id: 'garbage', label: 'Garbage', icon: '🗑️', color: '#8B4513' },
    { id: 'sewage', label: 'Sewage', icon: '💧', color: '#4B0082' },
    { id: 'road', label: 'Road Damage', icon: '🛣️', color: '#808080' },
    { id: 'water', label: 'Water Supply', icon: '🚰', color: '#00BFFF' },
    { id: 'other', label: 'Other', icon: '📌', color: '#6B8E23' }
];

// Complaint status
export const COMPLAINT_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved'
};

// Status colors
export const STATUS_COLORS = {
    [COMPLAINT_STATUS.PENDING]: '#dc3545',
    [COMPLAINT_STATUS.IN_PROGRESS]: '#ffc107',
    [COMPLAINT_STATUS.RESOLVED]: '#28a745'
};

// Severity levels
export const SEVERITY_LEVELS = [
    { id: 'low', label: 'Low', color: '#28a745' },
    { id: 'medium', label: 'Medium', color: '#ffc107' },
    { id: 'high', label: 'High', color: '#dc3545' }
];

// Project types
export const PROJECT_TYPES = [
    { id: 'road', label: 'Road Repair', icon: '🛣️' },
    { id: 'streetlight', label: 'Streetlight', icon: '💡' },
    { id: 'sewer', label: 'Sewage/Drainage', icon: '💧' },
    { id: 'park', label: 'Park/Garden', icon: '🌳' },
    { id: 'school', label: 'School/Education', icon: '🏫' },
    { id: 'hospital', label: 'Hospital/Clinic', icon: '🏥' }
];

// Languages supported
export const LANGUAGES = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' }
];

// Default location (Delhi)
export const DEFAULT_LOCATION = {
    lat: 28.6139,
    lng: 77.2090,
    zoom: 12
};

// API endpoints
export const API = {
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY
};

// Local storage keys
export const STORAGE_KEYS = {
    THEME: 'vikasdrishti_theme',
    LANGUAGE: 'vikasdrishti_language',
    USER: 'vikasdrishti_user'
};

// Timeouts
export const TIMEOUTS = {
    NOTIFICATION_DURATION: 5000,
    TOAST_DURATION: 3000,
    API_TIMEOUT: 10000
};

// Pagination
export const PAGINATION = {
    ITEMS_PER_PAGE: 20,
    MAX_FILE_SIZE: 5 * 1024 * 1024 // 5MB
};

// File upload
export const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
];

// Map tile layers
export const MAP_TILES = {
    OSM: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    SATELLITE: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
};

// Error messages
export const ERROR_MESSAGES = {
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION: 'Please check your input and try again.',
    FILE_TOO_LARGE: 'File size should be less than 5MB.',
    INVALID_FILE_TYPE: 'Please upload a valid image file (JPEG, PNG, GIF).'
};

// Success messages
export const SUCCESS_MESSAGES = {
    COMPLAINT_RAISED: 'Complaint raised successfully!',
    COMPLAINT_UPDATED: 'Complaint status updated!',
    PROJECT_CREATED: 'Project created successfully!',
    NOTIFICATION_SENT: 'Notification sent successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!'
};