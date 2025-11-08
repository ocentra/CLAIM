import React, { useEffect, useRef } from "react";
import "./PlayerAvatar.css";

interface PlayerAvatarProps {
  size?: number;
  imageUrl?: string;
  outerGlowColor?: string;
  rimColor?: string;
  arcColor?: string;
  showArc?: boolean;
  arcAngle?: number; // degrees of arc, 180 for top half
  arcOffset?: number; // shift arc rotation
  name?: string;
  showNamePlate?: boolean;
}

const DEFAULTS = {
  SIZE: 160,
  OUTER_GLOW_COLOR: "rgba(0, 190, 255, 0.8)",
  RIM_COLOR: "rgba(255, 204, 60, 0.95)",
  ARC_COLOR: "rgba(0, 255, 255, 0.9)",
  ARC_ANGLE: 140,
  ARC_OFFSET: -10,
};

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  size = DEFAULTS.SIZE,
  imageUrl,
  outerGlowColor = DEFAULTS.OUTER_GLOW_COLOR,
  rimColor = DEFAULTS.RIM_COLOR,
  arcColor = DEFAULTS.ARC_COLOR,
  showArc = true,
  arcAngle = DEFAULTS.ARC_ANGLE,
  arcOffset = DEFAULTS.ARC_OFFSET,
  name,
  showNamePlate = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.style.setProperty("--size", `${size}px`);
    node.style.setProperty("--outer-glow", outerGlowColor);
    node.style.setProperty("--rim-color", rimColor);
    node.style.setProperty("--arc-color", arcColor);
    node.style.setProperty("--arc-angle", `${arcAngle}deg`);
    node.style.setProperty("--arc-offset", `${arcOffset}deg`);
  }, [size, outerGlowColor, rimColor, arcColor, arcAngle, arcOffset]);

  return (
    <div ref={ref} className="avatar">
      {showArc && <div className="avatar__arc"></div>}
      <div className="avatar__outer-glow">
        <div className="avatar__rim">
          <div className="avatar__image">
            {imageUrl && <img src={imageUrl} alt="avatar" />}
          </div>
        </div>
      </div>
      {showNamePlate && (
        <div className="avatar__nameplate">
          <span>{name ?? "Player"}</span>
        </div>
      )}
    </div>
  );
};

export default PlayerAvatar;
