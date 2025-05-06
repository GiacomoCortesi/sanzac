import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TimeSlotGrid from "./TimeSlotGrid";
import { supabase } from "../lib/supabase";
import type { TimeSlot } from "../types";
import ReservationStatusDialog from "./ReservationStatusDialog";

const PRICE_PER_HOUR = 20;

const calculateTotalCost = (slots: string[]) => {
  return slots.length * PRICE_PER_HOUR;
};

const CalendarWithSlots: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [reservationName, setReservationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservationStatus, setReservationStatus] = useState({
    isOpen: false,
    success: false,
    bookedDate: "",
    bookedTimes: [] as string[],
  });

  const fetchReservations = async (date: Date) => {
    const isoDate = date.toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("date", isoDate);

    return error ? [] : data;
  };

  const generateSlots = async (date: Date) => {
    const existing = await fetchReservations(date);
    const hours = Array.from({ length: 15 }, (_, i) => i + 9);

    return hours.map((hour) => {
      const time = new Date(date);
      time.setHours(hour, 0, 0, 0);
      const label = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const match = existing.find((r) => r.time === label);
      const status: "available" | "booked" | "unavailable" =
        hour === 12 ? "unavailable" : match ? "booked" : "available";

      return {
        time: label,
        status,
        reservedBy: match?.name,
      };
    });
  };

  const handleToggleSlot = (slot: TimeSlot) => {
    setSelectedTimes((prev) =>
      prev.includes(slot.time)
        ? prev.filter((t) => t !== slot.time)
        : [...prev, slot.time]
    );
  };

  const handleSubmit = async () => {
    if (!reservationName || selectedTimes.length === 0) {
      setReservationStatus({
        isOpen: true,
        success: false,
        bookedDate: "",
        bookedTimes: [],
      });
      return;
    }

    setLoading(true);
    const isoDate = selectedDate.toISOString().split("T")[0];

    const payload = selectedTimes.map((time) => ({
      date: isoDate,
      time,
      name: reservationName,
    }));

    const { error } = await supabase.from("reservations").insert(payload);

    if (error) {
      setReservationStatus({
        isOpen: true,
        success: false,
        bookedDate: "",
        bookedTimes: [],
      });
    } else {
      setReservationStatus({
        isOpen: true,
        success: true,
        bookedDate: selectedDate?.toLocaleDateString() || "",
        bookedTimes: selectedTimes,
      });
      setSelectedTimes([]);
      setReservationName("");
      const updated = await generateSlots(selectedDate);
      setSlots(updated);
    }

    setLoading(false);
  };

  useEffect(() => {
    generateSlots(selectedDate).then(setSlots);
  }, [selectedDate]);

  return (
    <div className="p-6 rounded shadow-lg mx-auto">
      <div className="flex justify-center">
        <Calendar
          onChange={(date) => {
            setSelectedDate(date as Date);
            setSelectedTimes([]);
          }}
          value={selectedDate}
          className="REACT-CALENDAR"
        />
      </div>

      <h3 className="mt-6 text-lg font-semibold">
        Slot disponibili il {selectedDate.toDateString()}
      </h3>

      <TimeSlotGrid
        slots={slots}
        selectedTimes={selectedTimes}
        onToggleSlot={handleToggleSlot}
      />

      <div className="mt-6 space-y-3">
        <input
          type="text"
          placeholder="Chi sei?"
          value={reservationName}
          onChange={(e) => setReservationName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        {selectedTimes.length > 0 && (
          <div className="text-md font-medium">
            Costo stimato:{" "}
            <span className="font-semibold text-secondary-700">
              €{calculateTotalCost(selectedTimes)}
            </span>
          </div>
        )}
        <div className="flex justify-center">
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="btn btn-lg variant-filled"
          >
            Prenota
          </button>
        </div>
      </div>
      <ReservationStatusDialog
        isOpen={reservationStatus.isOpen}
        onClose={() =>
          setReservationStatus({ ...reservationStatus, isOpen: false })
        }
        success={reservationStatus.success}
        reservationDate={reservationStatus.bookedDate}
        bookedTimes={reservationStatus.bookedTimes}
      />
    </div>
  );
};

export default CalendarWithSlots;
