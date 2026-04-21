import FilterControls from './FilterControls';
// day 02 change in the sidebar ui and favicon

export default function Sidebar({ filters, setFilters, isSatellite, setIsSatellite, categories, isOpen, setIsOpen }) {
  return (
    <aside className={`absolute top-0 left-0 w-[320px] max-w-[100vw] h-[100vh] z-[1000] flex flex-col pt-12 pb-8 px-8 overflow-hidden mix-blend-screen text-[#f0f0fa] pointer-events-none transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* Close Button */}
      <div className="absolute top-12 right-6 pointer-events-auto z-[1001]">
        <button 
          onClick={() => setIsOpen(false)}
          className="text-[#f0f0fa] opacity-60 hover:opacity-100 transition-opacity p-2 bg-[rgba(240,240,250,0.05)] rounded-full hover:bg-[rgba(240,240,250,0.15)] cursor-pointer"
          title="Close Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="mb-10 pointer-events-auto shrink-0 pr-8">
        <h1 className="text-[42px] font-bold tracking-[0.96px] leading-[1] m-0">DISASTER<br/>MAP</h1>
        <p className="text-[12px] font-bold tracking-[1.17px] mt-3 opacity-70">LIVE MAP DATA</p>
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
