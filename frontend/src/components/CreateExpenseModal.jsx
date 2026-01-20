import { useState } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { useTripStore } from '../store/useTripStore';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { CURRENCIES, CATEGORIES, PAYER_TYPES } from '../utils/constants';

export default function CreateExpenseModal({ tripId, onClose }) {
  const createExpense = useExpenseStore((state) => state.createExpense);
  const fetchStatistics = useTripStore((state) => state.fetchStatistics);
  const fetchSettlement = useTripStore((state) => state.fetchSettlement);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'KRW',
    category: 'food',
    payerType: 'self',
    memo: '',
    expenseDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createExpense({
        tripId,
        ...formData,
        amount: parseFloat(formData.amount),
      });

      fetchStatistics(tripId);
      fetchSettlement(tripId);
      onClose();
    } catch (error) {
      console.error('Create expense error:', error);
      alert('지출 기록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">지출 기록하기</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">지출 항목</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="예: 점심 식사"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">금액</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                className="input-field"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">통화</label>
              <select
                className="input-field"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">카테고리</label>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, category: category.value })
                  }
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-colors ${
                    formData.category === category.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-1">{category.icon}</div>
                  <div className="text-xs sm:text-sm">{category.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">지불 유형</label>
            <select
              className="input-field"
              value={formData.payerType}
              onChange={(e) =>
                setFormData({ ...formData, payerType: e.target.value })
              }
            >
              {PAYER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">일시</label>
            <input
              type="datetime-local"
              className="input-field"
              value={formData.expenseDate}
              onChange={(e) =>
                setFormData({ ...formData, expenseDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              메모 (선택사항)
            </label>
            <textarea
              className="input-field"
              rows={2}
              value={formData.memo}
              onChange={(e) =>
                setFormData({ ...formData, memo: e.target.value })
              }
              placeholder="메모를 입력하세요..."
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
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
