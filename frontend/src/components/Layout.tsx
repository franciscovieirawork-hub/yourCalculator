import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children ?? <Outlet />}
      </main>
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-600">
              ATuaCalculadora – Calculadoras fiscais e financeiras Portugal 2026. Informação de carácter indicativo.
            </p>
            <p className="text-sm text-slate-500">
              Criado por{' '}
              <a
                href="https://fvdev.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-bank-navy hover:text-primary-600 transition-colors"
              >
                fvdev
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
