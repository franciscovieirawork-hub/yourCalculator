import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { TSU } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function CustoRealFuncionario({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [bruto, setBruto] = useState('2000');
  const [outrosEncargos, setOutrosEncargos] = useState('0');
  const brutoVal = parseFloat(bruto) || 0;
  const outros = parseFloat(outrosEncargos) || 0;
  const result = useMemo(() => {
    if (brutoVal <= 0) return null;
    const tsu = brutoVal * TSU.empregador;
    return { tsu: Math.round(tsu * 100) / 100, custoTotal: Math.round((brutoVal + tsu + outros) * 100) / 100 };
  }, [brutoVal, outros]);
  const pdfContent = result ? { inputs: { 'Bruto (€)': bruto, 'Outros encargos (€)': outrosEncargos }, results: { 'TSU (€)': result.tsu, 'Custo total (€)': result.custoTotal }, summary: `Custo total: ${result?.custoTotal} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="Custo real de um funcionário" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <p className="font-semibold text-bank-navy">Custo total: {result.custoTotal} € / mês</p>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Salário bruto mensal (€)</label><input type="number" step={0.01} value={bruto} onChange={(e) => setBruto(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Outros encargos (€/mês)</label><input type="number" step={0.01} value={outrosEncargos} onChange={(e) => setOutrosEncargos(e.target.value)} className="input-field mt-1" /></div>
      </div>
    </CalculatorLayout>
  );
}
