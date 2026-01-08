import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500/20 via-slate-900 to-purple-500/20 p-4">
      <div
        className="w-full h-full flex rounded-2xl overflow-hidden shadow-2xl
                   bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"
        style={{ minHeight: '95vh' }}
      >
        {/* IMAGE */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img
            src="src/assets/bg.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* GLASS FORM */}
        <div
          className="
            w-full lg:w-1/2 flex items-center justify-center px-6 py-12
            backdrop-blur-xl bg-slate-900/40
            border-l border-white/10
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]
          "
        >
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center space-x-8">
                <Link
                  to="/login"
                  className="text-slate-400 text-xl font-semibold pb-2 hover:text-white"
                >
                  Sign In
                </Link>
                <button className="text-white text-xl font-semibold pb-2 border-b-2 border-cyan-400">
                  Sign Up
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/40 p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <input
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-600
                           text-white focus:border-cyan-400"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-600
                           text-white focus:border-cyan-400"
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-600
                           text-white focus:border-cyan-400"
              />

              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-600
                           text-white focus:border-cyan-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-400 text-slate-900 font-semibold
                           rounded-full hover:bg-cyan-300 transition disabled:opacity-50"
              >
                {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
