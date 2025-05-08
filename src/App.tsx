import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Customers from './components/Customers';
import Inventory from './components/Inventory';
import Payment from './components/Payment';
import type { User } from 'firebase/auth';
import type { Language } from './shared/types';

// Debug environment variables
console.log('Environment Variables:', import.meta.env);

const auth = getAuth();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [section, setSection] = useState('dashboard');
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const texts = {
    fr: {
      dashboard: 'Tableau de bord',
      transactions: 'Transactions',
      customers: 'Clients',
      inventory: 'Inventaire',
      payment: 'Paiement',
      logout: 'Déconnexion',
    },
    en: {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      customers: 'Customers',
      inventory: 'Inventory',
      payment: 'Payment',
      logout: 'Logout',
    },
  };

  if (!user) return <Login language={language} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-xl mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Maboko</h1>
          <p className={language === 'fr' ? 'text-lg mt-2' : 'hidden'}>
            Gérez votre entreprise facilement !
          </p>
          <p className={language === 'en' ? 'text-lg mt-2' : 'hidden'}>
            Manage your business with ease!
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="input-field max-w-xs bg-white text-gray-900"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
            <button
              onClick={() => auth.signOut()}
              className="btn-primary bg-red-600 hover:bg-red-700"
            >
              {texts[language].logout}
            </button>
          </div>
        </header>
        <nav className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setSection('dashboard')}
            className="btn-primary"
          >
            {texts[language].dashboard}
          </button>
          <button
            onClick={() => setSection('transactions')}
            className="btn-primary"
          >
            {texts[language].transactions}
          </button>
          <button
            onClick={() => setSection('customers')}
            className="btn-primary"
          >
            {texts[language].customers}
          </button>
          <button
            onClick={() => setSection('inventory')}
            className="btn-primary"
          >
            {texts[language].inventory}
          </button>
          <button
            onClick={() => setSection('payment')}
            className="btn-primary"
          >
            {texts[language].payment}
          </button>
        </nav>
        <main className="bg-white p-6 rounded-2xl shadow-xl">
          {section === 'dashboard' && <Dashboard userId={user.uid} language={language} />}
          {section === 'transactions' && <Transactions userId={user.uid} language={language} />}
          {section === 'customers' && <Customers userId={user.uid} language={language} />}
          {section === 'inventory' && <Inventory userId={user.uid} language={language} />}
          {section === 'payment' && <Payment userId={user.uid} language={language} />}
        </main>
      </div>
    </div>
  );
};

export default App;