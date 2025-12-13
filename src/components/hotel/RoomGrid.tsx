"use client";

import { useHotel } from "@/lib/hotel-store";
import type { Room, RoomStatus, RoomType } from "@/lib/hotel-types";
import { z } from "zod";
import { Sparkles } from "lucide-react";

// Schema for Tambo component registration
export const RoomGridPropsSchema = z.object({
  rooms: z.array(z.object({
    id: z.string(),
    number: z.number(),
    type: z.enum(["King", "Queen", "Suite"]),
    features: z.array(z.string()),
    status: z.enum(["available", "occupied", "dirty", "clean", "out_of_order"]),
    floor: z.number(),
    rate: z.number(),
  })).optional().describe("Rooms to display. If not provided, shows all rooms from state."),
  highlightedRooms: z.array(z.number()).optional().describe("Room numbers to highlight"),
  filter: z.object({
    type: z.enum(["King", "Queen", "Suite"]).optional(),
    status: z.enum(["available", "occupied", "dirty", "clean", "out_of_order"]).optional(),
    features: z.array(z.string()).optional(),
  }).optional().describe("Filter criteria for rooms"),
  compact: z.boolean().optional().describe("Show compact view for chat embedding"),
  onRoomSelect: z.function().args(z.number()).returns(z.void()).optional(),
  onEditWithAI: z.function().args(z.object({
    roomNumber: z.number(),
    roomType: z.string(),
    status: z.string(),
    features: z.array(z.string()),
  })).returns(z.void()).optional().describe("Callback when Edit with AI button is clicked"),
});

export type RoomGridProps = z.infer<typeof RoomGridPropsSchema>;

const statusColors: Record<RoomStatus, string> = {
  available: "bg-emerald-500 hover:bg-emerald-600",
  occupied: "bg-blue-500 hover:bg-blue-600",
  dirty: "bg-amber-500 hover:bg-amber-600",
  clean: "bg-emerald-400 hover:bg-emerald-500",
  out_of_order: "bg-red-500 hover:bg-red-600",
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
  onEditWithAI?: (context: { roomNumber: number; roomType: string; status: string; features: string[] }) => void;
  compact?: boolean;
}) {
  const hasFeatures = room.features.length > 0;

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
          relative p-2 rounded text-white text-sm font-medium transition-all
          ${statusColors[room.status]}
          ${isHighlighted ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900" : ""}
          ${isSelected ? "ring-2 ring-white" : ""}
        `}
      >
        <span className="font-bold">{room.number}</span>
        <span className="ml-1 text-xs opacity-75">{typeIcons[room.type]}</span>
      </button>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`
          relative p-3 rounded-lg text-white transition-all min-w-[100px]
          ${statusColors[room.status]}
          ${isHighlighted ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 scale-105" : ""}
          ${isSelected ? "ring-2 ring-white scale-105" : ""}
        `}
      >
        <div className="flex items-start justify-between">
          <span className="text-lg font-bold">{room.number}</span>
          <span className="text-xs px-1.5 py-0.5 bg-black/20 rounded">{room.type}</span>
        </div>
        <div className="mt-1 text-xs opacity-75">{statusLabels[room.status]}</div>
        {hasFeatures && (
          <div className="mt-1 flex flex-wrap gap-1">
            {room.features.slice(0, 2).map((f) => (
              <span key={f} className="text-[10px] px-1 bg-black/20 rounded">
                {f.replace("_", " ")}
              </span>
            ))}
            {room.features.length > 2 && (
              <span className="text-[10px] px-1 bg-black/20 rounded">
                +{room.features.length - 2}
              </span>
            )}
          </div>
        )}
        <div className="mt-1 text-xs font-medium">${room.rate}/night</div>
      </button>
      {/* Edit with AI button - appears on hover */}
      {onEditWithAI && (
        <button
          onClick={handleAIClick}
          className="absolute -top-2 -right-2 p-1.5 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Edit with AI"
        >
          <Sparkles className="w-3 h-3 text-white" />
        </button>
      )}
    </div>
  );
}

export function RoomGrid({ rooms, highlightedRooms, filter, compact, onRoomSelect, onEditWithAI }: RoomGridProps) {
  const hotelContext = useHotel();
  const state = hotelContext?.state;
  const selectRoom = hotelContext?.selectRoom;

  // Use provided rooms or get from state (with fallback to empty array)
  let displayRooms = rooms || state?.rooms || [];

  // If no rooms provided and no state, show empty state
  if (displayRooms.length === 0 && !rooms) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 text-slate-400">
        No room data available
      </div>
    );
  }

  // Apply filter
  if (filter) {
    displayRooms = displayRooms.filter((room) => {
      if (filter.type && room.type !== filter.type) return false;
      if (filter.status && room.status !== filter.status) return false;
      if (filter.features && filter.features.length > 0) {
        if (!filter.features.every((f) => room.features.includes(f))) return false;
      }
      return true;
    });
  }

  // Use provided highlights or state highlights (with fallback to empty array)
  const highlighted = highlightedRooms || state?.highlightedRoomNumbers || [];

  // Group rooms by floor
  const roomsByFloor = displayRooms.reduce((acc, room) => {
    const floor = room.floor;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

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
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="flex flex-wrap gap-2">
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
          <p className="text-slate-400 text-sm">No rooms match the criteria</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-lg p-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-slate-700">
        {Object.entries(statusLabels).map(([status, label]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${statusColors[status as RoomStatus]}`} />
            <span className="text-sm text-slate-300">{label}</span>
          </div>
        ))}
      </div>

      {/* Room Grid by Floor */}
      <div className="space-y-6">
        {floors.map((floor) => (
          <div key={floor}>
            <h3 className="text-sm font-medium text-slate-400 mb-2">Floor {floor}</h3>
            <div className="flex flex-wrap gap-3">
              {roomsByFloor[floor]
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
        <p className="text-slate-400 text-center py-8">No rooms match the criteria</p>
      )}

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-slate-700 flex gap-6 text-sm text-slate-400">
        <span>Total: {displayRooms.length} rooms</span>
        <span>
          Available: {displayRooms.filter((r) => r.status === "available" || r.status === "clean").length}
        </span>
        <span>Occupied: {displayRooms.filter((r) => r.status === "occupied").length}</span>
      </div>
    </div>
  );
}
