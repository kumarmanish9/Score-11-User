import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../Services/teamService";
import { getMatches, getMatchDetails } from "../Services/matchService";
import { searchPlayers } from "../Services/playerService";
import PlayerCard from "../Components/HomeSection/PlayerCard";
import MatchSelector from "../Components/CreateTeam/MatchSelector";
import PlayerSearchList from "../Components/CreateTeam/PlayerSearchList";
import TeamLineup from "../Components/CreateTeam/TeamLineup";
import "../assets/Styles/Global.css";

function CreateTeam() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchType, setMatchType] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [team, setTeam] = useState(Array(11).fill(null));
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, [matchType]);

  useEffect(() => {
    if (searchQuery) {
      fetchPlayers();
    }
  }, [searchQuery, selectedMatch]);

  useEffect(() => {
    const loadMatchPlayers = async () => {
      if (!selectedMatch?._id) return;
      try {
        const detail = await getMatchDetails(selectedMatch._id);
        // attempt to extract players from different possible shapes
        let matchPlayers = [];
        if (!detail) matchPlayers = [];
        else if (Array.isArray(detail.players)) matchPlayers = detail.players;
        else if (Array.isArray(detail.squad)) matchPlayers = detail.squad;
        else if (detail.team1?.players || detail.team2?.players) {
          matchPlayers = [...(detail.team1?.players || []), ...(detail.team2?.players || [])];
        } else if (Array.isArray(detail.squads)) {
          matchPlayers = detail.squads.flatMap(s => Array.isArray(s.players) ? s.players : []);
        } else if (typeof detail === 'object') {
          // collect any array-valued props
          Object.values(detail).forEach(v => {
            if (Array.isArray(v)) matchPlayers.push(...v);
          });
        }

        // normalize minimal player fields
        matchPlayers = matchPlayers.map(p => (p && typeof p === 'object') ? p : { name: String(p) });
        setAvailablePlayers(matchPlayers);
        setPlayers(matchPlayers.slice(0, 12));
      } catch (err) {
        console.error('Error fetching match details:', err);
        setAvailablePlayers([]);
        setPlayers([]);
      }
    };
    loadMatchPlayers();
  }, [selectedMatch]);

  const fetchMatches = async () => {
    try {
      const data = await getMatches(matchType);
      setMatches((data || []).slice(0, 5)); // Top 5 matches
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  const fetchPlayers = async () => {
    try {
      if (selectedMatch) {
        const q = searchQuery.trim().toLowerCase();
        const filtered = availablePlayers.filter(p => {
          const name = (p.name || p.fullName || p.shortName || '').toString().toLowerCase();
          return name.includes(q);
        });
        setPlayers(filtered.slice(0, 12));
      } else {
        const data = await searchPlayers(searchQuery);
        setPlayers(data);
      }
    } catch (err) {
      console.error("Error searching players:", err);
    }
  };

  const addToTeam = (player) => {
    if (!player) return;
    // prevent duplicate players
    if (team.some(p => p && ((p._id && player._id && p._id === player._id) || (p.name && player.name && p.name === player.name)))) return;
    const firstEmpty = team.findIndex(p => !p);
    if (firstEmpty === -1) return; // team full
    const newTeam = [...team];
    newTeam[firstEmpty] = player;
    setTeam(newTeam);
  };

  const removeFromTeam = (position) => {
    const newTeam = [...team];
    newTeam[position - 1] = null;
    setTeam(newTeam);
  };

  const handleSubmit = async () => {
    if (team.filter(Boolean).length !== 11 || !captain || !viceCaptain) {
      alert("Select 11 players with Captain and Vice-Captain");
      return;
    }

    try {
      setLoading(true);
      const teamData = {
        matchId: selectedMatch._id,
        players: team.map(p => p._id),
        captainId: captain._id,
        viceCaptainId: viceCaptain._id,
        name: `Team for ${selectedMatch?.team1?.shortName || selectedMatch?.team1?.name || selectedMatch?.team1} vs ${selectedMatch?.team2?.shortName || selectedMatch?.team2?.name || selectedMatch?.team2}`
      };

      await createTeam(teamData);
      alert("Team created successfully!");
      navigate("/my-teams");
    } catch (err) {
      console.error("Error creating team:", err);
      alert("Error creating team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-gray-50 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="h4 mb-0 fw-bold text-gray-900">Create New Team</h2>
                  <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    ← Back
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                <MatchSelector
                  matches={matches}
                  matchType={matchType}
                  setMatchType={setMatchType}
                  selectedMatch={selectedMatch}
                  onSelectMatch={setSelectedMatch}
                />

                <PlayerSearchList
                  players={players}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onAddPlayer={addToTeam}
                />

                <TeamLineup
                  team={team}
                  captain={captain}
                  viceCaptain={viceCaptain}
                  onRemove={removeFromTeam}
                  onSetCaptain={(index) => setCaptain(team[index] || null)}
                  onSetViceCaptain={(index) => setViceCaptain(team[index] || null)}
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTeam;
