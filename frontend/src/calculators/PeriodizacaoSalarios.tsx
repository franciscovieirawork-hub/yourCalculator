import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function PeriodizacaoSalarios({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [brutoAnual, setBrutoAnual] = useState('24000');
  const [pagamentos, setPagamentos] = useState<'12' | '14'>('14');
  const bruto = parseFloat(brutoAnual) || 0;
  const n = pagamentos === '14' ? 14 : 12;
  const result = useMemo(() => {
    if (bruto <= 0) return null;
    const valorPorPagamento = bruto / n;
    return { valorPorPagamento: Math.round(valorPorPagamento * 100) / 100, totalAnual: bruto };
  }, [bruto, n]);
  const pdfContent = result ? { inputs: { 'Bruto anual (€)': brutoAnual, Pagamentos: pagamentos }, results: { 'Valor por pagamento (€)': result.valorPorPagamento }, summary: `${n} pagamentos de ${result?.valorPorPagamento} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="Simulador de periodização de salários" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <p className="font-semibold text-bank-navy">Valor por pagamento: {result.valorPorPagamento} € ({n} pagamentos/ano)</p>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Remuneração bruta anual (€)</label><input type="number" step={0.01} value={brutoAnual} onChange={(e) => setBrutoAnual(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">N.º de pagamentos</label><select value={pagamentos} onChange={(e) => setPagamentos(e.target.value as '12' | '14')} className="input-field mt-1"><option value="14">14 (12 meses + 2 subsídios)</option><option value="12">12 (duodécimos)</option></select></div>
      </div>
    </CalculatorLayout>
  );
}
