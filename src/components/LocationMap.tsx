// src/components/MapComponent.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function LocationMap() {
  return (
    <MapContainer
      center={[44.26752820912896, 12.212922286900744]} // Replace with the actual coordinates of SanZak Studio
      zoom={13}
      scrollWheelZoom={false}
      className="h-96 w-full rounded-2xl shadow-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[44.26752820912896, 12.212922286900744]}>
        <Popup>SanZak Studio</Popup>
      </Marker>
    </MapContainer>
  );
}
