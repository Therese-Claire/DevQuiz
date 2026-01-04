/**
 * AnalyticsSection Component
 * Container for analytics charts in a responsive grid layout
 */

// React imports
import React from 'react';

// Styles
import './AnalyticsSection.css';

// Chart components
import { LineChart, BarChart, PieChart } from '../Charts/Charts';

/**
 * AnalyticsSection Component
 * Displays analytics charts in a responsive grid
 */
const AnalyticsSection = () => {
  return (
    <section className="analytics-section">
      {/* Section header */}
      <div className="analytics-section__header">
        <h2 className="analytics-section__title">Analytics</h2>
        <p className="analytics-section__subtitle">Performance insights and statistics</p>
      </div>

      {/* Charts grid */}
      <div className="analytics-section__grid">
        {/* Line Chart - Takes full width on first row */}
        <div className="analytics-section__item analytics-section__item--wide">
          <LineChart />
        </div>
        
        {/* Bar Chart */}
        <div className="analytics-section__item">
          <BarChart />
        </div>
        
        {/* Pie Chart */}
        <div className="analytics-section__item">
          <PieChart />
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
