import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { irsAnualRendimentoColectavel } from './utils/irs';
import type { CalculatorProps } from './index';

export function IRSMultiplasFontes({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [salario, setSalario] = useState('20000');
  const [arrendamento, setArrendamento] = useState('5000');
  const [outros, setOutros] = useState('0');
  const total = (parseFloat(salario) || 0) + (parseFloat(arrendamento) || 0) + (parseFloat(outros) || 0);
  const result = useMemo(() => {
    if (total <= 0) return null;
    const imposto = irsAnualRendimentoColectavel(total);
    const taxaEfetiva = (imposto / total) * 100;
    return { imposto: Math.round(imposto * 100) / 100, taxaEfetiva: Math.round(taxaEfetiva * 2) / 2 };
  }, [total]);
  const pdfContent = result ? { inputs: { Salário: salario, Arrendamentos: arrendamento, Outros: outros }, results: { 'Rendimento total': total, 'IRS (€)': result.imposto, 'Taxa efetiva (%)': result.taxaEfetiva }, summary: `IRS: ${result?.imposto} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="IRS múltiplas fontes de rendimento" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <ul className="space-y-1 text-slate-700"><li>Rendimento total: {total} €</li><li className="font-semibold text-bank-navy">IRS: {result.imposto} € (taxa efetiva {result.taxaEfetiva}%)</li></ul>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Salário (€/ano)</label><input type="number" step={0.01} value={salario} onChange={(e) => setSalario(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Arrendamentos (€/ano)</label><input type="number" step={0.01} value={arrendamento} onChange={(e) => setArrendamento(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Outros rendimentos (€/ano)</label><input type="number" step={0.01} value={outros} onChange={(e) => setOutros(e.target.value)} className="input-field mt-1" /></div>
      </div>
    </CalculatorLayout>
  );
}
