import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../api/userApi';

const ACCENT = '#2C0703';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) return setError('Name is required');
    if (!formData.email.trim()) return setError('Email is required');
    if (formData.password && formData.password.length < 6)
      return setError('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword)
      return setError('Passwords do not match');

    setLoading(true);

    try {
      const updateData = {};
      if (formData.name !== user.name) updateData.name = formData.name;
      if (formData.email !== user.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;

      if (!Object.keys(updateData).length) {
        setError('No changes detected');
        setLoading(false);
        return;
      }

      const response = await userApi.updateUser(updateData);

      if (response.data?.user) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
          })
        );
      }

      setSuccess('Profile updated successfully!');
      setFormData({ ...formData, password: '', confirmPassword: '' });

      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setError('');

    try {
      await userApi.deleteUser();
      await logout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete account');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div
        className="relative border-b px-10 pt-6 pb-6 flex items-center gap-6"
        style={{ backgroundColor: ACCENT }}
      >
        {/* Floating Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          aria-label="Go back"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke={ACCENT}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Header Text Beside Button */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-white">
            Profile Settings
          </h1>
          <p className="text-white/80 text-sm">
            Manage your account information and security
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-10 py-10 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div
            className="flex items-center gap-6 px-10 py-8 border-b"
            style={{ backgroundColor: ACCENT }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: '#d1d5db', color: '#374151' }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                {user?.name || 'User'}
              </h2>
              <p className="text-slate-300 text-sm">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-10 py-8 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:outline-none"
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:outline-none"
              />
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="password"
                  name="password"
                  placeholder="New password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:outline-none"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
          <div className="px-10 py-6 border-b" style={{ backgroundColor: ACCENT }}>
            <h3 className="text-lg font-semibold text-white">Danger Zone</h3>
          </div>

          <div className="px-10 py-8 flex items-start justify-between gap-6 bg-slate-50">
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">
                Delete Account
              </h4>
              <p className="text-sm text-slate-600 max-w-xl">
                This action is permanent and cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Delete account?</h3>
            <p className="text-slate-600 mb-6">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-200 hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
