import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripStore } from '../store/useTripStore';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Calendar, MapPin, TrendingUp, LogOut, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import CreateTripModal from '../components/CreateTripModal';

export default function TripList() {
  const navigate = useNavigate();
  const trips = useTripStore((state) => state.trips);
  const fetchTrips = useTripStore((state) => state.fetchTrips);
  const deleteTrip = useTripStore((state) => state.deleteTrip);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const handleDeleteTrip = async (e, tripId, tripTitle) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    if (window.confirm(`"${tripTitle}" 여행을 삭제하시겠습니까?\n모든 지출 기록도 함께 삭제됩니다.`)) {
      try {
        await deleteTrip(tripId);
      } catch (error) {
        alert('여행 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">여행 목록</h1>
            <p className="text-sm text-gray-600">{user?.name}님 환영합니다!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5" />
            로그아웃
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {trips.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <MapPin className="w-20 h-20 mx-auto text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              아직 여행이 없습니다
            </h2>
            <p className="text-gray-500 mb-8">
              첫 여행을 추가하고 지출을 기록해보세요
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              새 여행 시작하기
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">내 여행</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                새 여행
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  className="card cursor-pointer hover:shadow-lg transition-shadow relative group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-2">
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {trip.isActive && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          진행중
                        </span>
                      )}
                      <button
                        onClick={(e) => handleDeleteTrip(e, trip.id, trip.title)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="여행 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(trip.startDate), 'yyyy.MM.dd', { locale: ko })} ~{' '}
                        {format(new Date(trip.endDate), 'yyyy.MM.dd', { locale: ko })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {JSON.parse(trip.countries).join(', ') || '국가 미지정'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t mt-4">
                      <TrendingUp className="w-4 h-4 text-primary-600" />
                      <span className="font-semibold text-lg text-primary-600">
                        {formatCurrency(trip.totalKrw || 0)}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      {trip._count?.expenses || 0}개의 지출 기록
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateTripModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
