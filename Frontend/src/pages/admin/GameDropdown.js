import React from 'react';

const GameDropdown = ({ games, onSelectGame, selectedGameId }) => {
  const handleSelectGame = (e) => {
    const gameId = e.target.value;
    onSelectGame(gameId);
  };

  return (
    <select value={selectedGameId} onChange={handleSelectGame}>
      <option value="">Select a Game</option>
      {games.map((game) => (
        <option key={game.id} value={game.id}>
          {game.description} - {game.category}
        </option>
      ))}
    </select>
  );
};

export default GameDropdown;
