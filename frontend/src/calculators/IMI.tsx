import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { IMI_TAXAS } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function IMI({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [vpt, setVpt] = useState('200000');
  const [taxa, setTaxa] = useState(profile?.municipalityTaxRate ? String(profile.municipalityTaxRate) : '0.3');
  const [tipo, setTipo] = useState<'urbano' | 'rustico'>('urbano');

  const vptVal = parseFloat(vpt) || 0;
  const taxaVal = parseFloat(taxa) || 0.3;
  const result = useMemo(() => {
    if (vptVal <= 0) return null;
    const t = tipo === 'rustico' ? IMI_TAXAS.rustico : Math.min(Math.max(taxaVal, IMI_TAXAS.minimoUrbano), IMI_TAXAS.maximoUrbano);
    const imposto = (vptVal * t) / 100;
    return { imposto: Math.round(imposto * 100) / 100, taxa: t * 100 };
  }, [vptVal, taxaVal, tipo]);

  const pdfContent = result ? { inputs: { 'VPT (€)': vpt, 'Taxa (%)': taxa, Tipo: tipo }, results: { 'IMI anual (€)': result.imposto }, summary: `IMI: ${result?.imposto} €/ano` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="IMI (Imposto Municipal sobre Imóveis)" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <p className="text-lg font-semibold text-bank-navy">IMI anual: {result.imposto} € (taxa {result.taxa}%)</p>
    )}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Valor Patrimonial Tributário - VPT (€)</label>
          <input type="number" min={0} value={vpt} onChange={(e) => setVpt(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Tipo de prédio</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as 'urbano' | 'rustico')} className="input-field mt-1">
            <option value="urbano">Urbano (taxa 0,30% - 0,45%)</option>
            <option value="rustico">Rústico (0,80%)</option>
          </select>
        </div>
        {tipo === 'urbano' && (
          <div>
            <label className="block text-sm font-medium text-slate-700">Taxa do município (%)</label>
            <input type="number" step={0.01} min={0.3} max={0.45} value={taxa} onChange={(e) => setTaxa(e.target.value)} className="input-field mt-1" placeholder="0.30 - 0.45" />
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
