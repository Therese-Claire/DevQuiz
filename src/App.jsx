
/**
 * Main App Component
 * Integrates all modules and manages global state
 */

import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import TopNavbar from './components/TopNavbar/TopNavbar';
import OverviewCards from './components/OverviewCards/OverviewCards';
import AnalyticsSection from './components/AnalyticsSection/AnalyticsSection';
import UserManagement from './components/UserManagement/UserManagement';
import QuizManagement from './components/QuizManagement/QuizManagement';
import ModalForms from './components/ModalForms/ModalForms';
import Toast from './components/Toast/Toast';
import './App.css';

function App() {
  // Navigation State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'create', // 'create' or 'edit'
    data: null
  });

  // Toast State
  const [toast, setToast] = useState({
    message: null,
    type: 'info'
  });

  // Handlers
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, message: null });
  };

  const openModal = (type = 'create', data = null) => {
    setModalConfig({
      isOpen: true,
      type,
      data
    });
  };

  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleModalSubmit = (formData) => {
    console.log('Form Submitted:', formData);
    // Here we would call API to save data
    showToast(
      modalConfig.type === 'create' ? 'Quiz created successfully!' : 'Changes saved successfully!', 
      'success'
    );
  };

  // Render Content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content animate-fadeIn">
            <OverviewCards />
            <AnalyticsSection />
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'quizzes':
        return <QuizManagement onOpenModal={() => openModal('create')} />;
      case 'questions':
        // Reuse QuizManagement or placeholder for now
         return (
          <div className="placeholder-content animate-fadeIn">
            <h2>Questions Management</h2>
            <p>Manage individual questions here (Coming Soon)</p>
          </div>
        );
      case 'categories':
        return (
           <div className="placeholder-content animate-fadeIn">
            <h2>Category Management</h2>
            <p>Manage quiz categories here (Coming Soon)</p>
          </div>
        );
      default:
        return (
          <div className="placeholder-content animate-fadeIn">
            <h2>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
            <p>Section under development...</p>
          </div>
        );
    }
  };

  return (
    <div className="app">
      {/* Toast Notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={closeToast} 
      />

      {/* Modal Overlay */}
      <ModalForms 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        data={modalConfig.data}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />

      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />
      
      {/* Main Content */}
      <main className="app-main">
        <TopNavbar 
          onMenuToggle={toggleSidebar} 
          activeSection={activeSection} 
        />
        
        <div className="app-container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
