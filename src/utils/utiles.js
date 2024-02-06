import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(duration);
dayjs.extend(utc);

const UiTimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  CREATING: 'CREATING',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT'
};

const ApiServiceConnector = {
  AUTHORIZATION: 'Basic rsfjl2uxok12',
  END_POINT: 'https://21.objects.htmlacademy.pro/spec/project/big-trip'
};

const ApiServiceMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};


const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  ERROR: 'ERROR'
};


const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const FormatsDate = {
  DAYMONTH: 'DD MMM',
  MONTHDAY: 'MMM DD',
  HOURMIN: 'HH:mm',
  DMYHM: 'DD/MM/YY HH:mm'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs())),
  [FilterType.PRESENT]: (points) => points.filter((point) =>
    (dayjs(point.dateFrom).isSameOrBefore(dayjs()) && dayjs(point.dateTo).isSameOrAfter(dayjs())) ||
    (dayjs(point.dateFrom).isSame(dayjs(), 'day') && dayjs(point.dateTo).isSame(dayjs(), 'day'))),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo).isBefore(dayjs()))
};

function getPointsByDate(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function getPointsByDuration(pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
}

function getEPointsByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

const formatDate = (date, neededFormat) => dayjs(date).format(neededFormat);

function formatDuration(startDate, endDate) {
  const diff = dayjs(endDate).diff(dayjs(startDate));
  const durationObj = dayjs.duration(diff);

  const days = durationObj.days() > 0 ? `${durationObj.format('DD')}D ` : '';
  const hours = (durationObj.hours() > 0 || days) ? `${durationObj.format('HH')}H ` : '';
  const minutes = `${durationObj.format('mm')}M`;

  return `${days}${hours}${minutes}`.trim();
}

function isSameDates(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

function isSamePrices(priceA, priceB) {
  return (priceA === null && priceB === null) || (priceA === priceB);
}

export {formatDate, isSameDates, isSamePrices, formatDuration, getPointsByDate, getPointsByDuration, getEPointsByPrice,
  Mode, UiTimeLimit, SortType, FormatsDate, filter, UserAction, UpdateType, FilterType, ApiServiceConnector, ApiServiceMethod};
