import React from 'react';

const Pro = () => {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-3 fw-bold mb-4">Score11 PRO</h1>
      <p className="lead mb-5">Unlock premium features</p>
      <div className="row g-4">
        <div className="col-md">
          <div className="card h-100 p-4 shadow">
            <h3>Advanced Analytics</h3>
            <p>Player stats & predictions</p>
          </div>
        </div>
        <div className="col-md">
          <div className="card h-100 p-4 shadow">
            <h3>Priority Support</h3>
            <p>24/7 dedicated help</p>
          </div>
        </div>
       
      </div>
      <button className="btn btn-warning btn-lg mt-5">Upgrade to PRO</button>
    </div>
  );
};

export default Pro;

