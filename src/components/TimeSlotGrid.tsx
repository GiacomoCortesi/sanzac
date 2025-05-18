import React from "react";
import type { TimeSlot } from "../types";

type Props = {
  slots: TimeSlot[];
  selectedSlots: TimeSlot[];
  onToggleSlot: (slot: TimeSlot) => void;
  date: Date;
};

const statusColors = {
  available:
    "bg-tertiary-300 text-tertiary-800 hover:bg-tertiary-100 cursor-pointer",
  booked: "bg-red-100 text-red-800 cursor-not-allowed opacity-60",
  unavailable: "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50",
  selected: "bg-tertiary-600 hover:bg-tertiary-700 cursor-pointer",
};

const isPastSlot = (date: Date, time: string) => {
  const now = new Date();
  const slotDateTime = new Date(date);
  const [hour, minute] = time.split(":").map(Number);
  slotDateTime.setHours(hour, minute, 0, 0);

  return slotDateTime < now;
};

const TimeSlotGrid: React.FC<Props> = ({
  slots,
  selectedSlots,
  onToggleSlot,
  date,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {slots.map((slot, idx) => {
        const past = isPastSlot(date, slot.startTime);

        const isSelected = selectedSlots.some(
          (selectedSlot) => selectedSlot.startTime === slot.startTime
        );
        const isClickable = slot.status === "available" && !past;

        const statusClass = isSelected
          ? statusColors.selected
          : past
          ? statusColors.unavailable
          : slot.status === "available"
          ? statusColors.available
          : statusColors.unavailable;

        return (
          <div
            key={idx}
            onClick={() => isClickable && onToggleSlot(slot)}
            className={`flex-col justify-center items-center py-2 px-3 rounded-lg text-center shadow-sm transition min-h-20 ${statusClass}`}
          >
            <p className="text-lg md:text-xl">
              {slot.startTime} - {slot.endTime}
            </p>
            {slot.status === "booked" && slot.reservedBy && (
              <p className="text-lg text-red-700 mt-1 italic">
                {slot.reservedBy}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlotGrid;
