import React from "react";
import PlayerSeat from "./PlayerSeat";
import "./PlayersOnTable.css";

const PlayersOnTable: React.FC = () => {
  return (
    <div className="players-on-table">
      <PlayerSeat name="You" position="bottom" />
    </div>
  );
};

export default PlayersOnTable;

