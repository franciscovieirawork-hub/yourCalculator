import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { TSU } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function CustoPatron({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [bruto, setBruto] = useState('2000');
  const brutoVal = parseFloat(bruto) || 0;
  const result = useMemo(() => {
    if (brutoVal <= 0) return null;
    const ssEmpregador = brutoVal * TSU.empregador;
    const custoTotal = brutoVal + ssEmpregador;
    return { ssEmpregador: Math.round(ssEmpregador * 100) / 100, custoTotal: Math.round(custoTotal * 100) / 100 };
  }, [brutoVal]);

  const pdfContent = result ? { inputs: { 'Salário bruto (€)': bruto }, results: { 'TSU empregador (23,75%) (€)': result.ssEmpregador, 'Custo total empresa (€)': result.custoTotal }, summary: `Custo total para a empresa: ${result.custoTotal} €` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Custo total para a empresa (Custo Patrão)" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li>TSU entidade empregadora (23,75%): {result.ssEmpregador} €</li>
        <li className="text-lg font-semibold text-bank-navy">Custo total para a empresa: {result.custoTotal} € / mês</li>
      </ul>
    )}>
      <div>
        <label className="block text-sm font-medium text-slate-700">Salário bruto mensal (€)</label>
        <input type="number" step={0.01} min={0} value={bruto} onChange={(e) => setBruto(e.target.value)} className="input-field mt-1" />
      </div>
    </CalculatorLayout>
  );
}
