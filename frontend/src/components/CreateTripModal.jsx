import { useState } from 'react';
import { useTripStore } from '../store/useTripStore';
import { X } from 'lucide-react';
import { format } from 'date-fns';

export default function CreateTripModal({ onClose }) {
  const createTrip = useTripStore((state) => state.createTrip);
  const [formData, setFormData] = useState({
    title: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    countries: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const countriesArray = formData.countries
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      await createTrip({
        ...formData,
        countries: countriesArray,
      });

      onClose();
    } catch (error) {
      console.error('Create trip error:', error);
      alert('여행 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full p-6 my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">새 여행 만들기</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">여행 이름</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="예: 도쿄 여행"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">시작일</label>
              <input
                type="date"
                required
                className="input-field"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">종료일</label>
              <input
                type="date"
                required
                className="input-field"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              방문 국가 (쉼표로 구분)
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.countries}
              onChange={(e) =>
                setFormData({ ...formData, countries: e.target.value })
              }
              placeholder="예: 일본, 태국"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? '생성 중...' : '생성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
