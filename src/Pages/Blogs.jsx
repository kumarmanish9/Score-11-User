import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTh, FaList, FaCalendar, FaUser } from 'react-icons/fa';
import { AuthContext } from '../Context/AuthContext';
import { getBlogs } from '../Services/blogService';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogs();
      setBlogs(data);
      setError('');
    } catch (err) {
      setError('Failed to load blogs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading blogs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      {/* Header */}
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="display-3 fw-bold mb-3 text-dark">
            Cricket Blogs & Insights
          </h1>
          <p className="lead text-muted mb-0">
            Latest news, analysis, tips, and stories from the world of cricket
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="row mb-4">
        <div className="col-lg-6">
          <div className="input-group shadow-sm rounded-4">
            <span className="input-group-text bg-white border-0 rounded-start-4">
              <FaSearch />
            </span>
            <input 
              type="text" 
              className="form-control border-0 px-4 shadow-none" 
              placeholder="Search blogs, players, matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-6 text-end">
          <div className="btn-group shadow-sm rounded-4" role="group">
            <button 
              className={`btn btn-outline-primary rounded-start-4 ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FaTh />
            </button>
            <button 
              className={`btn btn-outline-primary rounded-end-4 ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning text-center rounded-4 shadow-sm mb-4">
          {error}
          <button className="btn btn-outline-warning btn-sm ms-3" onClick={fetchBlogs}>
            Retry
          </button>
        </div>
      )}

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-5">
          <img src="/no-blogs.svg" alt="No blogs" className="mb-4" style={{maxHeight: '200px', opacity: 0.5}} />
          <h3 className="text-muted mb-3">No blogs found</h3>
          <p className="text-muted">Try adjusting your search or check back later</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "row g-4" : "list-group list-group-flush"}>
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className={viewMode === 'grid' ? "col-xl-3 col-lg-4 col-md-6" : ""}>
              <Link to={`/blog/${blog._id}`} className={`text-decoration-none ${viewMode === 'grid' ? '' : 'list-group-item list-group-item-action border-0 shadow-sm mb-3 rounded-4'}`}>
                <div className="card h-100 border-0 shadow-sm hover-lift overflow-hidden rounded-4">
                  {blog.image && (
                    <div className="position-relative overflow-hidden" style={{height: '200px'}}>
                      <img
                        src={blog.image}
                        className="card-img-top w-100 h-100 object-fit-cover"
                        alt={blog.title}
                        style={{transition: 'transform 0.3s ease'}}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                      <div className="position-absolute top-3 end-3">
                        <span className="badge bg-primary rounded-pill px-3 py-2 shadow">
                          {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold text-dark mb-3 lh-sm" style={{fontSize: '1.1rem'}}>
                      {blog.title}
                    </h5>
                    <p className="card-text text-muted small mb-3 lh-sm" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                      {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                    </p>
                    <div className="d-flex align-items-center small text-muted">
                      <FaUser className="me-2" />
                      <span>{blog.author?.name || 'Score11 Team'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="row mt-5">
        <div className="col-12 text-center">
          <nav>
            <ul className="pagination justify-content-center gap-2">
              <li className="page-item">
                <button className="page-link rounded-pill shadow-sm border-0" style={{minWidth: '50px'}}>
                  Previous
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link rounded-pill shadow-sm border-0 bg-primary text-white">1</span>
              </li>
              <li className="page-item">
                <button className="page-link rounded-pill shadow-sm border-0" style={{minWidth: '50px'}}>
                  2
                </button>
              </li>
              <li className="page-item">
                <button className="page-link rounded-pill shadow-sm border-0">Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
