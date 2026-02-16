import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { HORAS_EXTRAS } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function HorasExtras({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [valorHora, setValorHora] = useState('10');
  const [horasNormais, setHorasNormais] = useState('20');
  const [horasDescanso, setHorasDescanso] = useState('5');
  const vh = parseFloat(valorHora) || 0;
  const hn = parseFloat(horasNormais) || 0;
  const hd = parseFloat(horasDescanso) || 0;
  const result = useMemo(() => {
    if (vh <= 0) return null;
    const remunNormais = hn * vh * HORAS_EXTRAS.diaNormal;
    const remunDescanso = hd * vh * HORAS_EXTRAS.diaDescanso;
    const total = remunNormais + remunDescanso;
    return { remunNormais: Math.round(remunNormais * 100) / 100, remunDescanso: Math.round(remunDescanso * 100) / 100, total: Math.round(total * 100) / 100 };
  }, [vh, hn, hd]);
  const pdfContent = result ? { inputs: { 'Valor hora (€)': valorHora, 'Horas dia normal': horasNormais, 'Horas dia descanso': horasDescanso }, results: { 'Remun. horas normal (+25%)': result.remunNormais, 'Remun. dia descanso (+50%)': result.remunDescanso, Total: result.total }, summary: `Total horas extras: ${result?.total} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="Horas extras" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <ul className="space-y-1 text-slate-700"><li>Dia normal (+25%): {result.remunNormais} €</li><li>Dia descanso (+50%): {result.remunDescanso} €</li><li className="font-semibold text-bank-navy">Total: {result.total} €</li></ul>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Valor hora base (€)</label><input type="number" step={0.01} value={valorHora} onChange={(e) => setValorHora(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Horas em dia normal</label><input type="number" step={0.5} value={horasNormais} onChange={(e) => setHorasNormais(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Horas em dia de descanso</label><input type="number" step={0.5} value={horasDescanso} onChange={(e) => setHorasDescanso(e.target.value)} className="input-field mt-1" /></div>
      </div>
    </CalculatorLayout>
  );
}
