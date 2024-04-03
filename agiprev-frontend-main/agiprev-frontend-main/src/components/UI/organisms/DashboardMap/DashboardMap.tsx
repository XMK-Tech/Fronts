import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function DashboardMap() {
  const latitude = 51.505;
  const longetude = -0.09;

  return (
    <MapContainer
      style={{
        height: '450px',
        width: '450px',
      }}
      center={[latitude, longetude]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longetude]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
