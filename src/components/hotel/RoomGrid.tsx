"use client";

import { useHotel } from "@/lib/hotel-store";
import type { Room, RoomStatus, RoomType } from "@/lib/hotel-types";
import { z } from "zod";
import { Sparkles } from "lucide-react";

// Schema for Tambo component registration
export const RoomGridPropsSchema = z.object({
  rooms: z
    .array(
      z.object({
        id: z.string(),
        number: z.number(),
        type: z.enum(["King", "Queen", "Suite"]),
        features: z.array(z.string()),
        status: z.enum([
          "available",
          "occupied",
          "dirty",
          "clean",
          "out_of_order",
        ]),
        floor: z.number(),
        rate: z.number(),
      }),
    )
    .optional()
    .describe("Rooms to display. If not provided, shows all rooms from state."),
  highlightedRooms: z
    .array(z.number())
    .optional()
    .describe("Room numbers to highlight"),
  filter: z
    .object({
      type: z.enum(["King", "Queen", "Suite"]).optional(),
      status: z
        .enum(["available", "occupied", "dirty", "clean", "out_of_order"])
        .optional(),
      features: z.array(z.string()).optional(),
    })
    .optional()
    .describe("Filter criteria for rooms"),
  compact: z
    .boolean()
    .optional()
    .describe("Show compact view for chat embedding"),
  onRoomSelect: z.function().args(z.number()).returns(z.void()).optional(),
  onEditWithAI: z
    .function()
    .args(
      z.object({
        roomNumber: z.number(),
        roomType: z.string(),
        status: z.string(),
        features: z.array(z.string()),
      }),
    )
    .returns(z.void())
    .optional()
    .describe("Callback when Edit with AI button is clicked"),
});

export type RoomGridProps = z.infer<typeof RoomGridPropsSchema>;

const statusColors: Record<RoomStatus, { bg: string; dot: string }> = {
  available: {
    bg: "bg-success/10 border-success/20 hover:bg-success/15 hover:border-success/30",
    dot: "bg-success",
  },
  occupied: {
    bg: "bg-info/10 border-info/20 hover:bg-info/15 hover:border-info/30",
    dot: "bg-info",
  },
  dirty: {
    bg: "bg-warning/10 border-warning/20 hover:bg-warning/15 hover:border-warning/30",
    dot: "bg-warning",
  },
  clean: {
    bg: "bg-success/10 border-success/20 hover:bg-success/15 hover:border-success/30",
    dot: "bg-success/70",
  },
  out_of_order: {
    bg: "bg-destructive/10 border-destructive/20 hover:bg-destructive/15 hover:border-destructive/30",
    dot: "bg-destructive",
  },
};

const statusLabels: Record<RoomStatus, string> = {
  available: "Available",
  occupied: "Occupied",
  dirty: "Dirty",
  clean: "Clean",
  out_of_order: "Out of Order",
};

const typeIcons: Record<RoomType, string> = {
  King: "K",
  Queen: "Q",
  Suite: "S",
};

function RoomCard({
  room,
  isHighlighted,
  isSelected,
  onClick,
  onEditWithAI,
  compact,
}: {
  room: Room;
  isHighlighted: boolean;
  isSelected: boolean;
  onClick: () => void;
  onEditWithAI?: (context: {
    roomNumber: number;
    roomType: string;
    status: string;
    features: string[];
  }) => void;
  compact?: boolean;
}) {
  const handleAIClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditWithAI) {
      onEditWithAI({
        roomNumber: room.number,
        roomType: room.type,
        status: room.status,
        features: room.features,
      });
    }
  };

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`
          relative flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium transition-all
          ${statusColors[room.status].bg}
          ${isHighlighted ? "ring-2 ring-accent ring-offset-1 ring-offset-background" : ""}
          ${isSelected ? "ring-2 ring-foreground/50" : ""}
        `}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusColors[room.status].dot}`}
        />
        <span className="font-medium text-foreground">{room.number}</span>
        <span className="text-xs text-muted-foreground">
          {typeIcons[room.type]}
        </span>
      </button>
    );
  }

  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className={`
          flex h-full w-full flex-col rounded-lg border p-3 text-left transition-all
          ${statusColors[room.status].bg}
          ${isHighlighted ? "ring-2 ring-accent ring-offset-1 ring-offset-background" : ""}
          ${isSelected ? "ring-2 ring-foreground/50" : ""}
        `}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${statusColors[room.status].dot}`}
            />
            <span className="text-base font-semibold tracking-tight text-foreground">
              {room.number}
            </span>
          </div>
          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {room.type}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          {statusLabels[room.status]}
        </div>
        <div className="mt-auto pt-2 text-xs font-medium text-foreground">
          ${room.rate}/night
        </div>
      </button>
      {/* Edit with AI button - appears on hover */}
      {onEditWithAI && (
        <button
          onClick={handleAIClick}
          className="absolute -right-1.5 -top-1.5 z-10 rounded-full bg-accent p-1.5 opacity-0 shadow-md transition-opacity hover:opacity-100 group-hover:opacity-100 focus-ring"
          title="Edit with AI"
        >
          <Sparkles className="h-3 w-3 text-accent-foreground" />
        </button>
      )}
    </div>
  );
}

export function RoomGrid({
  rooms,
  highlightedRooms,
  filter,
  compact,
  onRoomSelect,
  onEditWithAI,
}: RoomGridProps) {
  const hotelContext = useHotel();
  const state = hotelContext?.state;
  const selectRoom = hotelContext?.selectRoom;

  // Use provided rooms or get from state (with fallback to empty array)
  let displayRooms = rooms || state?.rooms || [];

  // If no rooms provided and no state, show empty state
  if (displayRooms.length === 0 && !rooms) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
        <p className="text-sm text-muted-foreground">No room data available</p>
      </div>
    );
  }

  // Apply filter
  if (filter) {
    displayRooms = displayRooms.filter((room) => {
      if (filter.type && room.type !== filter.type) return false;
      if (filter.status && room.status !== filter.status) return false;
      if (filter.features && filter.features.length > 0) {
        if (!filter.features.every((f) => room.features.includes(f)))
          return false;
      }
      return true;
    });
  }

  // Use provided highlights or state highlights (with fallback to empty array)
  const highlighted = highlightedRooms || state?.highlightedRoomNumbers || [];

  // Group rooms by floor
  const roomsByFloor = displayRooms.reduce(
    (acc, room) => {
      const floor = room.floor;
      if (!acc[floor]) acc[floor] = [];
      acc[floor].push(room);
      return acc;
    },
    {} as Record<number, Room[]>,
  );

  const floors = Object.keys(roomsByFloor)
    .map(Number)
    .sort((a, b) => b - a); // Descending order

  const handleRoomClick = (roomNumber: number) => {
    if (onRoomSelect) {
      onRoomSelect(roomNumber);
    } else if (selectRoom) {
      selectRoom(roomNumber);
    }
  };

  if (compact) {
    return (
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex flex-wrap gap-1.5">
          {displayRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isHighlighted={highlighted.includes(room.number)}
              isSelected={state?.selectedRoomNumber === room.number}
              onClick={() => handleRoomClick(room.number)}
              compact
            />
          ))}
        </div>
        {displayRooms.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No rooms match the criteria
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 border-b border-border pb-4">
        {Object.entries(statusLabels).map(([status, label]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${statusColors[status as RoomStatus].dot}`}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Room Grid by Floor */}
      <div className="space-y-6">
        {floors.map((floor) => (
          <div key={floor}>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Floor {floor}
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {(roomsByFloor[floor] || [])
                .sort((a, b) => a.number - b.number)
                .map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    isHighlighted={highlighted.includes(room.number)}
                    isSelected={state?.selectedRoomNumber === room.number}
                    onClick={() => handleRoomClick(room.number)}
                    onEditWithAI={onEditWithAI}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {displayRooms.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          No rooms match the criteria
        </p>
      )}

      {/* Summary */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-4 text-xs text-muted-foreground">
        <span>Total: {displayRooms.length} rooms</span>
        <span className="text-success">
          Available:{" "}
          {
            displayRooms.filter(
              (r) => r.status === "available" || r.status === "clean",
            ).length
          }
        </span>
        <span className="text-info">
          Occupied: {displayRooms.filter((r) => r.status === "occupied").length}
        </span>
      </div>
    </div>
  );
}
