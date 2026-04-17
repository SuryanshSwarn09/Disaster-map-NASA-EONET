import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DisasterMap from './components/DisasterMap';
import TelemetryChart from './components/TelemetryChart';

function App() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [filters, setFilters] = useState({ 
    categories: [], 
    year: '2026' 
  });
  const [isSatellite, setIsSatellite] = useState(true);

  // Fetch Category Definitions on Mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/categories');
        const data = await res.json();
        const cats = data.categories || [];
        setCategories(cats);
        // Default to all categories globally on startup
        setFilters(prev => ({ ...prev, categories: cats.map(c => c.id) }));
      } catch (err) {
        console.error("Failed to load NASA categories");
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      // Don't fetch events until categories are loaded to prevent empty payload errors
      if (categories.length === 0) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const url = `https://eonet.gsfc.nasa.gov/api/v3/events/geojson?status=all&start=${filters.year}-01-01&end=${filters.year}-12-31`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch data from NASA');
        const data = await res.json();
        
        let fetchedEvents = data.features || [];
        
        if (filters.categories.length > 0) {
          fetchedEvents = fetchedEvents.filter(ev => {
            const evCats = ev.properties?.categories || [];
            return evCats.some(c => filters.categories.includes(c.id));
          });
        }
        
        setEvents(fetchedEvents);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [filters.year, filters.categories, categories]);

  return (
    <div className="w-full h-screen bg-black text-[#f0f0fa] relative overflow-hidden font-sans uppercase tracking-[1.17px]">
      <div className="absolute inset-0 z-0">
        <DisasterMap events={events} filters={filters} isSatellite={isSatellite} />
      </div>
      
      {/* Dark Gradient Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-[10]"></div>
      
      <Sidebar filters={filters} setFilters={setFilters} isSatellite={isSatellite} setIsSatellite={setIsSatellite} categories={categories} />
      
      <TelemetryChart events={events} isVisible={isChartVisible} setIsVisible={setIsChartVisible} />

      {/* Ghost Loader */}
      {isLoading && (
        <div className="absolute bottom-10 right-10 z-[2000] pointer-events-none transition-opacity duration-300">
          <div className="flex items-center justify-center gap-4">
            <div className="w-5 h-5 border-[1.5px] border-[rgba(240,240,250,0.35)] border-t-[#f0f0fa] rounded-full animate-spin"></div>
            <p className="text-[#f0f0fa] font-bold text-[13px] tracking-[1.17px] m-0">UPDATING FEED</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-10 right-10 z-[2000] bg-[rgba(240,240,250,0.1)] border border-[rgba(240,240,250,0.35)] p-6 backdrop-blur-sm">
          <h3 className="font-bold text-[13px] tracking-[1.17px]">MISSION ERROR</h3>
          <p className="text-[12px] mt-2 opacity-80">{error}</p>
        </div>
      )}

      {/* Empty State Notification HUD */}
      {!isLoading && !error && events.length === 0 && (
        <div className="absolute top-10 right-10 z-[2000] bg-[rgba(240,240,250,0.1)] border border-[rgba(240,240,250,0.35)] px-8 py-5 backdrop-blur-md pointer-events-none text-right shadow-2xl">
          <h3 className="font-bold text-[13px] tracking-[1.17px] text-[#f0f0fa]">NO TARGETS ACQUIRED</h3>
          <p className="text-[11px] mt-2 opacity-70 tracking-[1px] text-[#f0f0fa]">NO ACTIVE EVENTS FOUND FOR THIS CRITERIA</p>
        </div>
      )}
    </div>
  );
}

export default App;
