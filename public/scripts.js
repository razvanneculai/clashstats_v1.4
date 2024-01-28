// public/scripts.js

async function fetchPlayerInfo() {
    const playerTag = document.getElementById('playerTagInput').value;
  
    try {
      const response = await fetch('/getPlayerInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerTag: playerTag }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Update player name
        document.getElementById('playerName').innerText = `Player Name: ${data.playerName}`;
  
        // Display player deck with images
        const deckContainer = document.getElementById('deck');
        deckContainer.innerHTML = '<h3>Deck:</h3>';
        data.playerDeck.forEach(card => {
          const cardImage = document.createElement('img');
          cardImage.src = `images/${card.name}.png`;  // Assuming images are stored in the 'images' folder
          cardImage.alt = card.name;
          cardImage.title = `${card.name} (Level ${card.level}/${card.maxLevel})`;
          cardImage.classList.add('card-image');
          deckContainer.appendChild(cardImage);
        });
      } else {
        const errorData = await response.json();
        document.getElementById('result').innerText = `Error: ${errorData.error}`;
      }
    } catch (error) {
      console.error('Error fetching player information:', error);
      document.getElementById('result').innerText = 'Error fetching player information. Check the console for details.';
    }
  }
  
  async function fetchClanInfo() {
    const clanName = document.getElementById('clanNameInput').value;
  
    try {
      const response = await fetch('/getClanInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clanName: clanName }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Display clan participation
        const playersContainer = document.getElementById('players');
        playersContainer.innerHTML = '<h3>Clan Members:</h3>';
        data.players.forEach(player => {
          const playerInfo = document.createElement('p');
          playerInfo.innerText = `${player.name}: ${player.status}`;
          playersContainer.appendChild(playerInfo);
        });
      } else {
        const errorData = await response.json();
        document.getElementById('clanResult').innerText = `Error: ${errorData.error}`;
      }
    } catch (error) {
      console.error('Error fetching clan information:', error);
      document.getElementById('clanResult').innerText = 'Error fetching clan information. Check the console for details.';
    }
  }
  