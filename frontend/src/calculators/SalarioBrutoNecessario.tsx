import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { retencaoFonteMensal } from './utils/irs';
import { TSU, SUBSIDIO_ALIMENTACAO_ISENTO } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function SalarioBrutoNecessario({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [liquidoDesejado, setLiquidoDesejado] = useState('1200');
  const [subsidioAlimentacao, setSubsidioAlimentacao] = useState('6');
  const [diasUteis, setDiasUteis] = useState('22');
  const [adse, setAdse] = useState(profile?.adse ?? false);
  const [irsJovem, setIrsJovem] = useState(profile?.irsJovem ?? false);
  const [duodecimos, setDuodecimos] = useState(false);

  const liquido = parseFloat(liquidoDesejado) || 0;
  const mealDay = parseFloat(subsidioAlimentacao) || 0;
  const dias = parseInt(diasUteis, 10) || 22;
  const mealBruto = mealDay * dias;

  const result = useMemo(() => {
    if (liquido <= 0) return null;
    // Aproximação iterativa: bruto -> liquido; queremos liquido = X, achar bruto
    let bruto = liquido / 0.65; // primeira estimativa
    for (let i = 0; i < 30; i++) {
      const mealTributavel = Math.max(0, mealDay - SUBSIDIO_ALIMENTACAO_ISENTO) * dias;
      const baseSS = bruto + (mealTributavel > 0 ? mealTributavel : 0);
      const ss = baseSS * TSU.trabalhador;
      const baseRet = bruto + (duodecimos ? bruto / 6 : 0) + mealTributavel;
      const ret = retencaoFonteMensal(baseRet, {
        taxSituation: profile?.taxSituation ?? 'single',
        numberOfDependents: profile?.numberOfDependents ?? 0,
        irsJovem,
        twelfthHoliday: duodecimos,
        twelfthChristmas: duodecimos,
      });
      const adseVal = adse ? baseSS * 0.035 : 0;
      const liq = bruto - ss - ret - adseVal + mealBruto;
      if (Math.abs(liq - liquido) < 0.5) break;
      bruto = bruto + (liquido - liq);
      if (bruto < 0) break;
    }
    const mealTributavel = Math.max(0, mealDay - SUBSIDIO_ALIMENTACAO_ISENTO) * dias;
    const baseSS = bruto + (mealTributavel > 0 ? mealTributavel : 0);
    const ss = baseSS * TSU.trabalhador;
    const baseRet = bruto + (duodecimos ? bruto / 6 : 0) + mealTributavel;
    const ret = retencaoFonteMensal(baseRet, {
      taxSituation: profile?.taxSituation ?? 'single',
      numberOfDependents: profile?.numberOfDependents ?? 0,
      irsJovem,
      twelfthHoliday: duodecimos,
      twelfthChristmas: duodecimos,
    });
    const adseVal = adse ? baseSS * 0.035 : 0;
    const liq = bruto - ss - ret - adseVal + mealBruto;
    return {
      brutoNecessario: Math.round(bruto * 100) / 100,
      ss: Math.round(ss * 100) / 100,
      retencao: Math.round(ret * 100) / 100,
      adseVal: Math.round(adseVal * 100) / 100,
      liquidoObtido: Math.round(liq * 100) / 100,
    };
  }, [liquido, mealDay, dias, mealBruto, adse, irsJovem, duodecimos, profile]);

  const pdfContent = result
    ? {
        inputs: { 'Líquido desejado (€)': liquidoDesejado, 'Subs. alimentação (€/dia)': subsidioAlimentacao, 'Dias úteis': diasUteis, ADSE: adse, 'IRS Jovem': irsJovem, Duodécimos: duodecimos },
        results: { 'Bruto necessário (€)': result.brutoNecessario, 'SS (€)': result.ss, 'Retenção (€)': result.retencao, 'Líquido obtido (€)': result.liquidoObtido },
        summary: `Para receber ${liquido} € líquidos precisa de um bruto de aproximadamente ${result?.brutoNecessario} €.`,
      }
    : undefined;

  return (
    <CalculatorLayout meta={meta} title="Salário bruto necessário" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li className="text-lg font-semibold text-bank-navy">Salário bruto necessário: {result.brutoNecessario} € / mês</li>
        <li>SS: {result.ss} € · Retenção IRS: {result.retencao} € {result.adseVal > 0 && `· ADSE: ${result.adseVal} €`}</li>
        <li className="text-sm text-slate-600">Líquido obtido: {result.liquidoObtido} €</li>
      </ul>
    )}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Salário líquido desejado (€/mês)</label>
          <input type="number" step={0.01} min={0} value={liquidoDesejado} onChange={(e) => setLiquidoDesejado(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Subsídio alimentação (€/dia)</label>
          <input type="number" step={0.01} min={0} value={subsidioAlimentacao} onChange={(e) => setSubsidioAlimentacao(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Dias úteis</label>
          <input type="number" min={1} max={31} value={diasUteis} onChange={(e) => setDiasUteis(e.target.value)} className="input-field mt-1" />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={adse} onChange={(e) => setAdse(e.target.checked)} className="rounded border-slate-300 text-primary-600" />
          <span className="text-sm text-slate-700">ADSE</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={irsJovem} onChange={(e) => setIrsJovem(e.target.checked)} className="rounded border-slate-300 text-primary-600" />
          <span className="text-sm text-slate-700">IRS Jovem</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={duodecimos} onChange={(e) => setDuodecimos(e.target.checked)} className="rounded border-slate-300 text-primary-600" />
          <span className="text-sm text-slate-700">Duodécimos (férias e Natal)</span>
        </label>
      </div>
    </CalculatorLayout>
  );
}
