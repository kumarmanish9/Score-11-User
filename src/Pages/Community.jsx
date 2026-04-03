import React from 'react';
import { FaUsers, FaComments } from 'react-icons/fa';

const Community = () => {
  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold text-center mb-5">
        <FaUsers className="text-primary me-3" />
        Community
      </h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-lg">
            <div className="card-body">
              <h3 className="card-title mb-4">Recent Posts</h3>
              <div className="post mb-4 p-4 border-bottom">
                <div className="d-flex align-items-start mb-3">
                  <img src="https://i.pravatar.cc/40" alt="user" className="rounded-circle me-3" />
                  <div>
                    <h6>John Doe</h6>
                    <small className="text-muted">2 hours ago</small>
                  </div>
                </div>
                <p>Looking for players for weekend tournament! Join us 🔥</p>
                <div className="d-flex gap-2">
                  <FaComments />
                  <small>12 comments</small>
                </div>
              </div>
              {/* More posts */}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-lg h-100">
            <div className="card-body">
              <h5 className="card-title">Trending</h5>
              <ul className="list-unstyled">
                <li className="mb-2 p-2 border-bottom"><strong>Tournament XYZ</strong></li>
                {/* more */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;

