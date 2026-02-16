import React from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { IAS_2026 } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function PrestacoesSociais({ profile, onSaveDocument, meta }: CalculatorProps) {
  const pdfContent = { inputs: {}, results: { 'IAS 2026 (€)': IAS_2026, 'Subs. desemprego máx. (2,5 IAS)': Math.round(IAS_2026 * 2.5 * 100) / 100 }, summary: 'Prestações indexadas ao IAS 2026.' };
  return (
    <CalculatorLayout meta={meta} title="Cálculo de prestações sociais (SS)" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={
      <ul className="space-y-2 text-slate-700">
        <li>IAS 2026: {IAS_2026} €</li>
        <li>Subsídio desemprego (máx.): {Math.round(IAS_2026 * 2.5 * 100) / 100} €</li>
        <li className="text-sm text-slate-600">Muitas prestações são calculadas em função do IAS. Consulte a Segurança Social para valores exatos.</li>
      </ul>
    }>
      <p className="text-slate-600">Valores de referência das prestações sociais em 2026 (Portugal). Para simulações específicas use as calculadoras de subsídio de desemprego, doença, parentalidade, etc.</p>
    </CalculatorLayout>
  );
}
