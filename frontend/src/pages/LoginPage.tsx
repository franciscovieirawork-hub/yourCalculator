import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(password, loginMethod === 'email' ? email : undefined, loginMethod === 'phone' ? phoneNumber : undefined);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao iniciar sessão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card">
        <h1 className="font-display text-2xl font-semibold text-bank-navy">Entrar</h1>
        <p className="mt-1 text-sm text-slate-600">
          Aceda ao seu perfil e aos documentos guardados.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Iniciar sessão com
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  loginMethod === 'phone'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Telemóvel
              </button>
            </div>
          </div>
          {loginMethod === 'email' ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700">
                Número de telemóvel
              </label>
              <input
                id="phoneNumber"
                type="tel"
                required
                autoComplete="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input-field mt-1"
                placeholder="912345678 ou +351912345678"
              />
            </div>
          )}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Palavra-passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-1"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'A iniciar sessão...' : 'Entrar'}
          </button>
        </form>
        <div className="mt-4 space-y-2 text-center text-sm text-slate-600">
          <Link to="/recuperar-password" className="block font-medium text-primary-600 hover:underline">
            Esqueceu-se da palavra-passe? (pergunta de segurança)
          </Link>
          <Link to="/recuperar-password-sms" className="block font-medium text-primary-600 hover:underline">
            Recuperar por SMS
          </Link>
        </div>
        <p className="mt-2 text-center text-sm text-slate-600">
          Ainda não tem conta?{' '}
          <Link to="/registo" className="font-medium text-primary-600 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
