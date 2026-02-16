import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

// Tabela IMT 2026 - habitação própria (simplificada): escalões e taxas
const ESCALOES_IMT_HABITACAO = [
  { min: 0, max: 101193, taxa: 0, parcela: 0 },
  { min: 101193, max: 151789, taxa: 0.02, parcela: 0 },
  { min: 151789, max: 202386, taxa: 0.05, parcela: 1011.92 },
  { min: 202386, max: 252982, taxa: 0.07, parcela: 2546.77 },
  { min: 252982, max: 505965, taxa: 0.08, parcela: 3546.77 },
  { min: 505965, max: Infinity, taxa: 0.06, parcela: 0 },
];

function imtHabitacaoPropria(baseTributavel: number): number {
  let imposto = 0;
  for (const e of ESCALOES_IMT_HABITACAO) {
    if (baseTributavel <= e.min) break;
    const faixa = Math.min(baseTributavel - e.min, e.max - e.min);
    if (faixa <= 0) break;
    imposto += faixa * e.taxa - (e.parcela * (faixa / (e.max - e.min)));
  }
  return Math.max(0, imposto);
}

export function IMT({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [preco, setPreco] = useState('250000');
  const [vpt, setVpt] = useState('220000');
  const [habitacaoPropria, setHabitacaoPropria] = useState(true);

  const precoVal = parseFloat(preco) || 0;
  const vptVal = parseFloat(vpt) || 0;
  const base = Math.max(precoVal, vptVal);
  const result = useMemo(() => {
    if (base <= 0) return null;
    const imposto = habitacaoPropria ? imtHabitacaoPropria(base) : base * 0.065; // secundária 6,5% simplificado
    return { imposto: Math.round(imposto * 100) / 100, base };
  }, [base, habitacaoPropria]);

  const pdfContent = result ? { inputs: { 'Preço (€)': preco, 'VPT (€)': vpt, 'Habitação própria': habitacaoPropria }, results: { 'Base tributável': result.base, 'IMT (€)': result.imposto }, summary: `IMT: ${result?.imposto} €` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="IMT (Imposto Municipal sobre Transmissões)" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li>Base tributável: {result.base} €</li>
        <li className="font-semibold text-bank-navy">IMT a pagar: {result.imposto} €</li>
      </ul>
    )}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Preço de compra (€)</label>
          <input type="number" min={0} value={preco} onChange={(e) => setPreco(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">VPT (€) – se diferente</label>
          <input type="number" min={0} value={vpt} onChange={(e) => setVpt(e.target.value)} className="input-field mt-1" />
        </div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={habitacaoPropria} onChange={(e) => setHabitacaoPropria(e.target.checked)} className="rounded border-slate-300 text-primary-600" /> Habitação própria permanente</label>
      </div>
    </CalculatorLayout>
  );
}
