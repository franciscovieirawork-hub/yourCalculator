import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validatePassword } from '../utils/password';
import { apiUrl } from '../config';

export function ForgotPasswordSMSPage() {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/auth/forgot-password-sms'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erro ao enviar código');
      }
      const data = await res.json();
      setMessage(data.message);
      if (data.devCode) {
        // Apenas em desenvolvimento - mostrar código no console
        console.log('🔐 Código SMS (dev):', data.devCode);
        setMessage(`Código enviado! (dev: ${data.devCode})`);
      }
      setStep('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar código');
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
    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      setError(validation.error || 'Palavra-passe inválida');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/auth/reset-password-sms'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erro ao alterar palavra-passe');
      }
      setMessage('Palavra-passe alterada com sucesso! A redirecionar...');
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
        <h1 className="font-display text-2xl font-semibold text-bank-navy">Recuperar por SMS</h1>
        {step === 'phone' ? (
          <>
            <p className="mt-1 text-sm text-slate-600">
              Introduza o seu número de telemóvel para receber um código por SMS.
            </p>
            <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}
              {message && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>
              )}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700">
                  Número de telemóvel
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-field mt-1"
                  placeholder="912345678 ou +351912345678"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Formato: 912345678 ou +351912345678
                </p>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'A enviar...' : 'Enviar código'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-slate-600">
              Introduza o código recebido por SMS e defina uma nova palavra-passe.
            </p>
            <form onSubmit={handleResetSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}
              {message && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>
              )}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-slate-700">
                  Código recebido por SMS
                </label>
                <input
                  id="code"
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="input-field mt-1 text-center text-2xl tracking-widest"
                  placeholder="000000"
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
          <Link to="/recuperar-password" className="block font-medium text-primary-600 hover:underline">
            Usar pergunta de segurança em vez disso
          </Link>
          <Link to="/login" className="block font-medium text-primary-600 hover:underline">
            Voltar para entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
