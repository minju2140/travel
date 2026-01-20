import { useEffect } from 'react';
import { useTripStore } from '../store/useTripStore';
import { Calculator, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function Settlement({ tripId }) {
  const settlement = useTripStore((state) => state.settlement);
  const fetchSettlement = useTripStore((state) => state.fetchSettlement);

  useEffect(() => {
    fetchSettlement(tripId);
  }, [tripId, fetchSettlement]);

  if (!settlement) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const { user1, user2, message } = settlement;

  return (
    <div className="space-y-6">
      {/* Settlement Message */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-8 h-8" />
          <h2 className="text-2xl font-bold">정산 결과</h2>
        </div>
        <p className="text-xl text-primary-50">{message}</p>
      </div>

      {/* Individual Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User 1 */}
        <div className="card border-2 border-primary-200">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user1.name}</h3>
              <p className="text-sm text-gray-600">개인 지출 내역</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">총 지불 금액</span>
              <span className="font-semibold text-lg">
                {formatCurrency(user1.totalPaid)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">공동 지출 중</span>
              <span className="font-medium">{formatCurrency(user1.sharedPaid)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">공동 지출 부담액</span>
              <span className="font-medium">
                {formatCurrency(user1.shouldPayShared)}
              </span>
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">정산 금액</span>
                <span
                  className={`font-bold text-xl ${
                    user1.balance > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {user1.balance > 0 ? '+' : ''}
                  {formatCurrency(user1.balance)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {user1.balance > 0
                  ? '받아야 할 금액'
                  : '보내야 할 금액'}
              </p>
            </div>
          </div>
        </div>

        {/* User 2 */}
        <div className="card border-2 border-accent-200">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user2.name}</h3>
              <p className="text-sm text-gray-600">개인 지출 내역</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">총 지불 금액</span>
              <span className="font-semibold text-lg">
                {formatCurrency(user2.totalPaid)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">공동 지출 중</span>
              <span className="font-medium">{formatCurrency(user2.sharedPaid)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">공동 지출 부담액</span>
              <span className="font-medium">
                {formatCurrency(user2.shouldPayShared)}
              </span>
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">정산 금액</span>
                <span
                  className={`font-bold text-xl ${
                    user2.balance > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {user2.balance > 0 ? '+' : ''}
                  {formatCurrency(user2.balance)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {user2.balance > 0
                  ? '받아야 할 금액'
                  : '보내야 할 금액'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Settle */}
      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">💡 정산 방법</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• 공동 지출은 두 사람이 반씩 부담합니다.</p>
          <p>• 개인 지출은 각자 부담합니다.</p>
          <p>
            • 정산 금액은 공동 지출 중 실제 지불 금액과 부담해야 할 금액의
            차이입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
