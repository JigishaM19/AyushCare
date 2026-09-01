import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { RadarDataPoint } from '../../types/prakriti';

interface PrakritiRadarChartProps {
  data: RadarDataPoint[];
  vataPercent?: number;
  pittaPercent?: number;
  kaphaPercent?: number;
}

export const PrakritiRadarChart: React.FC<PrakritiRadarChartProps> = ({
  data,
  vataPercent,
  pittaPercent,
  kaphaPercent,
}) => {
  const chartData = data && data.length > 0 ? data : [
    { subject: 'Vata (Air/Ether)', A: vataPercent || 33.3, fullMark: 100 },
    { subject: 'Pitta (Fire/Water)', A: pittaPercent || 33.3, fullMark: 100 },
    { subject: 'Kapha (Water/Earth)', A: kaphaPercent || 33.4, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 sm:h-72 flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Radar
            name="Constitution %"
            dataKey="A"
            stroke="#0d9488"
            fill="#14b8a6"
            fillOpacity={0.45}
          />
          <Tooltip
            formatter={(value: any) => [`${value}%`, 'Score']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
