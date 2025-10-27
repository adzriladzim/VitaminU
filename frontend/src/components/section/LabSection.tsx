import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useClassData } from '@/context/ClassDataContext';
import BookingModal from '@/components/BookingModal';

const FILTERS = ['all', 'available', 'in use', 'booked'] as const;
type FilterType = typeof FILTERS[number];

export default function LabSection() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState<number | null>(null);
  const [selectedLabName, setSelectedLabName] = useState<string>('');
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { classes } = useClassData();

  const filteredLabs = filter === 'all'
    ? classes
    : classes.filter(l => {
        // Map the filter to match the class status format
        const statusMap: Record<string, string> = {
          'available': 'Available',
          'in use': 'In Use',
          'booked': 'Booked'
        };
        return l.status === statusMap[filter];
      });

  const { user } = useAuth(); // Get the current user
  const { bookClass, bookClassWithTime } = useClassData();

  const handleBookClick = (labId: number, labName: string) => {
    if (!isLoggedIn) {
      alert('Anda harus login terlebih dahulu untuk melakukan pemesanan.');
      navigate('/login');
      return;
    }

    const selectedLab = classes.find(lab => lab.id === labId);
    if (selectedLab) {
      // Check if the class is available before booking
      if (selectedLab.status !== 'Available') {
        alert(`Kelas ${labName} saat ini ${selectedLab.status.toLowerCase()}. Tidak dapat dilakukan pemesanan.`);
        return;
      }

      // Open the booking modal instead of booking directly
      setSelectedLabId(labId);
      setSelectedLabName(labName);
      setIsBookingModalOpen(true);
    } else {
      alert(`Kelas dengan ID ${labId} tidak ditemukan.`);
    }
  };

  const handleBookWithTime = (classId: number, startTime: string, endTime: string, className: string) => {
    if (!isLoggedIn) {
      alert('Anda harus login terlebih dahulu untuk melakukan pemesanan.');
      navigate('/login');
      return;
    }

    const userName = user?.full_name || user?.email || "Unknown User";
    bookClassWithTime(classId, userName, startTime, endTime, className);
  };

  return (
    <>
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-12" id='LabSection'>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-600 mb-4">
            Class Booking
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih dan pesan ruangan yang tersedia untuk kebutuhan pembelajaran Anda
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 transform hover:scale-105
                                ${filter === f
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-white text-cyan-600 border-2 border-cyan-600 hover:bg-cyan-50 shadow-sm'}`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLabs.map((lab) => {
            let statusColor = '';

            let statusText: string = lab.status;
            let showActionButton = false;

            switch (lab.status) {
              case 'Available':
                statusColor = 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';

                showActionButton = true;
                break;
              case 'Booked':
                statusColor = 'bg-gradient-to-r from-orange-500 to-amber-500 text-white';

                statusText = 'Booked (Waiting Approval)';
                break;
              case 'In Use':
                statusColor = 'bg-gradient-to-r from-red-500 to-rose-500 text-white';

                break;
              default:
                statusColor = 'bg-gray-500 text-white';

                break;
            }

            return (
              <Card
                key={lab.id}
                className="group relative flex flex-col overflow-hidden rounded-md shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border-0 transform hover:-translate-y-2"
              >
                {/* Image Section with Overlay */}
                {lab.image && (
                  <div className="relative w-full h-56 overflow-hidden">
                    <img
                      src={lab.image}
                      alt={lab.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                    {/* Status Badge on Image */}
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-bold shadow-lg ${statusColor} backdrop-blur-sm`}>

                        <span>{statusText}</span>
                      </span>
                    </div>

                    {/* Lab Name and Location on Image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                        {lab.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-white drop-shadow">
                          {lab.location}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <CardContent className="flex-grow p-6">
                  <div className="space-y-3">
                    {/* Description */}
                    <p className="text-gray-600 text-sm">{lab.description}</p>

                    {/* Location and Capacity Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{lab.location}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>kapasitas: 30 orang</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Footer with Action Button */}
                <CardFooter className="p-6 pt-0">
                  {showActionButton && (
                    <button
                      onClick={() => handleBookClick(lab.id, lab.name)}
                      disabled={!isLoggedIn}
                      className={`w-full py-3.5 rounded-md font-bold text-base transition-all duration-300 transform
                                                ${isLoggedIn
                          ? 'bg-cyan-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`
                      }
                    >
                      {isLoggedIn ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Book class
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Login to Book
                        </span>
                      )}
                    </button>
                  )}

                  {!showActionButton && (
                    <div className="w-full py-3.5 text-center text-gray-500 text-sm font-medium">
                      {lab.status === 'Booked' ? '⏳ Menunggu persetujuan admin' : '🔒 Sedang digunakan'}
                    </div>
                  )}
                </CardFooter>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-bl-md"></div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredLabs.length === 0 && (
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

    {/* Booking Modal */}
    {isBookingModalOpen && selectedLabId && (
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        classId={selectedLabId}
        className={selectedLabName}
        onBook={handleBookWithTime}
      />
    )}
    </>
  );
}
