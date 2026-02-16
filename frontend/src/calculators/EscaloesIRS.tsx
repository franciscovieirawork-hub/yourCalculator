import React from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { ESCALOES_IRS_2026 } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function EscaloesIRS({ profile, onSaveDocument, meta }: CalculatorProps) {
  const pdfContent = {
    inputs: { Ano: '2026' },
    results: Object.fromEntries(ESCALOES_IRS_2026.map((e, i) => [`Escalão ${i + 1} (${e.min}-${e.max === Infinity ? '∞' : e.max} €)`, `${(e.taxa * 100).toFixed(1)}%`])),
    summary: 'Tabela de escalões IRS 2026 - Portugal.',
  };

  return (
    <CalculatorLayout meta={meta} title="Escalões IRS e taxa efetiva" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-700">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-2 text-left font-medium">Escalão</th>
              <th className="py-2 text-left font-medium">Rendimento coletável (€)</th>
              <th className="py-2 text-left font-medium">Taxa</th>
              <th className="py-2 text-left font-medium">Parcela a abater</th>
            </tr>
          </thead>
          <tbody>
            {ESCALOES_IRS_2026.map((e, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2">{i + 1}</td>
                <td>{e.min} – {e.max === Infinity ? '∞' : e.max}</td>
                <td>{(e.taxa * 100).toFixed(1)}%</td>
                <td>{e.parcelaAbater} €</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-slate-600">Fonte: OE 2026. Mínimo de existência: 12 880 €.</p>
      </div>
    }>
      <p className="text-slate-600">Tabela de escalões do IRS para 2026 (Portugal). Use o Simulador IRS para calcular o imposto sobre o seu rendimento.</p>
    </CalculatorLayout>
  );
}
