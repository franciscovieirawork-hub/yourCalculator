/**
 * Constantes fiscais e legais Portugal - ano 2026
 * Referência: Leis vigentes em 16/02/2026
 */

// Salário mínimo nacional 2026 (€/mês)
export const SALARIO_MINIMO = {
  mainland: 920,
  madeira: 966,
  azores: 980,
};

// TSU - Taxa Social Única 2026
export const TSU = {
  trabalhador: 0.11,      // 11%
  empregador: 0.2375,     // 23,75%
  total: 0.3475,
};

// IAS 2026 (Indexante dos Apoios Sociais) - €
export const IAS_2026 = 537.13;

// Mínimo de existência IRS 2026 (€/ano)
export const MINIMO_EXISTENCIA_2026 = 12880;

// Isenção retenção na fonte: rendimento mensal até (€)
export const ISENCAO_RETENCAO_MENSAL = 920;

// Escalões IRS 2026 - rendimento coletável (€/ano) e taxas
// Fonte: OE 2026, atualização 3,51%, redução 0,3pp nos 2º-5º escalões
export const ESCALOES_IRS_2026 = [
  { min: 0,       max: 7479,   taxa: 0.145, parcelaAbater: 0 },
  { min: 7479,    max: 11284,  taxa: 0.21,  parcelaAbater: 497 },
  { min: 11284,   max: 15992,  taxa: 0.265, parcelaAbater: 1104 },
  { min: 15992,   max: 20700,  taxa: 0.285, parcelaAbater: 1448 },
  { min: 20700,   max: 26355,  taxa: 0.35,  parcelaAbater: 2704 },
  { min: 26355,   max: 38232,  taxa: 0.37,  parcelaAbater: 3052 },
  { min: 38232,   max: Infinity, taxa: 0.45, parcelaAbater: 6118 },
];

// Subsídio de desemprego 2026
export const SUBSIDIO_DESEMPREGO = {
  valorMinimo: IAS_2026,                    // 1 IAS
  valorMinimoSM: IAS_2026 * 1.15,          // 1,15 IAS se SM
  valorMaximo: IAS_2026 * 2.5,             // 2,5 IAS
  percentagemRemuneracao: 0.65,            // 65% da rem. ref. (primeiros meses)
  majoracaoAgregado: 1.10,                 // +10% em certos casos
};

// Recibos verdes 2026
export const RECIBOS_VERDES = {
  retencaoGeral: 0.23,                     // 23% (reduzida de 25%)
  isencaoAnual: 15000,
  isencaoPrimeiroAno: 12500,
  ssTaxa: 0.214,                           // 21,4%
  ssBasePresumida: 0.70,                   // 70% do rendimento
  ssReducaoPrimeiroAno: 0.50,              // 50% primeiro ano
};

// Subsídio de alimentação 2026 - isento até (€/dia)
export const SUBSIDIO_ALIMENTACAO_ISENTO = 6.0;

// IMI - taxas típicas 2026
export const IMI = {
  minimoUrbano: 0.003,   // 0,30%
  maximoUrbano: 0.0045,  // 0,45%
  rustico: 0.008,        // 0,80%
};

// Horas extras - percentagens legais (Código do Trabalho)
export const HORAS_EXTRAS = {
  diaNormal: 1.25,       // +25%
  diaDescanso: 1.50,     // +50%
  noturno: 1.25,         // +25% (acima do dia)
};
