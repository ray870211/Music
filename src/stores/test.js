function calculateDaysBetweenDates(begin, end) {
  var beginDate = new Date(begin);
  var endDate = new Date(end);
  var days = (endDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24);
  return days;
}
