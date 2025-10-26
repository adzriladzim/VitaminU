import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/apiClient";
import { Room, BookingCreatePayload } from "@/types";
const FILTERS = [
  { label: "ALL", value: "all" },
  { label: "AVAILABLE", value: "available" },
  { label: "IN USE", value: "in_use" },
  { label: "BOOKED", value: "booked" },
] as const;
type FilterType = (typeof FILTERS)[number]["value"];

export default function LabSection() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingRoomId, setBookingRoomId] = useState<string | null>(null);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

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

  const filteredRooms =
    filter === "all" ? rooms : rooms.filter((room) => room.status === filter);

  const handleBookClick = async (roomId: string, roomName: string) => {
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

    // Only allow booking if status is 'available'
    if (selectedRoom.status !== "available") {
      alert(
        `Room ${roomName} is currently ${selectedRoom.status}. Cannot book now.`
      );
      return;
    }

    setBookingRoomId(roomId); // Set loading state for this specific button
    setError(null); // Clear previous errors

    try {
      const now = new Date();
      const startTime = now.toISOString(); // Example: Now
      const endTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // Example: 1 hour later

      const bookingPayload: BookingCreatePayload = {
        room_id: roomId,
        start_time: startTime,
        end_time: endTime,
        status: "pending",
      };
      await apiClient.post("/bookings/", bookingPayload);

      alert(
        `Booking request for ${roomName} has been submitted and is pending admin approval.`
      );

      // Option 1: Re-fetch rooms to show updated status (if backend changes status on request)
      // fetchRooms(); // Uncomment if needed

      // Option 2: Optimistically update UI (if backend status doesn't change immediately)
      // This is simpler for 'pending' status
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId ? { ...room, status: "pending" } : room
        )
      );
    } catch (err: any) {
      console.error("Booking failed:", err);
      const errorMessage =
        err.response?.data?.detail || "Booking failed. Please try again.";
      setError(`Booking Error: ${errorMessage}`);
      alert(`Booking Error: ${errorMessage}`); // Show error to user
    } finally {
      setBookingRoomId(null); // Reset loading state for the button
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading rooms...</div>; // Loading indicator
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>; // Error display
  }

  return (
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

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105
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

        {/* Cards Grid */}
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
              // case 'pending': // Status from your backend booking model
              //   statusColor = 'bg-gradient-to-r from-orange-500 to-amber-500 text-white';
              //   statusText = 'Booked (Waiting Approval)'; // Match your image
              //   actionText = '⏳ Menunggu persetujuan admin';
              //   break;
              case "booked": // Status from your backend booking model
                statusColor =
                  "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"; // Example color
                statusText = "Booked (Approved)";
                actionText = "✅ Sudah Dipesan"; // You might want different logic here
                break;
              case "in_use": // This seems distinct from booking status in your backend
                statusColor =
                  "bg-gradient-to-r from-red-500 to-rose-500 text-white";
                actionText = "🔒 Sedang digunakan";
                statusText = "In Use";
                break;
              // case 'maintenance': // Status from your backend room model
              //   statusColor = 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
              //   actionText = '🔧 Dalam Perbaikan';
              //   break;
              // Add cases for rejected/canceled if needed
              default:
                statusColor = "bg-gray-400 text-white";
                break;
            }

            const showBookButton = room.status === "available";
            const isBookingThisRoom = bookingRoomId === room.id;

            return (
              <Card
                key={room.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border-0 transform hover:-translate-y-2"
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
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${statusColor} backdrop-blur-sm`}
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

                {/* Footer with Action Button */}
                <CardFooter className="p-6 pt-0">
                  {showBookButton && (
                    <button
                      onClick={() => handleBookClick(room.id, room.name)}
                      disabled={!isLoggedIn || isBookingThisRoom}
                      className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 transform
                                                ${
                                                  isBookingThisRoom
                                                    ? "bg-gray-400 text-gray-700 cursor-wait"
                                                    : isLoggedIn
                                                    ? "bg-cyan-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 active:scale-95"
                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                }`}
                    >
                      {isBookingThisRoom ? (
                        <span className="flex items-center justify-center gap-2">
                          {/* Anda bisa tambahkan ikon loading di sini jika mau */}
                          Booking...
                        </span>
                      ) : isLoggedIn ? (
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
                      ) : (
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
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          Login to Book
                        </span>
                      )}
                    </button>
                  )}

                  {/* {!showActionButton && (
                    <div className="w-full py-3.5 text-center text-gray-500 text-sm font-medium">
                      {lab.status === "Booked"
                        ? "⏳ Menunggu persetujuan admin"
                        : "🔒 Sedang digunakan"}
                    </div>
                  )} */}
                  {!showBookButton && (
                    <div className="w-full py-3.5 text-center text-gray-500 text-sm font-medium">
                      {actionText || `Status: ${room.status}`}
                    </div>
                  )}
                </CardFooter>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-bl-full"></div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {/* {filteredLabs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Tidak ada lab ditemukan
            </h3>
            <p className="text-gray-500">
              Coba filter lain atau kembali ke "All"
            </p>
          </div>
        )} */}
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
  );
}
