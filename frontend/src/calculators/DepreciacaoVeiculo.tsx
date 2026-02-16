import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function DepreciacaoVeiculo({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [precoCompra, setPrecoCompra] = useState('25000');
  const [anos, setAnos] = useState('5');
  const [combustivelMensal, setCombustivelMensal] = useState('150');
  const [seguroAnual, setSeguroAnual] = useState('400');
  const [manutencaoAnual, setManutencaoAnual] = useState('500');
  const preco = parseFloat(precoCompra) || 0;
  const anosVal = parseInt(anos, 10) || 0;
  const comb = parseFloat(combustivelMensal) || 0;
  const seg = parseFloat(seguroAnual) || 0;
  const man = parseFloat(manutencaoAnual) || 0;
  const result = useMemo(() => {
    if (preco <= 0) return null;
    const depreciacaoAnual = preco * 0.15;
    const custoAnual = depreciacaoAnual + comb * 12 + seg + man;
    const custoTotal5 = custoAnual * Math.min(anosVal, 5);
    return { depreciacaoAnual: Math.round(depreciacaoAnual * 100) / 100, custoAnual: Math.round(custoAnual * 100) / 100, custoTotal5: Math.round(custoTotal5 * 100) / 100 };
  }, [preco, anosVal, comb, seg, man]);
  const pdfContent = result ? { inputs: { 'Preço compra (€)': precoCompra, 'Combustível/mês (€)': combustivelMensal, 'Seguro/ano (€)': seguroAnual, 'Manutenção/ano (€)': manutencaoAnual }, results: { 'Depreciação anual (15%)': result.depreciacaoAnual, 'Custo anual total': result.custoAnual }, summary: `Custo anual: ${result?.custoAnual} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="Depreciação e custo total de propriedade" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <ul className="space-y-1 text-slate-700"><li>Depreciação anual (aprox. 15%): {result.depreciacaoAnual} €</li><li className="font-semibold text-bank-navy">Custo anual total: {result.custoAnual} €</li></ul>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Preço de compra (€)</label><input type="number" min={0} value={precoCompra} onChange={(e) => setPrecoCompra(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Combustível (€/mês)</label><input type="number" step={0.01} value={combustivelMensal} onChange={(e) => setCombustivelMensal(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Seguro (€/ano)</label><input type="number" step={0.01} value={seguroAnual} onChange={(e) => setSeguroAnual(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Manutenção (€/ano)</label><input type="number" step={0.01} value={manutencaoAnual} onChange={(e) => setManutencaoAnual(e.target.value)} className="input-field mt-1" /></div>
      </div>
    </CalculatorLayout>
  );
}
