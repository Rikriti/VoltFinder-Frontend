import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const currentLocationIcon = new L.Icon({
  iconUrl: require('../path/to/current-location-icon.png'), 
  iconSize: [35, 35],
});

function MapView({ stations, center }) {
  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={center} icon={currentLocationIcon}>
        <Popup>Your Current Location</Popup>
      </Marker>
      {stations.map((station, index) => (
        <Marker
          key={index}
          position={[station.geometry.location.lat, station.geometry.location.lng]}
        >
          <Popup>
            <strong>{station.name}</strong><br />
            {station.vicinity}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
