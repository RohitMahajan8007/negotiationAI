import React, { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from './state/store';
import LoginPage from './ui/pages/LoginPage';
import RegisterPage from './ui/pages/RegisterPage';
import Dashboard from './ui/pages/Dashboard';
import NegotiationRoom from './ui/pages/NegotiationRoom';
import { Toaster } from 'react-hot-toast';
import './App.css';

const AppContent = () => {
  const { user, token } = useSelector(state => state.auth);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [prefilledEmail, setPrefilledEmail] = useState('');

  if (!token) {
    return showRegister ? (
      <RegisterPage onSwitch={(email) => {
        if (email) setPrefilledEmail(email);
        setShowRegister(false);
      }} />
    ) : (
      <LoginPage 
        prefilledEmail={prefilledEmail} 
        onSwitch={() => setShowRegister(true)} 
      />
    );
  }

  if (selectedItem) {
    return <NegotiationRoom itemId={selectedItem} onBack={() => setSelectedItem(null)} />;
  }

  return <Dashboard onSelectItem={setSelectedItem} />;
};

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black font-outfit">
        <Toaster position="top-right" reverseOrder={false} 
          toastOptions={{
            style: {
              background: '#0a0a0a',
              color: '#fff',
              border: '1px solid rgba(0,255,204,0.1)',
              fontFamily: 'Outfit, sans-serif'
            },
            success: {
              iconTheme: { primary: '#00ffcc', secondary: '#000' }
            }
          }}
        />
        <AppContent />
      </div>
    </Provider>
  );
}

export default App;
