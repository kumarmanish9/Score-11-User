import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { 
  getWalletBalance, 
  getTransactions, 
  addMoney,
  withdrawMoney
 } from '../Services/walletService';
import { FaWallet, FaRupeeSign, FaHistory, FaPlus, FaCreditCard, FaQrcode, FaDownload, FaMinus } from 'react-icons/fa';
import "../assets/Styles/Global.css";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [tab, setTab] = useState('balance');
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDetails, setWithdrawDetails] = useState({ account: '', ifsc: '', holder: '' });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const [balRes, transRes] = await Promise.all([
        getWalletBalance(),
        getTransactions()
      ]);
      setBalance(Number(balRes.balance || 0));
      console.log('Transactions data:', transRes);
      setTransactions(Array.isArray(transRes) ? transRes : []);
    } catch (err) {
      console.error('Wallet fetch error:', err);
      setBalance(0);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely render values that might be objects
  const safeRender = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') {
      // If it's an object with name property (like contest object)
      if (value.name) return value.name;
      if (value.shortName) return value.shortName;
      if (value._id) return value._id;
      // If it's a date object
      if (value instanceof Date) return value.toLocaleString();
      // Otherwise return a safe string representation
      return JSON.stringify(value);
    }
    return String(value);
  };

  const handleAddMoney = async () => {
    const amount = Number(addAmount);
    if (!amount || amount < 10) {
      alert('Minimum ₹10');
      return;
    }

    try {
      setAddLoading(true);
      const res = await addMoney({ amount });
      alert(`₹${amount} added successfully!`);
      setBalance(prev => prev + amount);
      setAddAmount('');
      fetchWallet();
    } catch (err) {
      const message = err.response?.data?.message || 'Add money failed';
      alert(message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount < 100 || amount > balance) {
      alert('Minimum ₹100, maximum available balance');
      return;
    }
    if (!withdrawDetails.account || !withdrawDetails.ifsc || !withdrawDetails.holder) {
      alert('Complete bank details');
      return;
    }

    try {
      setWithdrawLoading(true);
      const res = await withdrawMoney({ 
        amount, 
        bankAccount: withdrawDetails.account,
        ifsc: withdrawDetails.ifsc,
        accountHolder: withdrawDetails.holder 
      });
      alert(`Withdraw ₹${amount} requested! Processing in 2-3 days.`);
      setBalance(prev => prev - amount);
      setWithdrawAmount('');
      setWithdrawDetails({ account: '', ifsc: '', holder: '' });
      fetchWallet();
    } catch (err) {
      const message = err.response?.data?.message || 'Withdraw failed';
      alert(message);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const downloadStatement = () => {
    const csv = transactions.map(t => 
      `${new Date(t.createdAt).toLocaleDateString()},${safeRender(t.type)},${t.amount},${safeRender(t.status)}`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wallet_statement.csv';
    a.click();
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <FaWallet className="fs-1 text-muted mb-4" />
        <h3>Please <Link to="/login" className="text-decoration-none">login</Link> to view wallet</h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}} />
        <p>Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem 0'}}>
      <div className="container">
        {/* Hero Header */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <FaWallet className="display-1 text-white mb-4" />
            <h1 className="display-4 fw-bold text-white mb-2">My Wallet</h1>
            <p className="lead text-white-50 mb-0">Balance • Transactions • Withdrawals</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="row mb-5">
          <div className="col-lg-10 mx-auto">
            <div className="card shadow-xl border-0 rounded-4 overflow-hidden position-relative" style={{background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'}}>
              <div className="p-5 text-center position-relative">
                <FaRupeeSign className="display-3 text-primary mb-3 opacity-75" />
                <h2 className="display-1 fw-bold text-primary mb-1">₹{balance.toLocaleString()}</h2>
                <p className="h4 text-muted mb-4">Available Balance</p>
                
                {/* Quick Actions */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <button className="btn btn-success btn-lg w-100 py-3 fw-bold shadow-lg" onClick={handleAddMoney} disabled={addLoading || !addAmount}>
                      {addLoading ? <span className="spinner-border spinner-border-sm me-2" /> : <FaPlus className="me-2" />}
                      Add Money
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button className="btn btn-warning btn-lg w-100 py-3 fw-bold shadow-lg" onClick={() => setTab('withdraw')} disabled={balance < 100}>
                      <FaMinus className="me-2" />
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="input-group mt-4 px-4" style={{maxWidth: '400px', margin: '0 auto'}}>
                  <span className="input-group-text bg-white border-primary rounded-start-pill">
                    <FaRupeeSign />
                  </span>
                  <input 
                    type="number" 
                    className="form-control border-primary border-end-0 fw-bold fs-5 text-center rounded-end-pill shadow-sm" 
                    placeholder="Enter amount"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    min="10"
                  />
                  <button className="btn btn-primary rounded-start-pill shadow-lg fw-bold" onClick={handleAddMoney} disabled={addLoading || !addAmount || Number(addAmount) < 10}>
                    Add ₹
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="row mb-4">
          <div className="col-lg-8 mx-auto">
            <div className="btn-group w-100 shadow-lg rounded-pill overflow-hidden" role="group">
              <button 
                className={`btn py-3 px-5 fw-bold flex-fill fs-5 rounded-0 ${tab === 'balance' ? 'btn-primary shadow-none' : 'btn-outline-primary'}`}
                onClick={() => setTab('balance')}
              >
                <FaWallet className="me-2" />
                Balance & Add Money
              </button>
              <button 
                className={`btn py-3 px-5 fw-bold flex-fill fs-5 rounded-0 ${tab === 'history' ? 'btn-primary shadow-none' : 'btn-outline-primary'}`}
                onClick={() => setTab('history')}
              >
                <FaHistory className="me-2" />
                Transactions
              </button>
              <button 
                className={`btn py-3 px-5 fw-bold flex-fill fs-5 rounded-end-pill ${tab === 'withdraw' ? 'btn-warning shadow-none' : 'btn-outline-warning'}`}
                onClick={() => setTab('withdraw')}
              >
                <FaMinus className="me-2" />
                Withdraw Money
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {tab === 'balance' && (
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="alert alert-info shadow">
                <h6><FaCreditCard className="me-2" />Payment Methods</h6>
                <div className="row g-3 mt-3">
                  <div className="col-md-3">
                    <button className="btn btn-outline-primary w-100 p-3 rounded-3">
                      <FaCreditCard className="fs-1 mb-2 d-block" />
                      <div>Add Card</div>
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-outline-success w-100 p-3 rounded-3">
                      <FaQrcode className="fs-1 mb-2 d-block text-success" />
                      <div>UPI QR</div>
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-outline-warning w-100 p-3 rounded-3">
                      <FaCreditCard className="fs-1 mb-2 d-block text-warning" />
                      <div>Net Banking</div>
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-outline-info w-100 p-3 rounded-3">
                      <FaCreditCard className="fs-1 mb-2 d-block text-info" />
                      <div>Wallets</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="card shadow-lg border-0">
                <div className="card-header bg-transparent border-0 pb-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Recent Transactions</h5>
                    <button className="btn btn-outline-secondary" onClick={downloadStatement}>
                      <FaDownload className="me-1" />
                      Download CSV
                    </button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Contest</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 15).map((t, i) => (
                        <tr key={i}>
                          <td>{new Date(t.createdAt || t.date).toLocaleString()}</td>
                          <td>
                            <span className={`badge fs-6 fw-semibold ${t.type === 'deposit' ? 'bg-success' : t.type === 'withdraw' ? 'bg-warning' : 'bg-info'}`}>
                              {safeRender(t.type).toUpperCase()}
                            </span>
                          </td>
                          <td className={`fw-bold fs-5 ${t.type === 'deposit' ? 'text-success' : 'text-danger'}`}>
                            ₹{Number(t.amount).toLocaleString()}
                          </td>
                          <td>{safeRender(t.contestName)}</td>
                          <td>
                            <span className={`badge fs-6 fw-semibold ${t.status === 'completed' ? 'bg-success' : t.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                              {safeRender(t.status).toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                            <FaWallet className="fs-1 mb-3 opacity-50" />
                            <p className="mb-0">No transactions yet</p>
                            <p className="small">Start by adding money above!</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'withdraw' && (
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                  <div className="text-center mb-5">
                    <FaMinus className="display-4 text-warning mb-3" />
                    <h3 className="fw-bold text-gray-900">Withdraw Money</h3>
                    <p className="text-muted">Minimum ₹100 • Processed in 2-3 working days</p>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Amount</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaRupeeSign />
                        </span>
                        <input 
                          type="number" 
                          className="form-control form-control-lg" 
                          placeholder="100" 
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)} 
                          min="100" 
                          max={balance}
                        />
                      </div>
                      <small className="text-muted">Available: ₹{balance.toLocaleString()}</small>
                    </div>
                    <div className="col-md-6">
                      <button className="btn btn-lg w-100 text-white bg-gradient-warning" onClick={handleWithdraw} disabled={withdrawLoading}>
                        {withdrawLoading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                        Withdraw Now
                      </button>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold mb-3">Bank Details</h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Account Number" 
                            value={withdrawDetails.account}
                            onChange={(e) => setWithdrawDetails({...withdrawDetails, account: e.target.value})} 
                          />
                        </div>
                        <div className="col-md-4">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="IFSC" 
                            value={withdrawDetails.ifsc}
                            onChange={(e) => setWithdrawDetails({...withdrawDetails, ifsc: e.target.value})} 
                          />
                        </div>
                        <div className="col-md-4">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Account Holder" 
                            value={withdrawDetails.holder}
                            onChange={(e) => setWithdrawDetails({...withdrawDetails, holder: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;