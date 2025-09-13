"use client";

import { DocIcon, ImageIcon, VideoIcon, AudioIcon, FileIcon } from '@/components/shared/icons';

interface PieChartProps {
  data: {
    images: number;
    videos: number;
    audios: number;
    documents: number;
    others: number;
  };
  total: number;
}

export function PieChart({ data, total }: PieChartProps) {
  const chartData = [
    { type: 'images', count: data.images, color: '#10B981', icon: '📷' },
    { type: 'videos', count: data.videos, color: '#8B5CF6', icon: '🎥' },
    { type: 'audios', count: data.audios, color: '#F59E0B', icon: '🎵' },
    { type: 'documents', count: data.documents, color: '#EF4444', icon: '📄' },
    { type: 'others', count: data.others, color: '#6B7280', icon: '📁' },
  ].filter(item => item.count > 0);

  const radius = 50; // Reduced from 80 to 50
  const centerX = 60; // Reduced from 100 to 60
  const centerY = 60; // Reduced from 100 to 60
  let currentAngle = 0;

  const segments = chartData.map((item) => {
    const angle = (item.count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    // Calculate path for pie segment
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    // Calculate position for icon and count in the middle of the segment
    const midAngle = (startAngle + endAngle) / 2;
    const midAngleRad = (midAngle * Math.PI) / 180;
    const iconRadius = radius * 0.65; // Position icons closer to center
    const iconX = centerX + iconRadius * Math.cos(midAngleRad);
    const iconY = centerY + iconRadius * Math.sin(midAngleRad);
    
    currentAngle += angle;
    
    return {
      ...item,
      pathData,
      iconX,
      iconY,
      midAngle
    };
  });

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Pie Chart SVG - smaller size */}
        <svg width="120" height="120" className="transform -rotate-90">
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity"
              />
            </g>
          ))}
          
          {/* Icons and counts positioned separately */}
          {segments.map((segment, index) => (
            <g key={`text-${index}`} className="transform rotate-90">
              {/* Count number */}
              <text
                x={segment.iconX}
                y={segment.iconY - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-sm font-bold"
                fontSize="10"
                fontWeight="bold"
              >
                {segment.count}
              </text>
              
              {/* Icon emoji */}
              <text
                x={segment.iconX}
                y={segment.iconY + 6}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white"
                fontSize="12"
              >
                {segment.icon}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
