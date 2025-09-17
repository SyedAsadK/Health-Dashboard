import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HotspotMap = ({ hotspots }) => {
  const mapCenter = [20.2961, 85.8245]; // Bhubaneswar coordinates

  const getDiseaseColor = (disease) => {
    switch (disease) {
      case "Cholera":
        return "#E74C3C"; // Red
      case "Typhoid":
        return "#FFC300"; // Yellow
      case "Hepatitis A":
        return "#3498DB"; // Blue
      case "Diarrhea":
        return "#2ECC71"; // Green
      default:
        return "#95A5A6"; // Grey for unknown
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-lg h-[30rem]">
      <h2 className="text-lg font-semibold text-white mb-4 px-2">
        Real-Time Hotspots
      </h2>
      <MapContainer center={mapCenter} zoom={11} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        {hotspots.map((hotspot) => (
          <CircleMarker
            key={hotspot.id}
            center={[hotspot.lat, hotspot.lon]} // Use lat and lon from the API
            radius={5 + hotspot.cases / 5}
            pathOptions={{
              color: getDiseaseColor(hotspot.disease),
              fillColor: getDiseaseColor(hotspot.disease),
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <b>Location:</b> {hotspot.location}
              <br />
              <b>Disease:</b> {hotspot.disease}
              <br />
              <b>Cases:</b> {hotspot.cases}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default HotspotMap;
