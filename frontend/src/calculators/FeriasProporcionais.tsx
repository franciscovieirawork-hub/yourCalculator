import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { TSU } from './constants-pt-2026';
import { retencaoFonteMensal } from './utils/irs';
import type { CalculatorProps } from './index';

export function FeriasProporcionais({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [brutoMensal, setBrutoMensal] = useState('1500');
  const [diasTrabalhados, setDiasTrabalhados] = useState('180');

  const bruto = parseFloat(brutoMensal) || 0;
  const dias = parseInt(diasTrabalhados, 10) || 0;
  const result = useMemo(() => {
    if (bruto <= 0 || dias <= 0) return null;
    const proporcionais = (dias / 365) * 22; // 22 dias úteis de férias por ano
    const valorBruto = (bruto / 30) * proporcionais;
    const ss = valorBruto * TSU.trabalhador;
    const ret = retencaoFonteMensal(valorBruto, { taxSituation: profile?.taxSituation ?? 'single', numberOfDependents: profile?.numberOfDependents ?? 0 });
    const liquido = valorBruto - ss - ret;
    return {
      diasFerias: Math.round(proporcionais * 10) / 10,
      valorBruto: Math.round(valorBruto * 100) / 100,
      ss: Math.round(ss * 100) / 100,
      retencao: Math.round(ret * 100) / 100,
      liquido: Math.round(liquido * 100) / 100,
    };
  }, [bruto, dias, profile]);

  const pdfContent = result ? { inputs: { 'Bruto mensal (€)': brutoMensal, 'Dias trabalhados': diasTrabalhados }, results: { 'Dias férias proporcionais': result.diasFerias, 'Valor bruto': result.valorBruto, 'Líquido': result.liquido }, summary: `Férias proporcionais líquidas: ${result?.liquido} €` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Férias proporcionais" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li>Dias de férias proporcionais: {result.diasFerias}</li>
        <li>Valor bruto: {result.valorBruto} €</li>
        <li>SS: {result.ss} € · Retenção: {result.retencao} €</li>
        <li className="font-semibold text-bank-navy">Valor líquido em cessação: {result.liquido} €</li>
      </ul>
    )}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Salário bruto mensal (€)</label>
          <input type="number" step={0.01} min={0} value={brutoMensal} onChange={(e) => setBrutoMensal(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Dias trabalhados no ano</label>
          <input type="number" min={1} max={365} value={diasTrabalhados} onChange={(e) => setDiasTrabalhados(e.target.value)} className="input-field mt-1" />
        </div>
      </div>
    </CalculatorLayout>
  );
}
