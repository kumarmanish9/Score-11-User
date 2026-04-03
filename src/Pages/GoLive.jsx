import React from 'react';

const GoLive = () => {
  return (
    <div className="container py-5">
      <h1>Go Live</h1>
      <div className="row">
        <div className="col-md-6">
          <h3>With Camera</h3>
          <p>Stream your match</p>
          <button className="btn btn-danger">Start Camera Stream</button>
        </div>
        <div className="col-md-6">
          <h3>With Phone</h3>
          <p>Mobile streaming</p>
          <button className="btn btn-danger">Connect Phone</button>
        </div>
      </div>
    </div>
  );
};

export default GoLive;

