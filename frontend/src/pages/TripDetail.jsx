import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTripStore } from '../store/useTripStore';
import { useExpenseStore } from '../store/useExpenseStore';
import { ArrowLeft, Plus, BarChart3, Receipt, Calculator } from 'lucide-react';
import { initSocket, connectSocket, joinTrip, getSocket } from '../utils/socket';
import Dashboard from '../components/Dashboard';
import ExpenseList from '../components/ExpenseList';
import Settlement from '../components/Settlement';
import CreateExpenseModal from '../components/CreateExpenseModal';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const currentTrip = useTripStore((state) => state.currentTrip);
  const fetchTrip = useTripStore((state) => state.fetchTrip);
  const fetchStatistics = useTripStore((state) => state.fetchStatistics);
  const fetchSettlement = useTripStore((state) => state.fetchSettlement);

  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const addExpenseFromSocket = useExpenseStore((state) => state.addExpenseFromSocket);
  const updateExpenseFromSocket = useExpenseStore((state) => state.updateExpenseFromSocket);
  const deleteExpenseFromSocket = useExpenseStore((state) => state.deleteExpenseFromSocket);

  useEffect(() => {
    fetchTrip(id);
    fetchExpenses(id);
    fetchStatistics(id);
    fetchSettlement(id);

    // Setup socket
    const socket = initSocket();
    connectSocket();
    joinTrip(id);

    socket.on('expense:created', (expense) => {
      addExpenseFromSocket(expense);
      fetchStatistics(id);
      fetchSettlement(id);
    });

    socket.on('expense:updated', (expense) => {
      updateExpenseFromSocket(expense);
      fetchStatistics(id);
      fetchSettlement(id);
    });

    socket.on('expense:deleted', ({ id: expenseId }) => {
      deleteExpenseFromSocket(expenseId);
      fetchStatistics(id);
      fetchSettlement(id);
    });

    return () => {
      socket.off('expense:created');
      socket.off('expense:updated');
      socket.off('expense:deleted');
    };
  }, [id]);

  const tabs = [
    { id: 'dashboard', label: '대시보드', icon: BarChart3 },
    { id: 'expenses', label: '지출 내역', icon: Receipt },
    { id: 'settlement', label: '정산', icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentTrip?.title || '여행 상세'}
              </h1>
              {currentTrip && (
                <p className="text-sm text-gray-600">
                  {JSON.parse(currentTrip.countries).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard tripId={id} />}
        {activeTab === 'expenses' && <ExpenseList tripId={id} />}
        {activeTab === 'settlement' && <Settlement tripId={id} />}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowExpenseModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showExpenseModal && (
        <CreateExpenseModal
          tripId={id}
          onClose={() => setShowExpenseModal(false)}
        />
      )}
    </div>
  );
}
