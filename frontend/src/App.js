import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import EventList from './components/EventList';
import Footer from './components/Footer';
import './styles.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <EventList />
      </main>
      <Footer />
    </div>
  );
}

export default App;
