const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Replace with your Clash Royale API key
const CLASH_ROYALE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjNlZjVjN2E5LTRlZTctNDVlZC04NDJhLTQ4OTdhZDkyMGYxOCIsImlhdCI6MTcwNjQ0NjQwMywic3ViIjoiZGV2ZWxvcGVyLzdhZWQzMDMxLTg3MDYtMGY3Ni0wYjJmLWFjYWI5YTNmMGVhYyIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxODguMjQuMjEwLjE4NiIsIjMuNzUuMTU4LjE2MyIsIjMuMTI1LjE4My4xNDAiLCIzNS4xNTcuMTE3LjI4Il0sInR5cGUiOiJjbGllbnQifV19.pjbvLzey90lD6ArUifQds3bEIXrv30LTFM1hclSSY9ucDAQCTpCDZ5OqINc6ZUbJGhMz6-GlgnZjECdALosCYg';
app.post('/getPlayerInfo', async (req, res) => {
  const playerTag = req.body.playerTag;

  try {
    // Make a request to the official Clash Royale API to get player information
    const playerResponse = await axios.get(`https://api.clashroyale.com/v1/players/${encodeURIComponent(playerTag)}`, {
      headers: {
        'Authorization': `Bearer ${CLASH_ROYALE_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    // Extract relevant player information
    const playerName = playerResponse.data.name;
    const trophies = playerResponse.data.trophies;
    const arena = playerResponse.data.arena.name;
    const expLevel = playerResponse.data.expLevel; // Change 'wins' to 'expLevel'
    const wins = playerResponse.data.wins;
    const battle = playerResponse.data.battleCount;
    const playerDeck = playerResponse.data.currentDeck.map(card => {
      return {
        name: card.name,
        id: card.id,
        level: card.level,
        maxLevel: card.maxLevel,
      };
    });

    // Send back player information including the deck, trophies, and arena
    res.json({
      playerName: playerName,
      trophies: trophies,
      arena: arena,
      playerDeck: playerDeck,
      expLevel: expLevel, // Change 'wins' to 'expLevel'
      wins: wins,
      battle: battle,
    });
  } catch (error) {
    console.error('Error from Clash Royale API:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : 'Internal Server Error',
    });
  }
});


app.post('/getClanInfo', async (req, res) => {
  const clanTag = req.body.clanTag;

  try {
    // Make a request to the official Clash Royale API to get clan information
    const clanResponse = await axios.get(`https://api.clashroyale.com/v1/clans/${encodeURIComponent(clanTag)}`, {
      headers: {
        'Authorization': `Bearer ${CLASH_ROYALE_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    // Extract relevant clan information
    const clanName = clanResponse.data.name;
    const clanMembers = clanResponse.data.memberList.map(member => {
      return {
        name: member.name,
        tag: member.tag,
        role: member.role,
      };
    });

    // Send back clan information including the member list
    res.json({
      clanName: clanName,
      clanMembers: clanMembers,
    });
  } catch (error) {
    console.error('Error from Clash Royale API (getClanInfo):', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : 'Internal Server Error',
    });
  }
});


app.post('/getPlayerUpcomingChests', async (req, res) => {
  const playerTag = req.body.playerTag;

  try {
    // Make a request to the official Clash Royale API to get player's upcoming chests
    const upcomingChestsResponse = await axios.get(`https://api.clashroyale.com/v1/players/${encodeURIComponent(playerTag)}/upcomingchests`, {
      headers: {
        'Authorization': `Bearer ${CLASH_ROYALE_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    // Extract relevant information
    const upcomingChests = upcomingChestsResponse.data.items

    // Send back upcoming chests information
    res.json({
      upcomingChests: upcomingChests,
    });
  } catch (error) {
    console.error('Error from Clash Royale API:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : 'Internal Server Error',
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/clan', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clan.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chests.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
