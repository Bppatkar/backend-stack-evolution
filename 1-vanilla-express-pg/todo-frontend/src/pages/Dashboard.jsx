import { useEffect, useState } from 'react';
import { useTodo } from '../contexts/TodoContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import TodoList from '../components/TodoList.jsx';
import TodoForm from '../components/TodoForm.jsx';
import Loader from '../components/Loader.jsx';
import { FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const { todos, loading, fetchTodos } = useTodo();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading && todos.length === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-2">
                You have {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <FiPlus />
              <span>Add Todo</span>
            </button>
          </div>

          {showForm && (
            <div className="mb-8">
              <TodoForm onClose={() => setShowForm(false)} />
            </div>
          )}

          <TodoList />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
