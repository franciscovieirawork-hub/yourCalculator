import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/password';

const SECURITY_QUESTIONS = [
  'Qual é o nome do seu animal de estimação?',
  'Qual é o nome da sua cidade natal?',
  'Qual é o nome da sua escola primária?',
  'Qual é o nome do meio da sua mãe?',
  'Qual é o seu prato favorito?',
  'Qual é o nome do seu melhor amigo de infância?',
];

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const validation = validatePassword(value);
    setPasswordError(validation.valid ? '' : validation.error || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validation = validatePassword(password);
    if (!validation.valid) {
      setPasswordError(validation.error || '');
      return;
    }
    if (!securityQuestion || !securityAnswer.trim()) {
      setError('Pergunta e resposta de segurança obrigatórias');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Número de telemóvel obrigatório');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name || undefined, securityQuestion, securityAnswer, phoneNumber || undefined);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao registar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card">
        <h1 className="font-display text-2xl font-semibold text-bank-navy">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-600">
          Guarde o seu perfil fiscal e os resultados das calculadoras.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Nome (opcional)
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field mt-1"
            />
          </div>
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
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Palavra-passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={10}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`input-field mt-1 ${passwordError ? 'border-red-300' : ''}`}
            />
            {passwordError && (
              <p className="mt-1 text-xs text-red-600">{passwordError}</p>
            )}
            {!passwordError && password && (
              <p className="mt-1 text-xs text-green-600">✓ Palavra-passe válida</p>
            )}
            {!password && (
              <p className="mt-1 text-xs text-slate-500">
                Mínimo 10 caracteres, 1 maiúscula, 1 número e 1 caractere especial.
              </p>
            )}
          </div>
          <div>
            <label htmlFor="securityQuestion" className="block text-sm font-medium text-slate-700">
              Pergunta de segurança (para recuperação de palavra-passe)
            </label>
            <select
              id="securityQuestion"
              required
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              className="input-field mt-1"
            >
              <option value="">— Selecionar pergunta —</option>
              {SECURITY_QUESTIONS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="securityAnswer" className="block text-sm font-medium text-slate-700">
              Resposta de segurança
            </label>
            <input
              id="securityAnswer"
              type="text"
              required
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              className="input-field mt-1"
              placeholder="A sua resposta"
            />
            <p className="mt-1 text-xs text-slate-500">
              Esta resposta será usada para recuperar a palavra-passe se a esquecer.
            </p>
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700">
              Telemóvel <span className="text-red-600">*</span>
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
              Necessário para recuperação por SMS e para iniciar sessão.
            </p>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'A registar...' : 'Criar conta'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
