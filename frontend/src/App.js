import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import EventList from './components/EventList';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import DashboardVisitor from './pages/DashboardVisitor';
import DashboardOrganizer from './pages/DashboardOrganizer';
import ReservationPage from './pages/ReservationPage';
import ContactAdmin from './components/ContactAdmin';
import './styles.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showReservation, setShowReservation] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Déterminer la page actuelle basée sur l'URL
    const path = window.location.pathname;
    if (path.includes('/login') || path.includes('/signup')) {
      setCurrentPage('auth');
    } else if (path.includes('/dashboard-visitor')) {
      setCurrentPage('dashboard-visitor');
    } else if (path.includes('/dashboard-organizer')) {
      setCurrentPage('dashboard-organizer');
    } else {
      setCurrentPage('home');
    }

    // Écouter les changements d'URL
    const handlePopState = () => {
      const newPath = window.location.pathname;
      if (newPath.includes('/login') || newPath.includes('/signup')) {
        setCurrentPage('auth');
      } else if (newPath.includes('/dashboard-visitor')) {
        setCurrentPage('dashboard-visitor');
      } else if (newPath.includes('/dashboard-organizer')) {
        setCurrentPage('dashboard-organizer');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleReservation = (event) => {
    setSelectedEvent(event);
    setShowReservation(true);
  };

  const handleCloseReservation = () => {
    setShowReservation(false);
    setSelectedEvent(null);
  };

  const handleBackReservation = () => {
    setShowReservation(false);
    setSelectedEvent(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthPage />;
      case 'dashboard-visitor':
        return <DashboardVisitor />;
      case 'dashboard-organizer':
        return <DashboardOrganizer />;
      default:
        return (
          <div className="App">
            <Header />
            <main>
              <Hero />
              <EventList onReservation={handleReservation} />
              <ContactAdmin />
            </main>
            <Footer />
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {renderPage()}
      {showReservation && (
        <ReservationPage
          event={selectedEvent}
          onClose={handleCloseReservation}
          onBack={handleBackReservation}
        />
      )}
    </div>
  );
}

export default App;
