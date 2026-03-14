import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { it } from '../../content/texts';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.message || it.login.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 border border-amber-700/30 rounded-lg p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-amber-400 text-center mb-2">
          {it.login.title}
        </h1>
        <p className="text-slate-300 text-center mb-6">
          {it.login.subtitle}
        </p>

        {error && (
          <div className="mb-4 rounded bg-red-900/40 border border-red-700/40 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-amber-200 mb-2">{it.login.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600 transition"
              placeholder={it.login.emailPlaceholder}
            />
          </div>

          <div>
            <label className="block text-amber-200 mb-2">{it.login.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {isLoading ? it.login.loading : it.login.submit}
          </button>
        </form>

        <p className="text-slate-300 text-center mt-6">
          {it.login.signupPrompt}{' '}
          <button
            type="button"
            onClick={() => navigate('/auth/signup')}
            className="text-amber-400 hover:text-amber-300 font-bold transition"
          >
            {it.login.signupAction}
          </button>
        </p>
      </div>
    </div>
  );
};
