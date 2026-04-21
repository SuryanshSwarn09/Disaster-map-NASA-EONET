import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DisasterMap from './components/DisasterMap';
import TelemetryChart from './components/TelemetryChart';

function App() {
  const [allEvents, setAllEvents] = useState([]);
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

        // If NASA API limit hit or other error, handle it gracefully
        if (!res.ok) throw new Error('API communication failed. Likely rate limited by NASA.');

        const data = await res.json();
        setAllEvents(data.features || []);
      } catch (err) {
        console.error(err);
        setError("NETWORK_ERR: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [filters.year, categories.length]);

  // Apply filters locally down-stream to avoid redundant network loads
  useEffect(() => {
    let fetchedEvents = allEvents;

    if (filters.categories.length > 0) {
      fetchedEvents = fetchedEvents.filter(ev => {
        const evCats = ev.properties?.categories || [];
        return evCats.some(c => filters.categories.includes(c.id));
      });
    }

    setEvents(fetchedEvents);
  }, [filters.categories, allEvents]);

  return (
    <div className="w-full h-screen bg-black text-[#f0f0fa] relative overflow-hidden font-sans uppercase tracking-[1.17px]">
      <div className="absolute inset-0 z-0">
        <DisasterMap events={events} filters={filters} isSatellite={isSatellite} />
      </div>

      {/* Dark Gradient Overlay for Text Legibility */}
      <div className={`absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-[10] transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}></div>

      <Sidebar
        filters={filters}
        setFilters={setFilters}
        isSatellite={isSatellite}
        setIsSatellite={setIsSatellite}
        categories={categories}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Sidebar Toggle Button (Shows when sidebar is hidden) */}
      <div className={`absolute top-12 left-8 z-[1001] transition-all duration-500 mt-1.5 ${isSidebarOpen ? 'opacity-0 pointer-events-none -translate-x-10' : 'opacity-100 pointer-events-auto translate-x-0'}`}>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-[rgba(37,37,42,0.8)] border border-[rgba(240,240,250,0.35)] p-3 rounded-full hover:bg-[rgba(240,240,250,0.2)] transition-all cursor-pointer backdrop-blur-md shadow-2xl text-[#f0f0fa]"
          title="Open Menu"
        >
          <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* GitHub Profile Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2000] group pointer-events-auto">
        <a
          href="https://github.com/SuryanshSwarn09"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(37,37,42,0.8)] border border-[rgba(11, 11, 11, 0.35)] backdrop-blur-md cursor-pointer hover:bg-[rgba(240,240,250,0.2)] transition-all duration-300 shadow-2xl relative"
        >
          {/* My pfp Icon */}
          <img
            src="pfp.png"
            alt="github"
            className="w-8 h-8 opacity-100 group-hover:opacity-100 transition-opacity"
          />

          {/* Tooltip / Label */}
          <div className="absolute bottom-16 px-4 py-2 bg-[rgba(37,37,42,0.95)] border border-[rgba(240,240,250,0.2)] rounded-[4px] backdrop-blur-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
            <p className="text-[11px] font-bold tracking-[1.17px] text-[#f0f0fa] m-0">CODED BY SURYANSH</p>
          </div>
        </a>
      </div>

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
        <div className="absolute top-10 right-10 z-[2000] bg-[rgba(240,240,250,0.1)] border border-[rgba(50, 50, 55, 0.35)] p-6 backdrop-blur-sm">
          <h3 className="font-bold text-[13px] tracking-[1.17px]">MISSION ERROR</h3>
          <p className="text-[12px] mt-2 opacity-80">{error}</p>
        </div>
      )}

      {/* Logic to show an alert whenever the PI feeds an empty arraty or no disaster in the selected cordinates on the map */}
      {!isLoading && !error && events.length === 0 && (
        <div className="absolute top-10 right-10 z-[2000] bg-[rgba(37, 37, 42, 0.1)] border border-[rgba(240,240,250,0.35)] px-8 py-5 backdrop-blur-md pointer-events-none text-right shadow-2xl">
          <h3 className="font-bold text-[13px] tracking-[1.17px] text-[#f0f0fa]">NO TARGETS ACQUIRED</h3>
          <p className="text-[11px] mt-2 opacity-70 tracking-[1px] text-[#f0f0fa]">NO ACTIVE EVENTS FOUND FOR THIS CRITERIA ON SLECTED COORDINATES</p>
        </div>
      )}
    </div>
  );
}

export default App;
