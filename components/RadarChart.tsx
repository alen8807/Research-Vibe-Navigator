import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { RadarMetric } from '../types';

interface RadarChartProps {
  data: RadarMetric[];
}

const VibeRadarChart: React.FC<RadarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="metric" 
            tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Vibe Score"
            dataKey="value"
            stroke="#4f46e5"
            strokeWidth={3}
            fill="#6366f1"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              border: 'none'
            }}
            itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VibeRadarChart;
