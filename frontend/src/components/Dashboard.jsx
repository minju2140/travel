import { useEffect } from 'react';
import { useTripStore } from '../store/useTripStore';
import { TrendingUp, Users } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { CHART_COLORS, CATEGORIES } from '../utils/constants';

export default function Dashboard({ tripId }) {
  const statistics = useTripStore((state) => state.statistics);
  const fetchStatistics = useTripStore((state) => state.fetchStatistics);

  useEffect(() => {
    fetchStatistics(tripId);
  }, [tripId, fetchStatistics]);

  if (!statistics) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Category data for pie chart
  const categoryData = Object.entries(statistics.byCategory).map(
    ([category, amount]) => ({
      name:
        CATEGORIES.find((c) => c.value === category)?.label || category,
      value: amount,
      icon: CATEGORIES.find((c) => c.value === category)?.icon || '📌',
    })
  );

  // User data for bar chart
  const userData = Object.entries(statistics.byUser).map(
    ([userId, data]) => ({
      name: data.name,
      총지출: data.total,
      개인지출: data.self,
      공동지출: data.shared,
    })
  );

  // Date data for line chart
  const dateData = Object.entries(statistics.byDate)
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      }),
      금액: amount,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const COLORS = Object.values(CHART_COLORS);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm mb-1">총 지출</p>
              <p className="text-3xl font-bold">
                {formatCurrency(statistics.totalKrw)}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-primary-200" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">지출 건수</p>
              <p className="text-3xl font-bold text-gray-900">
                {statistics.expenseCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">평균 지출</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(statistics.totalKrw / (statistics.expenseCount || 1))}
              </p>
            </div>
            <Users className="w-12 h-12 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">카테고리별 지출</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">데이터가 없습니다</p>
          )}
        </div>

        {/* User Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">개인별 지출</h3>
          {userData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="개인지출" fill={CHART_COLORS.user1} />
                <Bar dataKey="공동지출" fill={CHART_COLORS.shared} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">데이터가 없습니다</p>
          )}
        </div>
      </div>

      {/* Daily Trend Line Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">일별 지출 추이</h3>
        {dateData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="금액"
                stroke={CHART_COLORS.user1}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 py-8">데이터가 없습니다</p>
        )}
      </div>
    </div>
  );
}
