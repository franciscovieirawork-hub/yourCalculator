/**
 * Validação de palavra-passe no frontend
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 10) {
    return { valid: false, error: 'A palavra-passe deve ter pelo menos 10 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'A palavra-passe deve conter pelo menos uma letra maiúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'A palavra-passe deve conter pelo menos um número' };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, error: 'A palavra-passe deve conter pelo menos um caractere especial (!@#$%^&*(),.?":{}|<>)' };
  }
  return { valid: true };
}
