import { useState } from 'react';

export default function FilterControls({ filters, setFilters, categories = [] }) {
  const [localYear, setLocalYear] = useState(filters.year || '2026');
  const dynamicCategories = [
    { id: "all", title: "ALL REGIONS" },
    ...categories.map(c => ({ id: c.id, title: c.title.toUpperCase() }))
  ];

  const handleCategoryChange = (catId) => {
    setFilters(prev => ({
      ...prev,
      categories: catId === 'all' 
        ? categories.map(c => c.id)
        : [catId]
    }));
  };

  const handleSliderCommit = () => {
    setFilters(prev => ({ ...prev, year: localYear }));
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-[12px] font-bold tracking-[1.17px] opacity-50 mb-4">EVENT CLASSIFICATION</h2>
        <div className="flex flex-col space-y-4">
          {dynamicCategories.map(cat => {
            const isChecked = cat.id === 'all' 
              ? filters.categories.length === categories.length && categories.length > 0
              : filters.categories.length === 1 && filters.categories[0] === cat.id;

            return (
              <label key={cat.id} className="group flex items-center gap-4 cursor-pointer hover:opacity-100 transition-opacity">
                <div className="relative flex items-center justify-center w-[16px] h-[16px]">
                  <input 
                    type="radio"
                    name="classification"
                    checked={isChecked}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="peer appearance-none w-[16px] h-[16px] border border-[rgba(240,240,250,0.35)] rounded-full bg-transparent checked:border-[#f0f0fa] transition-colors outline-none cursor-pointer" 
                  />
                  <div className={`absolute w-[6px] h-[6px] rounded-full bg-[#f0f0fa] pointer-events-none transition-all duration-200 ${isChecked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
                </div>
                <span className={`text-[13px] font-bold tracking-[1.17px] uppercase ${isChecked ? 'text-[#f0f0fa]' : 'text-[#f0f0fa] opacity-60'}`}>{cat.title}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[12px] font-bold tracking-[1.17px] opacity-50">HISTORICAL TIMELINE</h2>
          <span className="text-[14px] font-bold tracking-[2px] text-[#f0f0fa]">{localYear}</span>
        </div>
        
        <input 
          type="range" 
          min="2016" 
          max="2026" 
          value={localYear}
          onChange={(e) => setLocalYear(e.target.value)}
          onMouseUp={handleSliderCommit}
          onTouchEnd={handleSliderCommit}
          className="w-full h-1 bg-[rgba(240,240,250,0.2)] rounded-full appearance-none cursor-ew-resize outline-none custom-range"
        />
        
        <div className="flex justify-between text-[10px] opacity-40 mt-3 tracking-[1px] font-bold">
          <span>2016</span>
          <span>2026</span>
        </div>
      </div>
    </div>
  );
}

// day 02 change in the sidebar ui and favicon
