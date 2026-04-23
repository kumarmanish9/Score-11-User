import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { FaCrown, FaChartLine, FaHeadset, FaTrophy, FaStar, FaCheckCircle, FaArrowRight, FaLock, FaUnlockAlt, FaRocket, FaInfinity, FaShieldAlt, FaUsers, FaVideo, FaDatabase } from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .pro-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Hero Section */
  .pro-hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 80px 0;
    position: relative;
    overflow: hidden;
  }

  .pro-hero::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: shimmer 20s linear infinite;
    pointer-events: none;
  }

  @keyframes shimmer {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }

  .pro-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    padding: 8px 20px;
    border-radius: 40px;
    font-size: 14px;
    font-weight: 700;
    color: white;
    margin-bottom: 20px;
  }

  .pro-title {
    font-size: 56px;
    font-weight: 800;
    color: white;
    margin-bottom: 20px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }

  .pro-subtitle {
    font-size: 18px;
    color: rgba(255,255,255,0.9);
    max-width: 600px;
    margin: 0 auto;
  }

  /* Pricing Cards */
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
    margin-top: -60px;
    margin-bottom: 60px;
    position: relative;
    z-index: 2;
  }

  .pricing-card {
    background: white;
    border-radius: 30px;
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;
  }

  .pricing-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 50px rgba(0,0,0,0.2);
  }

  .pricing-card.popular {
    transform: scale(1.05);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  }

  .pricing-card.popular:hover {
    transform: scale(1.05) translateY(-10px);
  }

  .popular-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    color: white;
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 800;
    z-index: 1;
  }

  .pricing-header {
    background: linear-gradient(135deg, #f8fafc, #ffffff);
    padding: 30px;
    text-align: center;
    border-bottom: 1px solid #e2e8f0;
  }

  .plan-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .plan-name {
    font-size: 24px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .plan-price {
    font-size: 48px;
    font-weight: 800;
    color: #3b82f6;
    margin-bottom: 8px;
  }

  .plan-price span {
    font-size: 18px;
    font-weight: 500;
    color: #64748b;
  }

  .plan-duration {
    font-size: 13px;
    color: #94a3b8;
  }

  .pricing-body {
    padding: 30px;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 0 0 30px 0;
  }

  .features-list li {
    padding: 10px 0;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #475569;
    border-bottom: 1px solid #f1f5f9;
  }

  .features-list li:last-child {
    border-bottom: none;
  }

  .check-icon {
    color: #10b981;
    font-size: 16px;
    flex-shrink: 0;
  }

  .lock-icon {
    color: #94a3b8;
    font-size: 14px;
    flex-shrink: 0;
  }

  .upgrade-btn {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    font-weight: 800;
    font-size: 16px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
    color: #64748b;
  }

  .upgrade-btn.available {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
  }

  .upgrade-btn.available:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }

  /* Features Section */
  .features-section {
    padding: 60px 0;
    background: rgba(255,255,255,0.03);
  }

  .section-title {
    font-size: 36px;
    font-weight: 800;
    color: white;
    text-align: center;
    margin-bottom: 16px;
  }

  .section-subtitle {
    font-size: 16px;
    color: rgba(255,255,255,0.7);
    text-align: center;
    margin-bottom: 50px;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
  }

  .feature-card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    text-align: center;
    transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .feature-card:hover {
    transform: translateY(-5px);
    background: rgba(255,255,255,0.08);
    border-color: rgba(102, 126, 234, 0.5);
  }

  .feature-icon {
    font-size: 48px;
    margin-bottom: 20px;
  }

  .feature-title {
    font-size: 20px;
    font-weight: 800;
    color: white;
    margin-bottom: 12px;
  }

  .feature-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
  }

  /* Testimonials */
  .testimonials-section {
    padding: 60px 0;
  }

  .testimonial-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }

  .testimonial-card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .testimonial-text {
    font-size: 14px;
    color: rgba(255,255,255,0.8);
    line-height: 1.6;
    margin-bottom: 20px;
    font-style: italic;
  }

  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .author-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    color: white;
  }

  .author-name {
    font-size: 14px;
    font-weight: 700;
    color: white;
    margin-bottom: 4px;
  }

  .author-role {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
  }

  /* FAQ Section */
  .faq-section {
    padding: 60px 0;
    background: rgba(255,255,255,0.03);
  }

  .faq-grid {
    max-width: 800px;
    margin: 0 auto;
  }

  .faq-item {
    background: rgba(255,255,255,0.05);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .faq-item:hover {
    background: rgba(255,255,255,0.08);
  }

  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    color: white;
    font-size: 16px;
  }

  .faq-answer {
    margin-top: 12px;
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
    display: none;
  }

  .faq-answer.open {
    display: block;
  }

  /* CTA Section */
  .cta-section {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 30px;
    padding: 60px;
    text-align: center;
    margin: 60px 0;
    position: relative;
    overflow: hidden;
  }

  .cta-title {
    font-size: 32px;
    font-weight: 800;
    color: white;
    margin-bottom: 16px;
  }

  .cta-subtitle {
    font-size: 16px;
    color: rgba(255,255,255,0.9);
    margin-bottom: 30px;
  }

  .cta-btn {
    background: white;
    color: #667eea;
    padding: 16px 40px;
    border-radius: 50px;
    font-weight: 800;
    font-size: 18px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .pro-title {
      font-size: 32px;
    }
    .pricing-card.popular {
      transform: scale(1);
    }
    .pricing-card.popular:hover {
      transform: translateY(-10px);
    }
    .section-title {
      font-size: 28px;
    }
    .cta-section {
      padding: 40px 20px;
      margin: 40px 20px;
    }
    .cta-title {
      font-size: 24px;
    }
  }
`;

const Pro = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [openFaq, setOpenFaq] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: '⭐',
      price: 0,
      duration: 'free forever',
      features: [
        'Create up to 5 teams',
        'Basic player stats',
        'Join public contests',
        'Standard support',
        'Basic match analytics'
      ],
      notIncluded: [
        'Advanced analytics',
        'Priority support',
        'Multiple team creation',
        'Exclusive contests'
      ]
    },
    {
      id: 'pro',
      name: 'PRO',
      icon: '👑',
      price: 499,
      duration: 'per month',
      popular: true,
      features: [
        'Unlimited team creation',
        'Advanced player analytics',
        'Priority 24/7 support',
        'Exclusive PRO contests',
        'Live match insights',
        'Personalized recommendations',
        'Ad-free experience',
        'Early access to features'
      ],
      notIncluded: []
    },
    {
      id: 'elite',
      name: 'ELITE',
      icon: '💎',
      price: 999,
      duration: 'per month',
      features: [
        'Everything in PRO',
        '1-on-1 strategy sessions',
        'Custom team analysis',
        'AI-powered predictions',
        'Premium data exports',
        'Private leaderboards',
        'Invite-only tournaments',
        'Dedicated account manager'
      ],
      notIncluded: []
    }
  ];

  const features = [
    { icon: '📊', title: 'Advanced Analytics', desc: 'Deep dive into player statistics, form guides, and performance predictions' },
    { icon: '🎯', title: 'AI Predictions', desc: 'Machine learning powered match and player performance predictions' },
    { icon: '🏆', title: 'Exclusive Contests', desc: 'Access to PRO-only contests with higher prize pools' },
    { icon: '⚡', title: 'Real-time Updates', desc: 'Instant notifications and live score updates' },
    { icon: '👥', title: 'Multi-team', desc: 'Create and manage multiple teams for different strategies' },
    { icon: '💬', title: 'Priority Support', desc: '24/7 dedicated support with priority response time' },
    { icon: '📈', title: 'Performance Tracking', desc: 'Track your performance history and improvement metrics' },
    { icon: '🔒', title: 'Ad-free Experience', desc: 'Enjoy uninterrupted gameplay without any ads' }
  ];

  const testimonials = [
    { name: 'Rahul Sharma', role: 'PRO User', text: 'Score11 PRO completely transformed my fantasy cricket game. The insights are invaluable!' },
    { name: 'Priya Patel', role: 'Elite Member', text: 'The AI predictions helped me win 3 consecutive contests. Best investment ever!' },
    { name: 'Amit Kumar', role: 'PRO User', text: 'Priority support is a game-changer. They resolved my issue in minutes!' }
  ];

  const faqs = [
    { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets like Paytm, Google Pay, and PhonePe.' },
    { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.' },
    { q: 'Is there a free trial?', a: 'Yes, we offer a 7-day free trial for PRO plan. No commitment required!' },
    { q: 'What happens after my subscription ends?', a: 'You\'ll revert to the Basic plan but can still access your data and teams. Upgrade again anytime to regain PRO features.' }
  ];

  const handleUpgrade = (plan) => {
    if (!user) {
      alert('Please login to upgrade to PRO');
      navigate('/login');
      return;
    }
    alert(`Redirecting to payment for ${plan.name} plan...`);
    // Implement actual payment integration here
  };

  return (
    <>
      <style>{styles}</style>
      <div className="pro-page">
        {/* Hero Section */}
        <div className="pro-hero">
          <div className="container text-center">
            <div className="pro-badge">
              <FaCrown /> Premium Experience
            </div>
            <h1 className="pro-title">
              Unlock Your Winning Potential
            </h1>
            <p className="pro-subtitle">
              Get access to advanced analytics, exclusive contests, and premium features that give you the edge over competition
            </p>
          </div>
        </div>

        <div className="container">
          {/* Pricing Cards */}
          <div className="pricing-grid">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && <div className="popular-badge">🔥 MOST POPULAR</div>}
                <div className="pricing-header">
                  <div className="plan-icon">{plan.icon}</div>
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    ₹{plan.price} <span>/ {plan.duration}</span>
                  </div>
                  {plan.price === 0 && <div className="plan-duration">Free forever</div>}
                </div>
                <div className="pricing-body">
                  <ul className="features-list">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <FaCheckCircle className="check-icon" />
                        {feature}
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, idx) => (
                      <li key={idx} style={{ opacity: 0.6 }}>
                        <FaLock className="lock-icon" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`upgrade-btn ${plan.price > 0 ? 'available' : ''}`}
                    onClick={() => handleUpgrade(plan)}
                  >
                    {plan.price === 0 ? 'Current Plan' : `Upgrade to ${plan.name}`}
                    {plan.price > 0 && <FaArrowRight style={{ marginLeft: 8 }} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="container">
            <h2 className="section-title">
              Everything You Need to Win
            </h2>
            <p className="section-subtitle">
              Premium features designed to help you make better decisions and win more contests
            </p>
            <div className="feature-grid">
              {features.map((feature, idx) => (
                <div key={idx} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="testimonials-section">
          <div className="container">
            <h2 className="section-title">
              What Our Members Say
            </h2>
            <p className="section-subtitle">
              Join thousands of satisfied users who have upgraded their game
            </p>
            <div className="testimonial-grid">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="testimonial-card">
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div className="container">
            <h2 className="section-title">
              Frequently Asked Questions
            </h2>
            <p className="section-subtitle">
              Got questions? We've got answers
            </p>
            <div className="faq-grid">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="faq-item"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <div className="faq-question">
                    {faq.q}
                    <span style={{ fontSize: 20 }}>{openFaq === idx ? '−' : '+'}</span>
                  </div>
                  <div className={`faq-answer ${openFaq === idx ? 'open' : ''}`}>
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container">
          <div className="cta-section">
            <h3 className="cta-title">
              Ready to Level Up Your Game?
            </h3>
            <p className="cta-subtitle">
              Join Score11 PRO today and start winning like a pro
            </p>
            <button 
              className="cta-btn"
              onClick={() => handleUpgrade(plans.find(p => p.id === 'pro'))}
            >
              Start Your 7-Day Free Trial
              <FaRocket style={{ marginLeft: 10 }} />
            </button>
            <p style={{ marginTop: 20, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pro;