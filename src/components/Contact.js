import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section className="page-section" id="contact">
      <div className="container px-4 px-lg-5">
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-8 col-xl-6 text-center">
            <h2 className="mt-0">Let's Get In Touch!</h2>
            <hr className="divider" />
            <p className="text-muted mb-5">Ready to start your next project with us? Send us a message and we will get back to you as soon as possible!</p>
          </div>
        </div>
        <div className="row gx-4 gx-lg-5 justify-content-center mb-5">
          <div className="col-lg-6">
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input 
                  className="form-control" 
                  id="name" 
                  type="text" 
                  placeholder="Enter your name..." 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
                <label htmlFor="name">Full name</label>
              </div>
              <div className="form-floating mb-3">
                <input 
                  className="form-control" 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
                <label htmlFor="email">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input 
                  className="form-control" 
                  id="phone" 
                  type="tel" 
                  placeholder="(123) 456-7890" 
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
                <label htmlFor="phone">Phone number</label>
              </div>
              <div className="form-floating mb-3">
                <textarea 
                  className="form-control" 
                  id="message" 
                  placeholder="Enter your message here..." 
                  style={{height: '10rem'}}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <label htmlFor="message">Message</label>
              </div>
              <div className="d-grid">
                <button className="btn btn-primary btn-xl" type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-4 text-center mb-5 mb-lg-0">
            <i className="bi-phone fs-2 mb-3 text-muted"></i>
            <div>+1 (555) 123-4567</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
