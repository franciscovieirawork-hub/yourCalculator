import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config';

interface Doc {
  id: string;
  title: string;
  calculatorId: string;
  calculatorName: string;
  createdAt: string;
}

export function DocumentsPage() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('yc_token');
    fetch(apiUrl('/documents'), { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setDocs)
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar este documento?')) return;
    setDeleting(id);
    const token = localStorage.getItem('yc_token');
    try {
      const res = await fetch(apiUrl(`/documents/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setDocs((d) => d.filter((x) => x.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const openPdf = async (id: string) => {
    const token = localStorage.getItem('yc_token');
    const res = await fetch(apiUrl(`/documents/${id}`), { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return;
    const doc = await res.json();
    const content = typeof doc.content === 'string' ? JSON.parse(doc.content) : doc.content;
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(doc.title || 'Documento', 20, 20);
    pdf.setFontSize(10);
    pdf.text(`Calculadora: ${doc.calculatorName}`, 20, 28);
    pdf.text(`Data: ${new Date(doc.createdAt).toLocaleDateString('pt-PT')}`, 20, 34);
    let y = 44;
    if (content.inputs && typeof content.inputs === 'object') {
      Object.entries(content.inputs).forEach(([k, v]) => {
        pdf.text(`${String(k)}: ${String(v)}`, 20, y);
        y += 6;
      });
      y += 4;
    }
    if (content.results && typeof content.results === 'object') {
      Object.entries(content.results).forEach(([k, v]) => {
        pdf.text(`${String(k)}: ${String(v)}`, 20, y);
        y += 6;
      });
    }
    if (content.summary) {
      y += 4;
      pdf.text(content.summary, 20, y);
    }
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-600">Inicie sessão para ver os documentos guardados.</p>
        <Link to="/login" className="mt-4 inline-block text-primary-600 hover:underline">Entrar</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="mx-auto max-w-2xl px-4 py-12 text-center text-slate-500">A carregar...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-bank-navy">Documentos guardados</h1>
        <p className="mt-1 text-slate-600">
          Simulações e PDFs que guardou a partir das calculadoras.
        </p>
      </div>

      {docs.length === 0 ? (
        <div className="card text-center text-slate-600">
          <p>Ainda não tem documentos guardados.</p>
          <p className="mt-2 text-sm">Use uma calculadora e guarde o resultado em PDF para aparecer aqui.</p>
          <Link to="/calculadoras" className="mt-4 inline-block text-primary-600 hover:underline">
            Ver calculadoras
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {docs.map((doc) => (
            <li key={doc.id} className="card flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-medium text-bank-navy">{doc.title}</h2>
                <p className="text-sm text-slate-600">
                  {doc.calculatorName} · {new Date(doc.createdAt).toLocaleDateString('pt-PT')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openPdf(doc.id)}
                  className="btn-secondary"
                >
                  Abrir PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(doc.id)}
                  disabled={deleting === doc.id}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting === doc.id ? 'A eliminar...' : 'Eliminar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
