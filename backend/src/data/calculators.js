/**
 * Lista de todas as calculadoras - Portugal 2026
 */

export const CALCULATOR_LIST = [
  // --- Laboral & Salários ---
  { slug: 'salario-liquido', name: 'Salário líquido mensal / anual', category: 'Laboral & Salários', categorySlug: 'laboral-salarios', description: 'IRS + Segurança Social + subsídios', icon: '💰' },
  { slug: 'salario-bruto-necessario', name: 'Salário bruto necessário', category: 'Laboral & Salários', categorySlug: 'laboral-salarios', description: 'Calcular bruto a partir do líquido desejado', icon: '📊' },
  { slug: 'imposto-retencao-fonte', name: 'Imposto sobre trabalho (retenção na fonte)', category: 'Laboral & Salários', categorySlug: 'laboral-salarios', description: 'Duodécimos, subsídio alimentação, ADSE, IRS Jovem', icon: '🧾' },
  { slug: 'horas-extras', name: 'Horas extras', category: 'Laboral & Salários', categorySlug: 'laboral-salarios', description: 'Remunerações suplementares conforme regras legais', icon: '⏰' },
  { slug: 'custo-patron', name: 'Custo total para a empresa (Custo Patrão)', category: 'Laboral & Salários', categorySlug: 'laboral-salarios', description: 'Incluindo TSU da entidade empregadora', icon: '🏢' },
  { slug: 'recibos-verdes', name: 'Recibos verdes', category: 'Laboral & Salários', categorySlug: 'laboral-salarios', description: 'Retenção na fonte + SS para independentes', icon: '📄' },
  { slug: 'rendimento-relevante-ss', name: 'Rendimento relevante e contribuições SS', category: 'Laboral & Salários', categorySlug: 'laboral-salarios', description: 'Base de incidência e percentagens', icon: '📈' },
  { slug: 'subsidio-ferias-natal', name: 'Subsídio de férias e subsídio de Natal', category: 'Laboral & Salários', categorySlug: 'laboral-salarios', description: 'Valores líquidos e proporcionais', icon: '🏖️' },
  { slug: 'ferias-proporcionais', name: 'Férias proporcionais', category: 'Laboral & Salários', categorySlug: 'laboral-salarios', description: 'Calcular em cessação de contrato', icon: '📅' },
  { slug: 'indemnizacoes-cessacao', name: 'Indemnizações por cessação / despedimento', category: 'Laboral & Salários', categorySlug: 'laboral-salarios', description: 'Estimativas por tipo de rescisão', icon: '📦' },
  // --- IRS ---
  { slug: 'simulador-irs-completo', name: 'Simulador IRS completo', category: 'Impostos e IRS', categorySlug: 'impostos-irs', description: 'Cálculo de imposto anual com categorias', icon: '📈' },
  { slug: 'escaloes-irs', name: 'Escalões IRS e taxa efetiva', category: 'Impostos e IRS', categorySlug: 'impostos-irs', description: 'Percentagens e taxas médias', icon: '📋' },
  { slug: 'irs-casal', name: 'IRS regime casal / conjunta ou separada', category: 'Impostos e IRS', categorySlug: 'impostos-irs', description: 'Com dependentes', icon: '👫' },
  { slug: 'deducoes-fiscais-efatura', name: 'Simulação de deduções fiscais (E-fatura)', category: 'Impostos e IRS', categorySlug: 'impostos-irs', description: 'Saúde, educação, habitação', icon: '🛡️' },
  { slug: 'irs-multiplas-fontes', name: 'IRS múltiplas fontes de rendimento', category: 'Impostos e IRS', categorySlug: 'impostos-irs', description: 'Salário + arrendamentos, etc.', icon: '💼' },
  // --- Segurança Social e Apoios ---
  { slug: 'contribuicoes-ss', name: 'Contribuições Segurança Social', category: 'Segurança Social', categorySlug: 'seguranca-social', description: 'Empregado + empregador', icon: '🛡️' },
  { slug: 'subsidio-desemprego', name: 'Subsídio de desemprego', category: 'Segurança Social', categorySlug: 'seguranca-social', description: 'Valor estimado e duração', icon: '📉' },
  { slug: 'subsidios-doenca-parentalidade', name: 'Subsídios doença / parentalidade / paternidade', category: 'Segurança Social', categorySlug: 'seguranca-social', description: 'Cálculo de prestações', icon: '👶' },
  { slug: 'reforma-pensoes', name: 'Reforma / pensões contributivas', category: 'Segurança Social', categorySlug: 'seguranca-social', description: 'Estimador de valor futuro', icon: '🏛️' },
  { slug: 'prestacoes-sociais', name: 'Cálculo de prestações sociais (SS)', category: 'Segurança Social', categorySlug: 'seguranca-social', description: 'Subsídios transitórios', icon: '📋' },
  // --- Finanças Pessoais ---
  { slug: 'imi', name: 'IMI (Imposto Municipal sobre Imóveis)', category: 'Imobiliário', categorySlug: 'imobiliario', description: 'Cálculo de imposto anual', icon: '🏠' },
  { slug: 'imt', name: 'IMT (Imposto Municipal sobre Transmissões)', category: 'Imobiliário', categorySlug: 'imobiliario', description: 'Cálculo na compra de casa', icon: '🔑' },
  { slug: 'credito-habitacao', name: 'Simulador de crédito habitação', category: 'Imobiliário', categorySlug: 'imobiliario', description: 'Prestações, spread, Euribor', icon: '🏡' },
  { slug: 'iuc', name: 'IUC (Imposto Único de Circulação)', category: 'Veículos', categorySlug: 'veiculos', description: 'Por tipo de veículo e emissões', icon: '🚗' },
  { slug: 'depreciacao-veiculo', name: 'Depreciação e custo total de propriedade', category: 'Veículos', categorySlug: 'veiculos', description: 'Combustível, seguro, manutenção', icon: '⛽' },
  { slug: 'orcamento-pessoal', name: 'Calculadora de orçamento pessoal / mensal', category: 'Pessoais', categorySlug: 'pessoais', description: 'Receitas vs despesas', icon: '💳' },
  { slug: 'poupanca-juros-compostos', name: 'Poupança & juros compostos', category: 'Pessoais', categorySlug: 'pessoais', description: 'Metas de poupança ao longo do tempo', icon: '📈' },
  { slug: 'amortizacao-divida', name: 'Calculador de amortização de dívida', category: 'Pessoais', categorySlug: 'pessoais', description: 'Créditos pessoais ou estudo', icon: '📉' },
  // --- Empresas ---
  { slug: 'custo-real-funcionario', name: 'Custo real de um funcionário', category: 'Empresas', categorySlug: 'empresas', description: 'Salário + TSU + outros encargos', icon: '👔' },
  { slug: 'periodizacao-salarios', name: 'Simulador de periodização de salários', category: 'Empresas', categorySlug: 'empresas', description: '12 vs 14 pagamentos', icon: '📅' },
  { slug: 'custos-formacao', name: 'Custos de formação profissional', category: 'Empresas', categorySlug: 'empresas', description: 'Contribuições obrigatórias', icon: '🎓' },
  // --- Outros ---
  { slug: 'nhr', name: 'Simulador Non-Habitual Resident (NHR)', category: 'Outros', categorySlug: 'outros', description: 'Impacto fiscal para estrangeiros', icon: '🌍' },
  { slug: 'mudancas-legislativas', name: 'Comparativo entre anos fiscais', category: 'Outros', categorySlug: 'outros', description: 'Efeitos de mudanças legislativas', icon: '📜' },
  { slug: 'comparacao-cenarios', name: 'Comparação de cenários', category: 'Outros', categorySlug: 'outros', description: 'Part-time vs full-time vs recibos verdes', icon: '🔄' },
  { slug: 'beneficios-stock-options', name: 'Efeitos de benefícios (stock options, seguro saúde)', category: 'Outros', categorySlug: 'outros', description: 'Simulação de benefícios', icon: '🎁' },
];

export const CATEGORIES = [
  { slug: 'laboral-salarios', name: 'Laboral & Salários', icon: '💼' },
  { slug: 'impostos-irs', name: 'Impostos e IRS', icon: '📈' },
  { slug: 'seguranca-social', name: 'Segurança Social', icon: '🛡️' },
  { slug: 'imobiliario', name: 'Imobiliário', icon: '🏠' },
  { slug: 'veiculos', name: 'Veículos', icon: '🚗' },
  { slug: 'pessoais', name: 'Pessoais', icon: '💳' },
  { slug: 'empresas', name: 'Empresas', icon: '🏢' },
  { slug: 'outros', name: 'Outros', icon: '🧠' },
];
