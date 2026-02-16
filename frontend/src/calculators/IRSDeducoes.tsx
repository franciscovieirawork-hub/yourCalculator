import React, { useState } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function IRSDeducoes({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [saude, setSaude] = useState('500');
  const [educacao, setEducacao] = useState('300');
  const [habitacao, setHabitacao] = useState('200');
  const [outras, setOutras] = useState('0');
  const total = (parseFloat(saude) || 0) + (parseFloat(educacao) || 0) + (parseFloat(habitacao) || 0) + (parseFloat(outras) || 0);
  const limiteGeral = 250; // limite genérico por categoria - simplificado
  const pdfContent = { inputs: { Saúde: saude, Educação: educacao, Habitação: habitacao, Outras: outras }, results: { 'Total deduções (€)': total }, summary: `Total deduções E-fatura: ${total} €` };
  return (
    <CalculatorLayout meta={meta} title="Simulação de deduções fiscais (E-fatura)" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={<p className="font-semibold text-bank-navy">Total deduções à colecta (indicativo): {total} €. Limites por categoria aplicam-se (consulte Portal das Finanças).</p>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Saúde (€)</label><input type="number" step={0.01} value={saude} onChange={(e) => setSaude(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Educação (€)</label><input type="number" step={0.01} value={educacao} onChange={(e) => setEducacao(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Habitação (€)</label><input type="number" step={0.01} value={habitacao} onChange={(e) => setHabitacao(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Outras (€)</label><input type="number" step={0.01} value={outras} onChange={(e) => setOutras(e.target.value)} className="input-field mt-1" /></div>
      </div>
    </CalculatorLayout>
  );
}
