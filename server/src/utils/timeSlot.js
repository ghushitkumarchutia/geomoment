const extractDayAndHour = (date = new Date()) => {
  return {
    dayOfWeek: date.getDay(),
    hourSlot: date.getHours(),
  };
};

module.exports = { extractDayAndHour };
