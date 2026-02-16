import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function CustosFormacao({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [numeroTrabalhadores, setNumeroTrabalhadores] = useState('50');
  const [horasFormacao, setHorasFormacao] = useState('40');
  const [custoHora, setCustoHora] = useState('25');
  const n = parseInt(numeroTrabalhadores, 10) || 0;
  const h = parseFloat(horasFormacao) || 0;
  const c = parseFloat(custoHora) || 0;
  const result = useMemo(() => {
    const custoTotal = n * h * c;
    const contribuicao = custoTotal * 0.01;
    return { custoTotal: Math.round(custoTotal * 100) / 100, contribuicao: Math.round(contribuicao * 100) / 100 };
  }, [n, h, c]);
  const pdfContent = result ? { inputs: { 'N.º trabalhadores': numeroTrabalhadores, 'Horas formação': horasFormacao, 'Custo/hora (€)': custoHora }, results: { 'Custo total (€)': result.custoTotal, 'Contribuição obrigatória (1%)': result.contribuicao }, summary: `Custo: ${result?.custoTotal} €` } : undefined;
  return (
    <CalculatorLayout meta={meta} title="Custos de formação profissional" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <p className="font-semibold text-bank-navy">Custo total: {result.custoTotal} € · Contribuição (1%): {result.contribuicao} €</p>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">N.º de trabalhadores</label><input type="number" min={0} value={numeroTrabalhadores} onChange={(e) => setNumeroTrabalhadores(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Horas de formação</label><input type="number" step={0.5} value={horasFormacao} onChange={(e) => setHorasFormacao(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Custo por hora (€)</label><input type="number" step={0.01} value={custoHora} onChange={(e) => setCustoHora(e.target.value)} className="input-field mt-1" /></div>
      </div>
    </CalculatorLayout>
  );
}
