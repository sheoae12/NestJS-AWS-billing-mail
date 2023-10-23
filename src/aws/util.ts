export function getKoreaCurrentTime() {
  const curr = new Date();
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;

  // UTC to KST
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const kr_curr = new Date(utc + KR_TIME_DIFF);

  return kr_curr;
}

export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLastMonthDates() {
  const today = getKoreaCurrentTime();
  const lastMonth = new Date(today);

  // 현재 날짜를 이전 달로 설정
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  lastMonth.setDate(1);

  // 이전 달의 마지막 날 계산
  const lastDay = new Date(
    lastMonth.getFullYear(),
    lastMonth.getMonth() + 1,
    0,
  );

  // 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환
  const firstDayFormatted = formatDate(lastMonth);
  const lastDayFormatted = formatDate(lastDay);

  return {
    firstDay: firstDayFormatted,
    lastDay: lastDayFormatted,
  };
}
