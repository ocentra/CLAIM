import React, { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import "./CenterTable.css";
import Mlogo from "../../../assets/Mlogo.png";

interface AnchorPoint {
  x: number;
  y: number;
  radius: number;
}

type EmblemStyle = "glass" | "hole";

interface CenterTableProps {
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
  zIndex?: number;
  anchorPoint?: AnchorPoint | null;
  followAnchor?: boolean;

  rimThickness?: number;
  rimColor?: string;
  rimGlowColor?: string;
  rimGlowSpread?: number;

  innerRimThickness?: number;
  innerRimColor?: string;
  innerRimTexture?: string;

  feltInnerColor?: string;
  feltOuterColor?: string;

  curvature?: number;
  emblemSize?: number;
  emblemInnerColor?: string;
  emblemOuterColor?: string;
  emblemBlendMode?: CSSProperties["mixBlendMode"];
  emblemStyle?: EmblemStyle;
}

/* 🎚️ Defaults */
const DEFAULTS = {
  WIDTH: 700,
  HEIGHT: 400,
  OFFSET_X: 0,
  OFFSET_Y: -80,
  Z_INDEX: 100,
  CURVATURE: 0.7,

  RIM_THICKNESS: 3,
  RIM_COLOR: "rgb(255, 187, 0)",
  RIM_GLOW_COLOR: "rgba(229, 255, 0, 0.31)",
  RIM_GLOW_SPREAD: 0.5,

  INNER_RIM_THICKNESS: 40,
  INNER_RIM_COLOR: "rgba(0, 40, 99, 0.46)",
  INNER_RIM_TEXTURE:
    "linear-gradient(145deg, rgb(0, 255, 255) 0%, rgb(12, 0, 54) 100%)",

  FELT_INNER_COLOR: "rgba(0, 170, 91, 0.19)",
  FELT_OUTER_COLOR: "rgba(0, 90, 50, 0.56)",

  EMBLEM_SIZE: 0.4,
  EMBLEM_INNER_COLOR: "rgb(0, 0, 0)",
  EMBLEM_OUTER_COLOR: "rgba(98, 255, 0, 0.74)",
  EMBLEM_STYLE: "glass" as EmblemStyle,
};

const RESPONSIVE_PADDING_X = 32;
const RESPONSIVE_PADDING_Y = 48;
const MIN_TABLE_SCALE = 0.35;
const MAX_TABLE_SCALE = 1;

const CenterTable: React.FC<CenterTableProps> = ({
  width = DEFAULTS.WIDTH,
  height = DEFAULTS.HEIGHT,
  offsetX = DEFAULTS.OFFSET_X,
  offsetY = DEFAULTS.OFFSET_Y,
  zIndex = DEFAULTS.Z_INDEX,
  anchorPoint = null,
  followAnchor = false,

  rimThickness = DEFAULTS.RIM_THICKNESS,
  rimColor = DEFAULTS.RIM_COLOR,
  rimGlowColor = DEFAULTS.RIM_GLOW_COLOR,
  rimGlowSpread = DEFAULTS.RIM_GLOW_SPREAD,
  innerRimThickness = DEFAULTS.INNER_RIM_THICKNESS,
  innerRimColor = DEFAULTS.INNER_RIM_COLOR,
  innerRimTexture = DEFAULTS.INNER_RIM_TEXTURE,
  feltInnerColor = DEFAULTS.FELT_INNER_COLOR,
  feltOuterColor = DEFAULTS.FELT_OUTER_COLOR,
  curvature = DEFAULTS.CURVATURE,
  emblemSize = DEFAULTS.EMBLEM_SIZE,
  emblemInnerColor = DEFAULTS.EMBLEM_INNER_COLOR,
  emblemOuterColor = DEFAULTS.EMBLEM_OUTER_COLOR,
  emblemBlendMode,
  emblemStyle = DEFAULTS.EMBLEM_STYLE,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const emblemImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.style.setProperty("--table-width", `${width}px`);
    node.style.setProperty("--table-height", `${height}px`);
    node.style.setProperty("--curvature", `${curvature}`);

    node.style.setProperty("--rim-thickness", `${rimThickness}px`);
    node.style.setProperty("--rim-color", rimColor);
    node.style.setProperty("--rim-glow-color", rimGlowColor);
    node.style.setProperty("--rim-glow-spread", `${rimGlowSpread}`);

    node.style.setProperty("--inner-rim-thickness", `${innerRimThickness}px`);
    node.style.setProperty("--inner-rim-color", innerRimColor);
    node.style.setProperty("--inner-rim-texture", innerRimTexture);

    node.style.setProperty("--felt-inner", feltInnerColor);
    node.style.setProperty("--felt-outer", feltOuterColor);

    const emblemDiameter = Math.min(width, height) * emblemSize;
    node.style.setProperty("--emblem-diameter", `${emblemDiameter}px`);
    node.style.setProperty("--emblem-inner-color", emblemInnerColor);
    node.style.setProperty("--emblem-outer-color", emblemOuterColor);
    const resolvedBlend =
      emblemBlendMode ?? (emblemStyle === "hole" ? "multiply" : "screen");
    node.style.setProperty("--emblem-blend-mode", resolvedBlend);

    node.style.zIndex = `${zIndex}`;
    if (followAnchor && anchorPoint) {
      node.style.left = `${anchorPoint.x + offsetX}px`;
      node.style.top = `${anchorPoint.y + offsetY}px`;
    } else {
      node.style.left = `calc(50% + ${offsetX}px)`;
      node.style.top = `calc(50% + ${offsetY}px)`;
    }

    const emblemImage = emblemImageRef.current;
    if (emblemImage) {
      emblemImage.style.width = "100%";
      emblemImage.style.height = "100%";
      emblemImage.style.objectFit = "cover";
      emblemImage.style.borderRadius = "50%";
      emblemImage.style.display = "block";
    }
  }, [
    width,
    height,
    offsetX,
    offsetY,
    zIndex,
    rimThickness,
    rimColor,
    rimGlowColor,
    rimGlowSpread,
    innerRimThickness,
    innerRimColor,
    innerRimTexture,
    feltInnerColor,
    feltOuterColor,
    curvature,
    emblemSize,
    emblemInnerColor,
    emblemOuterColor,
    emblemBlendMode,
    emblemStyle,
    followAnchor,
    anchorPoint,
  ]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const updateScale = () => {
      const viewportWidth =
        window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      const availableWidth =
        viewportWidth - RESPONSIVE_PADDING_X * 2;
      const availableHeight =
        viewportHeight - RESPONSIVE_PADDING_Y * 2;

      const safeAvailableWidth = Math.max(
        availableWidth,
        MIN_TABLE_SCALE * width
      );
      const safeAvailableHeight = Math.max(
        availableHeight,
        MIN_TABLE_SCALE * height
      );

      const rawScale = Math.min(
        safeAvailableWidth / width,
        safeAvailableHeight / height,
        MAX_TABLE_SCALE
      );
      const clampedScale = Math.max(
        MIN_TABLE_SCALE,
        Math.min(rawScale, MAX_TABLE_SCALE)
      );

      node.style.setProperty("--table-scale", clampedScale.toString());
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", updateScale);
    };
  }, [width, height]);

  return (
    <div ref={ref} className="center-table">
      <div className="center-table__outer-rim"></div>
      <div className="center-table__inner-rim"></div>
      <div className="center-table__surface">
        <div className="center-table__blur-layer"></div>
        <div className="center-table__felt-layer"></div>
        <div
          className={`center-table__emblem center-table__emblem--${emblemStyle}`}
        >
          <img
            src={Mlogo}
            alt="M logo emblem"
            ref={emblemImageRef}
          />
        </div>
      </div>
    </div>
  );
};

export default CenterTable;
