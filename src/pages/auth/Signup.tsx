import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password);
      navigate('/auth/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 border border-amber-700/30 rounded-lg p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-amber-400 mb-2 text-center">Join the Crew</h1>
          <p className="text-amber-100 text-center mb-8">Create your admin account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-600 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-amber-100 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600 transition"
                placeholder="captain@seas.local"
              />
            </div>

            <div>
              <label className="block text-amber-100 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600 transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-amber-100 text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-bold py-2 rounded transition"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-amber-100 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/auth/login')}
              className="text-amber-400 hover:text-amber-300 font-bold transition"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
