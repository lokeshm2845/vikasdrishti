import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../services/supabaseClient';
import { complaintService } from '../../services/complaintService';
import toast from 'react-hot-toast';

// Fix for default markers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GeofenceMap = ({ leaderData }) => {
    const [polygon, setPolygon] = useState([]);
    const [voters, setVoters] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectType, setProjectType] = useState('road');
    const [loading, setLoading] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        if (leaderData) {
            loadComplaints();
        }
    }, [leaderData]);

    const loadComplaints = async () => {
        if (!leaderData) return;
        const result = await complaintService.getLeaderComplaints(leaderData.id);
        if (result.success) {
            setComplaints(result.data);
        }
    };

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
            toast.error('Please draw a polygon first (click at least 3 points)');
            return;
        }

        setLoading(true);
        
        try {
            const closedPolygon = [...polygon, polygon[0]];
            const coordinates = closedPolygon.map(point => 
                `${point[1]} ${point[0]}`
            ).join(',');
            
            const polygonWKT = `POLYGON((${coordinates}))`;

            const { data, error } = await supabase
                .rpc('find_voters_in_polygon', {
                    polygon_wkt: polygonWKT
                });

            if (error) throw error;

            setVoters(data || []);
            
            if (data.length === 0) {
                toast('No voters found in this area');
            } else {
                toast.success(`Found ${data.length} voters in this area!`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error finding voters');
        } finally {
            setLoading(false);
        }
    };

    const sendUpdate = async () => {
        if (!projectName) {
            toast.error('Please enter project name');
            return;
        }

        if (voters.length === 0) {
            toast.error('No voters found in area');
            return;
        }

        setLoading(true);

        try {
            const projectId = `PRJ${Date.now()}`;
            const closedPolygon = [...polygon, polygon[0]];
            const coordinates = closedPolygon.map(point => 
                `${point[1]} ${point[0]}`
            ).join(',');
            const polygonWKT = `POLYGON((${coordinates}))`;

            const { error: projectError } = await supabase
                .from('projects')
                .insert([{
                    project_id: projectId,
                    leader_id: leaderData.id,
                    project_name: projectName,
                    project_type: projectType,
                    constituency: leaderData.constituency,
                    geofence: supabase.rpc('ST_GeogFromText', { text: polygonWKT }),
                    status: 'completed'
                }]);

            if (projectError) throw projectError;

            for (const voter of voters) {
                const message = `📢 VikasDrishti Update: ${projectName} completed in your area! - ${leaderData.name}`;
                
                await supabase
                    .from('notifications')
                    .insert([{
                        notification_id: `NOT${Date.now()}${voter.id}`,
                        user_id: voter.id,
                        leader_id: leaderData.id,
                        type: 'project_update',
                        message: message,
                        phone_number: voter.phone,
                        status: 'sent',
                        sent_at: new Date()
                    }]);
            }

            toast.success(`Updates sent to ${voters.length} residents!`);
            setProjectName('');
            setPolygon([]);
            setVoters([]);
            
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to send updates');
        } finally {
            setLoading(false);
        }
    };

    const updateComplaintStatus = async (complaintId, status) => {
        const resolutionNotes = prompt('Enter resolution notes:');
        if (status === 'resolved' && !resolutionNotes) return;

        const result = await complaintService.updateComplaintStatus(
            complaintId,
            status,
            resolutionNotes
        );

        if (result.success) {
            toast.success(`Complaint ${status}!`);
            loadComplaints();
        } else {
            toast.error('Failed to update complaint');
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ 
                background: '#FF9933',
                padding: '15px 20px',
                color: 'white'
            }}>
                <h2 style={{ margin: 0 }}>🇮🇳 Leader Dashboard</h2>
                {leaderData && (
                    <p style={{ margin: '5px 0 0' }}>
                        {leaderData.title || ''} | {leaderData.constituency || ''}
                    </p>
                )}
            </div>

            {/* Main Content - Split View */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Panel - Map */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                    {/* Map Controls */}
                    <div style={{ padding: '10px', background: '#f8f9fa', borderBottom: '2px solid #138808' }}>
                        <button 
                            onClick={() => setDrawing(!drawing)}
                            style={{
                                padding: '8px 16px',
                                background: drawing ? '#dc3545' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                marginRight: '10px',
                                cursor: 'pointer'
                            }}
                        >
                            {drawing ? 'Stop Drawing' : 'Draw Geofence'}
                        </button>
                        
                        <button 
                            onClick={findVoters}
                            disabled={polygon.length < 3 || loading}
                            style={{
                                padding: '8px 16px',
                                background: polygon.length < 3 ? '#ccc' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                marginRight: '10px',
                                cursor: polygon.length < 3 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Searching...' : 'Find Voters'}
                        </button>
                        
                        <span style={{ marginLeft: '10px', color: '#666' }}>
                            Points: {polygon.length} | Voters: {voters.length}
                        </span>
                    </div>

                    {/* Project Details */}
                    <div style={{ padding: '10px', background: '#e9ecef', display: 'flex', gap: '10px' }}>
                        <select
                            value={projectType}
                            onChange={(e) => setProjectType(e.target.value)}
                            style={{
                                padding: '8px',
                                borderRadius: '5px',
                                border: '1px solid #ced4da'
                            }}
                        >
                            <option value="road">🛣️ Road Repair</option>
                            <option value="streetlight">💡 Streetlight</option>
                            <option value="sewer">💧 Sewage/Drainage</option>
                            <option value="park">🌳 Park/Garden</option>
                            <option value="school">🏫 School/Education</option>
                        </select>
                        
                        <input 
                            placeholder="Project Name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '5px',
                                border: '1px solid #ced4da'
                            }}
                        />
                        
                        <button 
                            onClick={sendUpdate}
                            disabled={voters.length === 0 || !projectName || loading}
                            style={{
                                padding: '8px 20px',
                                background: '#138808',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            📲 Send Update ({voters.length})
                        </button>
                    </div>

                    {/* Map */}
                    <MapContainer 
                        center={[28.6139, 77.2090]} 
                        zoom={12} 
                        style={{ flex: 1 }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='© OpenStreetMap'
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
                </div>

                {/* Right Panel - Complaints List */}
                <div style={{ 
                    flex: 1, 
                    background: '#f8f9fa',
                    borderLeft: '2px solid #FF9933',
                    overflowY: 'auto',
                    padding: '15px'
                }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#FF9933' }}>
                        📋 Pending Complaints
                    </h3>

                    {complaints.length === 0 ? (
                        <p style={{ color: '#666', textAlign: 'center' }}>No complaints yet</p>
                    ) : (
                        complaints.filter(c => c.status !== 'resolved').map(complaint => (
                            <div key={complaint.id} style={{
                                background: 'white',
                                borderRadius: '8px',
                                padding: '15px',
                                marginBottom: '15px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: complaint.status === 'pending' ? '2px solid #dc3545' : 
                                        complaint.status === 'in_progress' ? '2px solid #ffc107' :
                                        '2px solid #28a745'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h4 style={{ margin: '0 0 10px 0' }}>{complaint.title}</h4>
                                    <span style={{
                                        padding: '3px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        background: complaint.status === 'pending' ? '#dc3545' :
                                                    complaint.status === 'in_progress' ? '#ffc107' :
                                                    '#28a745',
                                        color: 'white'
                                    }}>
                                        {complaint.status}
                                    </span>
                                </div>

                                <p style={{ fontSize: '14px', color: '#666' }}>{complaint.description}</p>
                                
                                {complaint.photo_url && (
                                    <img 
                                        src={complaint.photo_url} 
                                        alt="Complaint" 
                                        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '5px', margin: '10px 0' }}
                                    />
                                )}

                                {complaint.users && (
                                    <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>
                                        From: {complaint.users.name} | {complaint.category}
                                    </div>
                                )}

                                {complaint.status !== 'resolved' && (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => updateComplaintStatus(complaint.id, 'in_progress')}
                                            style={{
                                                flex: 1,
                                                padding: '8px',
                                                background: '#ffc107',
                                                border: 'none',
                                                borderRadius: '5px',
                                                color: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Start Work
                                        </button>
                                        <button
                                            onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                                            style={{
                                                flex: 1,
                                                padding: '8px',
                                                background: '#28a745',
                                                border: 'none',
                                                borderRadius: '5px',
                                                color: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Resolve
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default GeofenceMap;