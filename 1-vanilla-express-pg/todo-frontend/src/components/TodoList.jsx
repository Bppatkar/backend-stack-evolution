import React, { useState } from 'react';
import TodoItem from './TodoItem.jsx';
import { useTodo } from '../contexts/TodoContext.jsx';
import { FiCheckCircle, FiClock } from 'react-icons/fi';

function TodoList() {
  const { todos } = useTodo();
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="card">
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({todos.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            filter === 'active'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FiClock />
          <span>Active ({activeCount})</span>
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            filter === 'completed'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FiCheckCircle />
          <span>Completed ({completedCount})</span>
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {filter === 'all' && todos.length === 0 ? (
              <div className="space-y-2">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl font-medium text-gray-600">
                  No todos yet
                </p>
                <p className="text-gray-500">
                  Create your first todo to get started!
                </p>
              </div>
            ) : filter === 'active' ? (
              <div className="space-y-2">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-xl font-medium text-gray-600">
                  All caught up!
                </p>
                <p className="text-gray-500">No active todos. Great job!</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-xl font-medium text-gray-600">
                  No completed todos
                </p>
                <p className="text-gray-500">
                  Complete some tasks to see them here
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;
