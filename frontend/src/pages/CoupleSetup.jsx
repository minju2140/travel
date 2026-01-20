import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { coupleAPI } from '../api/couple';
import { Users, Copy, Check } from 'lucide-react';

export default function CoupleSetup() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // 'create' or 'join'
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkExistingCouple();
  }, []);

  const checkExistingCouple = async () => {
    try {
      const response = await coupleAPI.getMe();
      if (response.data.couple) {
        navigate('/');
      }
    } catch (err) {
      // No couple found, stay on this page
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await coupleAPI.create();
      setGeneratedCode(response.data.inviteCode);
      setMode('create');
    } catch (err) {
      setError(err.response?.data?.error || '초대 코드 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      setError('초대 코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await coupleAPI.join(inviteCode.trim().toUpperCase());
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || '커플 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">커플 연결</h1>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">
          파트너와 함께 지출을 관리하세요
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!mode && (
          <div className="space-y-4">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full btn-primary py-4 disabled:opacity-50"
            >
              초대 코드 생성하기
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <button
              onClick={() => setMode('join')}
              className="w-full btn-secondary py-4"
            >
              초대 코드로 참여하기
            </button>
          </div>
        )}

        {mode === 'create' && generatedCode && (
          <div className="space-y-4">
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">초대 코드</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl font-bold text-primary-700">{generatedCode}</p>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <Copy className="w-6 h-6 text-primary-600" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center">
              이 코드를 파트너에게 공유하세요. 파트너가 참여하면 자동으로 연결됩니다.
            </p>

            <button
              onClick={() => navigate('/')}
              className="w-full btn-primary py-3"
            >
              완료
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">초대 코드</label>
              <input
                type="text"
                className="input-field text-center text-lg tracking-wider uppercase"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="ABC123"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {loading ? '참여 중...' : '참여하기'}
            </button>

            <button
              onClick={() => setMode(null)}
              className="w-full btn-secondary py-3"
            >
              돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
