/**
 * Constantes Portugal 2026 - espelho do backend para cálculos no frontend
 */

export const SALARIO_MINIMO = { mainland: 920, madeira: 966, azores: 980 } as const;
export const TSU = { trabalhador: 0.11, empregador: 0.2375, total: 0.3475 } as const;
export const IAS_2026 = 537.13;
export const MINIMO_EXISTENCIA_2026 = 12880;
export const ISENCAO_RETENCAO_MENSAL = 920;

export const ESCALOES_IRS_2026 = [
  { min: 0, max: 7479, taxa: 0.145, parcelaAbater: 0 },
  { min: 7479, max: 11284, taxa: 0.21, parcelaAbater: 497 },
  { min: 11284, max: 15992, taxa: 0.265, parcelaAbater: 1104 },
  { min: 15992, max: 20700, taxa: 0.285, parcelaAbater: 1448 },
  { min: 20700, max: 26355, taxa: 0.35, parcelaAbater: 2704 },
  { min: 26355, max: 38232, taxa: 0.37, parcelaAbater: 3052 },
  { min: 38232, max: Infinity, taxa: 0.45, parcelaAbater: 6118 },
] as const;

export const SUBSIDIO_DESEMPREGO = {
  valorMinimo: IAS_2026,
  valorMinimoSM: IAS_2026 * 1.15,
  valorMaximo: IAS_2026 * 2.5,
  percentagemRemuneracao: 0.65,
  majoracaoAgregado: 1.10,
} as const;

export const RECIBOS_VERDES = {
  retencaoGeral: 0.23,
  isencaoAnual: 15000,
  isencaoPrimeiroAno: 12500,
  ssTaxa: 0.214,
  ssBasePresumida: 0.70,
  ssReducaoPrimeiroAno: 0.50,
} as const;

export const SUBSIDIO_ALIMENTACAO_ISENTO = 6.0;
export const IMI_TAXAS = { minimoUrbano: 0.003, maximoUrbano: 0.0045, rustico: 0.008 } as const;
export const HORAS_EXTRAS = { diaNormal: 1.25, diaDescanso: 1.5 } as const;
