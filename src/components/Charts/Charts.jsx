/**
 * Charts Components
 * Pure CSS/SVG charts for analytics display
 * Includes: LineChart, BarChart, PieChart
 */

// React imports
import React from 'react';

// Styles
import './Charts.css';

// Mock data
import { lineChartData, barChartData, pieChartData } from '../../data/mockData';

/**
 * LineChart Component
 * Displays quiz attempts over time using SVG line chart
 */
export const LineChart = () => {
  // Chart dimensions
  const width = 100;
  const height = 50;
  const padding = 5;
  
  // Get data points
  const data = lineChartData.datasets[0].data;
  const labels = lineChartData.labels;
  
  // Calculate min, max for scaling
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  // Calculate points for the line
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');
  
  // Create filled area path
  const areaPath = `M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`;
  
  return (
    <div className="chart-card">
      {/* Chart header */}
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">Quiz Attempts</h3>
          <p className="chart-card__subtitle">Weekly overview</p>
        </div>
        <div className="chart-card__legend">
          <span className="chart-card__legend-dot chart-card__legend-dot--blue" />
          <span className="chart-card__legend-label">Attempts</span>
        </div>
      </div>
      
      {/* Chart container */}
      <div className="chart-card__body">
        {/* SVG Line Chart */}
        <svg 
          className="line-chart__svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio, i) => (
            <line
              key={i}
              x1={padding}
              y1={height - padding - ratio * (height - padding * 2)}
              x2={width - padding}
              y2={height - padding - ratio * (height - padding * 2)}
              stroke="var(--border-color)"
              strokeWidth="0.3"
              strokeDasharray="1"
            />
          ))}
          
          {/* Filled area */}
          <polygon
            points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
            fill="url(#areaGradient)"
          />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((value, index) => {
            const x = padding + (index / (data.length - 1)) * (width - padding * 2);
            const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill="var(--bg-secondary)"
                stroke="url(#lineGradient)"
                strokeWidth="1"
                className="line-chart__point"
              />
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="line-chart__labels">
          {labels.map((label, index) => (
            <span key={index} className="line-chart__label">{label}</span>
          ))}
        </div>
      </div>
      
      {/* Chart footer stats */}
      <div className="chart-card__footer">
        <div className="chart-card__stat">
          <span className="chart-card__stat-value">2,303</span>
          <span className="chart-card__stat-label">Total this week</span>
        </div>
        <div className="chart-card__stat">
          <span className="chart-card__stat-value chart-card__stat-value--positive">+18%</span>
          <span className="chart-card__stat-label">vs last week</span>
        </div>
      </div>
    </div>
  );
};

/**
 * BarChart Component
 * Displays category distribution using pure CSS bars
 */
export const BarChart = () => {
  const data = barChartData.datasets[0].data;
  const labels = barChartData.labels;
  const colors = barChartData.datasets[0].colors;
  const maxValue = Math.max(...data);
  
  return (
    <div className="chart-card">
      {/* Chart header */}
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">Categories</h3>
          <p className="chart-card__subtitle">Quizzes per category</p>
        </div>
      </div>
      
      {/* Chart container */}
      <div className="chart-card__body">
        <div className="bar-chart">
          {data.map((value, index) => (
            <div key={index} className="bar-chart__item">
              {/* Bar container */}
              <div className="bar-chart__bar-container">
                {/* Actual bar */}
                <div 
                  className="bar-chart__bar"
                  style={{ 
                    height: `${(value / maxValue) * 100}%`,
                    backgroundColor: colors[index],
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Value tooltip */}
                  <span className="bar-chart__value">{value}</span>
                </div>
              </div>
              
              {/* Label */}
              <span className="bar-chart__label" title={labels[index]}>
                {labels[index].substring(0, 4)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * PieChart Component
 * Displays pass/fail ratio using SVG pie chart
 */
export const PieChart = () => {
  const data = pieChartData.datasets[0].data;
  const labels = pieChartData.labels;
  const colors = pieChartData.datasets[0].colors;
  
  // Calculate pie segments
  const total = data.reduce((sum, value) => sum + value, 0);
  let currentAngle = -90; // Start from top
  
  // SVG center and radius
  const cx = 50;
  const cy = 50;
  const radius = 40;
  const innerRadius = 25; // For donut chart effect
  
  /**
   * Calculate arc path for pie segment
   */
  const getArcPath = (startAngle, endAngle, outerR, innerR) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy + outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy + outerR * Math.sin(endRad);
    
    const x3 = cx + innerR * Math.cos(endRad);
    const y3 = cy + innerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(startRad);
    const y4 = cy + innerR * Math.sin(startRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
  };
  
  // Generate segments
  const segments = data.map((value, index) => {
    const angle = (value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    return {
      path: getArcPath(startAngle, endAngle, radius, innerRadius),
      color: colors[index],
      label: labels[index],
      value: value,
      percentage: ((value / total) * 100).toFixed(1)
    };
  });
  
  return (
    <div className="chart-card">
      {/* Chart header */}
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">Pass Rate</h3>
          <p className="chart-card__subtitle">Overall performance</p>
        </div>
      </div>
      
      {/* Chart container */}
      <div className="chart-card__body pie-chart__body">
        {/* SVG Pie Chart */}
        <div className="pie-chart__container">
          <svg viewBox="0 0 100 100" className="pie-chart__svg">
            {/* Segments */}
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.path}
                fill={segment.color}
                className="pie-chart__segment"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            ))}
            
            {/* Center text */}
            <text
              x={cx}
              y={cy - 5}
              textAnchor="middle"
              className="pie-chart__center-value"
            >
              {segments[0].percentage}%
            </text>
            <text
              x={cx}
              y={cy + 10}
              textAnchor="middle"
              className="pie-chart__center-label"
            >
              Passed
            </text>
          </svg>
        </div>
        
        {/* Legend */}
        <div className="pie-chart__legend">
          {segments.map((segment, index) => (
            <div key={index} className="pie-chart__legend-item">
              <span 
                className="pie-chart__legend-dot"
                style={{ backgroundColor: segment.color }}
              />
              <span className="pie-chart__legend-label">{segment.label}</span>
              <span className="pie-chart__legend-value">{segment.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default { LineChart, BarChart, PieChart };
