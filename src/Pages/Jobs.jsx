import React from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .jobs-container {
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
    min-height: 100vh;
  }

  .hero-section {
    background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
    color: white;
    padding: 80px 0;
    position: relative;
    overflow: hidden;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path fill="white" d="M20,20 L30,10 L40,20 L30,30 Z M60,60 L70,50 L80,60 L70,70 Z M80,20 L90,10 L100,20 L90,30 Z"/></svg>') repeat;
    pointer-events: none;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #fff 0%, #f5c500 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }

  .job-card {
    border-radius: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .job-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #f5c500, #ff9a00);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  .job-card:hover::before {
    transform: scaleX(1);
  }

  .job-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  }

  .card-icon {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-bottom: 20px;
  }

  .badge-fulltime {
    background: #e8f5e9;
    color: #2e7d32;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    display: inline-block;
  }

  .badge-remote {
    background: #e3f2fd;
    color: #1565c0;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    display: inline-block;
  }

  .salary-range {
    background: #f5f5f5;
    padding: 8px 12px;
    border-radius: 12px;
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  .apply-btn {
    border-radius: 14px;
    padding: 12px;
    font-weight: 700;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .apply-btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .apply-btn:active::after {
    width: 300px;
    height: 300px;
  }

  .cta-section {
    background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
    border-radius: 30px;
    padding: 60px 40px;
    margin-top: 60px;
    position: relative;
    overflow: hidden;
  }

  .cta-section::before {
    content: '✨';
    position: absolute;
    font-size: 200px;
    opacity: 0.03;
    bottom: -50px;
    right: -50px;
    pointer-events: none;
  }

  .email-btn {
    border-radius: 14px;
    padding: 14px 32px;
    font-weight: 700;
    transition: all 0.2s ease;
    background: #f5c500;
    border: none;
    color: #111;
  }

  .email-btn:hover {
    background: #ff9a00;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(245,197,0,0.3);
  }

  .floating-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .shape {
    position: absolute;
    background: linear-gradient(135deg, #f5c500, #ff9a00);
    border-radius: 50%;
    opacity: 0.05;
    animation: float 20s infinite ease-in-out;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in-up {
    animation: fadeInUp 0.8s ease-out;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }
    .hero-subtitle {
      font-size: 1rem;
      padding: 0 20px;
    }
    .cta-section {
      padding: 40px 20px;
      margin: 40px 20px;
    }
  }
`;

const Jobs = () => {
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      icon: "🎨",
      color: "primary",
      bgColor: "#e8eaf6",
      textColor: "#3949ab",
      description: "Build amazing React interfaces for millions of cricket fans. Work with modern UI/UX and real-time data.",
      tech: "React, Vite, Tailwind",
      salary: "₹8-15 LPA",
      experience: "2+ years",
      type: "Full-time",
      location: "Remote/Hybrid"
    },
    {
      id: 2,
      title: "Backend Developer",
      icon: "⚙️",
      color: "success",
      bgColor: "#e8f5e9",
      textColor: "#2e7d32",
      description: "Scale our Node.js backend for live cricket scores and fantasy contests. Handle millions of concurrent users.",
      tech: "Node.js, MongoDB, Redis",
      salary: "₹10-18 LPA",
      experience: "3+ years",
      type: "Full-time",
      location: "Remote/Hybrid"
    },
    {
      id: 3,
      title: "UI/UX Designer",
      icon: "🎯",
      color: "warning",
      bgColor: "#fff3e0",
      textColor: "#e65100",
      description: "Design intuitive interfaces for cricket fans. Create engaging fantasy experiences that users love.",
      tech: "Figma, Adobe XD, Framer",
      salary: "₹6-12 LPA",
      experience: "2+ years",
      type: "Full-time",
      location: "Remote/Hybrid"
    },
    {
      id: 4,
      title: "DevOps Engineer",
      icon: "🚀",
      color: "info",
      bgColor: "#e0f7fa",
      textColor: "#00695c",
      description: "Manage cloud infrastructure and ensure 99.9% uptime during live matches. Scale systems for peak traffic.",
      tech: "AWS, Docker, Kubernetes",
      salary: "₹12-20 LPA",
      experience: "3+ years",
      type: "Full-time",
      location: "Remote"
    },
    {
      id: 5,
      title: "Data Scientist",
      icon: "📊",
      color: "danger",
      bgColor: "#ffebee",
      textColor: "#c62828",
      description: "Build prediction models and player analytics. Work with cricket data to enhance user experience.",
      tech: "Python, TensorFlow, SQL",
      salary: "₹15-25 LPA",
      experience: "3+ years",
      type: "Full-time",
      location: "Hybrid"
    },
    {
      id: 6,
      title: "Product Manager",
      icon: "📱",
      color: "purple",
      bgColor: "#f3e5f5",
      textColor: "#6a1b9a",
      description: "Lead product strategy and roadmap. Work closely with engineering and design teams.",
      tech: "Agile, JIRA, Analytics",
      salary: "₹18-30 LPA",
      experience: "4+ years",
      type: "Full-time",
      location: "Hybrid"
    }
  ];

  const getButtonColor = (color) => {
    switch(color) {
      case 'primary': return '#3949ab';
      case 'success': return '#2e7d32';
      case 'warning': return '#e65100';
      case 'info': return '#00695c';
      case 'danger': return '#c62828';
      case 'purple': return '#6a1b9a';
      default: return '#111';
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="jobs-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="floating-shapes">
            <div className="shape" style={{ width: '100px', height: '100px', top: '10%', left: '5%', animationDelay: '0s' }}></div>
            <div className="shape" style={{ width: '150px', height: '150px', bottom: '10%', right: '5%', animationDelay: '5s' }}></div>
            <div className="shape" style={{ width: '70px', height: '70px', top: '50%', right: '20%', animationDelay: '2s' }}></div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center fade-in-up">
                <h1 className="hero-title">
                  Join the Score11 Team
                </h1>
                <p className="hero-subtitle">
                  We're building the future of fantasy cricket, and we want you to be part of it.
                  Work with the best talent in the industry and make an impact on millions of users.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-5">
          {/* Stats Section */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="display-4 fw-bold text-primary">50+</div>
                <div className="text-muted">Team Members</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="display-4 fw-bold text-success">5M+</div>
                <div className="text-muted">Active Users</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <div className="display-4 fw-bold text-warning">4.8⭐</div>
                <div className="text-muted">Glassdoor Rating</div>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="row g-4">
            {jobs.map((job, index) => (
              <div key={job.id} className="col-lg-4 col-md-6 fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="job-card card h-100 border-0 shadow-lg">
                  <div className="card-body p-4">
                    <div className="card-icon" style={{ background: job.bgColor, color: job.textColor }}>
                      {job.icon}
                    </div>
                    <h3 className="card-title fw-bold mb-3" style={{ color: job.textColor }}>
                      {job.title}
                    </h3>
                    <p className="card-text text-muted mb-3">
                      {job.description}
                    </p>
                    <div className="mb-3">
                      <span className="badge-fulltime me-2">{job.type}</span>
                      <span className="badge-remote">{job.location}</span>
                    </div>
                    <div className="mb-3">
                      <div className="salary-range d-inline-block me-2">
                        💰 {job.salary}
                      </div>
                    </div>
                    <div className="mb-4">
                      <small className="text-muted">
                        <strong>Tech Stack:</strong> {job.tech}<br />
                        <strong>Experience:</strong> {job.experience}
                      </small>
                    </div>
                    <a 
                      href={`mailto:careers@score11.com?subject=${job.title} Application`} 
                      className="apply-btn btn w-100 text-white"
                      style={{ background: getButtonColor(job.color) }}
                    >
                      Apply Now →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Perks Section */}
          <div className="row mt-5 pt-4">
            <div className="col-12 text-center mb-5">
              <h2 className="display-6 fw-bold">Why Join Score11?</h2>
              <p className="text-muted">We take care of our team members with amazing benefits</p>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="text-center p-3">
                <div className="display-4 mb-3">🏠</div>
                <h5>Work From Home</h5>
                <small className="text-muted">Flexible remote culture</small>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="text-center p-3">
                <div className="display-4 mb-3">💊</div>
                <h5>Health Insurance</h5>
                <small className="text-muted">Family coverage included</small>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="text-center p-3">
                <div className="display-4 mb-3">📚</div>
                <h5>Learning Budget</h5>
                <small className="text-muted">₹50k/year for courses</small>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="text-center p-3">
                <div className="display-4 mb-3">🎉</div>
                <h5>Team Retreats</h5>
                <small className="text-muted">Yearly offsites & parties</small>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section fade-in-up">
            <div className="row align-items-center">
              <div className="col-lg-8 text-center text-lg-start">
                <h3 className="text-white mb-3 fw-bold">Ready to join the team?</h3>
                <p className="text-white-50 mb-0">
                  Don't see the right role? Send us your resume anyway. We're always looking for talented people!
                </p>
              </div>
              <div className="col-lg-4 text-center text-lg-end mt-3 mt-lg-0">
                <a href="mailto:careers@score11.com" className="email-btn btn">
                  📧 careers@score11.com
                </a>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-5 pt-3">
            <p className="text-muted small">
              © 2024 Score11. All rights reserved. | We're an equal opportunity employer
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;