import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: 'How to join tournament?', a: 'Click join button after login.' },
    { q: 'Payment methods?', a: 'UPI, Cards, Wallets.' },
    { q: 'Team creation?', a: 'Search players and add to team.' },
    // more
  ];

  return (
    <div className="container py-5">
      <h1 className="display-4 text-center mb-5">FAQ</h1>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {faqs.map((faq, index) => (
            <div key={index} className="card mb-4 shadow">
              <div className="card-header p-0">
                <button 
                  className="btn btn-block text-start p-4 fw-bold"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  {faq.q}
                </button>
              </div>
              {openIndex === index && (
                <div className="card-body">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;

