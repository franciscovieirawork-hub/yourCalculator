/**
 * Validação de palavra-passe: mínimo 10 caracteres, letra maiúscula, número e caractere especial
 */
export function validatePassword(password) {
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
