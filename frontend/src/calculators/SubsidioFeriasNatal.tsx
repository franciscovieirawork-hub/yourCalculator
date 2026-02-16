import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { TSU } from './constants-pt-2026';
import { retencaoFonteMensal } from './utils/irs';
import type { CalculatorProps } from './index';

export function SubsidioFeriasNatal({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [brutoMensal, setBrutoMensal] = useState('1500');

  const bruto = parseFloat(brutoMensal) || 0;
  const result = useMemo(() => {
    if (bruto <= 0) return null;
    const valorSubsidio = bruto; // cada subsídio = 1 mês
    const ss = valorSubsidio * TSU.trabalhador;
    const ret = retencaoFonteMensal(valorSubsidio, { taxSituation: profile?.taxSituation ?? 'single', numberOfDependents: profile?.numberOfDependents ?? 0 });
    const liquido = valorSubsidio - ss - ret;
    return {
      valorBruto: Math.round(valorSubsidio * 100) / 100,
      ss: Math.round(ss * 100) / 100,
      retencao: Math.round(ret * 100) / 100,
      liquido: Math.round(liquido * 100) / 100,
    };
  }, [bruto, profile]);

  const pdfContent = result ? { inputs: { 'Salário bruto mensal (€)': brutoMensal }, results: { 'Subsídio bruto': result.valorBruto, 'SS': result.ss, 'Retenção': result.retencao, 'Subsídio líquido': result.liquido }, summary: `Subsídio líquido: ${result?.liquido} €` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Subsídio de férias e subsídio de Natal" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li>Valor bruto (cada): {result.valorBruto} €</li>
        <li>SS: {result.ss} € · Retenção: {result.retencao} €</li>
        <li className="font-semibold text-bank-navy">Valor líquido de cada subsídio: {result.liquido} €</li>
        <li className="text-sm">Proporcional: (dias trabalhados / 30) × {result.liquido} €</li>
      </ul>
    )}>
      <div>
        <label className="block text-sm font-medium text-slate-700">Salário bruto mensal (€)</label>
        <input type="number" step={0.01} min={0} value={brutoMensal} onChange={(e) => setBrutoMensal(e.target.value)} className="input-field mt-1" />
      </div>
    </CalculatorLayout>
  );
}
