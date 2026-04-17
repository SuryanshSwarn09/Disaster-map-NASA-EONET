import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TelemetryChart({ events, isVisible, setIsVisible }) {
  // Aggregate occurrences per classification
  const chartData = Object.values(events.reduce((acc, ev) => {
    const defaultAlias = 'UNCLASSIFIED';
    const cat = ev.properties?.categories?.[0]?.title?.toUpperCase() || defaultAlias;
    acc[cat] = acc[cat] || { name: cat, volume: 0 };
    acc[cat].volume += 1;
    return acc;
  }, {}));

  return (
    <div className={`absolute top-0 right-0 h-[100vh] w-[400px] transition-transform duration-500 ease-in-out z-[1500] ${isVisible ? 'translate-x-[0%]' : 'translate-x-[100%]'}`}>
      
      {/* Telemetry Toggle Control (Pulled left visually outside the panel) */}
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="absolute top-1/2 -left-[44px] -translate-y-1/2 flex flex-col items-center justify-between w-[44px] h-[340px] py-8 bg-[rgba(0,0,0,0.8)] border border-[rgba(240,240,250,0.35)] border-r-0 backdrop-blur-md text-[12px] font-bold tracking-[1.17px] text-[#f0f0fa] hover:bg-[rgba(240,240,250,0.1)] transition-colors cursor-pointer"
      >
        <div className={`w-[8px] h-[8px] shrink-0 rounded-full border border-[#f0f0fa] ${isVisible ? 'bg-[#f0f0fa]' : 'bg-transparent'} transition-colors duration-300`}></div>
        <span className="flex-1 flex items-center justify-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          GLOBAL DISTRIBUTION ANALYTICS
        </span>
      </button>

      {/* Primary Chart Housing */}
      <div className="h-full w-full bg-[rgba(0,0,0,0.9)] border-l border-[rgba(240,240,250,0.35)] backdrop-blur-xl p-8 pt-12 pb-16 flex flex-col pointer-events-auto">
        <h2 className="text-[#f0f0fa] font-bold text-[12px] tracking-[1.17px] opacity-50 mb-6 text-center">
          ACTIVE REGIONAL TARGET DISTRIBUTIONS
        </h2>
        
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <XAxis 
                type="number"
                tick={{ fill: 'rgba(240,240,250,0.5)', fontSize: 10, fontWeight: 'bold' }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                width={100}
                tick={{ fill: 'rgba(240,240,250,0.5)', fontSize: 10, fontWeight: 'bold' }}
                axisLine={{ stroke: 'rgba(240,240,250,0.2)' }}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(240,240,250,0.05)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(240,240,250,0.35)',
                  borderRadius: 0,
                  backdropFilter: 'blur(4px)',
                  fontFamily: 'inherit',
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  letterSpacing: '1px'
                }}
                itemStyle={{ color: '#f0f0fa' }}
              />
              <Bar 
                dataKey="volume" 
                fill="rgba(240,240,250,0.8)" 
                radius={[2, 2, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
