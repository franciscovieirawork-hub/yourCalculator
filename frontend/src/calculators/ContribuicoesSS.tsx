import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { TSU } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function ContribuicoesSS({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [bruto, setBruto] = useState('2000');
  const brutoVal = parseFloat(bruto) || 0;
  const result = useMemo(() => {
    if (brutoVal <= 0) return null;
    const trab = brutoVal * TSU.trabalhador;
    const emp = brutoVal * TSU.empregador;
    return { trab: Math.round(trab * 100) / 100, emp: Math.round(emp * 100) / 100, total: Math.round((trab + emp) * 100) / 100 };
  }, [brutoVal]);

  const pdfContent = result ? { inputs: { 'Remuneração bruta (€)': bruto }, results: { 'Contribuição trabalhador (11%)': result.trab, 'Contribuição empregador (23,75%)': result.emp, Total: result.total }, summary: `Total TSU: ${result?.total} €` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Contribuições Segurança Social" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li>Trabalhador (11%): {result.trab} €</li>
        <li>Empregador (23,75%): {result.emp} €</li>
        <li className="font-semibold text-bank-navy">Total TSU: {result.total} €</li>
      </ul>
    )}>
      <div>
        <label className="block text-sm font-medium text-slate-700">Remuneração bruta mensal (€)</label>
        <input type="number" step={0.01} min={0} value={bruto} onChange={(e) => setBruto(e.target.value)} className="input-field mt-1" />
      </div>
    </CalculatorLayout>
  );
}
