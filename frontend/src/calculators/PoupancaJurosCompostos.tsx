import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function PoupancaJurosCompostos({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [capitalInicial, setCapitalInicial] = useState('5000');
  const [mensalidade, setMensalidade] = useState('200');
  const [taxaAnual, setTaxaAnual] = useState('3');
  const [anos, setAnos] = useState('10');

  const C = parseFloat(capitalInicial) || 0;
  const M = parseFloat(mensalidade) || 0;
  const r = (parseFloat(taxaAnual) || 0) / 100 / 12;
  const n = (parseInt(anos, 10) || 0) * 12;
  const result = useMemo(() => {
    if (n <= 0) return null;
    const valorFuturo = C * Math.pow(1 + r, n) + M * ((Math.pow(1 + r, n) - 1) / (r || 1));
    const totalAplicado = C + M * n;
    const juros = valorFuturo - totalAplicado;
    return { valorFuturo: Math.round(valorFuturo * 100) / 100, totalAplicado: Math.round(totalAplicado * 100) / 100, juros: Math.round(juros * 100) / 100 };
  }, [C, M, r, n]);

  const pdfContent = result ? { inputs: { 'Capital inicial (€)': capitalInicial, 'Aplicação mensal (€)': mensalidade, 'Taxa anual (%)': taxaAnual, 'Anos': anos }, results: { 'Valor futuro (€)': result.valorFuturo, 'Total aplicado (€)': result.totalAplicado, 'Juros (€)': result.juros }, summary: `Valor futuro: ${result?.valorFuturo} €` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Poupança & juros compostos" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li className="font-semibold text-bank-navy">Valor futuro: {result.valorFuturo} €</li>
        <li>Total aplicado: {result.totalAplicado} €</li>
        <li>Juros: {result.juros} €</li>
      </ul>
    )}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Capital inicial (€)</label><input type="number" step={0.01} value={capitalInicial} onChange={(e) => setCapitalInicial(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Aplicação mensal (€)</label><input type="number" step={0.01} value={mensalidade} onChange={(e) => setMensalidade(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Taxa de juro anual (%)</label><input type="number" step={0.01} value={taxaAnual} onChange={(e) => setTaxaAnual(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Anos</label><input type="number" min={1} value={anos} onChange={(e) => setAnos(e.target.value)} className="input-field mt-1" /></div>
      </div>
    </CalculatorLayout>
  );
}
