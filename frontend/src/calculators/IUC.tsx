import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function IUC({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [cilindrada, setCilindrada] = useState('1600');
  const [co2, setCo2] = useState('120');
  const [tipo, setTipo] = useState<'gasolina' | 'diesel'>('gasolina');

  const cil = parseInt(cilindrada, 10) || 0;
  const co2Val = parseInt(co2, 10) || 0;
  const result = useMemo(() => {
    if (cil <= 0) return null;
    let imposto = 0;
    if (tipo === 'gasolina') {
      if (cil <= 1000) imposto = 25.53;
      else if (cil <= 1250) imposto = 51.06;
      else if (cil <= 1500) imposto = 76.59;
      else if (cil <= 1750) imposto = 102.12;
      else if (cil <= 2000) imposto = 127.65;
      else if (cil <= 2500) imposto = 153.18;
      else imposto = 191.48;
    } else {
      if (cil <= 1000) imposto = 51.06;
      else if (cil <= 1500) imposto = 76.59;
      else if (cil <= 2000) imposto = 102.12;
      else if (cil <= 2500) imposto = 127.65;
      else imposto = 153.18;
    }
    const componenteCO2 = Math.max(0, (co2Val - 95) * 2); // simplificado
    const total = imposto + componenteCO2;
    return { imposto: Math.round(total * 100) / 100 };
  }, [cil, co2Val, tipo]);

  const pdfContent = result ? { inputs: { Cilindrada: cilindrada, 'CO2 (g/km)': co2, Tipo: tipo }, results: { 'IUC anual (€)': result.imposto }, summary: `IUC: ${result?.imposto} €/ano` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="IUC (Imposto Único de Circulação)" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && <p className="text-lg font-semibold text-bank-navy">IUC anual: {result.imposto} €</p>}>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700">Cilindrada (cc)</label><input type="number" min={0} value={cilindrada} onChange={(e) => setCilindrada(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Emissões CO2 (g/km)</label><input type="number" min={0} value={co2} onChange={(e) => setCo2(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Tipo</label><select value={tipo} onChange={(e) => setTipo(e.target.value as 'gasolina' | 'diesel')} className="input-field mt-1"><option value="gasolina">Gasolina</option><option value="diesel">Diesel</option></select></div>
      </div>
    </CalculatorLayout>
  );
}
