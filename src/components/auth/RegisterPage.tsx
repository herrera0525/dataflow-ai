import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, User, Building2, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName, companyName);

    if (error) {
      // Sanitize error messages to avoid exposing sensitive information
      const sanitizedMessage = error.message.includes('already registered')
        ? 'An account with this email already exists'
        : 'An error occurred. Please try again.';
      setError(sanitizedMessage);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
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
          <h2 className="text-2xl font-bold text-white mb-2">Start your free trial</h2>
          <p className="text-gray-400 mb-8">No credit card required. Get started in minutes.</p>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="Acme Inc"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Work Email</label>
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

            <div>
              <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  maxLength={128}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-300 font-medium">Free trial includes:</p>
              <p className="text-gray-400 mt-1">100 documents, AI processing, 1 team member</p>
            </div>
          </div>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}