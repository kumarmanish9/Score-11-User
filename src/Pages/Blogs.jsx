import React, { useState, useEffect } from 'react';
import { FaSearch, FaTh, FaList, FaCalendar, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// ✅ MOCK DATA
const mockBlogs = [
  {
    _id: 'blog-01',
    title: 'Premium Fantasy Strategies for IPL',
    excerpt: 'Unlock winning lineup tips and captaincy insights.',
    author: { name: 'Score11 Insider' },
    createdAt: '2026-04-20T08:30:00Z',
    image: 'https://images.unsplash.com/photo-1595210382266-2d0077c1f541?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNyaWNrZXR8ZW58MHx8MHx8fDA%3D',
    category: 'Strategy',
    featured: true,
  },
  {
    _id: 'blog-02',
    title: 'Data-Driven Team Building',
    excerpt: 'Build a squad that performs consistently.',
    author: { name: 'Analytics Lab' },
    createdAt: '2026-04-18T12:00:00Z',
    image: 'https://media.istockphoto.com/id/497203317/photo/the-tools-for-a-batsman.webp?a=1&b=1&s=612x612&w=0&k=20&c=4PReFIDWkSfmwkIwwv1gLtz6iMRRe0p2qyQrx1CcmWs=',
    category: 'Analytics',
  },
  {
    _id: 'blog-03',
    title: 'Captaincy Secrets',
    excerpt: 'Choose impactful leaders for maximum points.',
    author: { name: 'Captaincy Coach' },
    createdAt: '2026-04-15T09:15:00Z',
    image: 'https://media.istockphoto.com/id/1158435298/photo/grand-cricket-stadium-with-wooden-wickets-front-view-in-daylight.webp?a=1&b=1&s=612x612&w=0&k=20&c=3IqFHdHbb5B_R2V8JGZl0XdlzI6Tb6Obew2GXYvyOZ4=',
    category: 'Captaincy',
  },
];

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    setTimeout(() => {
      setBlogs(mockBlogs);
      setLoading(false);
    }, 300);
  }, []);

  const featuredBlog = blogs.find(b => b.featured) || blogs[0];

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-white">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid pt-5 pb-0 bg-white">

      {/* 🔥 HERO FEATURED */}
      <div className="container mb-5">
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-md-6">
              <img
                src={featuredBlog?.image}
                className="w-100 h-100"
                style={{ objectFit: 'cover', minHeight: '300px' }}
                alt=""
              />
            </div>
            <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
              <span className="badge bg-warning text-dark mb-3">
                ⭐ Featured
              </span>
              <h2 className="fw-bold text-dark">{featuredBlog?.title}</h2>
              <p className="text-muted">{featuredBlog?.excerpt}</p>
              <button className="btn btn-dark rounded-pill mt-3 px-4">
                Read Premium →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 SEARCH + VIEW */}
      <div className="container mb-4">
        <div className="row">
          <div className="col-md-6">
            <div className="input-group shadow-sm rounded-pill">
              <span className="input-group-text bg-white border-0">
                <FaSearch />
              </span>
              <input
                className="form-control border-0"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 text-end">
            <button
              className={`btn btn-outline-dark me-2 ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FaTh />
            </button>
            <button
              className={`btn btn-outline-dark ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* 📦 BLOG CARDS */}
      <div className="container">
        <div className={viewMode === 'grid' ? 'row g-4' : ''}>
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className={viewMode === 'grid' ? 'col-md-4' : 'mb-3'}>
              <Link to="#" className="text-decoration-none text-dark">
                <div className="card border-0 shadow-sm rounded-4 h-100 hover-card">

                  {/* Premium badge */}
                  {blog.featured && (
                    <span className="position-absolute m-3 badge bg-warning text-dark">
                      Premium
                    </span>
                  )}

                  <img
                    src={blog.image}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                    alt=""
                  />

                  <div className="card-body">
                    <span className="badge bg-light text-dark mb-2">
                      {blog.category}
                    </span>

                    <h5 className="fw-bold text-dark">{blog.title}</h5>

                    <p className="text-muted small">{blog.excerpt}</p>

                    <div className="d-flex justify-content-between text-muted small">
                      <span>
                        <FaUser /> {blog.author.name}
                      </span>
                      <span>
                        <FaCalendar /> {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            </div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center mt-5">
            <h3 className="text-dark">No blogs found</h3>
            <p className="text-muted">Try different keywords</p>
          </div>
        )}
      </div>

      {/* ✨ HOVER EFFECT */}
      <style>
        {`
          .hover-card {
            transition: all 0.25s ease;
          }
          .hover-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.08);
          }
        `}
      </style>

    </div>
  );
};

export default Blogs;