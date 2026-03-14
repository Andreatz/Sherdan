import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { it } from '../../content/texts';

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
      setError(it.signup.errors.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(it.signup.errors.passwordLength);
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password);
      navigate('/auth/login');
    } catch (err: any) {
      setError(err.message || it.signup.errors.generic);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 border border-amber-700/30 rounded-lg p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-amber-400 text-center mb-2">
          {it.signup.title}
        </h1>
        <p className="text-slate-300 text-center mb-6">
          {it.signup.subtitle}
        </p>

        {error && (
          <div className="mb-4 rounded bg-red-900/40 border border-red-700/40 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-amber-200 mb-2">{it.signup.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600 transition"
              placeholder={it.signup.emailPlaceholder}
            />
          </div>

          <div>
            <label className="block text-amber-200 mb-2">{it.signup.password}</label>
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
            <label className="block text-amber-200 mb-2">
              {it.signup.confirmPassword}
            </label>
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
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded transition"
          >
            {isLoading ? it.signup.loading : it.signup.submit}
          </button>
        </form>

        <p className="text-slate-300 text-center mt-6">
          {it.signup.loginPrompt}{' '}
          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className="text-amber-400 hover:text-amber-300 font-bold transition"
          >
            {it.signup.loginAction}
          </button>
        </p>
      </div>
    </div>
  );
};
