import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { IAS_2026 } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function SubsidioDoencaParentalidade({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [remuneracaoRef, setRemuneracaoRef] = useState('1500');
  const [tipo, setTipo] = useState<'doenca' | 'parentalidade' | 'paternidade'>('parentalidade');
  const rem = parseFloat(remuneracaoRef) || 0;
  const result = useMemo(() => {
    if (rem <= 0) return null;
    let percentagem = 0.65;
    if (tipo === 'doenca') percentagem = 0.55;
    if (tipo === 'parentalidade' || tipo === 'paternidade') percentagem = 0.83;
    const valor = Math.min(Math.max(rem * percentagem, IAS_2026), IAS_2026 * 4);
    return { valor: Math.round(valor * 100) / 100, percentagem: percentagem * 100 };
  }, [rem, tipo]);
  const pdfContent = result ? { inputs: { 'Remuneração ref. (€)': remuneracaoRef, Tipo: tipo }, results: { 'Valor estimado (€)': result.valor }, summary: `Subsídio: ${result?.valor} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="Subsídios doença / parentalidade / paternidade" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <p className="font-semibold text-bank-navy">Valor estimado: {result.valor} € ({result.percentagem}% da rem. ref.)</p>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Remuneração de referência (€)</label><input type="number" step={0.01} value={remuneracaoRef} onChange={(e) => setRemuneracaoRef(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Tipo</label><select value={tipo} onChange={(e) => setTipo(e.target.value as 'doenca' | 'parentalidade' | 'paternidade')} className="input-field mt-1"><option value="doenca">Subsídio de doença</option><option value="parentalidade">Parentalidade</option><option value="paternidade">Paternidade</option></select></div>
      </div>
    </CalculatorLayout>
  );
}
