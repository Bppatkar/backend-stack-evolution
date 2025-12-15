import React, { createContext, useCallback, useContext, useState } from 'react';
import { todoAPI } from '../utils/api.js';
import toast from 'react-hot-toast';

const TodoContext = createContext();

export const useTodo = () => useContext(TodoContext);

function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoAPI.getAll();
      setTodos(response.data.todos || []);
      return { success: true, todos: response.data.todos || [] };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to load todos';
      setError(message);
      console.error('Failed to fetch todos:', error);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = async (title, description = '') => {
    try {
      setError(null);

      // Handle both object and separate parameters
      if (typeof title === 'object' && title !== null) {
        const todoData = title;
        title = String(todoData.title || '');
        description = String(todoData.description || '');
      } else {
        title = String(title || '');
        description = String(description || '');
      }

      console.log('Creating todo with:', { title, description });
      const response = await todoAPI.create({ title, description });
      const newTodo = response.data.todo;
      setTodos((prev) => [newTodo, ...prev]);
      toast.success('Todo created successfully!');
      return { success: true, todo: newTodo };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create todo';
      setError(message);
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateTodo = async (id, data) => {
    try {
      setError(null);
      const response = await todoAPI.update(id, data);
      const updatedTodo = response.data.todo;
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      toast.success('Todo updated successfully!');
      return { success: true, todo: updatedTodo };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update todo';
      setError(message);
      toast.error(message);
      return { success: false, message };
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError(null);
      await todoAPI.delete(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      toast.success('Todo deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete todo';
      setError(message);
      toast.error(message);
      return { success: false, message };
    }
  };

  const toggleTodo = async (id) => {
    try {
      setError(null);
      const response = await todoAPI.toggle(id);
      const toggledTodo = response.data.todo;
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? toggledTodo : todo))
      );
      const message = toggledTodo.completed
        ? 'Todo marked as completed!'
        : 'Todo marked as incomplete!';
      toast.success(message);
      return { success: true, todo: toggledTodo };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to toggle todo';
      setError(message);
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    // Stats
    totalTodos: todos.length,
    completedTodos: todos.filter((todo) => todo.completed).length,
    pendingTodos: todos.filter((todo) => !todo.completed).length,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export default TodoProvider;
