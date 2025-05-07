import React from "react";
import type { TimeSlot } from "../types";

type Props = {
  slots: TimeSlot[];
  selectedTimes: string[];
  onToggleSlot: (slot: TimeSlot) => void;
};

const statusColors = {
  available: "bg-tertiary-100 text-green-800 hover:bg-green-200 cursor-pointer",
  booked: "bg-red-100 text-red-800 cursor-not-allowed opacity-60",
  unavailable: "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50",
  selected: "bg-tertiary-600 hover:bg-tertiary-700 cursor-pointer",
};

const formatTimeRange = (start: string) => {
  const [hour, minute] = start.split(":").map(Number);
  const endHour = (hour + 1).toString().padStart(2, "0");
  return `${start} - ${endHour}:${minute.toString().padStart(2, "0")}`;
};

const TimeSlotGrid: React.FC<Props> = ({
  slots,
  selectedTimes,
  onToggleSlot,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
      {slots.map((slot, idx) => {
        const isSelected = selectedTimes.includes(slot.time);
        const statusClass =
          slot.status === "available" && isSelected
            ? statusColors.selected
            : statusColors[slot.status];

        return (
          <div
            key={idx}
            onClick={() => slot.status === "available" && onToggleSlot(slot)}
            className={`py-2 px-3 rounded-lg text-center shadow-sm transition ${statusClass}`}
          >
            <div>{formatTimeRange(slot.time)}</div>
            {slot.status === "booked" && slot.reservedBy && (
              <div className="text-xs text-red-700 mt-1 italic">
                {slot.reservedBy}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlotGrid;
