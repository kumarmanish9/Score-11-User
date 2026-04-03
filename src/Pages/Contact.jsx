import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="row">
        <div className="col-lg-8 mx-auto text-center mb-5 fade-in-up">
          <h1 className="display-4 fw-bold mb-4 text-primary">
            Get in Touch
          </h1>
          <p className="lead text-muted">
            Have questions? We'd love to hear from you. Reach out and let's talk cricket!
          </p>
        </div>
      </div>

      <div className="row g-5">
        {/* Contact Info */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg h-100 hover-lift">
            <div className="card-body p-5">
              <h3 className="card-title fw-bold mb-4 text-primary">Contact Info</h3>
              <div className="d-flex align-items-center mb-4">
                <FaPhone className="fs-3 text-primary me-3" />
                <div>
                  <h6 className="mb-1">Phone</h6>
                  <p className="mb-0">+91 98765 43210</p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-4">
                <FaEnvelope className="fs-3 text-primary me-3" />
                <div>
                  <h6 className="mb-1">Email</h6>
                  <p className="mb-0">support@score11.com</p>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <FaMapMarkerAlt className="fs-3 text-primary me-3 mt-1" />
                <div>
                  <h6 className="mb-1">Address</h6>
                  <p className="mb-0">123 Cricket Street<br/>Fantasy City, FC 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg hover-lift">
            <div className="card-body p-5">
              <h3 className="card-title fw-bold mb-4 text-dark">Send us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <input 
                      type="text" 
                      className="form-control border-0 shadow-sm p-4 rounded-4 h-100" 
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input 
                      type="email" 
                      className="form-control border-0 shadow-sm p-4 rounded-4 h-100" 
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <textarea 
                      className="form-control border-0 shadow-sm p-4 rounded-4" 
                      rows="6"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="row mt-5 pt-5 border-top">
        <div className="col-12 text-center">
          <h4 className="mb-4">Follow Us</h4>
          <div className="d-flex justify-content-center gap-4">
            <a href="https://twitter.com" className="btn btn-outline-primary rounded-circle p-3 hover-lift" style={{width: '60px', height: '60px'}}>
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" className="btn btn-outline-primary rounded-circle p-3 hover-lift" style={{width: '60px', height: '60px'}}>
              <FaInstagram size={24} />
            </a>
            <a href="https://youtube.com" className="btn btn-outline-primary rounded-circle p-3 hover-lift" style={{width: '60px', height: '60px'}}>
              <FaYoutube size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
