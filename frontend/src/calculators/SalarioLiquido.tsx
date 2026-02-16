import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import { retencaoFonteMensal } from './utils/irs';
import { TSU, SUBSIDIO_ALIMENTACAO_ISENTO } from './constants-pt-2026';
import type { CalculatorProps } from './index';

export function SalarioLiquido({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [brutoMensal, setBrutoMensal] = useState<string>(() =>
    profile?.region ? '1500' : '1500'
  );
  const [subsidioAlimentacao, setSubsidioAlimentacao] = useState<string>(
    () => String(profile?.mealAllowance ?? 6)
  );
  const [diasUteis, setDiasUteis] = useState('22');
  const [duodecimosFerias, setDuodecimosFerias] = useState(profile?.twelfthHoliday ?? false);
  const [duodecimosNatal, setDuodecimosNatal] = useState(profile?.twelfthChristmas ?? false);
  const [adse, setAdse] = useState(profile?.adse ?? false);
  const [irsJovem, setIrsJovem] = useState(profile?.irsJovem ?? false);

  const bruto = parseFloat(brutoMensal) || 0;
  const mealDay = parseFloat(subsidioAlimentacao) || 0;
  const dias = parseInt(diasUteis, 10) || 22;
  const mealTributavel = Math.max(0, mealDay - SUBSIDIO_ALIMENTACAO_ISENTO) * dias;

  const result = useMemo(() => {
    if (bruto <= 0) return null;
    const baseSS = bruto + (mealTributavel > 0 ? mealTributavel : 0);
    const ssTrabalhador = baseSS * TSU.trabalhador;
    const baseRetencao = bruto + (duodecimosFerias ? bruto / 12 : 0) + (duodecimosNatal ? bruto / 12 : 0) + mealTributavel;
    const retencao = retencaoFonteMensal(baseRetencao, {
      taxSituation: profile?.taxSituation ?? 'single',
      numberOfDependents: profile?.numberOfDependents ?? 0,
      irsJovem,
      twelfthHoliday: duodecimosFerias,
      twelfthChristmas: duodecimosNatal,
    });
    const adseVal = adse ? baseSS * 0.035 : 0; // 3.5% ADSE
    const mealBruto = mealDay * dias;
    const liquidoMensal = bruto - ssTrabalhador - retencao - adseVal + mealBruto;
    const liquidoAnual = liquidoMensal * 14 + (duodecimosFerias && duodecimosNatal ? 0 : bruto); // 14 ou 12+2
    return {
      ssTrabalhador: Math.round(ssTrabalhador * 100) / 100,
      retencao: Math.round(retencao * 100) / 100,
      adseVal: Math.round(adseVal * 100) / 100,
      mealBruto: Math.round(mealBruto * 100) / 100,
      liquidoMensal: Math.round(liquidoMensal * 100) / 100,
      liquidoAnual: Math.round(liquidoAnual * 100) / 100,
    };
  }, [bruto, mealTributavel, mealDay, dias, duodecimosFerias, duodecimosNatal, adse, irsJovem, profile]);

  const pdfContent = result
    ? {
        inputs: {
          'Salário bruto mensal (€)': brutoMensal,
          'Subsídio alimentação (€/dia)': subsidioAlimentacao,
          'Dias úteis': diasUteis,
          'Duodécimos férias': duodecimosFerias,
          'Duodécimos Natal': duodecimosNatal,
          ADSE: adse,
          'IRS Jovem': irsJovem,
        },
        results: {
          'SS trabalhador (€)': result.ssTrabalhador,
          'Retenção IRS (€)': result.retencao,
          'ADSE (€)': result.adseVal,
          'Subsídio alimentação (€)': result.mealBruto,
          'Salário líquido mensal (€)': result.liquidoMensal,
          'Salário líquido anual (€)': result.liquidoAnual,
        },
        summary: `Salário líquido mensal: ${result?.liquidoMensal} €`,
      }
    : undefined;

  return (
    <CalculatorLayout
      meta={meta}
      title="Salário líquido mensal / anual"
      onSaveDocument={onSaveDocument}
      pdfContent={pdfContent}
      result={
        result && (
          <ul className="space-y-2 text-slate-700">
            <li><strong>SS (trabalhador 11%):</strong> {result.ssTrabalhador} €</li>
            <li><strong>Retenção IRS:</strong> {result.retencao} €</li>
            {result.adseVal > 0 && <li><strong>ADSE:</strong> {result.adseVal} €</li>}
            {result.mealBruto > 0 && <li><strong>Subsídio alimentação:</strong> {result.mealBruto} €</li>}
            <li className="border-t border-slate-200 pt-2 text-lg font-semibold text-bank-navy">
              Salário líquido mensal: {result.liquidoMensal} €
            </li>
            <li className="font-semibold text-bank-navy">
              Salário líquido anual (aprox.): {result.liquidoAnual} €
            </li>
          </ul>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Salário bruto mensal (€)</label>
          <input
            type="number"
            step={0.01}
            min={0}
            value={brutoMensal}
            onChange={(e) => setBrutoMensal(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Subsídio de alimentação (€/dia) – isento até 6€</label>
          <input
            type="number"
            step={0.01}
            min={0}
            value={subsidioAlimentacao}
            onChange={(e) => setSubsidioAlimentacao(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Dias úteis (para subsídio alimentação)</label>
          <input
            type="number"
            min={1}
            max={31}
            value={diasUteis}
            onChange={(e) => setDiasUteis(e.target.value)}
            className="input-field mt-1"
          />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={duodecimosFerias} onChange={(e) => setDuodecimosFerias(e.target.checked)} className="rounded border-slate-300 text-primary-600" />
          <span className="text-sm text-slate-700">Duodécimos subsídio de férias</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={duodecimosNatal} onChange={(e) => setDuodecimosNatal(e.target.checked)} className="rounded border-slate-300 text-primary-600" />
          <span className="text-sm text-slate-700">Duodécimos subsídio de Natal</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={adse} onChange={(e) => setAdse(e.target.checked)} className="rounded border-slate-300 text-primary-600" />
          <span className="text-sm text-slate-700">Beneficiário ADSE (3,5%)</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={irsJovem} onChange={(e) => setIrsJovem(e.target.checked)} className="rounded border-slate-300 text-primary-600" />
          <span className="text-sm text-slate-700">IRS Jovem (até 35 anos)</span>
        </label>
      </div>
    </CalculatorLayout>
  );
}
