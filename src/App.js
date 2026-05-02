import React from 'react';
import Home from './components/Home';
import './App.css'; 
import Values from './pages/Values';
import ContactBar from './components/ContactBar';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import FAQ from './pages/FAQ';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Home />
      <ContactBar />
      <Values/>
      <AboutUs/>
      <Services/>
      <Doctors/>
      <FAQ/>
      <Footer/>
    </div>
  );
}

export default App;