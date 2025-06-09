import React from "react";
import type { TimeSlot } from "src/types";

interface ReservationStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  reservationDate: string;
  bookedSlots: TimeSlot[];
}

const ReservationStatusDialog: React.FC<ReservationStatusDialogProps> = ({
  isOpen,
  onClose,
  success,
  reservationDate,
  bookedSlots,
}) => {
  if (!isOpen) return null;
  const bookedTimes = bookedSlots.map((bookedSlot) => {
    return bookedSlot.startTime + " - " + bookedSlot.endTime;
  });
  const formattedTimes = bookedTimes.join(", ");

  return (
    <div className="fixed inset-0 bg-surface-100 dark:bg-surface-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-background dark:bg-surface-800 text-inherit p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold">
          {success ? "Prenotazione riuscita!" : "Errore nella prenotazione"}
        </h2>
        {success ? (
          <>
            <p className="mb-4 text-lg">
              La tua prenotazione per il <strong>{reservationDate}</strong>. è
              stata accettata
            </p>
            <p className="mb-4 text-lg">
              Se hai inserito un indirizzo email valido riceverai presto una mail di
              conferma, altrimenti monitora lo stato dal calendario.
            </p>
            <p className="mb-4 text-lg">
              Orari prenotati: <strong>{formattedTimes}</strong>
            </p>
          </>
        ) : (
          <p className="text-lg">
            C'è stato un errore con la tua prenotazione. Riprova più tardi.
          </p>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 rounded-full hover:bg-tertiary-300"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
};

export default ReservationStatusDialog;
