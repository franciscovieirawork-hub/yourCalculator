import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { irsAnualRendimentoColectavel } from './utils/irs';
import type { CalculatorProps } from './index';

export function IRSCasal({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [rend1, setRend1] = useState('20000');
  const [rend2, setRend2] = useState('15000');
  const [regime, setRegime] = useState<'joint' | 'separate'>('joint');
  const r1 = parseFloat(rend1) || 0;
  const r2 = parseFloat(rend2) || 0;
  const result = useMemo(() => {
    if (regime === 'joint') {
      const colectavel = r1 + r2;
      const imposto = irsAnualRendimentoColectavel(colectavel / 2) * 2; // divisão por 2 e multiplicação
      return { impostoConjunto: Math.round(imposto * 100) / 100, colectavel };
    }
    const imp1 = irsAnualRendimentoColectavel(r1);
    const imp2 = irsAnualRendimentoColectavel(r2);
    return { impostoSeparado: Math.round((imp1 + imp2) * 100) / 100 };
  }, [r1, r2, regime]);
  const imposto = result && ('impostoConjunto' in result ? result.impostoConjunto : result.impostoSeparado);
  const pdfContent = result ? { inputs: { 'Rendimento 1 (€)': rend1, 'Rendimento 2 (€)': rend2, Regime: regime }, results: { 'IRS (€)': imposto }, summary: `IRS ${regime}: ${imposto} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="IRS regime casal" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <p className="font-semibold text-bank-navy">IRS anual ({regime === 'joint' ? 'conjunto' : 'separado'}): {imposto} €</p>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Rendimento titular 1 (€)</label><input type="number" step={0.01} value={rend1} onChange={(e) => setRend1(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Rendimento titular 2 (€)</label><input type="number" step={0.01} value={rend2} onChange={(e) => setRend2(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Regime</label><select value={regime} onChange={(e) => setRegime(e.target.value as 'joint' | 'separate')} className="input-field mt-1"><option value="joint">Conjunto</option><option value="separate">Separado</option></select></div>
      </div>
    </CalculatorLayout>
  );
}
