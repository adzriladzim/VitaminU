import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/apiClient"; // Diambil dari HEAD
import { Room, BookingCreatePayload } from "@/types"; // Diambil dari HEAD
import BookingModal from "@/components/BookingModal"; // Diambil dari 1e3ed98...

// Filter definition diambil dari HEAD karena lebih deskriptif
const FILTERS = [
  { label: "ALL", value: "all" },
  { label: "AVAILABLE", value: "available" },
  { label: "IN USE", value: "in_use" },
  { label: "BOOKED", value: "booked" },
] as const;
type FilterType = (typeof FILTERS)[number]["value"];

export default function LabSection() {
  // --- State Gabungan ---
  // State dari HEAD
  const [filter, setFilter] = useState<FilterType>("all");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State dari 1e3ed98... (disesuaikan)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  const [selectedLabName, setSelectedLabName] = useState<string>("");

  // --- Hooks Gabungan ---
  const { isLoggedIn, user } = useAuth(); // Digabung, perlu user dan isLoggedIn
  const navigate = useNavigate();

  // --- Logika Fetching Data (dari HEAD) ---
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<Room[]>("/rooms/");
        setRooms(response.data);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
        setError("Could not load rooms. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // --- Logika Filter (dari HEAD) ---
  const filteredRooms =
    filter === "all" ? rooms : rooms.filter((room) => room.status === filter);

  // --- Logika Handler (Gabungan) ---

  /**
   * Handler untuk tombol "Book Now" di card.
   * Fungsinya HANYA membuka modal (logika dari 1e3ed98...)
   * Ditambah pengecekan status dari HEAD.
   */
  const handleBookClick = (roomId: string, roomName: string) => {
    if (!isLoggedIn || !user) {
      alert("Anda harus login terlebih dahulu untuk melakukan pemesanan.");
      navigate("/login");
      return;
    }

    const selectedRoom = rooms.find((room) => room.id === roomId);
    if (!selectedRoom) {
      alert(`Room with ID ${roomId} not found.`);
      return;
    }

    // Pengecekan status dari HEAD
    if (selectedRoom.status !== "available") {
      alert(
        `Room ${roomName} is currently ${selectedRoom.status}. Cannot book now.`
      );
      return;
    }

    setSelectedLabId(roomId);
    setSelectedLabName(roomName);
    setIsBookingModalOpen(true);
  };

  const handleBookSubmit = async (
    classId: string,
    startTime: string,
    endTime: string,
    className: string
  ) => {
    setError(null); // Clear previous errors

    try {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      // 2. Konversi objek Date ke string ISO 8601 (format UTC 'Z')
      //    Metode .toISOString() selalu mengembalikan UTC
      const startTimeISO = startDate.toISOString();
      const endTimeISO = endDate.toISOString();
      const bookingPayload: BookingCreatePayload = {
        room_id: classId,
        start_time: startTimeISO,
        end_time: endTimeISO,
      };

      await apiClient.post("/bookings/", bookingPayload);

      alert(
        `Booking request for ${className} has been submitted and is pending admin approval.`
      );

      // Optimistically update UI
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === classId ? { ...room, status: "pending" } : room
        )
      );

      setIsBookingModalOpen(false); // Tutup modal setelah sukses
    } catch (err: any) {
      console.error("Booking failed:", err);
      const errorMessage =
        err.response?.data?.detail || "Booking failed. Please try again.";
      setError(`Booking Error: ${errorMessage}`);
      alert(`Booking Error: ${errorMessage}`); // Tampilkan error
    } finally {
    }
  };
  if (isLoading) {
    return <div className="text-center py-20">Loading rooms...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  // Return JSX gabungan
  return (
    <>
      <section
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-12"
        id="LabSection"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-600 mb-4">
              Class Booking
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pilih dan pesan ruangan yang tersedia untuk kebutuhan pembelajaran
              Anda
            </p>
          </div>

          {/* Filter Buttons (dari HEAD) */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 transform hover:scale-105
                        ${
                          filter === f.value
                            ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                            : "bg-white text-cyan-600 border-2 border-cyan-600 hover:bg-cyan-50 shadow-sm"
                        }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards Grid (dari HEAD) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => {
              let statusColor = "";
              let statusText: string = room.status; // Default to backend status
              let actionText = ""; // Text for non-available rooms

              switch (room.status) {
                case "available":
                  statusColor =
                    "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
                  break;
                // case 'pending': // Status dari backend booking model
                //   statusColor = 'bg-gradient-to-r from-orange-500 to-amber-500 text-white';
                //   statusText = 'Booked (Waiting Approval)';
                //   actionText = '⏳ Menunggu persetujuan admin';
                //   break;
                case "booked": // Status dari backend booking model
                  statusColor =
                    "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"; // Example color
                  statusText = "Booked (Approved)";
                  actionText = "✅ Sudah Dipesan";
                  break;
                case "in_use": // This seems distinct from booking status in your backend
                  statusColor =
                    "bg-gradient-to-r from-red-500 to-rose-500 text-white";
                  actionText = "🔒 Sedang digunakan";
                  statusText = "In Use";
                  break;
                // case 'maintenance': // Status dari backend room model
                //   statusColor = 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
                //   actionText = '🔧 Dalam Perbaikan';
                //   break;
                default:
                  statusColor = "bg-gray-400 text-white";
                  break;
              }

              const showBookButton = room.status === "available";
              // 'isBookingThisRoom' state diganti, loading kini ada di modal

              return (
                <Card
                  key={room.id}
                  className="group relative flex flex-col overflow-hidden rounded-md shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border-0 transform hover:-translate-y-2"
                >
                  {/* Image Section with Overlay */}
                  {room.image_url && (
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || ""}${
                          room.image_url
                        }`}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-image.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Status Badge on Image */}
                      <div className="absolute top-4 right-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-bold shadow-lg ${statusColor} backdrop-blur-sm`}
                        >
                          {statusText.toUpperCase()}
                        </span>
                      </div>

                      {/* Lab Name and Location on Image */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="text-sm text-white drop-shadow">
                            {room.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content Section */}
                  <CardContent className="flex-grow p-6">
                    <div className="space-y-3">
                      {/* Description */}
                      <p className="text-gray-600 text-sm">
                        {room.description || "No description available."}
                      </p>

                      {/* Location and Capacity Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-cyan-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>{room.location}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-cyan-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>Kapasitas: {room.capacity} orang</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    {showBookButton && (
                      <button
                        // Logika onClick diperbarui untuk cek login, lalu panggil handleBookClick (pembuka modal)
                        onClick={() => {
                          if (!isLoggedIn) {
                            alert("Anda harus login untuk memesan ruangan.");
                            navigate("/login");
                          } else {
                            handleBookClick(room.id, room.name);
                          }
                        }}
                        // Logika disabled dan className disederhanakan
                        className={`w-full py-3.5 rounded-md font-bold text-base transition-all duration-300 transform
                           bg-cyan-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 active:scale-95
                        `}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Book Now
                        </span>
                      </button>
                    )}
                    {!showBookButton && (
                      <div className="w-full py-3.5 text-center text-gray-500 text-sm font-medium">
                        {actionText || `Status: ${room.status}`}
                      </div>
                    )}
                  </CardFooter>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-bl-md"></div>
                </Card>
              );
            })}
          </div>
          {filteredRooms.length === 0 && rooms.length > 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Tidak ada lab ditemukan
              </h3>
              <p className="text-gray-500">
                Coba filter lain atau kembali ke "All"
              </p>
            </div>
          )}
        </div>
      </section>
      {isBookingModalOpen && selectedLabId && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          classId={selectedLabId}
          className={selectedLabName}
          onBook={handleBookSubmit}
        />
      )}
    </>
  );
}
