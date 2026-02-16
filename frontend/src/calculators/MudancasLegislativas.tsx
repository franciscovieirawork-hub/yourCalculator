import React from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function MudancasLegislativas({ profile, onSaveDocument, meta }: CalculatorProps) {
  const pdfContent = { inputs: { Ano: '2026' }, results: { 'Alterações 2026': 'Escalões IRS +3,51%; mín. existência 12 880 €; TSU inalterada; IAS 537,13 €' }, summary: 'Comparativo anos fiscais - consultar OE.' };
  return (
    <CalculatorLayout meta={meta} title="Comparativo entre anos fiscais" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={<p className="text-slate-700">Principais alterações 2026: escalões IRS atualizados 3,51%; mínimo de existência 12 880 €; retenção isenta até 920 €/mês; IAS 537,13 €. Use as outras calculadoras para comparar cenários.</p>}>
      <p className="text-slate-600">Consulte o Orçamento de Estado e as tabelas oficiais para um comparativo detalhado entre anos. Esta calculadora serve de referência às alterações de 2026.</p>
    </CalculatorLayout>
  );
}
