import FilterControls from './FilterControls';

export default function Sidebar({ filters, setFilters, isSatellite, setIsSatellite, categories }) {
  return (
    <aside className="absolute top-0 left-0 w-[320px] h-[100vh] z-[1000] flex flex-col pt-12 pb-8 px-8 overflow-hidden mix-blend-screen text-[#f0f0fa] pointer-events-none">
      <div className="mb-10 pointer-events-auto shrink-0">
        <h1 className="text-[42px] font-bold tracking-[0.96px] leading-[1] m-0">DISASTER<br/>MAP</h1>
        <p className="text-[12px] font-bold tracking-[1.17px] mt-3 opacity-70">LIVE ORBITAL TELEMETRY</p>
      </div>
      
      <div className="flex flex-col gap-8 flex-1 overflow-y-auto pointer-events-auto custom-scrollbar pr-2">
        <FilterControls filters={filters} setFilters={setFilters} categories={categories} />
      </div>
      
      <div className="mt-8 flex flex-col gap-5 pointer-events-auto shrink-0">
        <button 
          onClick={() => setIsSatellite(!isSatellite)}
          className="w-full py-[18px] px-5 rounded-[32px] font-bold text-[13px] tracking-[1.17px] bg-[rgba(240,240,250,0.1)] border border-[rgba(240,240,250,0.35)] hover:bg-[rgba(240,240,250,0.2)] hover:text-white transition-all cursor-pointer uppercase"
        >
          {isSatellite ? 'SATELLITE: ACTIVE' : 'SATELLITE: INACTIVE'}
        </button>
        <div className="text-[10px] tracking-[1px] text-center opacity-50">
          DATA SOURCED VIA EONET
        </div>
      </div>
    </aside>
  );
}
