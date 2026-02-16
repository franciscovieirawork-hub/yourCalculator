import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { TSU } from './constants-pt-2026';
import { retencaoFonteMensal } from './utils/irs';
import { RECIBOS_VERDES } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function ComparacaoCenarios({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [bruto, setBruto] = useState('2000');
  const [cenario, setCenario] = useState<'fulltime' | 'parttime' | 'recibos'>('fulltime');
  const [percentagemPartTime, setPercentagemPartTime] = useState('50');
  const brutoVal = parseFloat(bruto) || 0;
  const pt = parseFloat(percentagemPartTime) || 50;
  const result = useMemo(() => {
    if (brutoVal <= 0) return null;
    if (cenario === 'fulltime') {
      const ss = brutoVal * TSU.trabalhador;
      const ret = retencaoFonteMensal(brutoVal, { taxSituation: profile?.taxSituation ?? 'single', numberOfDependents: profile?.numberOfDependents ?? 0 });
      return { liquido: Math.round((brutoVal - ss - ret) * 100) / 100, label: 'Full-time' };
    }
    if (cenario === 'parttime') {
      const base = (brutoVal * pt) / 100;
      const ss = base * TSU.trabalhador;
      const ret = retencaoFonteMensal(base, { taxSituation: profile?.taxSituation ?? 'single', numberOfDependents: profile?.numberOfDependents ?? 0 });
      return { liquido: Math.round((base - ss - ret) * 100) / 100, label: `Part-time ${pt}%` };
    }
    const base = (brutoVal * RECIBOS_VERDES.ssBasePresumida);
    const ss = base * RECIBOS_VERDES.ssTaxa;
    const ret = brutoVal * 12 <= RECIBOS_VERDES.isencaoAnual ? 0 : brutoVal * RECIBOS_VERDES.retencaoGeral;
    return { liquido: Math.round((brutoVal - ss - ret) * 100) / 100, label: 'Recibos verdes' };
  }, [brutoVal, cenario, pt, profile]);
  const pdfContent = result ? { inputs: { 'Bruto (€)': bruto, Cenário: cenario }, results: { Líquido: result.liquido }, summary: `${result.label}: ${result?.liquido} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="Comparação de cenários" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <p className="font-semibold text-bank-navy">{result.label}: {result.liquido} € líquidos/mês</p>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Remuneração de referência (€/mês)</label><input type="number" step={0.01} value={bruto} onChange={(e) => setBruto(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Cenário</label><select value={cenario} onChange={(e) => setCenario(e.target.value as 'fulltime' | 'parttime' | 'recibos')} className="input-field mt-1"><option value="fulltime">Full-time (trabalho dependente)</option><option value="parttime">Part-time</option><option value="recibos">Recibos verdes</option></select></div>
        {cenario === 'parttime' && <div><label className="block text-sm font-medium text-slate-700">Percentagem (%)</label><input type="number" min={1} max={100} value={percentagemPartTime} onChange={(e) => setPercentagemPartTime(e.target.value)} className="input-field mt-1" /></div>}
      </div>
    </CalculatorLayout>
  );
}
