import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllPlayers, deletePlayer } from '../Services/playerService';
import { FaPlus, FaTrash, FaEdit, FaUser, FaSearch, FaSyncAlt } from 'react-icons/fa';
import "../assets/Styles/Global.css";

function InstantPlayerList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Auto-refresh on ?refresh=1 param
  useEffect(() => {
    if (searchParams.get('refresh')) {
      fetchPlayers();
      // Clear refresh param
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('refresh');
      setSearchParams(newParams);
    }
  }, [searchParams]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const data = await getAllPlayers();
      setPlayers(data);
      setFilteredPlayers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = players.filter(p => 
      p.playerName.toLowerCase().includes(term) ||
      p.role.toLowerCase().includes(term) ||
      (p.teamName && p.teamName.toLowerCase().includes(term))
    );
    setFilteredPlayers(filtered);
  }, [search, players]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this player?')) {
      try {
        await deletePlayer(id);
        fetchPlayers();
        alert('Player deleted!');
      } catch (err) {
        alert('Error deleting player');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary fs-1"></div>
      </div>
    );
  }

  return (
    <div className="py-6 bg-gradient-light">
      <div className="container">
        {/* Header */}
        <div className="row align-items-center mb-5">
          <div className="col">
            <h1 className="h2 fw-bold mb-0">
              <FaUser className="me-2 text-primary" />
              Player Directory ({filteredPlayers.length})
            </h1>
            <p className="text-muted mb-0">All your custom players - unlimited creation</p>
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-secondary btn-sm me-2" onClick={fetchPlayers} title="Refresh">
              <FaSyncAlt />
            </button>
            <Link to="/instant-player-create" className="btn btn-primary btn-lg px-5 shadow-lg">
              <FaPlus className="me-2" />
              Add Player
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="row mb-5">
          <div className="col-md-6">
            <div className="input-group input-group-lg shadow-sm">
              <span className="input-group-text bg-white">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0 shadow-none"
                placeholder="Search by name, role or team..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Players Table */}
        <div className="card shadow-xl border-0">
          <div className="card-header bg-white border-0 py-4">
            <h5 className="mb-0 fw-semibold">Players List</h5>
          </div>
          <div className="card-body p-0">
            {filteredPlayers.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>Player Name</th>
                      <th className="text-center">Jersey</th>
                      <th>Role</th>
                      <th>Team</th>
                      <th className="text-center">Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player) => (
                      <tr key={player._id} className="align-middle">
                        <td>
                          <div className="fw-semibold">{player.playerName}</div>
                          <small className="text-muted">ID: {player._id.slice(-6)}</small>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-primary fs-6 px-3 py-2">
                            #{player.jerseyNumber || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge px-3 py-2 fw-semibold rounded-pill 
                            ${player.role === 'batsman' ? 'bg-success' : 
                              player.role === 'bowler' ? 'bg-danger' :
                              player.role === 'all-rounder' ? 'bg-purple' : 'bg-warning'}`}>
                            {player.role.replace('-', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td>
                        <span className="fw-medium">{player.teamName || player.team?.name || 'Independent'}</span>
                        </td>
                        <td className="text-center">
                          <small className="text-muted">
                            {new Date(player.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <Link 
                              to={`/players/${player._id}`}
                              className="btn btn-sm btn-outline-primary"
                              title="View Profile"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(player._id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaUser className="display-1 text-muted mb-4" />
                <h4>No players found</h4>
                <p className="text-muted mb-4">Create your first instant player</p>
                <Link to="/instant-player-create" className="btn btn-primary btn-lg px-5">
                  Add First Player
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstantPlayerList;

