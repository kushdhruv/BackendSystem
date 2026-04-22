import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Shield, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authAPI.register(form);
      const { user, token } = res.data.data;
      login(user, token);
      toast.success(`Welcome, ${user.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>
      <div className="auth-container fade-in">
        <div className="auth-header">
          <div className="auth-logo">
            <Shield size={28} />
          </div>
          <h1>Create Account</h1>
          <p>Get started with your task manager</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                id="register-name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
                id="register-email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Min 6 characters including a number"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                id="register-password"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
              id="register-role"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading} id="register-submit">
            {loading ? <Loader size={18} className="spin" /> : <ArrowRight size={18} />}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
