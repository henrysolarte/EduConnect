import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Masthead from './components/Masthead';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import JSCourse from './components/JSCourse';
import Papers from './components/Papers';
import ArticulosCientificos from './components/ArticulosCientificos';
import Tesis from './components/Tesis';
import Editoriales from './components/Editoriales';

function HomePage() {
  return (
    <>
      <Navbar />
      <Masthead />
      <Services />
      <About />
      <Portfolio />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App" id="page-top">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<><Register /></>} />
          <Route path="/login" element={<><Login /></>} />
          <Route path="/js" element={<JSCourse />} />
          <Route path="/papers" element={<Papers />} />
          <Route path="/articulos-cientificos" element={<ArticulosCientificos />} />
          <Route path="/tesis" element={<Tesis />} />
          <Route path="/editoriales" element={<Editoriales />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
