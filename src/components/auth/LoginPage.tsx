import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      // Sanitize error messages to avoid exposing sensitive information
      const sanitizedMessage = error.message.includes('Invalid login credentials')
        ? 'Invalid email or password'
        : 'An error occurred. Please try again.';
      setError(sanitizedMessage);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            DataFlow<span className="text-blue-400">AI</span>
          </span>
        </Link>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8">Sign in to continue automating your workflow.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  placeholder="you@company.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  maxLength={128}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400">
                <input type="checkbox" className="mr-2 rounded border-gray-700 bg-gray-900" />
                Remember me
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              Start free trial
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}