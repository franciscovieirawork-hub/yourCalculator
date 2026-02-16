import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function NHR({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [rendimento, setRendimento] = useState('80000');
  const [categoria, setCategoria] = useState<'trabalho' | 'pensao' | 'outros'>('trabalho');
  const rend = parseFloat(rendimento) || 0;
  const result = useMemo(() => {
    if (rend <= 0) return null;
    let taxaEfetiva = 0.20;
    if (categoria === 'pensao') taxaEfetiva = 0.10;
    const imposto = rend * taxaEfetiva;
    return { imposto: Math.round(imposto * 100) / 100, taxa: taxaEfetiva * 100 };
  }, [rend, categoria]);
  const pdfContent = result ? { inputs: { 'Rendimento (€)': rendimento, Categoria: categoria }, results: { 'Imposto estimado (€)': result.imposto, 'Taxa NHR (%)': result.taxa }, summary: `NHR: ${result?.imposto} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="Simulador Non-Habitual Resident (NHR)" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <p className="font-semibold text-bank-navy">Imposto estimado (taxa {result.taxa}%): {result.imposto} €. Regime NHR com condições específicas.</p>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Rendimento anual (€)</label><input type="number" step={0.01} value={rendimento} onChange={(e) => setRendimento(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Categoria</label><select value={categoria} onChange={(e) => setCategoria(e.target.value as 'trabalho' | 'pensao' | 'outros')} className="input-field mt-1"><option value="trabalho">Trabalho (20%)</option><option value="pensao">Pensão (10%)</option><option value="outros">Outros</option></select></div>
      </div>
    </CalculatorLayout>
  );
}
