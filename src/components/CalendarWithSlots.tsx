import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import TimeSlotGrid from "./TimeSlotGrid";
import { supabase } from "../lib/supabase";
import type { TimeSlot } from "../types";
import ReservationStatusDialog from "./ReservationStatusDialog";

const PRICE_PER_SLOT = 25;

const calculateTotalCost = (slots: TimeSlot[]) => {
  return slots.length * PRICE_PER_SLOT;
};

const CalendarWithSlots: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [reservationName, setReservationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservationStatus, setReservationStatus] = useState({
    isOpen: false,
    success: false,
    bookedDate: "",
    bookedSlots: [] as TimeSlot[],
  });

  const fetchReservations = async (date: Date) => {
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = selectedDate.getDate().toString().padStart(2, "0");

    const isoDate = `${year}-${month}-${day}`;

    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("date", isoDate);

    return error ? [] : data;
  };

  const generateSlots = async (date: Date) => {
    const existing = await fetchReservations(date);
    const slots = [
      {
        startTime: "9:00",
        endTime: "13:00",
      },
      {
        startTime: "13:00",
        endTime: "16:00",
      },
      {
        startTime: "16:00",
        endTime: "19:00",
      },
      {
        startTime: "19:00",
        endTime: "22:00",
      },
    ];
    return slots.map((slot) => {
      const match = existing.find((r) => r.start_time === slot.startTime);
      const status: "available" | "booked" | "pending" = match
        ? "booked"
        : "available";
      return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        status,
        reservedBy: match?.name,
      };
    });
  };

  const handleToggleSlot = (slot: TimeSlot) => {
    setSelectedSlots((prev) =>
      prev.some((prevSlot) => prevSlot.startTime == slot.startTime)
        ? prev.filter((t) => t.startTime !== slot.startTime)
        : [...prev, { startTime: slot.startTime, endTime: slot.endTime }]
    );
  };

  const handleSubmit = async () => {
    if (!reservationName || selectedSlots.length === 0) {
      setReservationStatus({
        isOpen: true,
        success: false,
        bookedDate: "",
        bookedSlots: [],
      });
      return;
    }
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = selectedDate.getDate().toString().padStart(2, "0");

    const isoDate = `${year}-${month}-${day}`;

    const payload = selectedSlots.map((selectedSlot) => ({
      date: isoDate,
      start_time: selectedSlot.startTime,
      end_time: selectedSlot.endTime,
      name: reservationName,
      status: "pending",
    }));

    const { error } = await supabase.from("reservations").insert(payload);

    if (error) {
      setReservationStatus({
        isOpen: true,
        success: false,
        bookedDate: "",
        bookedSlots: [],
      });
    } else {
      setReservationStatus({
        isOpen: true,
        success: true,
        bookedDate: selectedDate?.toLocaleDateString() || "",
        bookedSlots: selectedSlots,
      });
      setSelectedSlots([]);
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
            setSelectedSlots([]);
          }}
          value={selectedDate}
          className="react-calendar"
        />
      </div>

      <h3 className="mt-6 text-lg font-semibold">
        Slot disponibili il {selectedDate.toDateString()}
      </h3>

      <TimeSlotGrid
        slots={slots}
        selectedSlots={selectedSlots}
        onToggleSlot={handleToggleSlot}
        date={selectedDate}
      />

      <div className="mt-6 space-y-3">
        <input
          type="text"
          placeholder="Chi sei?"
          value={reservationName}
          onChange={(e) => setReservationName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        {selectedSlots.length > 0 && (
          <div className="text-md font-medium">
            Costo:{" "}
            <span className="font-semibold text-secondary-700">
              €{calculateTotalCost(selectedSlots)}
            </span>
          </div>
        )}
        <div className="flex justify-center">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="btn btn-lg preset-outlined-secondary-500"
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
        bookedSlots={reservationStatus.bookedSlots}
      />
    </div>
  );
};

export default CalendarWithSlots;
