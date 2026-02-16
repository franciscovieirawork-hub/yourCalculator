import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function AmortizacaoDivida({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [divida, setDivida] = useState('10000');
  const [taxaAnual, setTaxaAnual] = useState('10');
  const [prestacao, setPrestacao] = useState('300');

  const D = parseFloat(divida) || 0;
  const r = (parseFloat(taxaAnual) || 0) / 100 / 12;
  const P = parseFloat(prestacao) || 0;
  const result = useMemo(() => {
    if (D <= 0 || P <= 0) return null;
    let saldo = D;
    let meses = 0;
    let totalJuros = 0;
    while (saldo > 0 && meses < 600) {
      const juros = saldo * r;
      totalJuros += juros;
      saldo = saldo + juros - P;
      meses++;
    }
    return { meses, totalJuros: Math.round(totalJuros * 100) / 100, totalPago: Math.round((D + totalJuros) * 100) / 100 };
  }, [D, r, P]);

  const pdfContent = result ? { inputs: { 'Dívida (€)': divida, 'Taxa anual (%)': taxaAnual, 'Prestação mensal (€)': prestacao }, results: { 'Meses até liquidar': result.meses, 'Total juros (€)': result.totalJuros }, summary: `Liquidar em ${result?.meses} meses` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Calculador de amortização de dívida" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li>Meses até liquidar: {result.meses}</li>
        <li>Total juros: {result.totalJuros} €</li>
        <li className="font-semibold text-bank-navy">Total pago: {result.totalPago} €</li>
      </ul>
    )}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Dívida atual (€)</label><input type="number" step={0.01} value={divida} onChange={(e) => setDivida(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Taxa de juro anual (%)</label><input type="number" step={0.01} value={taxaAnual} onChange={(e) => setTaxaAnual(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Prestação mensal (€)</label><input type="number" step={0.01} value={prestacao} onChange={(e) => setPrestacao(e.target.value)} className="input-field mt-1" /></div>
      </div>
    </CalculatorLayout>
  );
}
