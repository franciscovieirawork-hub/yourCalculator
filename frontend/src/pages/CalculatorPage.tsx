import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCalculatorBySlug } from '../calculators/index';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config';

export function CalculatorPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [meta, setMeta] = useState<{ name: string; calculatorId: string } | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(apiUrl(`/calculators/${slug}`))
      .then((r) => r.json())
      .then((data) => setMeta({ name: data.name, calculatorId: data.slug }))
      .catch(() => setMeta(null));
  }, [slug]);

  const Calculator = slug ? getCalculatorBySlug(slug) : null;

  if (!slug || !Calculator) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-slate-600">Calculadora não encontrada.</p>
      </div>
    );
  }

  const handleSaveDocument = user
    ? async (title: string, content: object) => {
        const token = localStorage.getItem('yc_token');
        const res = await fetch(apiUrl('/documents'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title,
            calculatorId: slug,
            calculatorName: meta?.name ?? slug,
            content: typeof content === 'string' ? content : JSON.stringify(content),
          }),
        });
        if (!res.ok) throw new Error('Erro ao guardar');
        return res.json();
      }
    : undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Calculator
        profile={user?.profile ?? null}
        onSaveDocument={handleSaveDocument}
        meta={{ slug, name: meta?.name ?? slug, calculatorId: slug, calculatorName: meta?.name ?? slug }}
      />
    </div>
  );
}
