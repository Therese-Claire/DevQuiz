/**
 * Sidebar Component
 * Fixed left navigation sidebar with collapsible mobile support
 * Features: Navigation items, active state highlighting, gradient accents
 */

// React imports
import { useState } from 'react';

// Styles
import './Sidebar.css';

// Navigation items configuration
import { navigationItems } from '../../data/mockData';

/**
 * Icon component - Renders SVG icons based on icon name
 * @param {string} name - Icon identifier
 * @param {string} className - Additional CSS classes
 */
const Icon = ({ name, className = '' }) => {
  // SVG icons mapped by name
  const icons = {
    // Dashboard icon - grid layout
    dashboard: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    // Users icon - multiple people
    users: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    // Quiz icon - document with checkmark
    quiz: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
    // Question icon - question mark circle
    question: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    // Category icon - folder
    category: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    // Analytics icon - bar chart
    analytics: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    // Reports icon - file text
    reports: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    // Settings icon - gear
    settings: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    // Close icon - X
    close: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    )
  };

  return (
    <span className={`sidebar-icon ${className}`}>
      {icons[name] || icons.dashboard}
    </span>
  );
};

/**
 * Sidebar Component
 * @param {string} activeSection - Currently active navigation section
 * @param {function} onNavigate - Callback when navigation item is clicked
 * @param {boolean} isOpen - Mobile sidebar open state
 * @param {function} onClose - Callback to close mobile sidebar
 */
const Sidebar = ({ activeSection, onNavigate, isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile - closes sidebar when clicked */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar container */}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Logo section */}
        <div className="sidebar__header">
          {/* Logo with gradient text */}
          <div className="sidebar__logo">
            <span className="sidebar__logo-icon">
              {/* Quiz icon */}
              <svg viewBox="0 0 24 24" fill="none">
                <path 
                  d="M12 2L2 7l10 5 10-5-10-5z" 
                  fill="url(#logoGradient)"
                />
                <path 
                  d="M2 17l10 5 10-5M2 12l10 5 10-5" 
                  stroke="url(#logoGradient)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="sidebar__logo-text">
              Dev<span className="text-gradient">Quiz</span>
            </span>
          </div>
          
          {/* Close button for mobile */}
          <button 
            className="sidebar__close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="sidebar__nav">
          <ul className="sidebar__menu">
            {navigationItems.map((item) => (
              <li key={item.id} className="sidebar__menu-item">
                <button
                  className={`sidebar__link ${activeSection === item.id ? 'sidebar__link--active' : ''}`}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose(); // Close mobile sidebar on navigation
                  }}
                >
                  {/* Gradient background for active state */}
                  <span className="sidebar__link-bg" />
                  
                  {/* Icon */}
                  <Icon name={item.icon} className="sidebar__link-icon" />
                  
                  {/* Label */}
                  <span className="sidebar__link-label">{item.label}</span>
                  
                  {/* Active indicator dot */}
                  {activeSection === item.id && (
                    <span className="sidebar__active-dot" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer section */}
        <div className="sidebar__footer">
          <div className="sidebar__footer-card">
            <div className="sidebar__footer-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="sidebar__footer-content">
              <p className="sidebar__footer-title">Need Help?</p>
              <p className="sidebar__footer-text">Check our documentation</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
