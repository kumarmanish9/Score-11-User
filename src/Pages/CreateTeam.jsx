import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../Services/teamService";
import { getMatches, getMatchDetails } from "../Services/matchService";
import { searchPlayers } from "../Services/playerService";

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

  // ✅ Normalize Player (FIXED)
  const normalizePlayer = (p) => {
    if (!p || typeof p !== "object") {
      return { name: "Unknown Player" };
    }

    const name =
      p.name ||
      p.fullName ||
      p.playerName ||
      p.shortName ||
      p.short_name ||
      p.displayName ||
      (p.player && (p.player.name || p.player.fullName)) ||
      "Unknown Player"; // ❗ FIXED (no _id fallback)

    return { ...p, name };
  };

  // ✅ Fetch Matches
  useEffect(() => {
    fetchMatches();
  }, [matchType]);

  const fetchMatches = async () => {
    try {
      const data = await getMatches(matchType);
      setMatches((data || []).slice(0, 5));
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  // ✅ Load Match Players
  useEffect(() => {
    const loadMatchPlayers = async () => {
      if (!selectedMatch?._id) return;

      try {
        const detail = await getMatchDetails(selectedMatch._id);

        let matchPlayers = [];

        if (Array.isArray(detail?.players)) {
          matchPlayers = detail.players;
        } else if (Array.isArray(detail?.squad)) {
          matchPlayers = detail.squad;
        } else if (detail?.team1?.players || detail?.team2?.players) {
          matchPlayers = [
            ...(detail.team1?.players || []),
            ...(detail.team2?.players || []),
          ];
        } else if (Array.isArray(detail?.squads)) {
          matchPlayers = detail.squads.flatMap((s) =>
            Array.isArray(s.players) ? s.players : []
          );
        }

        // ✅ Normalize players
        matchPlayers = matchPlayers.map(normalizePlayer);

        setAvailablePlayers(matchPlayers);
        setPlayers(matchPlayers.slice(0, 12));
      } catch (err) {
        console.error("Error fetching match details:", err);
        setAvailablePlayers([]);
        setPlayers([]);
      }
    };

    loadMatchPlayers();
  }, [selectedMatch]);

  // ✅ Search Players
  useEffect(() => {
    fetchPlayers();
  }, [searchQuery, selectedMatch]);

  const fetchPlayers = async () => {
  try {
    const query = searchQuery.trim().toLowerCase();

    // ❌ Empty query
    if (!query) {
      if (selectedMatch) {
        setPlayers(availablePlayers.slice(0, 24));
      } else {
        setPlayers([]);
      }
      return;
    }

    // ❌ Too short
    if (query.length < 2) {
      setPlayers([]);
      return;
    }

    // ✅ Valid search
    const apiData = await searchPlayers(query);
    const normalizedAPI = (apiData || []).map(normalizePlayer);

    if (selectedMatch) {
      const localFiltered = availablePlayers.filter((p) =>
        (p.name || "").toLowerCase().includes(query)
      );

      const combined = [...localFiltered, ...normalizedAPI];

      const unique = [];
      const seen = new Set();

      for (let p of combined) {
        const key = p._id || p.name;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(p);
        }
      }

      setPlayers(unique.slice(0, 24));
    } else {
      setPlayers(normalizedAPI);
    }

  } catch (err) {
    console.error("Error searching players:", err);
  }
};

  // ✅ Add Player to Team (FIXED DUPLICATE CHECK)
  const addToTeam = (player) => {
    if (!player) return;
    console.log('addToTeam called with player:', player);
    console.log('current team state:', team);

    // Only treat as duplicate when we can compare a real id or a real name
    if (player._id) {
      if (team.some((p) => p && p._id && p._id === player._id)) {
        console.log('duplicate by _id, skipping');
        return;
      }
    } else {
      const playerName = player.name || player.playerName || player.fullName || player.displayName || player.shortName || player.short_name || null;
      if (playerName && team.some((p) => p && (p.name === playerName || p.playerName === playerName))) {
        console.log('duplicate by name, skipping');
        return;
      }
    }

    const firstEmpty = team.findIndex((p) => !p);
    if (firstEmpty === -1) return;

    const newTeam = [...team];
    newTeam[firstEmpty] = player;
    console.log('adding player at slot', firstEmpty, player);
    setTeam(newTeam);
    console.log('new team state:', newTeam);
  };

  // ✅ Remove Player
  const removeFromTeam = (position) => {
    const newTeam = [...team];
    newTeam[position - 1] = null;
    setTeam(newTeam);
  };

// ✅ Submit Team (FULL FIXED VERSION)
const handleSubmit = async () => {
  try {
    // 🔍 Validate players
    const validPlayers = team.filter((p) => p && p._id);

    if (validPlayers.length !== 11) {
      alert("Please select exactly 11 valid players");
      return;
    }

    // 🔍 Validate captain
    if (!captain || !captain._id) {
      alert("Please select a valid Captain");
      return;
    }

    // 🔍 Validate vice captain
    if (!viceCaptain || !viceCaptain._id) {
      alert("Please select a valid Vice Captain");
      return;
    }

    // 🔍 Prevent same captain & vice-captain
    if (captain._id === viceCaptain._id) {
      alert("Captain and Vice-Captain cannot be the same");
      return;
    }

    // 🔍 Validate match
    if (!selectedMatch || !selectedMatch._id) {
      alert("Please select a match");
      return;
    }

    setLoading(true);

    // ✅ Prepare clean payload
    const teamData = {
      matchId: selectedMatch._id,
      players: validPlayers.map((p) => p._id),
      captainId: captain._id,
      viceCaptainId: viceCaptain._id,
      name: `Team for ${
        selectedMatch?.team1?.shortName ||
        selectedMatch?.team1?.name ||
        selectedMatch?.team1 ||
        "Team A"
      } vs ${
        selectedMatch?.team2?.shortName ||
        selectedMatch?.team2?.name ||
        selectedMatch?.team2 ||
        "Team B"
      }`,
    };

    // 🔥 DEBUG (VERY IMPORTANT)
    console.log("🚀 FINAL TEAM DATA:", teamData);

    // ❗ API CALL
    const response = await createTeam(teamData);

    console.log("✅ Team created response:", response);

    alert("Team created successfully!");
    navigate("/my-teams");

  } catch (err) {
    console.error("❌ Error creating team:", err?.response?.data || err);

    // 🔥 Show backend error message if available
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "Error creating team";

    alert(message);
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
                  <h2 className="h4 mb-0 fw-bold text-gray-900">
                    Create New Team
                  </h2>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
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
                  onSetViceCaptain={(index) =>
                    setViceCaptain(team[index] || null)
                  }
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