import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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
        {/* LEFT — IMAGE */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img
            src="src/assets/bg.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* RIGHT — GLASS FORM */}
        <div
          className="
            w-full lg:w-1/2 flex items-center justify-center px-6 py-12
            backdrop-blur-xl bg-slate-900/40
            border-l border-white/10
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]
          "
        >
          <div className="w-full max-w-md">
            {/* Tabs */}
            <div className="text-center mb-8">
              <div className="flex justify-center space-x-8">
                <button className="text-white text-xl font-semibold pb-2 border-b-2 border-cyan-400">
                  Sign In
                </button>
                <Link
                  to="/register"
                  className="text-slate-400 text-xl font-semibold pb-2 hover:text-white transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/40 p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm text-cyan-400 mb-2">
                  Your email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-600
                             text-white placeholder-slate-500 focus:outline-none
                             focus:border-cyan-400 transition-colors"
                  placeholder="bob.8888@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Your password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-600
                             text-white placeholder-slate-500 focus:outline-none
                             focus:border-cyan-400 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end">
                <a className="text-sm text-cyan-400 hover:text-cyan-300">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-400 text-slate-900 font-semibold
                           rounded-full hover:bg-cyan-300 transition disabled:opacity-50"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
