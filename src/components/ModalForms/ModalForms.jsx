
/**
 * ModalForms Component
 * Renders overlay modals for creating/editing content
 */

import React, { useState, useEffect } from 'react';
import './ModalForms.css';
import { difficultyLevels, categoriesData } from '../../data/mockData';

const ModalForms = ({ isOpen, onClose, type, data, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    difficulty: 'Beginner',
    status: 'Draft',
    description: ''
  });

  // Reset or populate form when opening
  useEffect(() => {
    if (isOpen) {
      if (data) {
        setFormData(data);
      } else {
        setFormData({
          title: '',
          category: '',
          difficulty: 'Beginner',
          status: 'Draft',
          description: ''
        });
      }
    }
  }, [isOpen, data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="modal-content animate-slideUp" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {type === 'edit' ? 'Edit Quiz' : 'Create New Quiz'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Quiz Title</label>
            <input 
              type="text" 
              name="title" 
              className="form-input" 
              placeholder="e.g. JavaScript Fundamentals"
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                name="category" 
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categoriesData.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select 
                name="difficulty" 
                className="form-select"
                value={formData.difficulty}
                onChange={handleChange}
              >
                {difficultyLevels.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description" 
              className="form-textarea" 
              placeholder="Brief description of the quiz..."
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {type === 'edit' ? 'Save Changes' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForms;
