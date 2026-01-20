export const CURRENCIES = [
  { code: 'KRW', name: '원화 (₩)', symbol: '₩' },
  { code: 'USD', name: '미국 달러 ($)', symbol: '$' },
  { code: 'JPY', name: '일본 엔 (¥)', symbol: '¥' },
  { code: 'EUR', name: '유로 (€)', symbol: '€' },
  { code: 'CNY', name: '중국 위안 (¥)', symbol: '¥' },
  { code: 'GBP', name: '영국 파운드 (£)', symbol: '£' },
  { code: 'THB', name: '태국 바트 (฿)', symbol: '฿' },
  { code: 'VND', name: '베트남 동 (₫)', symbol: '₫' },
  { code: 'TWD', name: '대만 달러 (NT$)', symbol: 'NT$' },
  { code: 'HKD', name: '홍콩 달러 (HK$)', symbol: 'HK$' },
  { code: 'SGD', name: '싱가포르 달러 (S$)', symbol: 'S$' },
  { code: 'AUD', name: '호주 달러 (A$)', symbol: 'A$' },
  { code: 'CAD', name: '캐나다 달러 (C$)', symbol: 'C$' },
  { code: 'CHF', name: '스위스 프랑 (CHF)', symbol: 'CHF' },
];

export const CATEGORIES = [
  { value: 'food', label: '식비', icon: '🍔' },
  { value: 'accommodation', label: '숙박', icon: '🏨' },
  { value: 'transportation', label: '교통', icon: '🚌' },
  { value: 'shopping', label: '쇼핑', icon: '🛍️' },
  { value: 'attraction', label: '관광', icon: '🎭' },
  { value: 'entertainment', label: '오락', icon: '🎮' },
  { value: 'other', label: '기타', icon: '📌' },
];

export const PAYER_TYPES = [
  { value: 'self', label: '내가 냄' },
  { value: 'partner', label: '파트너가 냄' },
  { value: 'shared', label: '공동 지출' },
];

export const CHART_COLORS = {
  user1: '#14b8a6',
  user2: '#f43f5e',
  shared: '#8b5cf6',
  food: '#f59e0b',
  accommodation: '#3b82f6',
  transportation: '#10b981',
  shopping: '#ec4899',
  attraction: '#8b5cf6',
  entertainment: '#f97316',
  other: '#6b7280',
};
