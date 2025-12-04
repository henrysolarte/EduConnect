import React from 'react';

function Footer() {
  return (
    <footer className="bg-light py-5">
      <div className="container px-4 px-lg-5">
        <div className="small text-center text-muted">
          Copyright &copy; {new Date().getFullYear()} - Company Name
        </div>
      </div>
    </footer>
  );
}

export default Footer;
