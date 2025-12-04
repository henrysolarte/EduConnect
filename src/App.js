import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Masthead from './components/Masthead';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App" id="page-top">
      <Navbar />
      <Masthead />
      <About />
      <Services />
      <Portfolio />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
