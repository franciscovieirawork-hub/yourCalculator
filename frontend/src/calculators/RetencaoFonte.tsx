import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { retencaoFonteMensal } from './utils/irs';
import type { CalculatorProps } from './index';

export function RetencaoFonte({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [bruto, setBruto] = useState('2000');
  const [duodecimosFerias, setDuodecimosFerias] = useState(profile?.twelfthHoliday ?? false);
  const [duodecimosNatal, setDuodecimosNatal] = useState(profile?.twelfthChristmas ?? false);
  const [irsJovem, setIrsJovem] = useState(profile?.irsJovem ?? false);

  const brutoVal = parseFloat(bruto) || 0;
  const result = useMemo(() => {
    if (brutoVal <= 0) return null;
    const base = brutoVal + (duodecimosFerias ? brutoVal / 12 : 0) + (duodecimosNatal ? brutoVal / 12 : 0);
    const ret = retencaoFonteMensal(base, {
      taxSituation: profile?.taxSituation ?? 'single',
      numberOfDependents: profile?.numberOfDependents ?? 0,
      irsJovem,
      twelfthHoliday: duodecimosFerias,
      twelfthChristmas: duodecimosNatal,
    });
    return { retencao: ret, baseAnualAprox: base * 14 };
  }, [brutoVal, duodecimosFerias, duodecimosNatal, irsJovem, profile]);

  const pdfContent = result ? { inputs: { 'Bruto mensal (€)': bruto, Duodécimos: duodecimosFerias || duodecimosNatal, 'IRS Jovem': irsJovem }, results: { 'Retenção mensal (€)': result.retencao }, summary: `Retenção na fonte: ${result.retencao} €/mês` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Imposto sobre trabalho (retenção na fonte)" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <p className="text-lg font-semibold text-bank-navy">Retenção na fonte mensal: {result.retencao} €</p>
    )}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Remuneração bruta mensal (€)</label>
          <input type="number" step={0.01} min={0} value={bruto} onChange={(e) => setBruto(e.target.value)} className="input-field mt-1" />
        </div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={duodecimosFerias} onChange={(e) => setDuodecimosFerias(e.target.checked)} className="rounded border-slate-300 text-primary-600" /> Duodécimos férias</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={duodecimosNatal} onChange={(e) => setDuodecimosNatal(e.target.checked)} className="rounded border-slate-300 text-primary-600" /> Duodécimos Natal</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={irsJovem} onChange={(e) => setIrsJovem(e.target.checked)} className="rounded border-slate-300 text-primary-600" /> IRS Jovem</label>
      </div>
    </CalculatorLayout>
  );
}
