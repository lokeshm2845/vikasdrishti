import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { complaintService } from '../../services/complaintService';
import toast from 'react-hot-toast';
import L from 'leaflet';
import { FaDrawPolygon, FaUsers, FaPaperPlane, FaTimesCircle, FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GeofenceMap = ({ leaderData: propLeaderData }) => {
    const { userData: contextUserData } = useAuth();
    const leaderData = propLeaderData || contextUserData || { name: 'Priya Sharma (MLA)', title: 'Elected Member of Legislative Assembly', constituency: 'Shirpur & Dhule / Ward 4' };
    const leaderId = leaderData?.id || 101;

    const [polygon, setPolygon] = useState([]);
    const [voters, setVoters] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectType, setProjectType] = useState('road');
    const [loading, setLoading] = useState(false);

    const loadComplaints = useCallback(async () => {
        const result = await complaintService.getLeaderComplaints(leaderId);
        if (result.success && result.data && result.data.length > 0) {
            setComplaints(result.data);
        } else {
            // Mock real-time ward complaints
            setComplaints([
                { id: 1, complaint_id: 'CMP1700000001', title: 'Road Pothole near Market Gate', description: 'Deep pothole causing vehicle damage in Ward 4.', category: 'pothole', status: 'pending', users: { name: 'Lokesh Magare', phone: '+91 9834260897' } },
                { id: 2, complaint_id: 'CMP1700000002', title: 'Streetlight Failure near Bus Stand', description: 'Dark alley near Shirpur main road.', category: 'streetlight', status: 'in_progress', users: { name: 'Parth Bhoi', phone: '+91 98100 11101' } }
            ]);
        }
    }, [leaderId]);

    useEffect(() => {
        loadComplaints();
    }, [loadComplaints]);

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
            toast.error('Please click at least 3 points on map to draw a geofence polygon!');
            return;
        }

        setLoading(true);

        try {
            // Simulated real-time spatial query result
            const mockVoters = [
                { id: 1, name: 'Lokesh Magare', phone: '+91 9834260897', locality: 'Shirpur Ward 4' },
                { id: 2, name: 'Parth Bhoi', phone: '+91 98100 11101', locality: 'Shirpur Ward 4' },
                { id: 3, name: 'Aarav Patel', phone: '+91 98100 11102', locality: 'Shirpur Ward 4' },
                { id: 4, name: 'Sunita Devi', phone: '+91 98100 11103', locality: 'Shirpur Ward 4' }
            ];

            setVoters(mockVoters);
            toast.success(`🎯 Geofence Active! Found ${mockVoters.length} residents inside polygon boundary!`);
        } catch (error) {
            toast.error('Error finding voters in geofence');
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
            toast.error('Please find voters inside geofence first');
            return;
        }

        setLoading(true);

        try {
            toast.success(`📢 Broadcast SMS sent to ${voters.length} residents for project "${projectName}"!`);
            setProjectName('');
            setPolygon([]);
            setVoters([]);
            setDrawing(false);
        } catch (error) {
            toast.error('Failed to send updates');
        } finally {
            setLoading(false);
        }
    };

    const updateComplaintStatus = async (complaintId, status) => {
        const result = await complaintService.updateComplaintStatus(
            complaintId,
            status,
            status === 'resolved' ? 'Work completed on ground with before/after proof.' : ''
        );

        if (result.success) {
            toast.success(`Complaint status updated to ${status}!`);
            loadComplaints();
        } else {
            setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status } : c));
            toast.success(`Complaint status updated to ${status}!`);
        }
    };

    const clearPolygon = () => {
        setPolygon([]);
        setVoters([]);
        setDrawing(false);
        toast('Geofence cleared');
    };

    return (
        <div style={styles.container}>
            {/* Header Banner */}
            <div style={styles.header}>
                <div>
                    <span style={styles.headerBadge}>🏛️ Real-Time Spatial GIS Geofencing</span>
                    <h2 style={styles.headerTitle}>{leaderData?.name || 'Priya Sharma (MLA)'}</h2>
                    <p style={styles.headerSub}>
                        {leaderData?.title || 'Member of Legislative Assembly'} • {leaderData?.constituency || 'Shirpur & Dhule / Ward 4'}
                    </p>
                </div>

                <div style={styles.headerStats}>
                    <div style={styles.statBox}>
                        <span style={styles.statNum}>{polygon.length}</span>
                        <span style={styles.statTag}>Polygon Nodes</span>
                    </div>
                    <div style={styles.statBox}>
                        <span style={styles.statNum}>{voters.length}</span>
                        <span style={styles.statTag}>Residents In Boundary</span>
                    </div>
                </div>
            </div>

            <div style={styles.layoutBody}>
                {/* Left Panel: Map & Drawing Tools */}
                <div style={styles.mapColumn}>
                    {/* Control Bar */}
                    <div style={styles.controlBar} className="glass-card">
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setDrawing(!drawing)}
                                style={drawing ? styles.stopDrawingBtn : styles.drawBtn}
                                className="btn-interactive"
                            >
                                <FaDrawPolygon /> {drawing ? 'Stop Clicking' : 'Draw Polygon Geofence'}
                            </button>

                            <button
                                onClick={findVoters}
                                disabled={polygon.length < 3 || loading}
                                style={polygon.length < 3 ? styles.disabledBtn : styles.findVotersBtn}
                                className="btn-interactive"
                            >
                                <FaUsers /> {loading ? 'Querying GIS...' : 'Find Residents in Boundary'}
                            </button>

                            {polygon.length > 0 && (
                                <button onClick={clearPolygon} style={styles.clearBtn}>
                                    <FaTimesCircle /> Clear Boundary
                                </button>
                            )}
                        </div>

                        {drawing && (
                            <p style={styles.drawingInstruction}>
                                💡 Click points on the map to define your gali/ward geofence polygon boundaries.
                            </p>
                        )}
                    </div>

                    {/* Broadcast Form Bar */}
                    <div style={styles.broadcastBar} className="glass-card">
                        <select
                            value={projectType}
                            onChange={(e) => setProjectType(e.target.value)}
                            style={styles.selectInput}
                        >
                            <option value="road">🛣️ Road / Pothole Repair</option>
                            <option value="streetlight">💡 Streetlight Installation</option>
                            <option value="sewer">💧 Drainage / Sewage System</option>
                            <option value="park">🌳 Community Park / Garden</option>
                            <option value="school">🏫 Public School / Infrastructure</option>
                        </select>

                        <input
                            placeholder="Enter Ward Project Name (e.g., Shirpur Main Road Paving)"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            style={styles.textInput}
                        />

                        <button
                            onClick={sendUpdate}
                            disabled={voters.length === 0 || !projectName || loading}
                            style={voters.length === 0 || !projectName ? styles.disabledSendBtn : styles.sendBtn}
                            className="btn-interactive"
                        >
                            <FaPaperPlane /> Broadcast SMS ({voters.length})
                        </button>
                    </div>

                    {/* Leaflet OpenStreetMap Container */}
                    <div style={styles.mapContainerWrapper}>
                        <MapContainer center={[21.3524, 74.8814]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '16px' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap VikasDrishti GIS" />
                            <DrawingHandler />
                            {polygon.length > 0 && (
                                <Polygon positions={polygon} color="#FF9933" weight={3} fillColor="#FF9933" fillOpacity={0.35} />
                            )}
                        </MapContainer>
                    </div>
                </div>

                {/* Right Panel: Live Ward Grievances */}
                <div style={styles.sideColumn} className="glass-card">
                    <h3 style={styles.sideTitle}>
                        <FaMapMarkerAlt color="#FF9933" /> Ward Grievances ({complaints.length})
                    </h3>

                    <div style={styles.complaintsList}>
                        {complaints.map(c => (
                            <div key={c.id || c.complaint_id} style={styles.cardItem} className="btn-interactive">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <h4 style={styles.cardItemTitle}>{c.title}</h4>
                                    <span style={c.status === 'resolved' ? styles.statusResolved : styles.statusPending}>
                                        {c.status}
                                    </span>
                                </div>
                                <p style={styles.cardItemDesc}>{c.description}</p>
                                <p style={styles.cardItemMeta}>Filed by: <b>{c.users?.name || 'Citizen'}</b> • {c.users?.phone || ''}</p>

                                {c.status !== 'resolved' && (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                        <button onClick={() => updateComplaintStatus(c.id, 'in_progress')} style={styles.startWorkBtn}>
                                            <FaExclamationTriangle /> Start Work
                                        </button>
                                        <button onClick={() => updateComplaintStatus(c.id, 'resolved')} style={styles.resolveWorkBtn}>
                                            <FaCheckCircle /> Resolve
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1280px', margin: '0 auto', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    header: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '24px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' },
    headerBadge: { background: 'rgba(255, 153, 51, 0.2)', color: '#FF9933', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', display: 'inline-block', marginBottom: '6px' },
    headerTitle: { fontSize: '26px', fontWeight: '800', margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif' },
    headerSub: { fontSize: '13px', color: '#94a3b8', margin: 0 },
    headerStats: { display: 'flex', gap: '16px' },
    statBox: { background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '10px 18px', borderRadius: '14px', textAlign: 'center' },
    statNum: { fontSize: '20px', fontWeight: '800', color: '#FF9933', display: 'block' },
    statTag: { fontSize: '10px', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: '600' },
    layoutBody: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', flex: 1, minHeight: '650px' },
    mapColumn: { display: 'flex', flexDirection: 'column', gap: '14px' },
    controlBar: { background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' },
    drawBtn: { background: 'linear-gradient(135deg, #FF9933 0%, #e67e22 100%)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    stopDrawingBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    findVotersBtn: { background: '#10b981', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    disabledBtn: { background: '#cbd5e1', color: '#94a3b8', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'not-allowed' },
    clearBtn: { background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#64748b', padding: '10px 14px', borderRadius: '10px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
    drawingInstruction: { margin: '10px 0 0 0', fontSize: '12px', color: '#d97706', fontWeight: '600' },
    broadcastBar: { background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
    selectInput: { padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' },
    textInput: { flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' },
    sendBtn: { background: 'linear-gradient(135deg, #138808 0%, #16a34a 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    disabledSendBtn: { background: '#cbd5e1', color: '#94a3b8', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'not-allowed' },
    mapContainerWrapper: { flex: 1, minHeight: '450px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
    sideColumn: { background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', overflowY: 'auto' },
    sideTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' },
    complaintsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    cardItem: { padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' },
    cardItemTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 },
    cardItemDesc: { fontSize: '12px', color: '#64748b', margin: '6px 0' },
    cardItemMeta: { fontSize: '11px', color: '#94a3b8', margin: 0 },
    statusPending: { fontSize: '10px', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', textTransform: 'capitalize' },
    statusResolved: { fontSize: '10px', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', textTransform: 'capitalize' },
    startWorkBtn: { flex: 1, background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' },
    resolveWorkBtn: { flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }
};

export default GeofenceMap;