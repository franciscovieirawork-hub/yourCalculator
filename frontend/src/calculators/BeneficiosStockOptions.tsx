import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function BeneficiosStockOptions({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [valorBeneficio, setValorBeneficio] = useState('5000');
  const [tipo, setTipo] = useState<'stock_options' | 'seguro_saude'>('stock_options');
  const valor = parseFloat(valorBeneficio) || 0;
  const result = useMemo(() => {
    if (valor <= 0) return null;
    const tributavel = valor;
    const irs = tributavel * 0.35;
    const ss = tributavel * 0.11;
    return { tributavel, irs: Math.round(irs * 100) / 100, ss: Math.round(ss * 100) / 100, liquido: Math.round((valor - irs - ss) * 100) / 100 };
  }, [valor]);
  const pdfContent = result ? { inputs: { 'Valor benefício (€)': valorBeneficio, Tipo: tipo }, results: { 'IRS (aprox.)': result.irs, 'SS (aprox.)': result.ss, 'Líquido': result.liquido }, summary: `Líquido: ${result?.liquido} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="Efeitos de benefícios (stock options, seguro saúde)" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <ul className="space-y-1 text-slate-700"><li>Valor tributável: {result.tributavel} €</li><li>IRS (indicativo): {result.irs} €</li><li className="font-semibold text-bank-navy">Líquido estimado: {result.liquido} €</li></ul>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Valor do benefício (€)</label><input type="number" step={0.01} value={valorBeneficio} onChange={(e) => setValorBeneficio(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Tipo</label><select value={tipo} onChange={(e) => setTipo(e.target.value as 'stock_options' | 'seguro_saude')} className="input-field mt-1"><option value="stock_options">Stock options / bónus</option><option value="seguro_saude">Seguro de saúde (geralmente isento até certo valor)</option></select></div>
      </div>
    </CalculatorLayout>
  );
}
