// Map Component for VikasDrishti 
// src/components/MapComponent.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../supabaseClient';

// Fix for default markers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = () => {
    const [polygon, setPolygon] = useState([]);
    const [voters, setVoters] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [leaderName, setLeaderName] = useState('');

    // Component to handle map clicks
    const DrawingHandler = () => {
        useMapEvents({
            click(e) {
                if (!drawing) return;
                const { lat, lng } = e.latlng;
                setPolygon(prev => [...prev, [lat, lng]]);
            }
        });
        return null;
    };

    const findVoters = async () => {
        if (polygon.length < 3) {
            alert('Please draw a polygon first (click at least 3 points)');
            return;
        }

        // Close the polygon
        const closedPolygon = [...polygon, polygon[0]];
        
        // Format for PostGIS
        const coordinates = closedPolygon.map(point => 
            `${point[1]} ${point[0]}`
        ).join(',');
        
        const polygonWKT = `POLYGON((${coordinates}))`;

        // Call Supabase function
        const { data, error } = await supabase
            .rpc('find_voters_in_polygon', {
                polygon_wkt: polygonWKT
            });

        if (error) {
            console.error('Error:', error);
            alert('Error finding voters');
        } else {
            setVoters(data || []);
            alert(`Found ${data?.length || 0} voters in this area!`);
        }
    };

    const sendNotifications = () => {
        if (!projectName || !leaderName) {
            alert('Please fill project details');
            return;
        }

        if (voters.length === 0) {
            alert('No voters found in area');
            return;
        }

        // Show notifications one by one (demo)
        voters.forEach((voter, index) => {
            setTimeout(() => {
                const message = `🔔 VIKASDRISHTI UPDATE:\n\nHello ${voter.name}!\nGood news! The ${projectName} on your street (${voter.street_name || 'your area'}) is now complete.\n\nYour leader ${leaderName} got this work done for you.\n\nक्या आप संतुष्ट हैं? (हाँ/नहीं)`;
                
                alert(message);
            }, index * 2000); // Show every 2 seconds
        });

        alert(`✅ Sending notifications to ${voters.length} residents...`);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
                padding: '15px', 
                background: '#FF9933',
                borderBottom: '2px solid #138808'
            }}>
                <h2 style={{ color: 'white', margin: 0 }}>VikasDrishti - Hyper-Local Governance</h2>
            </div>

            <div style={{ padding: '15px', background: '#f0f0f0' }}>
                <button 
                    onClick={() => setDrawing(!drawing)}
                    style={{
                        padding: '10px 20px',
                        background: drawing ? '#dc3545' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        marginRight: '10px',
                        cursor: 'pointer'
                    }}
                >
                    {drawing ? '⏹️ Stop Drawing' : '✏️ Start Drawing Geofence'}
                </button>
                
                <button 
                    onClick={findVoters}
                    disabled={polygon.length < 3}
                    style={{
                        padding: '10px 20px',
                        background: polygon.length < 3 ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        marginRight: '10px',
                        cursor: polygon.length < 3 ? 'not-allowed' : 'pointer'
                    }}
                >
                    🔍 Find Voters in Area
                </button>
                
                <span style={{ marginLeft: '10px' }}>
                    Polygon points: {polygon.length}
                </span>
            </div>

            <div style={{ padding: '15px', background: '#e0e0e0' }}>
                <input 
                    placeholder="Project Name (e.g., Road Repair)"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '300px',
                        marginRight: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                <input 
                    placeholder="Leader Name (e.g., MLA Priya Sharma)"
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '300px',
                        marginRight: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                <button 
                    onClick={sendNotifications}
                    disabled={voters.length === 0 || !projectName || !leaderName}
                    style={{
                        padding: '10px 30px',
                        background: '#138808',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    📲 Send Updates ({voters.length} residents)
                </button>
            </div>

            <MapContainer 
                center={[28.6139, 77.2090]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
            >
                {/* OpenStreetMap (FREE) */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                <DrawingHandler />
                
                {polygon.length > 0 && (
                    <Polygon 
                        positions={polygon}
                        color="#FF9933"
                        weight={3}
                        fillColor="#FF9933"
                        fillOpacity={0.3}
                    />
                )}
            </MapContainer>

            <div style={{ 
                padding: '15px', 
                background: '#f8f9fa',
                borderTop: '2px solid #FF9933',
                maxHeight: '200px',
                overflowY: 'auto'
            }}>
                <h4>📍 Residents in Selected Area: {voters.length}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {voters.map(v => (
                        <div key={v.id} style={{
                            padding: '8px',
                            background: 'white',
                            borderRadius: '5px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <strong>{v.name}</strong><br/>
                            📞 {v.phone || 'N/A'}<br/>
                            🏠 {v.street_name || 'Unknown'}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapComponent;