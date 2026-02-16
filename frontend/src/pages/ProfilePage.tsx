import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/password';
import { apiUrl } from '../config';
import type { UserProfile } from '../context/AuthContext';

const TAX_SITUATIONS = [
  { value: '', label: '— Selecionar —' },
  { value: 'single', label: 'Não casado(a) sem dependentes' },
  { value: 'single_dependents', label: 'Não casado(a) com um ou mais dependentes' },
  { value: 'married_one', label: 'Casado(a), único titular' },
  { value: 'married_two', label: 'Casado(a), dois titulares' },
];

const REGIONS = [
  { value: '', label: '— Selecionar —' },
  { value: 'mainland', label: 'Continente' },
  { value: 'madeira', label: 'Madeira' },
  { value: 'azores', label: 'Açores' },
];

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('yc_token');
    fetch(apiUrl('/profile'), { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => setProfile({}))
      .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (key: keyof UserProfile, value: unknown) => {
    setProfile((p) => (p ? { ...p, [key]: value } : { [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage('');
    const token = localStorage.getItem('yc_token');
    try {
      const res = await fetch(apiUrl('/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error('Erro ao guardar');
      await refreshUser();
      setMessage('Perfil atualizado com sucesso.');
    } catch {
      setMessage('Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-600">Inicie sessão para editar o perfil.</p>
      </div>
    );
  }

  if (loading || !profile) {
    return <div className="mx-auto max-w-2xl px-4 py-12 text-center text-slate-500">A carregar...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="card">
        <h1 className="font-display text-2xl font-semibold text-bank-navy">Perfil</h1>
        <p className="mt-1 text-sm text-slate-600">
          Estes dados podem ser usados para preencher automaticamente as calculadoras.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {message && (
            <div className={`rounded-lg p-3 text-sm ${message.includes('sucesso') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <section>
            <h2 className="text-lg font-medium text-bank-navy">Situação fiscal</h2>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Situação para IRS</label>
                <select
                  value={profile.taxSituation ?? ''}
                  onChange={(e) => handleChange('taxSituation', e.target.value || null)}
                  className="input-field mt-1"
                >
                  {TAX_SITUATIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">N.º de dependentes</label>
                <input
                  type="number"
                  min={0}
                  value={profile.numberOfDependents ?? 0}
                  onChange={(e) => handleChange('numberOfDependents', parseInt(e.target.value, 10) || 0)}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Regime IRS (casado)</label>
                <select
                  value={profile.irsRegime ?? ''}
                  onChange={(e) => handleChange('irsRegime', e.target.value || null)}
                  className="input-field mt-1"
                >
                  <option value="">—</option>
                  <option value="joint">Conjunto</option>
                  <option value="separate">Separado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Região (salário mínimo)</label>
                <select
                  value={profile.region ?? ''}
                  onChange={(e) => handleChange('region', e.target.value || null)}
                  className="input-field mt-1"
                >
                  {REGIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-bank-navy">Benefícios e opções</h2>
            <div className="mt-3 space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.adse ?? false}
                  onChange={(e) => handleChange('adse', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700">ADSE</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.irsJovem ?? false}
                  onChange={(e) => handleChange('irsJovem', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700">IRS Jovem (até 35 anos)</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-slate-700">Subsídio de alimentação (€/dia)</label>
                <input
                  type="number"
                  step={0.01}
                  min={0}
                  value={profile.mealAllowance ?? ''}
                  onChange={(e) => handleChange('mealAllowance', e.target.value === '' ? null : parseFloat(e.target.value))}
                  className="input-field mt-1"
                  placeholder="ex: 6"
                />
                <p className="mt-1 text-xs text-slate-500">Isento até 6€/dia em 2026.</p>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.mealAllowanceTaxFree ?? true}
                  onChange={(e) => handleChange('mealAllowanceTaxFree', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700">Subsídio alimentação isento (até 6€)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.twelfthHoliday ?? false}
                  onChange={(e) => handleChange('twelfthHoliday', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700">Duodécimos subsídio de férias</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.twelfthChristmas ?? false}
                  onChange={(e) => handleChange('twelfthChristmas', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700">Duodécimos subsídio de Natal</span>
              </label>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-bank-navy">Trabalhador independente</h2>
            <div className="mt-3 space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.selfEmployed ?? false}
                  onChange={(e) => handleChange('selfEmployed', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700">Sou trabalhador independente (recibos verdes)</span>
              </label>
              {profile.selfEmployed && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Código atividade (CAE)</label>
                    <input
                      type="text"
                      value={profile.activityCode ?? ''}
                      onChange={(e) => handleChange('activityCode', e.target.value || null)}
                      className="input-field mt-1"
                      placeholder="opcional"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={profile.firstYearActivity ?? false}
                      onChange={(e) => handleChange('firstYearActivity', e.target.checked)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">Primeiro ano de atividade (benefícios)</span>
                  </label>
                </>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-bank-navy">Imobiliário (IMI)</h2>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Concelho</label>
                <input
                  type="text"
                  value={profile.municipality ?? ''}
                  onChange={(e) => handleChange('municipality', e.target.value || null)}
                  className="input-field mt-1"
                  placeholder="ex: Lisboa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Taxa IMI (%) – opcional</label>
                <input
                  type="number"
                  step={0.01}
                  min={0.3}
                  max={0.45}
                  value={profile.municipalityTaxRate ?? ''}
                  onChange={(e) => handleChange('municipalityTaxRate', e.target.value === '' ? null : parseFloat(e.target.value))}
                  className="input-field mt-1"
                  placeholder="0.30 - 0.45"
                />
              </div>
            </div>
          </section>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'A guardar...' : 'Guardar perfil'}
          </button>
        </form>
      </div>

      {/* Alterar password */}
      <div className="card mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-bank-navy">Alterar palavra-passe</h2>
            <p className="mt-1 text-sm text-slate-600">
              Altere a sua palavra-passe para manter a conta segura.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowPasswordChange(!showPasswordChange);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setPasswordError('');
              setPasswordMessage('');
            }}
            className="btn-secondary"
          >
            {showPasswordChange ? 'Cancelar' : 'Alterar'}
          </button>
        </div>

        {showPasswordChange && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setPasswordError('');
              setPasswordMessage('');
              
              if (!currentPassword || !newPassword || !confirmPassword) {
                setPasswordError('Preencha todos os campos');
                return;
              }
              
              if (newPassword !== confirmPassword) {
                setPasswordError('As palavras-passe não coincidem');
                return;
              }
              
              const validation = validatePassword(newPassword);
              if (!validation.valid) {
                setPasswordError(validation.error || '');
                return;
              }
              
              setChangingPassword(true);
              const token = localStorage.getItem('yc_token');
              try {
                const res = await fetch(apiUrl('/profile/change-password'), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ currentPassword, newPassword }),
                });
                if (!res.ok) {
                  const err = await res.json().catch(() => ({}));
                  throw new Error(err.error || 'Erro ao alterar palavra-passe');
                }
                setPasswordMessage('Palavra-passe alterada com sucesso!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                  setShowPasswordChange(false);
                  setPasswordMessage('');
                }, 2000);
              } catch (err) {
                setPasswordError(err instanceof Error ? err.message : 'Erro ao alterar palavra-passe');
              } finally {
                setChangingPassword(false);
              }
            }}
            className="mt-6 space-y-4"
          >
            {passwordError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{passwordError}</div>
            )}
            {passwordMessage && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{passwordMessage}</div>
            )}
            
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700">
                Palavra-passe atual
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
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
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  const validation = validatePassword(e.target.value);
                  setPasswordError(validation.valid ? '' : validation.error || '');
                }}
                className={`input-field mt-1 ${passwordError && newPassword ? 'border-red-300' : ''}`}
              />
              {!passwordError && newPassword && (
                <p className="mt-1 text-xs text-green-600">✓ Palavra-passe válida</p>
              )}
              {!newPassword && (
                <p className="mt-1 text-xs text-slate-500">
                  Mínimo 10 caracteres, 1 maiúscula, 1 número e 1 caractere especial.
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Confirmar nova palavra-passe
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
            
            <button type="submit" disabled={changingPassword} className="btn-primary">
              {changingPassword ? 'A alterar...' : 'Alterar palavra-passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
