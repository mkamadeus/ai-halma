import React, { useCallback } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type Pawn from "../models/Pawn";

const tileVariants = cva(
  "flex items-center justify-center rounded-md transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-tile-default hover:bg-tile-default/80",
        selected: "bg-tile-selected hover:bg-tile-selected/90",
        lastMove: "bg-tile-last-move hover:bg-tile-last-move/90",
        blueZone: "bg-tile-blue-zone hover:bg-tile-blue-zone/80",
        orangeZone: "bg-tile-orange-zone hover:bg-tile-orange-zone/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type TileVariant = NonNullable<VariantProps<typeof tileVariants>["variant"]>;

interface TileProps {
  row: number;
  col: number;
  cellWidth: number;
  backgroundColor?: string;
  variant?: TileVariant;
  pawn: Pawn | null;
  isSelected: boolean;
  isMoveTarget: boolean;
  disabled?: boolean;
  onClick: (row: number, col: number) => void;
}

const pawnOwnerLabel = (owner: number): string =>
  owner === 1 ? "Blue" : "Orange";

const buildAriaLabel = (
  row: number,
  col: number,
  pawn: Pawn | null,
  isSelected: boolean,
  isMoveTarget: boolean,
): string => {
  const parts = [`Row ${row + 1}, Column ${col + 1}`];
  if (pawn) {
    parts.push(`${pawnOwnerLabel(pawn.owner)} pawn`);
  }
  if (isSelected) parts.push("selected");
  if (isMoveTarget) parts.push("valid move target");
  if (!pawn && !isMoveTarget) parts.push("empty");
  return parts.join(", ");
};

const Tile = React.memo<TileProps>(
  ({
    row,
    col,
    cellWidth,
    variant = "default",
    pawn,
    isSelected,
    isMoveTarget,
    disabled = false,
    onClick,
  }) => {
    const handleClick = useCallback(() => {
      onClick(row, col);
    }, [onClick, row, col]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(row, col);
        }
      },
      [onClick, row, col],
    );

    const ariaLabel = buildAriaLabel(row, col, pawn, isSelected, isMoveTarget);

    return (
      <div
        className="relative"
        style={{
          width: `${cellWidth}%`,
          paddingBottom: `${cellWidth}%`,
        }}
      >
        <button
          type="button"
          role="gridcell"
          aria-label={ariaLabel}
          aria-selected={isSelected}
          aria-disabled={disabled}
          disabled={disabled}
          tabIndex={0}
          className={cn(tileVariants({ variant }), "absolute inset-0 m-auto")}
          style={{ width: "87%", height: "87%" }}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          {pawn && (
            <div
              className={cn(
                "rounded-full absolute shadow-md transition-all duration-200",
                "shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.15)]",
                pawn.owner === 1 ? "bg-pawn-blue" : "bg-pawn-orange",
                isSelected && "scale-110 ring-2 ring-ring ring-offset-1",
              )}
              style={{ width: "65%", height: "65%" }}
            />
          )}

          {isMoveTarget && (
            <div
              className="rounded-full absolute animate-pulse bg-tile-move-target/70"
              style={{ width: "30%", height: "30%" }}
            />
          )}
        </button>
      </div>
    );
  },
  (prev, next) =>
    prev.cellWidth === next.cellWidth &&
    prev.variant === next.variant &&
    prev.isSelected === next.isSelected &&
    prev.isMoveTarget === next.isMoveTarget &&
    prev.disabled === next.disabled &&
    prev.onClick === next.onClick &&
    prev.pawn === next.pawn &&
    prev.row === next.row &&
    prev.col === next.col,
);

export default Tile;
export type { TileProps, TileVariant };
