import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { getWalletBalance } from '../Services/walletService';
import { FaCartPlus, FaSearch, FaFilter, FaStar, FaRupeeSign } from 'react-icons/fa';
import '../assets/Styles/Global.css';

// **MOCK PRODUCTS** - Hoisted outside component
const mockProducts = [
  {
    id: 1,
    name: 'SG Cobra Cricket Bat',
    price: 4599,
    category: 'Bats',
    image: 'https://m.media-amazon.com/images/I/71g1n88jqqL._AC_UL320_.jpg',
    rating: 4.8,
    reviews: 124,
    stock: 15,
    description: 'Premium Kashmir willow bat for aggressive stroke play'
  },
  {
    id: 2,
    name: 'SS Ton Elite Cricket Bat',
    price: 6999,
    category: 'Bats',
    image: 'https://m.media-amazon.com/images/I/81OqT+RbJOL._AC_UL320_.jpg',
    rating: 4.9,
    reviews: 89,
    stock: 8,
    description: 'English willow for professional players'
  },
  {
    id: 3,
    name: 'Cosco Cricket Ball',
    price: 299,
    category: 'Balls',
    image: 'https://m.media-amazon.com/images/I/71P5Yg5f1OL._AC_UL320_.jpg',
    rating: 4.6,
    reviews: 356,
    stock: 45,
    description: 'Official match ball - Red leather'
  },
  {
    id: 4,
    name: 'SG RSD Pro Helmet',
    price: 2499,
    category: 'Helmets',
    image: 'https://m.media-amazon.com/images/I/61vJ1J4R8+L._AC_UL320_.jpg',
    rating: 4.7,
    reviews: 67,
    stock: 12,
    description: 'ISI certified safety helmet with steel grille'
  },
  {
    id: 5,
    name: 'Nike Cricket Shoes',
    price: 4999,
    category: 'Shoes',
    image: 'https://m.media-amazon.com/images/I/71qJzj4J+NL._AC_UL320_.jpg',
    rating: 4.5,
    reviews: 234,
    stock: 20,
    description: 'Lightweight spikes for fast bowlers'
  },
  {
    id: 6,
    name: 'Batting Leg Guard',
    price: 1799,
    category: 'Pads',
    image: 'https://m.media-amazon.com/images/I/61f5Y7qLbdL._AC_UL320_.jpg',
    rating: 4.4,
    reviews: 156,
    stock: 25,
    description: 'High density foam protection pads'
  },
  {
    id: 7,
    name: 'Training Nets',
    price: 1299,
    category: 'Accessories',
    image: 'https://m.media-amazon.com/images/I/71K5uU9vQBL._AC_UL320_.jpg',
    rating: 4.3,
    reviews: 78,
    stock: 30,
    description: 'Portable practice net 10x10 ft'
  },
  {
    id: 8,
    name: 'Scorebook',
    price: 249,
    category: 'Accessories',
    image: 'https://m.media-amazon.com/images/I/71o5dK5yI+L._AC_UL320_.jpg',
    rating: 4.6,
    reviews: 456,
    stock: 100,
    description: 'Official cricket score book'
  },
  {
    id: 9,
    name: 'Grips & Tape',
    price: 149,
    category: 'Accessories',
    image: 'https://m.media-amazon.com/images/I/61Z8Y4yZ+ZL._AC_UL320_.jpg',
    rating: 4.7,
    reviews: 789,
    stock: 200,
    description: 'Super grip tape roll 24 yards'
  },
  {
    id: 10,
    name: 'Pro Jersey',
    price: 1299,
    category: 'Apparel',
    image: 'https://m.media-amazon.com/images/I/71nK0+whbOL._AC_UL320_.jpg',
    rating: 4.8,
    reviews: 345,
    stock: 50,
    description: 'Breathable team jersey'
  },
  {
    id: 11,
    name: 'SS Master 900 Ball',
    price: 499,
    category: 'Balls',
    image: 'https://m.media-amazon.com/images/I/81q7F+0KOhL._AC_UL320_.jpg',
    rating: 4.5,
    reviews: 234,
    stock: 35,
    description: 'Practice leather ball'
  },
  {
    id: 12,
    name: 'Batting Gloves',
    price: 999,
    category: 'Gloves',
    image: 'https://m.media-amazon.com/images/I/71r5Y1t1+KL._AC_UL320_.jpg',
    rating: 4.6,
    reviews: 167,
    stock: 28,
    description: 'Premium leather batting gloves'
  }
];

const Store = () => {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(5000); // Demo balance
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadWallet();
  }, [user]);

  const loadWallet = async () => {
    if (user) {
      try {
        const data = await getWalletBalance();
        setBalance(data.balance || 5000);
      } catch (err) {
        setBalance(5000);
      }
    }
  };

  const addToCart = (product) => {
    if (!user) {
      alert('Login to buy products');
      navigate('/login');
      return;
    }
    setCart([...cart, product]);
    alert(`${product.name} added to cart! Balance: ₹${balance}`);
  };

  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory === 'all' || product.category === filterCategory)
  );

  const categories = ['all', 'Bats', 'Balls', 'Helmets', 'Shoes', 'Pads', 'Gloves', 'Apparel', 'Accessories'];

  return (
    <div className="py-5 bg-offwhite min-vh-100">
      <div className="container">
        {/* Hero */}
        <div className="row text-center mb-6">
          <div className="col-lg-8 mx-auto">
            <h1 className="display-4 fw-bold mb-3 text-gray-900">
              Cricket Store
            </h1>
            <p className="lead text-gray-600 mb-0">
              Premium gear for champions • Balance: <span className="fw-bold text-success fs-4">₹{balance.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="row g-3 mb-5">
          <div className="col-lg-5">
            <div className="input-group shadow-lg rounded-pill bg-white overflow-hidden">
              <span className="input-group-text bg-white border-end-0 px-4">
                <FaSearch className="text-primary fs-5" />
              </span>
              <input 
                type="text" 
                className="form-control border-0 shadow-none px-4 py-3 fs-5" 
                placeholder="Search SG Cobra, Nike Shoes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-5">
            <select 
              className="form-select shadow-sm rounded-pill py-3 fs-6 fw-semibold h-100"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-2">
            <Link to="/cart" className="btn btn-success w-100 rounded-pill py-3 fs-6 fw-bold shadow-sm h-100 d-flex align-items-center justify-content-center">
              <FaCartPlus className="me-2" />
              Cart ({cart.length})
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row g-4">
          {filteredProducts.length === 0 ? (
            <div className="col-12 text-center py-10">
              <FaSearch className="display-1 text-muted mb-4 opacity-50" />
              <h3 className="mb-4 text-gray-600">No products found</h3>
              <p className="lead text-muted mb-5">Try "bat", "ball" or "SG"</p>
              <button className="btn btn-primary btn-lg rounded-pill px-6 shadow-lg" onClick={() => {setSearch(''); setFilterCategory('all')}}>
                Show All
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift overflow-hidden bg-white">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="card-img-top"
                    style={{height: '250px', objectFit: 'contain', padding: '20px'}}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x250/6B7280/FFFFFF?text=Product';
                    }}
                  />
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0 fw-bold text-gray-900">
                        {product.name}
                      </h5>
                      <div className="text-warning">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <span className="ms-1 small text-muted">({product.reviews})</span>
                      </div>
                    </div>
                    <p className="text-muted small mb-3">{product.description}</p>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="h4 fw-bold text-primary">
                          <FaRupeeSign className="me-1" />
                          {product.price.toLocaleString()}
                        </div>
                        <div className="badge bg-success fs-6 px-3 py-2">
                          In Stock: {product.stock}
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn btn-success w-100 rounded-pill fw-bold py-3 shadow-sm fs-6"
                      onClick={() => addToCart(product)}
                      disabled={balance < product.price}
                    >
                      <FaCartPlus className="me-2" />
                      {balance < product.price ? 'Low Balance' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <small className="text-muted">
              Found {filteredProducts.length} products • Categories: {categories.slice(1).join(', ')}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
