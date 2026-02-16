import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcMenuOpen, setCalcMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-bank-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">AT</span>
          ATuaCalculaora
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setCalcMenuOpen((o) => !o)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Calculadoras
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {calcMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCalcMenuOpen(false)} />
                <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                  <Link to="/calculadoras" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setCalcMenuOpen(false)}>
                    Ver todas as calculadoras
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <Link to="/calculadoras?cat=laboral-salarios" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={() => setCalcMenuOpen(false)}>Laboral & Salários</Link>
                  <Link to="/calculadoras?cat=impostos-irs" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={() => setCalcMenuOpen(false)}>Impostos e IRS</Link>
                  <Link to="/calculadoras?cat=seguranca-social" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={() => setCalcMenuOpen(false)}>Segurança Social</Link>
                  <Link to="/calculadoras?cat=imobiliario" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={() => setCalcMenuOpen(false)}>Imobiliário</Link>
                  <Link to="/calculadoras?cat=veiculos" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={() => setCalcMenuOpen(false)}>Veículos</Link>
                  <Link to="/calculadoras?cat=pessoais" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={() => setCalcMenuOpen(false)}>Pessoais</Link>
                  <Link to="/calculadoras?cat=empresas" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={() => setCalcMenuOpen(false)}>Empresas</Link>
                  <Link to="/calculadoras?cat=outros" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={() => setCalcMenuOpen(false)}>Outros</Link>
                </div>
              </>
            )}
          </div>
          <Link to="/calculadoras" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Todas
          </Link>
          {user ? (
            <>
              <Link to="/documentos" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Documentos
              </Link>
              <Link to="/perfil" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Perfil
              </Link>
              <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Entrar
              </Link>
              <Link to="/registo" className="btn-primary">
                Criar conta
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu */}
        <button
          type="button"
          className="rounded-lg p-2 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          title="Menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <Link to="/calculadoras" className="block py-2 text-slate-700" onClick={() => setMenuOpen(false)}>Calculadoras</Link>
          {user ? (
            <>
              <Link to="/documentos" className="block py-2 text-slate-700" onClick={() => setMenuOpen(false)}>Documentos</Link>
              <Link to="/perfil" className="block py-2 text-slate-700" onClick={() => setMenuOpen(false)}>Perfil</Link>
              <button type="button" onClick={handleLogout} className="block py-2 text-left text-slate-600">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-slate-700" onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link to="/registo" className="block py-2 text-primary-600 font-medium" onClick={() => setMenuOpen(false)}>Criar conta</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
