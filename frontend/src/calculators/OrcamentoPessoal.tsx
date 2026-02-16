import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function OrcamentoPessoal({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [receitas, setReceitas] = useState('2000');
  const [habitacao, setHabitacao] = useState('600');
  const [alimentacao, setAlimentacao] = useState('300');
  const [transportes, setTransportes] = useState('150');
  const [outras, setOutras] = useState('200');

  const rec = parseFloat(receitas) || 0;
  const despesas = (parseFloat(habitacao) || 0) + (parseFloat(alimentacao) || 0) + (parseFloat(transportes) || 0) + (parseFloat(outras) || 0);
  const result = useMemo(() => {
    const saldo = rec - despesas;
    const percentPoupanca = rec > 0 ? (saldo / rec) * 100 : 0;
    return { despesas: Math.round(despesas * 100) / 100, saldo: Math.round(saldo * 100) / 100, percentPoupanca: Math.round(percentPoupanca * 1) / 1 };
  }, [rec, despesas]);

  const pdfContent = result ? { inputs: { Receitas: receitas, Habitação: habitacao, Alimentação: alimentacao, Transportes: transportes, Outras: outras }, results: { Despesas: result.despesas, Saldo: result.saldo, '% poupança': `${result.percentPoupanca}%` }, summary: `Saldo mensal: ${result?.saldo} €` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Calculadora de orçamento pessoal" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li>Total despesas: {result.despesas} €</li>
        <li className="font-semibold text-bank-navy">Saldo (receitas - despesas): {result.saldo} €</li>
        <li>% para poupança: {result.percentPoupanca}%</li>
      </ul>
    )}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Receitas mensais (€)</label><input type="number" step={0.01} value={receitas} onChange={(e) => setReceitas(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Habitação (€)</label><input type="number" step={0.01} value={habitacao} onChange={(e) => setHabitacao(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Alimentação (€)</label><input type="number" step={0.01} value={alimentacao} onChange={(e) => setAlimentacao(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Transportes (€)</label><input type="number" step={0.01} value={transportes} onChange={(e) => setTransportes(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Outras despesas (€)</label><input type="number" step={0.01} value={outras} onChange={(e) => setOutras(e.target.value)} className="input-field mt-1" /></div>
      </div>
    </CalculatorLayout>
  );
}
