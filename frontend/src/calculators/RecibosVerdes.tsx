import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { RECIBOS_VERDES } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function RecibosVerdes({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [rendimento, setRendimento] = useState('2000');
  const [primeiroAno, setPrimeiroAno] = useState(profile?.firstYearActivity ?? false);

  const rend = parseFloat(rendimento) || 0;
  const result = useMemo(() => {
    if (rend <= 0) return null;
    const retencao = rend * 12 <= RECIBOS_VERDES.isencaoAnual ? 0 : rend * RECIBOS_VERDES.retencaoGeral;
    const baseSS = rend * RECIBOS_VERDES.ssBasePresumida;
    let ss = baseSS * RECIBOS_VERDES.ssTaxa;
    if (primeiroAno) ss *= (1 - RECIBOS_VERDES.ssReducaoPrimeiroAno);
    const liquido = rend - retencao - ss;
    return {
      retencao: Math.round(retencao * 100) / 100,
      ss: Math.round(ss * 100) / 100,
      liquido: Math.round(liquido * 100) / 100,
    };
  }, [rend, primeiroAno]);

  const pdfContent = result ? { inputs: { 'Rendimento mensal (€)': rendimento, 'Primeiro ano atividade': primeiroAno }, results: { 'Retenção (€)': result.retencao, 'SS (€)': result.ss, 'Líquido (€)': result.liquido }, summary: `Líquido recibos verdes: ${result?.liquido} €` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Recibos verdes" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li>Retenção na fonte (23%): {result.retencao} €</li>
        <li>Segurança Social (21,4% sobre 70%): {result.ss} €</li>
        <li className="font-semibold text-bank-navy">Líquido: {result.liquido} €</li>
      </ul>
    )}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Rendimento mensal (€)</label>
          <input type="number" step={0.01} min={0} value={rendimento} onChange={(e) => setRendimento(e.target.value)} className="input-field mt-1" />
        </div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={primeiroAno} onChange={(e) => setPrimeiroAno(e.target.checked)} className="rounded border-slate-300 text-primary-600" /> Primeiro ano de atividade (redução 50% SS)</label>
      </div>
    </CalculatorLayout>
  );
}
