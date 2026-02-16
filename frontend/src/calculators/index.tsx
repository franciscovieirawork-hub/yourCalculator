import React from 'react';
import { SalarioLiquido } from './SalarioLiquido';
import { SalarioBrutoNecessario } from './SalarioBrutoNecessario';
import { RetencaoFonte } from './RetencaoFonte';
import { CustoPatron } from './CustoPatron';
import { RecibosVerdes } from './RecibosVerdes';
import { SubsidioFeriasNatal } from './SubsidioFeriasNatal';
import { FeriasProporcionais } from './FeriasProporcionais';
import { IndemnizacoesCessacao } from './IndemnizacoesCessacao';
import { EscaloesIRS } from './EscaloesIRS';
import { SimuladorIRS } from './SimuladorIRS';
import { ContribuicoesSS } from './ContribuicoesSS';
import { SubsidioDesemprego } from './SubsidioDesemprego';
import { IMI } from './IMI';
import { IMT } from './IMT';
import { CreditoHabitacao } from './CreditoHabitacao';
import { IUC } from './IUC';
import { OrcamentoPessoal } from './OrcamentoPessoal';
import { PoupancaJurosCompostos } from './PoupancaJurosCompostos';
import { AmortizacaoDivida } from './AmortizacaoDivida';
import { CustoRealFuncionario } from './CustoRealFuncionario';
import { PeriodizacaoSalarios } from './PeriodizacaoSalarios';
import { HorasExtras } from './HorasExtras';
import { RendimentoRelevanteSS } from './RendimentoRelevanteSS';
import { IRSDeducoes } from './IRSDeducoes';
import { IRSCasal } from './IRSCasal';
import { IRSMultiplasFontes } from './IRSMultiplasFontes';
import { SubsidioDoencaParentalidade } from './SubsidioDoencaParentalidade';
import { ReformaPensoes } from './ReformaPensoes';
import { PrestacoesSociais } from './PrestacoesSociais';
import { DepreciacaoVeiculo } from './DepreciacaoVeiculo';
import { CustosFormacao } from './CustosFormacao';
import { NHR } from './NHR';
import { MudancasLegislativas } from './MudancasLegislativas';
import { ComparacaoCenarios } from './ComparacaoCenarios';
import { BeneficiosStockOptions } from './BeneficiosStockOptions';

export interface CalculatorMeta {
  slug: string;
  name: string;
  calculatorId: string;
  calculatorName: string;
}

export interface UserProfileForCalc {
  taxSituation: string | null;
  numberOfDependents: number;
  irsRegime: string | null;
  region: string | null;
  adse: boolean;
  irsJovem: boolean;
  mealAllowance: number | null;
  mealAllowanceTaxFree: boolean;
  twelfthHoliday: boolean;
  twelfthChristmas: boolean;
  selfEmployed: boolean;
  activityCode: string | null;
  firstYearActivity: boolean;
  municipality: string | null;
  municipalityTaxRate: number | null;
}

export interface CalculatorProps<P = object> {
  profile: UserProfileForCalc | null;
  onSaveDocument?: (title: string, content: object) => Promise<{ id: string; title: string; calculatorId: string; calculatorName: string; createdAt: string }>;
  meta: CalculatorMeta;
  initialValues?: Partial<P>;
}

const MAP: Record<string, React.ComponentType<CalculatorProps>> = {
  'salario-liquido': SalarioLiquido,
  'salario-bruto-necessario': SalarioBrutoNecessario,
  'imposto-retencao-fonte': RetencaoFonte,
  'horas-extras': HorasExtras,
  'custo-patron': CustoPatron,
  'recibos-verdes': RecibosVerdes,
  'rendimento-relevante-ss': RendimentoRelevanteSS,
  'subsidio-ferias-natal': SubsidioFeriasNatal,
  'ferias-proporcionais': FeriasProporcionais,
  'indemnizacoes-cessacao': IndemnizacoesCessacao,
  'simulador-irs-completo': SimuladorIRS,
  'escaloes-irs': EscaloesIRS,
  'irs-casal': IRSCasal,
  'deducoes-fiscais-efatura': IRSDeducoes,
  'irs-multiplas-fontes': IRSMultiplasFontes,
  'contribuicoes-ss': ContribuicoesSS,
  'subsidio-desemprego': SubsidioDesemprego,
  'subsidios-doenca-parentalidade': SubsidioDoencaParentalidade,
  'reforma-pensoes': ReformaPensoes,
  'prestacoes-sociais': PrestacoesSociais,
  imi: IMI,
  imt: IMT,
  'credito-habitacao': CreditoHabitacao,
  iuc: IUC,
  'depreciacao-veiculo': DepreciacaoVeiculo,
  'orcamento-pessoal': OrcamentoPessoal,
  'poupanca-juros-compostos': PoupancaJurosCompostos,
  'amortizacao-divida': AmortizacaoDivida,
  'custo-real-funcionario': CustoRealFuncionario,
  'periodizacao-salarios': PeriodizacaoSalarios,
  'custos-formacao': CustosFormacao,
  nhr: NHR,
  'mudancas-legislativas': MudancasLegislativas,
  'comparacao-cenarios': ComparacaoCenarios,
  'beneficios-stock-options': BeneficiosStockOptions,
};

export function getCalculatorBySlug(slug: string): React.ComponentType<CalculatorProps> | null {
  return MAP[slug] ?? null;
}
