import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiUrl } from '../config';

interface Calc {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  icon: string;
}

export function HomePage() {
  const [searchParams] = useSearchParams();
  const cat = searchParams.get('cat');
  const [calculators, setCalculators] = useState<Calc[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl('/calculators'), {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
    })
      .then((r) => {
        if (!r.ok) {
          console.error('Failed to fetch calculators:', r.status, r.statusText);
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        console.log('Calculators loaded:', data.calculators?.length || 0);
        setCalculators(data.calculators || []);
      })
      .catch((err) => {
        console.error('Error loading calculators:', err);
        setCalculators([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = calculators.filter((c) => {
    const matchCat = !cat || c.categorySlug === cat;
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const byCategory = filtered.reduce<Record<string, Calc[]>>((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold text-bank-navy sm:text-4xl">
          Calculadoras Fiscais e Financeiras
        </h1>
        <p className="mt-2 text-slate-600">
          Atualizado para Portugal 2026 – Salários, IRS, Segurança Social, Imobiliário e muito mais.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <label htmlFor="search" className="sr-only">
          Pesquisar calculadoras
        </label>
        <input
          id="search"
          type="search"
          placeholder="Pesquisar calculadoras..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
        />
      </div>

      {cat && (
        <div className="mt-4 flex justify-center">
          <Link to="/calculadoras" className="text-sm text-primary-600 hover:underline">
            Limpar filtro de categoria
          </Link>
        </div>
      )}

      {loading ? (
        <div className="mt-12 text-center text-slate-500">A carregar...</div>
      ) : (
        <div className="mt-10 space-y-10">
          {Object.entries(byCategory).map(([category, calcs]) => (
            <section key={category}>
              <h2 className="mb-4 font-display text-xl font-semibold text-bank-navy">
                {category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {calcs.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/calculadoras/${c.slug}`}
                    className="card flex flex-col transition-shadow hover:shadow-lg"
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <h3 className="mt-2 font-semibold text-bank-navy">{c.name}</h3>
                    <p className="mt-1 flex-1 text-sm text-slate-600">{c.description}</p>
                    <span className="mt-2 text-sm text-primary-600">Abrir calculadora →</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-slate-500">
              Nenhuma calculadora encontrada. Tente outra pesquisa.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
