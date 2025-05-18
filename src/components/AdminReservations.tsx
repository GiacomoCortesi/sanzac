import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { FaTrash, FaCheck } from "react-icons/fa";

type Reservation = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  name: string;
  status: string;
};

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        // low security - any authenticated user is admin user
        setIsAdmin(true);
      }
    });
  }, []);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("date", { ascending: true });
    if (!error) setReservations(data || []);
  };

  const deleteReservation = async (id: string) => {
    await supabase.from("reservations").delete().eq("id", id);
    fetchReservations();
  };

  const acceptReservation = async (id: string) => {
    await supabase
      .from("reservations")
      .update({ status: "accepted" })
      .eq("id", id);
    fetchReservations();
  };

  return isAdmin ? (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Gestione Prenotazioni
      </h1>
      <div className="overflow-x-auto rounded-xl shadow-md bg-base-100">
        <table className="table w-full text-sm">
          <thead>
            <tr className="bg-base-200 text-base font-semibold">
              <th>Data</th>
              <th>Inizio</th>
              <th>Fine</th>
              <th>Nome</th>
              <th>Stato</th>
              <th className="text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className="hover:bg-base-200 transition">
                <td>{res.date}</td>
                <td>{res.end_time}</td>
                <td>{res.end_time}</td>
                <td>{res.name}</td>
                <td>
                  <span
                    className={`badge ${
                      res.status === "pending"
                        ? "badge-warning"
                        : res.status === "accepted"
                        ? "badge-success"
                        : "badge-ghost"
                    }`}
                  >
                    {res.status}
                  </span>
                </td>
                <td className="flex justify-center gap-2">
                  {res.status === "pending" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => acceptReservation(res.id)}
                      title="Accept"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteReservation(res.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <p className="text-center mt-10">
      You must be an admin user to see this page
    </p>
  );
};

export default AdminReservations;
