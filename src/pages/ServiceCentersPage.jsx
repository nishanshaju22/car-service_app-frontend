import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import DashboardLayout from '../components/layout/DashboardLayout';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DEFAULT_POSITION = [51.505, -0.09]; // fallback location

const DefaultIcon = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

// Mock service center data
const MOCK_CENTERS = [
    {
        id: 1,
        name: 'Speedy Car Repairs',
        lat: 51.508,
        lon: -0.11,
        address: '123 High Street',
    },
    {
        id: 2,
        name: 'AutoFix Garage',
        lat: 51.502,
        lon: -0.09,
        address: '456 Main Road',
    },
    {
        id: 3,
        name: 'Super Service Center',
        lat: 51.51,
        lon: -0.1,
        address: '789 Elm Street',
    },
];

// Component to move the map to the user location
const LocateUser = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) map.setView(position, 14);
    }, [position]);
    return null;
};

const ServiceCentersPage = () => {
    const [userPosition, setUserPosition] = useState(null);
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
                () => setUserPosition(DEFAULT_POSITION)
            );
        } else {
            setUserPosition(DEFAULT_POSITION);
        }
    }, []);

    // Load mock centers and/or later query real API
    useEffect(() => {
        if (!userPosition) return;

        setLoading(true);

        // Show mock centers immediately
        setCenters(MOCK_CENTERS);

        // Simulate async fetching to allow replacement with real API
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [userPosition]);

    return (
        <DashboardLayout>
            <div className="min-h-screen px-6 py-6 bg-gray-50">
                <h1 className="text-2xl font-semibold mb-4">Nearby Service Centers</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}

                <div className="relative w-full" style={{ height: '70vh' }}>
                    {/* Map */}
                    <MapContainer
                        center={userPosition || DEFAULT_POSITION}
                        zoom={14}
                        scrollWheelZoom
                        style={{ height: '100%', width: '100%' }}
                        className="rounded-xl"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {userPosition && <LocateUser position={userPosition} />}

                        {centers.map((center) => (
                            <Marker key={center.id} position={[center.lat, center.lon]}>
                                <Popup>
                                    <strong>{center.name}</strong>
                                    {center.address && <p>{center.address}</p>}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Loading overlay */}
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10">
                            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ServiceCentersPage;
