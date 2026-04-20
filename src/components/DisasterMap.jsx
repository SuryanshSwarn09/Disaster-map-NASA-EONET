import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<div class="flex items-center justify-center font-bold text-[14px] text-[#f0f0fa] tracking-[1px] bg-black/80 backdrop-blur-sm border border-[rgba(240,240,250,0.5)] w-[36px] h-[36px] rounded-full hover:scale-125 transition-transform duration-200"><span>${cluster.getChildCount()}</span></div>`,
    className: 'custom-ghost-cluster',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

export const getIcon = (categoryId) => {
  let emoji = '📍';
  if (categoryId === 'wildfires') emoji = '🔥';
  if (categoryId === 'volcanoes') emoji = '🌋';
  if (categoryId === 'severeStorms') emoji = '⛈️';
  if (categoryId === 'earthquakes') emoji = '🌏🫨';

  return L.divIcon({
    className: 'custom-ghost-icon',
    html: `<div class="flex items-center justify-center w-[24px] h-[24px] rounded-full border border-[rgba(240,240,250,0.5)] bg-black/80 backdrop-blur-sm text-[14px] hover:scale-150 transition-transform duration-200">${emoji}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export default function DisasterMap({ events, filters, isSatellite }) {
  const center = [22.5937, 78.9629]; // India
  
  const tileUrl = isSatellite 
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"; // Fallback to Space Black (Carto Dark)
  
  const tileAttribution = isSatellite
    ? 'Imagery &copy; Esri'
    : '&copy; CartoDB';

  return (
    <div className="w-full h-full relative z-0 bg-black">
      <MapContainer 
        center={center} 
        zoom={5} 
        minZoom={3}
        scrollWheelZoom={true} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution={tileAttribution}
          url={tileUrl}
          noWrap={true}
        />
        <ZoomControl position="bottomright" />
        
        <MarkerClusterGroup
          key={`${filters.year}-${filters.categories.join('-')}`}
          chunkedLoading
          showCoverageOnHover={false}
          maxClusterRadius={40}
          iconCreateFunction={createClusterCustomIcon}
        >
          {events.map((ev) => {
            if (!ev.geometry || !ev.geometry.coordinates) return null;
            
            let coord;
            // Handle Polygon / MultiPolygon arrays effectively
            if (ev.geometry.type === 'Polygon' || ev.geometry.type === 'MultiPolygon') {
              const poly = Array.isArray(ev.geometry.coordinates[0][0]) 
                ? ev.geometry.coordinates[0][0] 
                : ev.geometry.coordinates[0];
              coord = [poly[1], poly[0]]; // Extract [lat, lng] from the primary polygon
            } else {
              coord = [ev.geometry.coordinates[1], ev.geometry.coordinates[0]];
            }
            
            // Failsafe to protect React from crashing on unmapped projections
            if (!coord || isNaN(coord[0]) || isNaN(coord[1])) return null;

            const title = ev.properties?.title || 'UNKNOWN TARGET';
            const sources = ev.properties?.sources || [];
            const eventDate = ev.properties?.date || 'SYS_CURRENT';
            const catTitle = ev.properties?.categories?.[0]?.title || 'UNCLASSIFIED';
            const catId = ev.properties?.categories?.[0]?.id || 'wildfires';
            
            return (
              <Marker key={ev.properties?.id || Math.random()} position={coord} icon={getIcon(catId)}>
                <Popup>
                  <div className="min-w-[200px] uppercase font-sans tracking-[1.17px]">
                    <h3 className="font-bold text-[#f0f0fa] text-[13px] mb-4 border-b border-[rgba(240,240,250,0.35)] pb-2">{title}</h3>
                    <div className="text-[10px] text-[#f0f0fa] space-y-2 opacity-80">
                      <p><span className="opacity-50 mr-2">CLASS:</span> {catTitle}</p>
                      <p><span className="opacity-50 mr-2">TIMESTAMP:</span> {eventDate}</p>
                      {sources.length > 0 && (
                        <p className="flex items-center">
                          <span className="opacity-50 mr-2">SYS_LINK:</span> 
                          <a href={sources[0].url} target="_blank" rel="noreferrer" className="text-white hover:text-[rgba(240,240,250,0.5)] transition-colors">
                            [{sources[0].id}]
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
