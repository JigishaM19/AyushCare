import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DoshaDistributionChartProps {
  data: Array<{ name: string; percentage?: number; value?: number; fill?: string }>;
}

export const DoshaDistributionChart: React.FC<DoshaDistributionChartProps> = ({ data }) => {
  const formattedData = data.map((d) => ({
    name: d.name,
    score: d.percentage !== undefined ? d.percentage : d.value || 0,
    fill:
      d.fill ||
      (d.name.includes('Vata') ? '#8B5CF6' : d.name.includes('Pitta') ? '#EF4444' : '#10B981'),
  }));

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: any) => [`${value}%`, 'Dosha Ratio']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
