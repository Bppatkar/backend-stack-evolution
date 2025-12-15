import React, { useState } from 'react';
import { useTodo } from '../contexts/TodoContext.jsx';
import { FiX } from 'react-icons/fi';

function TodoForm({ onClose, todo = null }) {
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const { createTodo, updateTodo } = useTodo();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    setLoading(true);
    try {
      let result;
      if (todo) {
        // For editing
        result = await updateTodo(todo.id, formData);
      } else {
        // For creating
        result = await createTodo(formData.title, formData.description || '');
        if (result.success) {
          setFormData({ title: '', description: '' });
        }
      }
      
      // Close form if successful
      if (result.success && onClose) {
        onClose();
      }
    } catch (error) {
      // console.error('Failed to save todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {todo ? 'Edit Todo' : 'Add New Todo'}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="What needs to be done?"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field min-h-[100px]"
            placeholder="Add details about this task..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="btn-primary"
          >
            {loading ? 'Saving...' : todo ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TodoForm;