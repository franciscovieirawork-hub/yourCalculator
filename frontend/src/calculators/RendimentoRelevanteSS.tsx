import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { RECIBOS_VERDES } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function RendimentoRelevanteSS({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [rendimento, setRendimento] = useState('2500');
  const [primeiroAno, setPrimeiroAno] = useState(profile?.firstYearActivity ?? false);
  const rend = parseFloat(rendimento) || 0;
  const result = useMemo(() => {
    if (rend <= 0) return null;
    const base = rend * RECIBOS_VERDES.ssBasePresumida;
    let contrib = base * RECIBOS_VERDES.ssTaxa;
    if (primeiroAno) contrib *= (1 - RECIBOS_VERDES.ssReducaoPrimeiroAno);
    return { baseIncidencia: Math.round(base * 100) / 100, contribuicao: Math.round(contrib * 100) / 100 };
  }, [rend, primeiroAno]);
  const pdfContent = result ? { inputs: { 'Rendimento (€)': rendimento, 'Primeiro ano': primeiroAno }, results: { 'Base de incidência (70%)': result.baseIncidencia, 'Contribuição SS': result.contribuicao }, summary: `Contribuição: ${result?.contribuicao} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="Rendimento relevante e contribuições SS" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <ul className="space-y-1 text-slate-700"><li>Base de incidência (70%): {result.baseIncidencia} €</li><li className="font-semibold text-bank-navy">Contribuição SS (21,4%): {result.contribuicao} €</li></ul>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Rendimento mensal (€)</label><input type="number" step={0.01} value={rendimento} onChange={(e) => setRendimento(e.target.value)} className="input-field mt-1" /></div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={primeiroAno} onChange={(e) => setPrimeiroAno(e.target.checked)} className="rounded border-slate-300 text-primary-600" /> Primeiro ano (redução 50%)</label>
      </div>
    </CalculatorLayout>
  );
}
