import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Plus, Trash2, Edit3, Check, X, ListTodo, Clock, CheckCircle2,
  AlertTriangle, ChevronDown, Filter, Loader, ClipboardList, TrendingUp
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [form, setForm] = useState({
    title: '', description: '', status: 'todo', priority: 'medium', dueDate: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      params.limit = 50;

      const res = await tasksAPI.getAll(params);
      setTasks(res.data.data.tasks);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await tasksAPI.getStats();
      setStats(res.data.data);
    } catch (err) {
      // silent
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
    setEditingTask(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await tasksAPI.update(editingTask._id, form);
        toast.success('Task updated!');
      } else {
        await tasksAPI.create(form);
        toast.success('Task created!');
      }
      resetForm();
      fetchTasks();
      fetchStats();
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Operation failed';
      toast.error(message);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(id);
      toast.success('Task deleted');
      fetchTasks();
      fetchStats();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusToggle = async (task) => {
    const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
    try {
      await tasksAPI.update(task._id, { status: nextStatus });
      fetchTasks();
      fetchStats();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const statusIcon = (status) => {
    if (status === 'todo') return <ListTodo size={14} />;
    if (status === 'in-progress') return <Clock size={14} />;
    return <CheckCircle2 size={14} />;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard container fade-in">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]}
          </h1>
          <p className="dash-subtitle">Here's your task overview</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }} id="create-task-btn">
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-total">
              <TrendingUp size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-todo">
              <ListTodo size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.byStatus?.todo || 0}</span>
              <span className="stat-label">To Do</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-progress">
              <Clock size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.byStatus?.['in-progress'] || 0}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-done">
              <CheckCircle2 size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.byStatus?.done || 0}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="modal slide-in">
            <div className="modal-header">
              <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
              <button className="btn btn-ghost" onClick={resetForm}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="task-form">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="What needs to be done?"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  id="task-title"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="Add details (optional)"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  id="task-description"
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    id="task-status"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    id="task-priority"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  id="task-due-date"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary" id="task-submit">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <Filter size={16} />
          <select
            className="form-select filter-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            id="filter-status"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            className="form-select filter-select"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            id="filter-priority"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <span className="task-count">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={56} />
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus size={18} /> Create Task
          </button>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task, index) => (
            <div
              key={task._id}
              className={`task-card ${task.status === 'done' ? 'task-done' : ''}`}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className="task-left">
                <button
                  className={`status-toggle status-${task.status}`}
                  onClick={() => handleStatusToggle(task)}
                  title="Toggle status"
                >
                  {statusIcon(task.status)}
                </button>
                <div className="task-info">
                  <h3 className="task-title">{task.title}</h3>
                  {task.description && (
                    <p className="task-desc">{task.description}</p>
                  )}
                  <div className="task-meta">
                    <span className={`badge badge-${task.status}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                    <span className={`badge badge-${task.priority}`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="task-due">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="task-actions">
                <button className="btn btn-ghost" onClick={() => handleEdit(task)} title="Edit">
                  <Edit3 size={16} />
                </button>
                <button className="btn btn-ghost" onClick={() => handleDelete(task._id)} title="Delete" style={{ color: 'var(--danger)' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
