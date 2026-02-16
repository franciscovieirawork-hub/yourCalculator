import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { irsAnualRendimentoColectavel } from './utils/irs';
import { MINIMO_EXISTENCIA_2026 } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function SimuladorIRS({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [rendimentoBruto, setRendimentoBruto] = useState('25000');
  const [deducoesEspecificas, setDeducoesEspecificas] = useState('0');

  const bruto = parseFloat(rendimentoBruto) || 0;
  const deducoes = parseFloat(deducoesEspecificas) || 0;
  const result = useMemo(() => {
    if (bruto <= 0) return null;
    const colectavel = Math.max(0, bruto - deducoes);
    const imposto = irsAnualRendimentoColectavel(colectavel);
    const taxaEfetiva = bruto > 0 ? (imposto / bruto) * 100 : 0;
    const minimo = MINIMO_EXISTENCIA_2026;
    return {
      colectavel: Math.round(colectavel * 100) / 100,
      imposto: Math.round(imposto * 100) / 100,
      taxaEfetiva: Math.round(taxaEfetiva * 2) / 2,
      minimoExistencia: minimo,
    };
  }, [bruto, deducoes]);

  const pdfContent = result ? { inputs: { 'Rendimento bruto anual (€)': rendimentoBruto, 'Deduções específicas (€)': deducoesEspecificas }, results: { 'Rendimento coletável (€)': result.colectavel, 'Imposto IRS (€)': result.imposto, 'Taxa efetiva (%)': result.taxaEfetiva }, summary: `IRS anual: ${result?.imposto} €` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Simulador IRS completo" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li>Rendimento coletável: {result.colectavel} €</li>
        <li className="font-semibold text-bank-navy">Imposto IRS (anual): {result.imposto} €</li>
        <li>Taxa efetiva: {result.taxaEfetiva}%</li>
        <li className="text-sm">Mínimo de existência 2026: {result.minimoExistencia} €</li>
      </ul>
    )}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Rendimento bruto anual (€)</label>
          <input type="number" step={0.01} min={0} value={rendimentoBruto} onChange={(e) => setRendimentoBruto(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Deduções específicas (€)</label>
          <input type="number" step={0.01} min={0} value={deducoesEspecificas} onChange={(e) => setDeducoesEspecificas(e.target.value)} className="input-field mt-1" />
        </div>
      </div>
    </CalculatorLayout>
  );
}
