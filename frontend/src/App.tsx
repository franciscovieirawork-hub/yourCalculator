import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ForgotPasswordSMSPage } from './pages/ForgotPasswordSMSPage';
import { ProfilePage } from './pages/ProfilePage';
import { DocumentsPage } from './pages/DocumentsPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calculadoras" element={<HomePage />} />
        <Route path="/calculadoras/:slug" element={<CalculatorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registo" element={<RegisterPage />} />
        <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
        <Route path="/recuperar-password-sms" element={<ForgotPasswordSMSPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/documentos" element={<DocumentsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
