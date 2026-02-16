import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from './CalculatorLayout';
import type { CalculatorProps } from './index';

export function IndemnizacoesCessacao({ profile, onSaveDocument, meta }: CalculatorProps) {
  const [brutoMensal, setBrutoMensal] = useState('1500');
  const [anosTrabalho, setAnosTrabalho] = useState('5');
  const [tipoRescisao, setTipoRescisao] = useState<'sem_justa_causa' | 'com_justa_causa' | 'extincao'>('sem_justa_causa');

  const bruto = parseFloat(brutoMensal) || 0;
  const anos = parseFloat(anosTrabalho) || 0;

  const result = useMemo(() => {
    if (bruto <= 0 || anos <= 0) return null;
    let diasPorAno = 0;
    if (tipoRescisao === 'sem_justa_causa') diasPorAno = 22; // até 20 anos, depois 30
    else if (tipoRescisao === 'com_justa_causa') diasPorAno = 22;
    else diasPorAno = 22;
    const diasTotais = Math.min(anos * diasPorAno, 20 * 22 + Math.max(0, anos - 20) * 30);
    const baseDiaria = bruto / 30;
    const indemnizacao = baseDiaria * diasTotais;
    return {
      diasTotais: Math.round(diasTotais),
      baseDiaria: Math.round(baseDiaria * 100) / 100,
      indemnizacao: Math.round(indemnizacao * 100) / 100,
    };
  }, [bruto, anos, tipoRescisao]);

  const pdfContent = result ? { inputs: { 'Bruto mensal (€)': brutoMensal, 'Anos de trabalho': anosTrabalho, 'Tipo rescisão': tipoRescisao }, results: { 'Dias a indemnizar': result.diasTotais, 'Indemnização (€)': result.indemnizacao }, summary: `Indemnização estimada: ${result?.indemnizacao} €` } : undefined;

  return (
    <CalculatorLayout meta={meta} title="Indemnizações por cessação / despedimento" onSaveDocument={onSaveDocument} pdfContent={pdfContent} result={result && (
      <ul className="space-y-2 text-slate-700">
        <li>Dias a indemnizar: {result.diasTotais}</li>
        <li>Base diária: {result.baseDiaria} €</li>
        <li className="font-semibold text-bank-navy">Indemnização estimada: {result.indemnizacao} €</li>
        <li className="text-sm text-slate-600">Valor indicativo. Consulte o Código do Trabalho e a sua situação.</li>
      </ul>
    )}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Remuneração bruta mensal (€)</label>
          <input type="number" step={0.01} min={0} value={brutoMensal} onChange={(e) => setBrutoMensal(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Anos de trabalho</label>
          <input type="number" step={0.1} min={0} value={anosTrabalho} onChange={(e) => setAnosTrabalho(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Tipo de rescisão</label>
          <select value={tipoRescisao} onChange={(e) => setTipoRescisao(e.target.value as typeof tipoRescisao)} className="input-field mt-1">
            <option value="sem_justa_causa">Despedimento sem justa causa (empregador)</option>
            <option value="com_justa_causa">Despedimento com justa causa / extinção posto</option>
            <option value="extincao">Extinção do posto de trabalho</option>
          </select>
        </div>
      </div>
    </CalculatorLayout>
  );
}
