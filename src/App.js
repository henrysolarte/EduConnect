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
import PythonCourse from './components/PythonCourse';
import CPPCourse from './components/CPPCourse';
import JavaCourse from './components/JavaCourse';
import AngularCourse from './components/AngularCourse';
import HTML5Course from './components/HTML5Course';
import Carrito from './components/Carrito';
import Pagos from './components/Pagos';
import Papers from './components/Papers';
import ArticulosCientificos from './components/ArticulosCientificos';
import Tesis from './components/Tesis';
import Editoriales from './components/Editoriales';
import Publicaciones from './components/Publicaciones';
import AprobarPublicaciones from './components/AprobarPublicaciones';
import AprobarProfesores from './components/AprobarProfesores';

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
          <Route path="/python" element={<PythonCourse />} />
          <Route path="/cursos-cpp" element={<CPPCourse />} />
          <Route path="/java" element={<JavaCourse />} />
          <Route path="/angular" element={<AngularCourse />} />
          <Route path="/html5" element={<HTML5Course />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/papers" element={<Papers />} />
          <Route path="/articulos-cientificos" element={<ArticulosCientificos />} />
          <Route path="/tesis" element={<Tesis />} />
          <Route path="/editoriales" element={<Editoriales />} />
          <Route path="/publicaciones" element={<Publicaciones />} />
          <Route path="/aprobar-publicaciones" element={<AprobarPublicaciones />} />
          <Route path="/aprobar-profesores" element={<AprobarProfesores />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
