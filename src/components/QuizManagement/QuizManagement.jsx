
/**
 * QuizManagement Component
 * Manage quizzes: list, search, filter, and actions
 */

import React, { useState } from 'react';
import './QuizManagement.css';
import { quizzesData, difficultyLevels, statusOptions } from '../../data/mockData';

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'published': return 'status-badge--published';
      case 'draft': return 'status-badge--draft';
      case 'review': return 'status-badge--review';
      case 'archived': return 'status-badge--archived';
      default: return 'status-badge--default';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

const QuizManagement = ({ onOpenModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logic
  const filteredQuizzes = quizzesData.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || quiz.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="quiz-section animate-fadeIn">
      {/* Header */}
      <div className="quiz-header">
        <div>
          <h2 className="quiz-title">Quiz Management</h2>
          <p className="quiz-subtitle">Create, edit, and manage quizzes</p>
        </div>
        <button className="btn-primary" onClick={onOpenModal}>
          + Create New Quiz
        </button>
      </div>

      {/* Controls */}
      <div className="table-controls">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search quizzes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Table Card */}
      <div className="card quiz-card">
        <div className="table-container">
          <table className="quiz-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Questions</th>
                <th>Pass Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentQuizzes.length > 0 ? (
                currentQuizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>
                      <div className="quiz-title-cell">
                        <span className="quiz-name">{quiz.title}</span>
                      </div>
                    </td>
                    <td><span className="quiz-category">{quiz.category}</span></td>
                    <td>
                      <span className={`difficulty-badge difficulty--${quiz.difficulty.toLowerCase()}`}>
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td><StatusBadge status={quiz.status} /></td>
                    <td className="text-center">{quiz.questions}</td>
                    <td className="text-center">
                      <div className="pass-rate">
                        <span className="pass-rate-val">{quiz.passRate}%</span>
                        <div className="pass-rate-bar">
                          <div 
                            className="pass-rate-fill" 
                            style={{ width: `${quiz.passRate}%`, backgroundColor: quiz.passRate > 70 ? 'var(--accent-green)' : 'var(--accent-orange)' }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" title="Edit">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button className="btn-icon btn-icon--danger" title="Delete">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">No quizzes found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="pagination">
          <button 
            className="btn-secondary" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="btn-secondary" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizManagement;
