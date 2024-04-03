import dayjs from 'dayjs';

export function formatDate(
  date: string | number | Date | undefined | null
): string {
  if (!date) return '';
  return dayjs(date).format('DD/MM/YYYY');
}

export function formatMonthDate(
  date: string | number | Date | undefined | null
): string {
  if (!date) return '';
  return dayjs(date).format('MM/YYYY');
}

export function formatHour(
  date: string | Date | undefined | null,
  systemTime: boolean = false
) {
  if (!date) return '';
  const newDate = new Date(date);
  if (!systemTime) newDate.setHours(newDate.getHours() - 3);
  return dayjs(newDate).format('HH:mm');
}

export function formatDateAndHour(
  date: string | Date | undefined | null,
  systemTime: boolean = false
) {
  if (!date) return '';
  const newDate = new Date(date);
  if (!systemTime) newDate.setHours(newDate.getHours() - 3);
  return dayjs(newDate).format('DD/MM/YYYY HH:mm');
}
