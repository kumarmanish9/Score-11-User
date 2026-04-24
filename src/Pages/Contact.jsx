import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '14px 18px',
    border: `1.5px solid ${focused === field ? '#111' : '#e8e8e8'}`,
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "'Mulish', sans-serif",
    fontWeight: 500,
    color: '#111',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === field ? '0 0 0 3px rgba(17,17,17,0.06)' : 'none',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Mulish:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        .ct-root { font-family: 'Mulish', sans-serif; background: #f7f7f5; min-height: 100vh; padding: 60px 20px 80px; }
        .ct-send:hover { background: #e63946 !important; transform: translateY(-2px); }
        .ct-social-btn:hover { background: #111 !important; color: #fff !important; transform: translateY(-3px); }
        .ct-info-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.1) !important; }
        ::placeholder { color: #bbb; }
      `}</style>

      <div className="ct-root">
        <div style={{ maxWidth: 960, margin: '0 auto' }}>

          {/* ── Hero ── */}
          <div style={{ textAlign: 'center', marginBottom: 52, animation: 'fadeUp 0.5s ease both' }}>
            <div style={{
              display: 'inline-block',
              fontSize: 11, fontWeight: 800, letterSpacing: '0.12em',
              color: '#e63946', background: '#ffeaec',
              padding: '5px 14px', borderRadius: 20, marginBottom: 16,
            }}>
              SUPPORT & CONTACT
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2.2rem, 6vw, 3.4rem)',
              fontWeight: 800, letterSpacing: '-0.03em',
              color: '#111', lineHeight: 1.05, marginBottom: 16,
            }}>
              Let's Talk <span style={{ color: '#e63946' }}>Cricket</span>
            </h1>
            <p style={{ fontSize: 15, color: '#888', fontWeight: 500, maxWidth: 420, margin: '0 auto' }}>
              Questions, feedback, or just want to chat about the game? We're always here.
            </p>
          </div>

          {/* ── Main grid ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: 20,
            alignItems: 'start',
            animation: 'fadeUp 0.5s ease 0.1s both',
          }}>

            {/* Info card */}
            <div className="ct-info-card" style={{
              background: '#fff',
              borderRadius: 20,
              border: '1px solid #ebebeb',
              padding: '28px 24px',
              transition: 'box-shadow 0.2s',
            }}>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 16, fontWeight: 800,
                color: '#111', marginBottom: 24, letterSpacing: '-0.01em',
              }}>
                Contact Info
              </h3>

              {[
                { Icon: FaPhone,        label: 'Phone',   value: '+91 98765 43210',         color: '#ffeaec', icon: '#e63946' },
                { Icon: FaEnvelope,     label: 'Email',   value: 'support@score11.com',     color: '#ede9fe', icon: '#7c3aed' },
                { Icon: FaMapMarkerAlt, label: 'Address', value: '123 Cricket Street\nFantasy City, FC 12345', color: '#dcfce7', icon: '#16a34a' },
              ].map(({ Icon, label, value, color, icon }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 11,
                    background: color, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon style={{ color: icon, fontSize: 15 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#bbb', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#333', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{value}</div>
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 20, marginTop: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', color: '#bbb', marginBottom: 14 }}>FOLLOW US</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { Icon: FaTwitter, href: 'https://twitter.com', color: '#1d9bf0' },
                    { Icon: FaInstagram, href: 'https://instagram.com', color: '#e1306c' },
                    { Icon: FaYoutube, href: 'https://youtube.com', color: '#ff0000' },
                  ].map(({ Icon, href, color }) => (
                    <a key={href} href={href} target="_blank" rel="noreferrer"
                      className="ct-social-btn"
                      style={{
                        width: 38, height: 38, borderRadius: 10,
                        border: '1.5px solid #e8e8e8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#555', background: '#fff', transition: 'all 0.18s',
                        textDecoration: 'none',
                      }}
                    >
                      <Icon style={{ fontSize: 15 }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form card */}
            <div style={{
              background: '#fff',
              borderRadius: 20,
              border: '1px solid #ebebeb',
              padding: '32px 28px',
            }}>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 16, fontWeight: 800,
                color: '#111', marginBottom: 24, letterSpacing: '-0.01em',
              }}>
                Send a Message
              </h3>

              {submitted ? (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '40px 0', gap: 14, animation: 'fadeUp 0.4s ease',
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: '#dcfce7', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    animation: 'checkPop 0.4s ease',
                  }}>
                    <span style={{ fontSize: 22 }}>✓</span>
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: '#111' }}>Message Sent!</div>
                  <div style={{ fontSize: 13, color: '#aaa', fontWeight: 500 }}>We'll get back to you shortly.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#bbb', display: 'block', marginBottom: 6 }}>YOUR NAME</label>
                      <input
                        type="text"
                        placeholder="Virat Kohli"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        style={inputStyle('name')}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#bbb', display: 'block', marginBottom: 6 }}>EMAIL ADDRESS</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        style={inputStyle('email')}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#bbb', display: 'block', marginBottom: 6 }}>YOUR MESSAGE</label>
                    <textarea
                      rows={6}
                      placeholder="Tell us what's on your mind..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      style={{ ...inputStyle('message'), resize: 'vertical', minHeight: 140 }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="ct-send"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: '#111', color: '#fff',
                      border: 'none', borderRadius: 12,
                      padding: '13px 28px',
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 13, fontWeight: 800, letterSpacing: '0.04em',
                      cursor: 'pointer', transition: 'background 0.2s, transform 0.15s',
                    }}
                  >
                    <span>Send Message</span>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Contact;