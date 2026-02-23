export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun', fullLabel: 'Sunday' },
  { value: 1, label: 'Mon', fullLabel: 'Monday' },
  { value: 2, label: 'Tue', fullLabel: 'Tuesday' },
  { value: 3, label: 'Wed', fullLabel: 'Wednesday' },
  { value: 4, label: 'Thu', fullLabel: 'Thursday' },
  { value: 5, label: 'Fri', fullLabel: 'Friday' },
  { value: 6, label: 'Sat', fullLabel: 'Saturday' },
];

export const HOUR_SLOTS = [
  { id: 'morning', label: 'Morning', description: '6AM – 12PM', representative: 9 },
  { id: 'afternoon', label: 'Afternoon', description: '12PM – 6PM', representative: 14 },
  { id: 'evening', label: 'Evening', description: '6PM – 10PM', representative: 20 },
  { id: 'night', label: 'Night', description: '10PM – 6AM', representative: 1 },
];

export const SUBMIT_SLOTS = [
  { id: 'all', label: 'All Time', description: 'Applies at all times', representative: -1 },
  ...HOUR_SLOTS,
];

export const getSlotLabel = (hour) => {
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 18) return 'Afternoon';
  if (hour >= 18 && hour < 22) return 'Evening';
  return 'Night';
};

export const getSlotForHour = (hour) => {
  const label = getSlotLabel(hour);
  return HOUR_SLOTS.find((s) => s.label === label);
};

export const getDayLabel = (day, full = false) => {
  if (day === -1) return full ? 'All days' : 'All';
  const entry = DAYS_OF_WEEK[day];
  if (!entry) return '';
  return full ? entry.fullLabel : entry.label;
};

export const getCurrentTimeDefaults = () => {
  const now = new Date();
  const day = now.getDay();
  const slot = getSlotForHour(now.getHours());
  return { day, hour: slot.representative };
};
