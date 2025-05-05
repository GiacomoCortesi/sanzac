// src/components/ReservationStatusDialog.tsx
import React from 'react';

interface ReservationStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  reservationDate: string;
  bookedTimes: string[];
}

const ReservationStatusDialog: React.FC<ReservationStatusDialogProps> = ({
  isOpen,
  onClose,
  success,
  reservationDate,
  bookedTimes,
}) => {
  if (!isOpen) return null;

  const formattedTimes = bookedTimes.join(', ');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">{success ? 'Prenotazione riuscita!' : 'Errore nella prenotazione'}</h2>
        {success ? (
          <>
            <p className="mb-4 text-lg">La tua prenotazione è stata confermata per il <strong>{reservationDate}</strong>.</p>
            <p className="mb-4 text-lg">Orari prenotati: <strong>{formattedTimes}</strong></p>
          </>
        ) : (
          <p className="text-lg">C'è stato un errore con la tua prenotazione. Riprova più tardi.</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
};

export default ReservationStatusDialog;
