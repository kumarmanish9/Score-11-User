import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { getWalletBalance, getTransactions, addMoney } from '../Services/walletService';
import { FaWallet, FaRupeeSign, FaHistory, FaPlus, FaCreditCard, FaQrcode } from 'react-icons/fa';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [tab, setTab] = useState('balance');
  const [addAmount, setAddAmount] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const bal = await getWalletBalance();
      const trans = await getTransactions();
      setBalance(Number(bal.balance || 0));
      setTransactions(Array.isArray(trans) ? trans : []);
    } catch (err) {
      console.error(err);
      setBalance(0);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!addAmount || Number(addAmount) <= 0) {
      alert('Enter valid amount');
      return;
    }

    try {
      setAddLoading(true);
      const res = await addMoney({ amount: Number(addAmount) });
      alert('Money added successfully! (Demo)');
      setBalance(Number(balance) + Number(addAmount));
      setAddAmount('');
      fetchWallet(); // Refresh transactions
    } catch (err) {
      alert('Add money failed. Backend endpoint missing.');
      console.error(err);
    } finally {
      setAddLoading(false);
    }
  };

  if (!user) return <div className="text-center py-5">Please <Link to="/login">login</Link> to view wallet</div>;

  if (loading) return <div className="text-center py-5">
    <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}} />
    <p>Loading wallet...</p>
  </div>;

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">
          <FaWallet className="text-success me-3" size={48} />
          My Wallet
        </h1>
        <p className="lead text-muted">Manage your balance and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-lg border-0 rounded-4 text-center p-5 position-relative overflow-hidden">
            <div className="bg-gradient-circle"></div>
            <FaRupeeSign size={64} className="text-warning mb-4 opacity-75" />
            <h2 className="display-2 fw-bold text-primary mb-2">₹{Number(balance).toLocaleString()}</h2>
            <p className="h5 text-gray-600 mb-4">Available Balance</p>
            
            {/* Add Money Section */}
            <div className="row g-3 align-items-end">
              <div className="col-md-7">
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-white border-primary">
                    <FaRupeeSign />
                  </span>
                  <input 
                    type="number" 
                    className="form-control border-primary fw-semibold shadow-sm" 
                    placeholder="0"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    min="10"
                  />
                </div>
              </div>
              <div className="col-md-5">
                <button 
                  className="btn btn-primary btn-lg w-100 fw-bold shadow-lg" 
                  onClick={handleAddMoney}
                  disabled={addLoading || !addAmount}
                >
                  {addLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaPlus className="me-2" />
                      Add Money
                    </>
                  )}
                </button>
              </div>
            </div>
            <small className="text-muted mt-3 d-block">Minimum ₹10 • Instant UPI/Cards</small>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="row mb-5">
        <div className="col-md-10 mx-auto">
          <h5 className="fw-bold text-gray-900 mb-4">Payment Methods</h5>
          <div className="row g-3">
            <div className="col-md-6 col-lg-3">
              <button className="btn btn-outline-primary w-100 p-4 text-start rounded-3 shadow-sm hover-lift">
                <FaCreditCard className="fs-1 mb-3 text-primary" />
                <h6 className="fw-bold mb-1">Add Card</h6>
                <small className="text-muted">Save cards for fast checkout</small>
              </button>
            </div>
            <div className="col-md-6 col-lg-3">
              <button className="btn btn-outline-success w-100 p-4 text-start rounded-3 shadow-sm hover-lift">
                <FaQrcode className="fs-1 mb-3 text-success" />
                <h6 className="fw-bold mb-1">UPI</h6>
                <small className="text-muted">PhonePe, GPay, Paytm</small>
              </button>
            </div>
            <div className="col-md-6 col-lg-3">
              <button className="btn btn-outline-warning w-100 p-4 text-start rounded-3 shadow-sm hover-lift">
                <FaCreditCard className="fs-1 mb-3 text-warning" />
                <h6 className="fw-bold mb-1">Net Banking</h6>
                <small className="text-muted">All major banks</small>
              </button>
            </div>
            <div className="col-md-6 col-lg-3">
              <button className="btn btn-outline-info w-100 p-4 text-start rounded-3 shadow-sm hover-lift">
                <FaCreditCard className="fs-1 mb-3 text-info" />
                <h6 className="fw-bold mb-1">Wallet</h6>
                <small className="text-muted">Amazon Pay, Mobikwik</small>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="row mb-4">
        <div className="col text-center">
          <div className="btn-group btn-group-lg" role="group">
            <button 
              className={`btn px-5 py-3 fs-5 fw-bold ${tab === 'balance' ? 'btn-primary shadow-lg' : 'btn-outline-primary'}`}
              onClick={() => setTab('balance')}
            >
              Balance
            </button>
            <button 
              className={`btn px-5 py-3 fs-5 fw-bold ${tab === 'history' ? 'btn-primary shadow-lg' : 'btn-outline-primary'}`}
              onClick={() => setTab('history')}
            >
              <FaHistory className="me-2" />
              History
            </button>
          </div>
        </div>
      </div>

      {tab === 'history' && (
        <div className="card shadow-lg border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 10).map((t, i) => (
                    <tr key={i}>
                      <td>{new Date(t.date || Date.now()).toLocaleDateString()}</td>
                      <td>{t.type || 'Deposit'}</td>
                      <td className="fw-bold text-success">
                        <FaRupeeSign className="me-1" />
                        {Number(t.amount || 0).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge fs-6 fw-semibold ${t.status === 'success' ? 'bg-success' : 'bg-warning'}`}>
                          {t.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No transactions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
