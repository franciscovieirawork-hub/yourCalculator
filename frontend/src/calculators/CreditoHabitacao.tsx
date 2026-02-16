import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function CreditoHabitacao({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [capital, setCapital] = useState('200000');
  const [prazo, setPrazo] = useState('30');
  const [taxaSpread, setTaxaSpread] = useState('1');
  const [euribor, setEuribor] = useState('3.5');

  const cap = parseFloat(capital) || 0;
  const meses = (parseInt(prazo, 10) || 30) * 12;
  const spread = parseFloat(taxaSpread) || 1;
  const eur = parseFloat(euribor) || 3.5;
  const taxaMensal = (spread + eur) / 100 / 12;
  const result = useMemo(() => {
    if (cap <= 0 || meses <= 0) return null;
    const prestacao = taxaMensal === 0 ? cap / meses : (cap * taxaMensal * Math.pow(1 + taxaMensal, meses)) / (Math.pow(1 + taxaMensal, meses) - 1);
    const totalJuros = prestacao * meses - cap;
    return {
      prestacao: Math.round(prestacao * 100) / 100,
      totalJuros: Math.round(totalJuros * 100) / 100,
      totalPagamento: Math.round((prestacao * meses) * 100) / 100,
    };
  }, [cap, meses, taxaMensal]);

  const pdfContent = result ? { inputs: { 'Capital (€)': capital, 'Prazo (anos)': prazo, 'Spread (%)': taxaSpread, 'Euribor (%)': euribor }, results: { 'Prestação mensal (€)': result.prestacao, 'Total juros (€)': result.totalJuros }, summary: `Prestação: ${result?.prestacao} €/mês` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Simulador de crédito habitação" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li className="font-semibold text-bank-navy">Prestação mensal: {result.prestacao} €</li>
        <li>Total de juros: {result.totalJuros} €</li>
        <li>Total a pagar: {result.totalPagamento} €</li>
      </ul>
    )}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Capital em dívida (€)</label><input type="number" min={0} value={capital} onChange={(e) => setCapital(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Prazo (anos)</label><input type="number" min={1} max={40} value={prazo} onChange={(e) => setPrazo(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Spread (%)</label><input type="number" step={0.01} value={taxaSpread} onChange={(e) => setTaxaSpread(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Euribor 12 meses (%)</label><input type="number" step={0.01} value={euribor} onChange={(e) => setEuribor(e.target.value)} className="input-field mt-1" /></div>
      </div>
    </CalculatorLayout>
  );
}
