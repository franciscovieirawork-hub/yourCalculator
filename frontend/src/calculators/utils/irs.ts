import { ESCALOES_IRS_2026, ISENCAO_RETENCAO_MENSAL } from '../constants-pt-2026';

/**
 * Retenção na fonte mensal (trabalho dependente) - aproximação por escalão
 * Perfil: taxSituation (single, single_dependents, married_one, married_two), numberOfDependents, irsJovem
 */
export function retencaoFonteMensal(
  rendimentoBrutoMensal: number,
  options: {
    taxSituation?: string | null;
    numberOfDependents?: number;
    irsJovem?: boolean;
    mealAllowanceTaxFree?: number | null; // valor isento
    mealAllowance?: number | null;
    twelfthHoliday?: boolean;
    twelfthChristmas?: boolean;
  } = {}
): number {
  if (rendimentoBrutoMensal <= 0) return 0;
  const { taxSituation = 'single', numberOfDependents = 0, irsJovem = false } = options;
  // Remuneração mensal para efeitos de retenção (inclui duodécimos se aplicável)
  let baseRetencao = rendimentoBrutoMensal;
  if (options.twelfthHoliday) baseRetencao += (rendimentoBrutoMensal * 0.5) / 12; // metade do subsídio férias
  if (options.twelfthChristmas) baseRetencao += (rendimentoBrutoMensal * 0.5) / 12; // metade do subsídio natal
  if (baseRetencao <= ISENCAO_RETENCAO_MENSAL) return 0;

  const anual = baseRetencao * 14; // 12 + 2 subsídios
  const escalao = ESCALOES_IRS_2026.find((e) => anual >= e.min && anual < e.max) ?? ESCALOES_IRS_2026[ESCALOES_IRS_2026.length - 1];
  const impostoAnual = Math.max(0, anual * escalao.taxa - escalao.parcelaAbater);
  let retencaoMensal = impostoAnual / 14;
  if (irsJovem) retencaoMensal *= 0.5; // IRS Jovem 50% no primeiro ano, etc. - simplificado
  return Math.round(retencaoMensal * 100) / 100;
}

/**
 * Imposto IRS anual sobre rendimento coletável (fórmula Portugal: escalão único)
 */
export function irsAnualRendimentoColectavel(rendimentoColectavel: number): number {
  if (rendimentoColectavel <= 0) return 0;
  const escalao = ESCALOES_IRS_2026.find((e) => rendimentoColectavel >= e.min && rendimentoColectavel < e.max) ?? ESCALOES_IRS_2026[ESCALOES_IRS_2026.length - 1];
  const imposto = Math.max(0, rendimentoColectavel * escalao.taxa - escalao.parcelaAbater);
  return Math.round(imposto * 100) / 100;
}
