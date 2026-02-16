import React from 'react';
import { jsPDF } from 'jspdf';
import type { CalculatorMeta } from './index';

interface CalculatorLayoutProps {
  meta: CalculatorMeta;
  title: string;
  children: React.ReactNode;
  result?: React.ReactNode;
  onSaveDocument?: (title: string, content: object) => Promise<{ id: string; title: string; calculatorId: string; calculatorName: string; createdAt: string }>;
  pdfContent?: { inputs: Record<string, unknown>; results: Record<string, unknown>; summary?: string };
}

export function CalculatorLayout({
  meta,
  title,
  children,
  result,
  onSaveDocument,
  pdfContent,
}: CalculatorLayoutProps) {
  const [saving, setSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState('');

  const handleExportPdf = () => {
    if (!pdfContent) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(meta.calculatorName, 20, 20);
    doc.setFontSize(12);
    doc.text(`Simulação - ${new Date().toLocaleDateString('pt-PT')}`, 20, 28);
    let y = 40;
    doc.setFontSize(10);
    Object.entries(pdfContent.inputs).forEach(([k, v]) => {
      doc.text(`${String(k)}: ${String(v)}`, 20, y);
      y += 6;
    });
    y += 4;
    Object.entries(pdfContent.results).forEach(([k, v]) => {
      doc.text(`${String(k)}: ${String(v)}`, 20, y);
      y += 6;
    });
    if (pdfContent.summary) {
      y += 4;
      doc.text(pdfContent.summary, 20, y);
    }
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleSaveDocument = async () => {
    if (!onSaveDocument || !pdfContent) return;
    setSaving(true);
    setSaveMessage('');
    try {
      const title = `${meta.calculatorName} - ${new Date().toLocaleDateString('pt-PT')}`;
      const content = {
        ...pdfContent,
        calculatorId: meta.calculatorId,
        calculatorName: meta.calculatorName,
        savedAt: new Date().toISOString(),
      };
      await onSaveDocument(title, content);
      setSaveMessage('Documento guardado. Pode vê-lo em Documentos.');
    } catch {
      setSaveMessage('Erro ao guardar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-bank-navy">{title}</h1>
        <p className="mt-1 text-slate-600">{meta.calculatorName}</p>
      </div>

      <div className="card">{children}</div>

      {result && (
        <div className="card border-primary-200 bg-primary-50/30">
          <h2 className="text-lg font-semibold text-bank-navy">Resultado</h2>
          <div className="mt-4">{result}</div>
        </div>
      )}

      {(pdfContent || onSaveDocument) && (
        <div className="flex flex-wrap items-center gap-3">
          {pdfContent && (
            <button type="button" onClick={handleExportPdf} className="btn-secondary">
              Exportar PDF (abrir no navegador)
            </button>
          )}
          {onSaveDocument && pdfContent && (
            <button type="button" onClick={handleSaveDocument} disabled={saving} className="btn-primary">
              {saving ? 'A guardar...' : 'Guardar documento'}
            </button>
          )}
          {saveMessage && <span className="text-sm text-slate-600">{saveMessage}</span>}
        </div>
      )}
    </div>
  );
}
