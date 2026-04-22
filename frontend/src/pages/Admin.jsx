import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Users, Trash2, Shield, UserCheck, Loader } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers({ limit: 50 });
      setUsers(res.data.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateRole(userId, newRole);
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}" and all their tasks?`)) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin container fade-in">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <Shield size={28} />
            Admin Panel
          </h1>
          <p className="admin-subtitle">Manage users and their roles</p>
        </div>
        <div className="admin-stat">
          <Users size={18} />
          <span>{users.length} users</span>
        </div>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="user-row">
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name-text">{u.name}</span>
                  </div>
                </td>
                <td className="user-email">{u.email}</td>
                <td>
                  <select
                    className="role-select"
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="user-date">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(u._id, u.name)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
