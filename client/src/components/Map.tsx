import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
    center: [number, number];
    zoom?: number;
    markers?: { lat: number; lng: number; popup?: string }[];
}

const Map: React.FC<MapProps> = ({ center, zoom = 13, markers = [] }) => {
    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.lat, marker.lng]}>
                    {marker.popup && <Popup>{marker.popup}</Popup>}
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
