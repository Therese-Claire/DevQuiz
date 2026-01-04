/**
 * TopNavbar Component
 * Top navigation bar with search, notifications, and profile dropdown
 * Features: Mobile hamburger menu, notification badge, profile dropdown
 */

// React imports
import { useState, useRef, useEffect } from 'react';

// Styles
import './TopNavbar.css';

// Mock data
import { adminUser, notificationsData } from '../../data/mockData';

/**
 * TopNavbar Component
 * @param {function} onMenuToggle - Callback to toggle mobile sidebar
 * @param {string} activeSection - Currently active section name
 */
const TopNavbar = ({ onMenuToggle, activeSection }) => {
  // State for dropdowns
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Refs for click outside detection
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  
  // Count unread notifications
  const unreadCount = notificationsData.filter(n => !n.read).length;
  
  /**
   * Handle click outside to close dropdowns
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close notification dropdown if clicked outside
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      // Close profile dropdown if clicked outside
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  /**
   * Get formatted section title
   */
  const getSectionTitle = () => {
    // Capitalize first letter
    return activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
  };
  
  /**
   * Get notification type icon
   */
  const getNotificationIcon = (type) => {
    const icons = {
      user: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      quiz: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
      system: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    };
    return icons[type] || icons.system;
  };

  return (
    <header className="topnav">
      {/* Left section: Menu toggle and title */}
      <div className="topnav__left">
        {/* Hamburger menu button (mobile only) */}
        <button 
          className="topnav__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        
        {/* Section title */}
        <div className="topnav__title">
          <h1 className="topnav__heading">{getSectionTitle()}</h1>
          <p className="topnav__subtitle">Welcome back, {adminUser.name}</p>
        </div>
      </div>
      
      {/* Right section: Search, notifications, profile */}
      <div className="topnav__right">
        {/* Search bar */}
        <div className="topnav__search">
          <span className="topnav__search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input 
            type="text" 
            className="topnav__search-input"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>
        
        {/* Notification dropdown */}
        <div className="topnav__dropdown" ref={notificationRef}>
          <button 
            className={`topnav__icon-btn ${isNotificationOpen ? 'topnav__icon-btn--active' : ''}`}
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
          >
            {/* Bell icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            
            {/* Notification badge */}
            {unreadCount > 0 && (
              <span className="topnav__badge">{unreadCount}</span>
            )}
          </button>
          
          {/* Notification dropdown menu */}
          {isNotificationOpen && (
            <div className="topnav__dropdown-menu topnav__notifications animate-slideDown">
              {/* Header */}
              <div className="topnav__dropdown-header">
                <span className="topnav__dropdown-title">Notifications</span>
                <button className="topnav__dropdown-action">Mark all read</button>
              </div>
              
              {/* Notification list */}
              <div className="topnav__notification-list">
                {notificationsData.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`topnav__notification-item ${!notification.read ? 'topnav__notification-item--unread' : ''}`}
                  >
                    {/* Icon */}
                    <span className={`topnav__notification-icon topnav__notification-icon--${notification.type}`}>
                      {getNotificationIcon(notification.type)}
                    </span>
                    
                    {/* Content */}
                    <div className="topnav__notification-content">
                      <p className="topnav__notification-title">{notification.title}</p>
                      <p className="topnav__notification-message">{notification.message}</p>
                      <span className="topnav__notification-time">{notification.time}</span>
                    </div>
                    
                    {/* Unread indicator */}
                    {!notification.read && (
                      <span className="topnav__notification-dot" />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Footer */}
              <div className="topnav__dropdown-footer">
                <button className="topnav__dropdown-link">View all notifications</button>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile dropdown */}
        <div className="topnav__dropdown" ref={profileRef}>
          <button 
            className={`topnav__profile-btn ${isProfileOpen ? 'topnav__profile-btn--active' : ''}`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="User menu"
            aria-expanded={isProfileOpen}
          >
            {/* Avatar */}
            <div className="topnav__avatar">
              <span className="topnav__avatar-text">
                {adminUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* User info (hidden on mobile) */}
            <div className="topnav__user-info">
              <span className="topnav__user-name">{adminUser.name}</span>
              <span className="topnav__user-role">{adminUser.role}</span>
            </div>
            
            {/* Chevron icon */}
            <svg className="topnav__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          {/* Profile dropdown menu */}
          {isProfileOpen && (
            <div className="topnav__dropdown-menu topnav__profile-menu animate-slideDown">
              {/* Profile section */}
              <div className="topnav__profile-header">
                <div className="topnav__avatar topnav__avatar--lg">
                  <span className="topnav__avatar-text">
                    {adminUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="topnav__profile-info">
                  <span className="topnav__profile-name">{adminUser.name}</span>
                  <span className="topnav__profile-email">{adminUser.email}</span>
                </div>
              </div>
              
              {/* Menu items */}
              <div className="topnav__profile-items">
                <button className="topnav__profile-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>My Profile</span>
                </button>
                
                <button className="topnav__profile-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09" />
                  </svg>
                  <span>Settings</span>
                </button>
                
                <button className="topnav__profile-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>Help & Support</span>
                </button>
              </div>
              
              {/* Logout */}
              <div className="topnav__profile-footer">
                <button className="topnav__profile-item topnav__profile-item--danger">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
