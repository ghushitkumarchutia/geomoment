import { formatDistanceToNow } from 'date-fns';
import { DAYS_OF_WEEK } from './timeSlots';

export const formatTimeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });

export const formatDaySlot = (day, hour) => {
  const dayLabel = DAYS_OF_WEEK[day]?.label || '';
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${dayLabel} ${displayHour}${period}`;
};

export const formatHour = (hour) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
};

export const truncateNote = (text, maxLength = 60) => {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.slice(0, maxLength)}…`;
};
