/**
 * Serviço de SMS - suporta Twilio e pode ser facilmente adaptado para outros serviços
 * 
 * Para usar Twilio:
 * 1. Criar conta em https://www.twilio.com
 * 2. Obter Account SID e Auth Token
 * 3. Adicionar ao .env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
 * 
 * Alternativas portuguesas:
 * - SMS.pt: https://www.sms.pt/api
 * - MessageBird: https://www.messagebird.com
 */

// Formato esperado: +351912345678 (E.164)
export function formatPhoneNumber(phone) {
  if (!phone) return null;
  // Remove espaços e caracteres especiais
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Se não começar com +, assume Portugal (+351)
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('00')) {
      cleaned = '+' + cleaned.slice(2);
    } else if (cleaned.startsWith('351')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('9') && cleaned.length === 9) {
      cleaned = '+351' + cleaned;
    } else {
      return null; // Formato inválido
    }
  }
  return cleaned;
}

export async function sendSMS(phoneNumber, message) {
  const provider = process.env.SMS_PROVIDER || 'twilio';
  
  if (provider === 'twilio') {
    return sendViaTwilio(phoneNumber, message);
  }
  
  // Adicionar outros providers aqui (SMS.pt, MessageBird, etc.)
  throw new Error(`SMS provider "${provider}" não configurado`);
}

async function sendViaTwilio(phoneNumber, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  
  if (!accountSid || !authToken || !fromNumber) {
    console.error('Twilio não configurado. Adicione TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_PHONE_NUMBER ao .env');
    throw new Error('Serviço de SMS não configurado');
  }
  
  try {
    const twilio = await import('twilio');
    const client = twilio.default(accountSid, authToken);
    
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: phoneNumber,
    });
    
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('Erro ao enviar SMS via Twilio:', error);
    throw new Error('Falha ao enviar SMS');
  }
}

/**
 * Gera código de 6 dígitos para SMS
 */
export function generateSMSCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
