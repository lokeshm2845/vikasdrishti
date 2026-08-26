-- ==============================================================================
-- VIKASDRISHTI MASTER DATABASE SCHEMA (COMBINED & OPTIMIZED FOR iQOO 15 PLATFORM)
-- Includes PostGIS Spatial Engine, Civic Complaint Lifecycle, Geofences & Seeding
-- ==============================================================================

-- 1. Enable PostGIS Extension for Geofencing & Spatial Coordinates
CREATE EXTENSION IF NOT EXISTS postgis;

-- ==============================================================================
-- 1. USERS TABLE (Citizens who file complaints)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    auth_id TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    address TEXT,
    street_name TEXT,
    locality TEXT,
    city TEXT DEFAULT 'Delhi',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location GEOGRAPHY(POINT, 4326),
    preferred_language TEXT DEFAULT 'hi',
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 2. LEADERS TABLE (MLAs, Ward Representatives, Councilors)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.leaders (
    id SERIAL PRIMARY KEY,
    auth_id TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    title TEXT DEFAULT 'MLA',
    constituency TEXT NOT NULL,
    ward_number TEXT,
    party TEXT,
    profile_photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 3. PROJECTS TABLE (Development works by leaders)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    project_id TEXT UNIQUE NOT NULL,
    leader_id INTEGER REFERENCES public.leaders(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    project_type TEXT NOT NULL,
    description TEXT,
    street_name TEXT,
    locality TEXT,
    constituency TEXT,
    geofence GEOGRAPHY(POLYGON, 4326),
    before_photo_url TEXT,
    after_photo_url TEXT,
    cost_amount NUMERIC,
    start_date DATE,
    completion_date DATE,
    status TEXT DEFAULT 'planned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 4. COMPLAINTS TABLE (Issues raised by citizens on iQOO 15)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.complaints (
    id SERIAL PRIMARY KEY,
    complaint_id TEXT UNIQUE NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    leader_id INTEGER REFERENCES public.leaders(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    original_language TEXT DEFAULT 'hi',
    translated_description TEXT,
    category TEXT DEFAULT 'pothole',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location GEOGRAPHY(POINT, 4326),
    photo_url TEXT,
    status TEXT DEFAULT 'pending',
    severity TEXT DEFAULT 'medium',
    assigned_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    resolution_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 5. NOTIFICATIONS TABLE (SMS & Push Notifications)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id SERIAL PRIMARY KEY,
    notification_id TEXT UNIQUE NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    leader_id INTEGER REFERENCES public.leaders(id) ON DELETE CASCADE,
    complaint_id INTEGER REFERENCES public.complaints(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    channel TEXT DEFAULT 'sms',
    message TEXT NOT NULL,
    message_hindi TEXT,
    phone_number TEXT,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 6. FEEDBACK TABLE (User Ratings & Satisfaction)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.feedback (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES public.complaints(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 7. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_complaints_location ON public.complaints USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_projects_geofence ON public.projects USING GIST(geofence);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_leader ON public.complaints(leader_id);
CREATE INDEX IF NOT EXISTS idx_complaints_user ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);

-- Disable Row Level Security for smooth Hackathon prototyping
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback DISABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 8. SPATIAL FUNCTIONS (VOTERS & COMPLAINTS MATCHING)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.find_voters_in_polygon(polygon_wkt TEXT)
RETURNS TABLE (
    id INTEGER,
    name TEXT,
    phone TEXT,
    street_name TEXT,
    preferred_language TEXT
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.name,
        u.phone,
        u.street_name,
        u.preferred_language
    FROM public.users u
    WHERE ST_Within(
        u.location::geometry,
        ST_GeomFromText(polygon_wkt, 4326)::geometry
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.find_complaints_in_area(
    center_lat DOUBLE PRECISION,
    center_lng DOUBLE PRECISION,
    radius_meters INTEGER
)
RETURNS TABLE (
    id INTEGER,
    complaint_id TEXT,
    title TEXT,
    description TEXT,
    category TEXT,
    status TEXT,
    user_name TEXT,
    distance_meters DOUBLE PRECISION
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.complaint_id,
        c.title,
        c.description,
        c.category,
        c.status,
        u.name,
        ST_Distance(
            c.location::geometry,
            ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geometry
        ) as distance
    FROM public.complaints c
    JOIN public.users u ON c.user_id = u.id
    WHERE ST_DWithin(
        c.location::geometry,
        ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geometry,
        radius_meters
    )
    ORDER BY distance;
END;
$$;

-- ==============================================================================
-- 9. SAMPLE DATA SEEDING
-- ==============================================================================

-- Seed Leaders
INSERT INTO public.leaders (auth_id, name, email, phone, title, constituency, party)
VALUES 
('7c5f095f-480b-40f7-8e8d-8f84c02f5833', 'Priya Sharma (MLA)', 'lokeshmagare28@gmail.com', '+919810011001', 'MLA', 'Pune Central / West Delhi', 'AAP'),
('leader2', 'Vikram Singh', 'vikram.singh@example.com', '+919810011002', 'Councilor', 'Dwarka', 'BJP')
ON CONFLICT (email) DO NOTHING;

-- Seed Users
INSERT INTO public.users (auth_id, name, email, phone, street_name, locality, latitude, longitude, location, preferred_language)
VALUES 
('4720fc9f-9ec5-4428-b0d6-d5a10a0c12fa', 'Parth Bhoi', 'parthbhoi1476@gmail.com', '+919810011101', 'Tilak Nagar Main Road', 'Tilak Nagar', 28.6400, 77.0950, ST_SetSRID(ST_MakePoint(77.0950, 28.6400), 4326)::geography, 'hi'),
('user2', 'Sunita Devi', 'sunita.d@example.com', '+919810011102', 'Janakpuri District Center', 'Janakpuri', 28.6210, 77.0850, ST_SetSRID(ST_MakePoint(77.0850, 28.6210), 4326)::geography, 'hi')
ON CONFLICT (email) DO NOTHING;

-- Seed Sample Complaints
INSERT INTO public.complaints (complaint_id, user_id, leader_id, title, description, original_language, category, latitude, longitude, status, severity)
VALUES 
('CMP1700000001', 1, 1, 'Large Pothole on Main Road', 'There is a deep 2-foot pothole near Goodluck Cafe causing traffic slowdowns.', 'en', 'pothole', 18.5204, 73.8567, 'pending', 'high'),
('CMP1700000002', 1, 1, 'स्ट्रीट लाइट बंद है', 'बस स्टॉप के पास 3 स्ट्रीट लाइट पिछले 4 दिनों से बंद हैं।', 'hi', 'streetlight', 18.5308, 73.8474, 'in_progress', 'medium'),
('CMP1700000003', 2, 1, 'गटार तुंबले आहे', 'शाळेजवळ कचरा साचल्याने पाणी रस्त्यावर येत आहे.', 'mr', 'sewage', 18.5150, 73.8500, 'resolved', 'low')
ON CONFLICT (complaint_id) DO NOTHING;
