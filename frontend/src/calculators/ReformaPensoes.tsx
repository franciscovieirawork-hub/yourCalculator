import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function ReformaPensoes({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [mediaCarreira, setMediaCarreira] = useState('1500');
  const [anosDescontos, setAnosDescontos] = useState('40');
  const media = parseFloat(mediaCarreira) || 0;
  const anos = parseInt(anosDescontos, 10) || 0;
  const result = useMemo(() => {
    if (media <= 0) return null;
    const fatorSustentabilidade = anos >= 40 ? 1 : 0.95;
    const pensaoEstimada = media * 0.55 * fatorSustentabilidade;
    return { pensaoEstimada: Math.round(pensaoEstimada * 100) / 100 };
  }, [media, anos]);
  const pdfContent = result ? { inputs: { 'Média carreira (€)': mediaCarreira, 'Anos descontos': anosDescontos }, results: { 'Pensão estimada (€)': result.pensaoEstimada }, summary: `Pensão estimada: ${result?.pensaoEstimada} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="Reforma / pensões contributivas" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <p className="font-semibold text-bank-navy">Pensão estimada: {result.pensaoEstimada} € / mês (indicativo)</p>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Remuneração média da carreira (€)</label><input type="number" step={0.01} value={mediaCarreira} onChange={(e) => setMediaCarreira(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Anos com descontos</label><input type="number" min={1} value={anosDescontos} onChange={(e) => setAnosDescontos(e.target.value)} className="input-field mt-1" /></div>
      </div>
    </CalculatorLayout>
  );
}
