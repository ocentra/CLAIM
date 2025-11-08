import React from "react";
import PlayerAvatar from "./PlayerAvatar";
import "./PlayerSeat.css";

export type PlayerSeatPosition = "top" | "bottom" | "left" | "right";

interface PlayerSeatProps {
  name?: string;
  imageUrl?: string;
  size?: number;
  position?: PlayerSeatPosition;
}

const DEFAULT_NAME = "Player";

const PlayerSeat: React.FC<PlayerSeatProps> = ({
  name = DEFAULT_NAME,
  imageUrl,
  size,
  position = "bottom",
}) => {
  return (
    <div className={`player-seat player-seat--${position}`}>
      <PlayerAvatar
        size={size}
        imageUrl={imageUrl}
        name={name}
        showNamePlate
      />
    </div>
  );
};

export default PlayerSeat;

