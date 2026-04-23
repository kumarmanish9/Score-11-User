import React, { useState } from 'react';

const faqs = [
  {
    category: 'Getting Started',
    items: [
      { q: 'How do I join a tournament?', a: 'Log in to your account, browse available tournaments from the Contests page, and click the "Join Now" button. Make sure you have sufficient balance for paid contests before joining.' },
      { q: 'How do I create my fantasy team?', a: 'Go to the team creation page, search for players from the match squad, and add them to your team within the allowed budget. You need exactly 11 players — choose your captain and vice-captain wisely as they earn 2x and 1.5x points respectively.' },
      { q: 'Can I edit my team after joining?', a: 'Yes, you can edit your team until the match deadline (usually when the first ball is bowled). Go to My Teams and tap Edit to make changes.' },
    ]
  },
  {
    category: 'Payments & Prizes',
    items: [
      { q: 'What payment methods are accepted?', a: 'We support UPI (GPay, PhonePe, Paytm), debit/credit cards (Visa, Mastercard, RuPay), and popular wallets. All transactions are secured with 256-bit SSL encryption.' },
      { q: 'How do I withdraw my winnings?', a: 'Go to your Wallet, tap Withdraw, and enter the amount. Winnings are credited to your bank account within 24–48 hours. KYC verification is required for withdrawals above ₹10,000.' },
      { q: 'Are there any withdrawal limits?', a: 'The minimum withdrawal amount is ₹100. There is no maximum limit, but large withdrawals may require additional KYC verification as per RBI guidelines.' },
    ]
  },
  {
    category: 'Rules & Scoring',
    items: [
      { q: 'How is the points system calculated?', a: 'Points are awarded for runs scored (1pt per run), wickets (25pts), catches (8pts), stumpings (12pts), and more. Bonus points are given for milestones like 50s, 100s, and 3-wicket hauls.' },
      { q: 'What happens if a match is abandoned?', a: 'If a match is abandoned before the minimum overs threshold, all entry fees are fully refunded to participants. If the match completes minimum overs, results are declared based on scores at that point.' },
    ]
  },
];

const FAQ = () => {
  const [openKey, setOpenKey] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...faqs.map(f => f.category)];

  const filtered = activeCategory === 'All'
    ? faqs.flatMap(f => f.items.map(item => ({ ...item, category: f.category })))
    : faqs.find(f => f.category === activeCategory)?.items.map(item => ({ ...item, category: activeCategory })) || [];

  const toggle = (key) => setOpenKey(prev => prev === key ? null : key);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Mulish:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .faq-root { font-family: 'Mulish', sans-serif; background: #f7f7f5; min-height: 100vh; padding: 56px 20px 80px; color: #111; }
        .faq-item:hover { border-color: #d0d0d0 !important; }
        .faq-catbtn:hover { border-color: #111 !important; color: #111 !important; }
        .faq-q-btn:hover .faq-icon { background: #111 !important; color: #fff !important; }
      `}</style>

      <div className="faq-root">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* ── Header ── */}
          <div style={{ textAlign: 'center', marginBottom: 44, animation: 'fadeUp 0.45s ease both' }}>
            <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#e63946', background: '#ffeaec', padding: '4px 13px', borderRadius: 20, marginBottom: 14 }}>
              HELP CENTER
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.05, marginBottom: 12 }}>
              Frequently Asked<br /><span style={{ color: '#e63946' }}>Questions</span>
            </h1>
            <p style={{ fontSize: 15, color: '#888', fontWeight: 500 }}>
              Everything you need to know about Score11.
            </p>
          </div>

          {/* ── Category filters ── */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36, animation: 'fadeUp 0.45s ease 0.08s both' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className="faq-catbtn"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '7px 18px',
                  borderRadius: 20,
                  border: `1.5px solid ${activeCategory === cat ? '#111' : '#e0e0e0'}`,
                  background: activeCategory === cat ? '#111' : '#fff',
                  color: activeCategory === cat ? '#fff' : '#888',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'Mulish', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  letterSpacing: '0.02em',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── FAQ list ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((faq, i) => {
              const key = `${faq.category}-${i}`;
              const isOpen = openKey === key;
              return (
                <div
                  key={key}
                  className="faq-item"
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    border: `1.5px solid ${isOpen ? '#e63946' : '#ebebeb'}`,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: isOpen ? '0 4px 20px rgba(230,57,70,0.08)' : '0 1px 4px rgba(0,0,0,0.03)',
                    animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                  }}
                >
                  {/* Question row */}
                  <button
                    className="faq-q-btn"
                    onClick={() => toggle(key)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      padding: '18px 20px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: isOpen ? '#e63946' : '#111', lineHeight: 1.4, fontFamily: "'Syne', sans-serif", transition: 'color 0.2s' }}>
                        {faq.q}
                      </div>
                    </div>
                    <div
                      className="faq-icon"
                      style={{
                        width: 28, height: 28,
                        borderRadius: 8,
                        border: `1.5px solid ${isOpen ? '#e63946' : '#e0e0e0'}`,
                        background: isOpen ? '#e63946' : '#fff',
                        color: isOpen ? '#fff' : '#aaa',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: 16, fontWeight: 300,
                        transition: 'all 0.2s',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      +
                    </div>
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', animation: 'slideDown 0.25s ease' }}>
                      <div style={{ height: 1, background: '#f5f5f5', marginBottom: 16 }} />
                      <p style={{ fontSize: 14, color: '#555', lineHeight: 1.75, fontWeight: 500 }}>
                        {faq.a}
                      </p>
                      <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#bbb' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e0e0e0', display: 'inline-block' }} />
                        {faq.category}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Still need help ── */}
          <div style={{
            marginTop: 48,
            background: '#fff',
            borderRadius: 20,
            border: '1.5px solid #ebebeb',
            padding: '28px 24px',
            textAlign: 'center',
            animation: 'fadeUp 0.45s ease 0.3s both',
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🏏</div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: '#111', marginBottom: 6 }}>
              Still have questions?
            </h4>
            <p style={{ fontSize: 13, color: '#aaa', fontWeight: 500, marginBottom: 18 }}>
              Our support team is available 24/7 to help you out.
            </p>
            <a
              href="/contact"
              style={{
                display: 'inline-block',
                background: '#111',
                color: '#fff',
                borderRadius: 11,
                padding: '11px 28px',
                fontFamily: "'Syne', sans-serif",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                transition: 'background 0.18s',
              }}
            >
              CONTACT SUPPORT
            </a>
          </div>

        </div>
      </div>
    </>
  );
};

export default FAQ;