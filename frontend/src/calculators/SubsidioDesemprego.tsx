import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { SUBSIDIO_DESEMPREGO, TSU } from './constants-pt-2026';
import { retencaoFonteMensal } from './utils/irs';
import type { CalculatorProps } from './index';

export function SubsidioDesemprego({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [remuneracaoMedia, setRemuneracaoMedia] = useState('1500');
  const [diasComContribuicoes, setDiasComContribuicoes] = useState('720');

  const rem = parseFloat(remuneracaoMedia) || 0;
  const dias = parseInt(diasComContribuicoes, 10) || 0;
  const result = useMemo(() => {
    if (rem <= 0) return null;
    const remRef = rem * 0.65; // 65% da remuneração de referência (simplificado)
    const valorMin = SUBSIDIO_DESEMPREGO.valorMinimo;
    const valorMax = SUBSIDIO_DESEMPREGO.valorMaximo;
    let valor = Math.min(Math.max(remRef, valorMin), valorMax);
    const duracaoMeses = dias >= 1080 ? 24 : dias >= 720 ? 18 : dias >= 540 ? 12 : dias >= 360 ? 9 : 6;
    return {
      valorEstimado: Math.round(valor * 100) / 100,
      duracaoMeses,
      valorMin,
      valorMax,
    };
  }, [rem, dias]);

  const pdfContent = result ? { inputs: { 'Remuneração média (€)': remuneracaoMedia, 'Dias com contribuições (últimos 24 meses)': diasComContribuicoes }, results: { 'Valor estimado (€)': result.valorEstimado, 'Duração (meses)': result.duracaoMeses }, summary: `Subsídio desemprego: ${result?.valorEstimado} €/mês, até ${result.duracaoMeses} meses` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Subsídio de desemprego" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li className="font-semibold text-bank-navy">Valor estimado: {result.valorEstimado} € / mês</li>
        <li>Duração estimada: até {result.duracaoMeses} meses</li>
        <li className="text-sm">Limites 2026: min. {result.valorMin} € · máx. {result.valorMax} €</li>
      </ul>
    )}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Remuneração média (últimos 12 meses) (€)</label>
          <input type="number" step={0.01} min={0} value={remuneracaoMedia} onChange={(e) => setRemuneracaoMedia(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Dias com descontos (últimos 24 meses)</label>
          <input type="number" min={0} value={diasComContribuicoes} onChange={(e) => setDiasComContribuicoes(e.target.value)} className="input-field mt-1" />
        </div>
      </div>
    </CalculatorLayout>
  );
}
