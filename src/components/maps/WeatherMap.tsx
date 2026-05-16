import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useEffect } from 'react';

// Fix for Leaflet default icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 10, { animate: true });
  }, [center, map]);

  return null;
}

interface WeatherMapProps {
  position: [number, number];
  weather: any;
}

export default function WeatherMap({ position, weather }: WeatherMapProps) {
  return (
    <MapContainer 
      center={position} 
      zoom={10} 
      scrollWheelZoom={true} 
      zoomControl={false}
      className="h-full w-full z-0"
    >
      <ChangeView center={position} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {weather && (
        <Marker position={position}>
          <Popup>
            <div className="p-2 font-sans">
              <p className="font-black text-indigo-600 text-lg">{weather.location.name}</p>
              <p className="font-bold text-gray-500 uppercase text-[10px]">{weather.current.condition}</p>
              <p className="font-black text-2xl text-gray-800 mt-2">{weather.current.temp}°C</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
