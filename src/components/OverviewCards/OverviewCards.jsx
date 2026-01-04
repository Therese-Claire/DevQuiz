/**
 * OverviewCards Component
 * Displays key statistics in a responsive card grid
 * Features: Icon indicators, change percentages, hover animations, gradient accents
 */

// React imports
import React from 'react';

// Styles
import './OverviewCards.css';

// Mock data
import { statisticsData } from '../../data/mockData';

/**
 * StatIcon component - Renders appropriate icon based on type
 * @param {string} type - Icon type identifier
 */
const StatIcon = ({ type }) => {
  // Icon definitions with SVG
  const icons = {
    // Users icon
    users: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    // Active user icon
    userActive: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polyline points="17 11 19 13 23 9" />
      </svg>
    ),
    // Quiz icon
    quiz: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
    // Question icon
    question: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    // Attempt icon (play circle)
    attempt: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
    // Chart icon (trending up)
    chart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    )
  };

  return icons[type] || icons.chart;
};

/**
 * TrendIcon component - Renders up/down arrow based on change type
 * @param {string} type - 'positive' or 'negative'
 */
const TrendIcon = ({ type }) => {
  if (type === 'positive') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
};

/**
 * OverviewCards Component
 * Renders a grid of statistic cards
 */
const OverviewCards = () => {
  return (
    <section className="overview-cards">
      {/* Section header */}
      <div className="overview-cards__header">
        <h2 className="overview-cards__title">Overview</h2>
        <p className="overview-cards__subtitle">Key metrics at a glance</p>
      </div>

      {/* Cards grid */}
      <div className="overview-cards__grid">
        {statisticsData.map((stat, index) => (
          <article 
            key={stat.id}
            className={`stat-card stat-card--${stat.color}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Gradient top border accent */}
            <div className="stat-card__accent" />
            
            {/* Card content */}
            <div className="stat-card__content">
              {/* Icon container */}
              <div className={`stat-card__icon stat-card__icon--${stat.color}`}>
                <StatIcon type={stat.icon} />
              </div>
              
              {/* Text content */}
              <div className="stat-card__info">
                {/* Title */}
                <span className="stat-card__title">{stat.title}</span>
                
                {/* Value */}
                <span className="stat-card__value">{stat.value}</span>
                
                {/* Change indicator */}
                <div className={`stat-card__change stat-card__change--${stat.changeType}`}>
                  <span className="stat-card__change-icon">
                    <TrendIcon type={stat.changeType} />
                  </span>
                  <span className="stat-card__change-value">{stat.change}</span>
                  <span className="stat-card__change-text">vs last month</span>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="stat-card__decoration">
              <StatIcon type={stat.icon} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default OverviewCards;
