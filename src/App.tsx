import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Footer from './components/Footer';
import Catalog from './components/Catalog';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero />
            <FeaturedProducts onNavigate={setCurrentPage} />
          </>
        );
      case 'catalog':
        return <Catalog onNavigate={setCurrentPage} />;
      case 'product':
        return <ProductDetail onNavigate={setCurrentPage} />;
      case 'cart':
        return <Cart onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} onLogin={setIsLoggedIn} />;
      case 'register':
        return <Register onNavigate={setCurrentPage} onLogin={setIsLoggedIn} />;
      case 'account':
        return <Account onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      default:
        return (
          <>
            <Hero />
            <FeaturedProducts onNavigate={setCurrentPage} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isLoggedIn={isLoggedIn}
      />
      {renderPage()}
      {currentPage === 'home' && <Footer onNavigate={setCurrentPage} />}
    </div>
  );
}

export default App;