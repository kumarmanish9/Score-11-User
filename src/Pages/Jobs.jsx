import React from 'react';

const Jobs = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto text-center mb-5 fade-in-up">
          <h1 className="display-4 fw-bold mb-4 text-primary">
            Careers at Score11
          </h1>
          <p className="lead text-muted mb-5">
            Join our passionate team and help build the future of fantasy cricket!
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-lg hover-lift">
            <div className="card-body p-5">
              <h3 className="card-title fw-bold mb-3 text-primary">Frontend Developer</h3>
              <p className="card-text text-muted mb-4">
                Build amazing React interfaces for millions of cricket fans. Work with modern UI/UX and real-time data.
              </p>
              <ul className="list-unstyled mb-4">
                <li className="mb-2"><strong>React, Vite</strong> • Full-time</li>
                <li className="mb-2"><strong>₹8-15 LPA</strong> • Remote/Hybrid</li>
                <li>2+ years experience</li>
              </ul>
              <a href="mailto:careers@score11.com?subject=Frontend Developer Application" className="btn btn-primary btn-lg w-100">
                Apply Now
              </a>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-lg hover-lift">
            <div className="card-body p-5">
              <h3 className="card-title fw-bold mb-3 text-success">Backend Developer</h3>
              <p className="card-text text-muted mb-4">
                Scale our Node.js backend for live cricket scores and fantasy contests.
              </p>
              <ul className="list-unstyled mb-4">
                <li className="mb-2"><strong>Node.js, MongoDB</strong> • Full-time</li>
                <li className="mb-2"><strong>₹10-18 LPA</strong> • Remote/Hybrid</li>
                <li>3+ years experience</li>
              </ul>
              <a href="mailto:careers@score11.com?subject=Backend Developer Application" className="btn btn-success btn-lg w-100">
                Apply Now
              </a>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-lg hover-lift">
            <div className="card-body p-5">
              <h3 className="card-title fw-bold mb-3 text-warning">UI/UX Designer</h3>
              <p className="card-text text-muted mb-4">
                Design intuitive interfaces for cricket fans. Create engaging fantasy experiences.
              </p>
              <ul className="list-unstyled mb-4">
                <li className="mb-2"><strong>Figma, Adobe XD</strong> • Full-time</li>
                <li className="mb-2"><strong>₹6-12 LPA</strong> • Remote/Hybrid</li>
                <li>2+ years experience</li>
              </ul>
              <a href="mailto:careers@score11.com?subject=UI/UX Designer Application" className="btn btn-warning btn-lg w-100 text-white">
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12 text-center">
          <h3 className="mb-4">Ready to join the team?</h3>
          <p className="lead text-muted mb-4">
            Send your resume to <strong>careers@score11.com</strong>
          </p>
          <a href="mailto:careers@score11.com" className="btn btn-outline-primary btn-lg">
            Email Your Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
