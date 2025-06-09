import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import {
  FaTrash,
  FaCheck,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheckCircle,
} from "react-icons/fa";
import { actions } from "astro:actions";

type Reservation = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  name: string;
  status: string;
  email: string;
};

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);

  // Sorting
  const [sortBy, setSortBy] = useState<keyof Reservation>("date");
  const [sortAsc, setSortAsc] = useState(false); // DESC by default

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setIsAdmin(true);
    });
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [page, pageSize, sortBy, sortAsc]);

  const fetchReservations = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const [{ data, error }, { count }] = await Promise.all([
      supabase
        .from("reservations")
        .select("*", { count: "exact" })
        .order(sortBy, { ascending: sortAsc })
        .range(from, to),
      supabase.from("reservations").select("*", { count: "exact", head: true }),
    ]);

    if (!error) {
      setReservations(data || []);
      setTotalCount(count || 0);
    }
  };

  const fetchReservation = async (id: string) => {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", id)
      .single();

    return error ? undefined : data;
  };

  const deleteReservation = async (id: string) => {
    const toDeleteReservation = await fetchReservation(id);
    await supabase.from("reservations").delete().eq("id", id);
    fetchReservations();
    console.log(toDeleteReservation);
    const result = await actions.emailActions.sendReservationDeniedEmail({
      to: toDeleteReservation?.email,
      userName: toDeleteReservation?.name,
    });
  };

  const acceptReservation = async (reservation: Reservation) => {
    await supabase
      .from("reservations")
      .update({ status: "accepted" })
      .eq("id", reservation.id);
    fetchReservations();
    if (reservation.email) {
      const result = await actions.emailActions.sendReservationConfirmedEmail({
        to: reservation?.email,
        userName: reservation.id,
      });
    }
  };

  const acceptAllPending = async () => {
    await supabase
      .from("reservations")
      .update({ status: "accepted" })
      .eq("status", "pending");
    fetchReservations();
  };

  const handleSort = (column: keyof Reservation) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  const renderSortIcon = (column: keyof Reservation) => {
    if (sortBy !== column) return <FaSort className="inline-block ml-1" />;
    return sortAsc ? (
      <FaSortUp className="inline-block ml-1" />
    ) : (
      <FaSortDown className="inline-block ml-1" />
    );
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return isAdmin ? (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-4">
          Gestione Prenotazioni
          <button
            className="btn btn-sm btn-success flex items-center gap-2"
            onClick={acceptAllPending}
            disabled={reservations.every((res) => res.status !== "pending")}
          >
            <span className="text-tertiary-400 font-bold text-primary flex items-center gap-2">
              Accetta tutte <FaCheckCircle />
            </span>
          </button>
        </h1>
      </div>
      <div className="overflow-x-auto rounded-xl shadow bg-base-100">
        <table className="table w-full text-sm">
          <thead>
            <tr className="bg-base-200 text-base font-semibold">
              <th onClick={() => handleSort("date")} className="cursor-pointer">
                Data {renderSortIcon("date")}
              </th>
              <th>Inizio</th>
              <th>Fine</th>
              <th onClick={() => handleSort("name")} className="cursor-pointer">
                Nome {renderSortIcon("name")}
              </th>
              <th
                onClick={() => handleSort("status")}
                className="cursor-pointer"
              >
                Stato {renderSortIcon("status")}
              </th>
              <th className="text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className="hover:bg-base-200 transition">
                <td>{res.date}</td>
                <td>{res.start_time}</td>
                <td>{res.end_time}</td>
                <td
                  className="max-w-[120px] md:max-w-xs truncate"
                  title={res.name}
                >
                  {res.name}
                </td>
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
                      onClick={() => acceptReservation(res)}
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
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  Nessuna prenotazione trovata.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 ">
        <div className="flex gap-2 items-center md:min-w-100">
          <label className="text-sm hidden sm:block">Mostra:</label>
          <select
            className="select select-sm select-bordered max-w-15"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1); // reset to first page
            }}
          >
            {[25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm hidden sm:block">Prenotazioni</span>
        </div>

        <div className="join">
          <button
            className="btn btn-sm join-item"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ←
          </button>
          <button className="btn btn-sm join-item" disabled>
            Pagina {page} / {totalPages || 1}
          </button>
          <button
            className="btn btn-sm join-item"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center mt-10">
      Devi essere un utente autenticato per accedere a questa pagina.
    </p>
  );
};

export default AdminReservations;
