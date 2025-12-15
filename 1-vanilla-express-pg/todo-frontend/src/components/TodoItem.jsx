import { useState } from 'react';
import { useTodo } from '../contexts/TodoContext.jsx';
import TodoForm from './TodoForm.jsx';
import { FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';

const TodoItem = ({ todo }) => {
  const [showEdit, setShowEdit] = useState(false);
  const { toggleTodo, deleteTodo } = useTodo();

  const handleToggle = async () => {
    await toggleTodo(todo.id);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await deleteTodo(todo.id);
    }
  };

  if (showEdit) {
    return (
      <TodoForm
        todo={todo}
        onClose={() => setShowEdit(false)}
      />
    );
  }

  return (
    <div
      className={`border rounded-lg p-4 ${
        todo.completed
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start space-x-4">
        <button
          onClick={handleToggle}
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {todo.completed && <FiCheck size={14} />}
        </button>

        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h3
                className={`font-medium ${
                  todo.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-900'
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p className="text-gray-600 mt-1">{todo.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>
                  Created: {new Date(todo.created_at).toLocaleDateString()}
                </span>
                {todo.updated_at !== todo.created_at && (
                  <span>
                    Updated: {new Date(todo.updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowEdit(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Edit"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;