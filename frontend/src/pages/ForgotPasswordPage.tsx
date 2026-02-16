import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../config';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'answer'>('email');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Email não encontrado');
      }
      const data = await res.json();
      setSecurityQuestion(data.securityQuestion);
      setStep('answer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao verificar email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('As palavras-passe não coincidem');
      return;
    }
    if (newPassword.length < 10 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setError('A palavra-passe deve ter pelo menos 10 caracteres, 1 maiúscula, 1 número e 1 caractere especial');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, securityAnswer, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erro ao alterar palavra-passe');
      }
      setMessage('Palavra-passe alterada com sucesso! Pode agora iniciar sessão.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar palavra-passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card">
        <h1 className="font-display text-2xl font-semibold text-bank-navy">Recuperar palavra-passe</h1>
        {step === 'email' ? (
          <>
            <p className="mt-1 text-sm text-slate-600">
              Introduza o seu email para ver a pergunta de segurança.
            </p>
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}
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
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'A verificar...' : 'Continuar'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-slate-600">
              Responda à pergunta de segurança e defina uma nova palavra-passe.
            </p>
            <form onSubmit={handleResetSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}
              {message && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Pergunta de segurança
                </label>
                <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  {securityQuestion}
                </p>
              </div>
              <div>
                <label htmlFor="securityAnswer" className="block text-sm font-medium text-slate-700">
                  Resposta
                </label>
                <input
                  id="securityAnswer"
                  type="text"
                  required
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
                  Nova palavra-passe
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  minLength={10}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field mt-1"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Mínimo 10 caracteres, 1 maiúscula, 1 número e 1 caractere especial.
                </p>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                  Confirmar palavra-passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={10}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field mt-1"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'A alterar...' : 'Alterar palavra-passe'}
              </button>
            </form>
          </>
        )}
        <div className="mt-4 space-y-2 text-center text-sm text-slate-600">
          <Link to="/recuperar-password-sms" className="block font-medium text-primary-600 hover:underline">
            Recuperar por SMS em vez disso
          </Link>
          <Link to="/login" className="block font-medium text-primary-600 hover:underline">
            Voltar para entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
