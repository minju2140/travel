import { useEffect } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { useAuthStore } from '../store/useAuthStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Trash2, User } from 'lucide-react';
import { CATEGORIES, CURRENCIES } from '../utils/constants';

export default function ExpenseList({ tripId }) {
  const expenses = useExpenseStore((state) => state.expenses);
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchExpenses(tripId);
  }, [tripId, fetchExpenses]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = async (id) => {
    if (window.confirm('이 지출을 삭제하시겠습니까?')) {
      try {
        await deleteExpense(id);
      } catch (error) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const getCategoryIcon = (category) => {
    return CATEGORIES.find((c) => c.value === category)?.icon || '📌';
  };

  const getCategoryLabel = (category) => {
    return CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const getCurrencySymbol = (code) => {
    return CURRENCIES.find((c) => c.code === code)?.symbol || code;
  };

  const getPayerTypeLabel = (type) => {
    switch (type) {
      case 'self':
        return '개인';
      case 'partner':
        return '파트너';
      case 'shared':
        return '공동';
      default:
        return type;
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">💸</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          아직 지출 기록이 없습니다
        </h3>
        <p className="text-gray-500">
          우측 하단의 + 버튼을 눌러 지출을 기록해보세요
        </p>
      </div>
    );
  }

  // Group expenses by date
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = format(new Date(expense.expenseDate), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedExpenses)
        .sort(([a], [b]) => new Date(b) - new Date(a))
        .map(([date, dayExpenses]) => (
          <div key={date} className="card">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
              <h3 className="font-semibold text-gray-900">
                {format(new Date(date), 'M월 d일 (EEE)', { locale: ko })}
              </h3>
              <p className="text-sm text-gray-600">
                {formatCurrency(
                  dayExpenses.reduce((sum, exp) => sum + exp.krwAmount, 0)
                )}
              </p>
            </div>

            <div className="space-y-3">
              {dayExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl">{getCategoryIcon(expense.category)}</div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {expense.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {getCategoryLabel(expense.category)} •{' '}
                          {getPayerTypeLabel(expense.payerType)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(expense.krwAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getCurrencySymbol(expense.currency)}{' '}
                          {expense.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{expense.user.name}</span>
                        {expense.memo && (
                          <>
                            <span>•</span>
                            <span className="italic">{expense.memo}</span>
                          </>
                        )}
                      </div>

                      {expense.userId === user?.id && (
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
