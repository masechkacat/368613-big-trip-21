import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(duration);
dayjs.extend(utc);

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

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const EditType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const FormatsDate = {
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
  [FilterType.PRESENT]: (points) => points.filter((point) => dayjs(point.dateFrom)
    .isSameOrBefore(dayjs()) && dayjs(point.dateTo).isSameOrAfter(dayjs())),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo).isBefore(dayjs()))
};


function getPointsByDate(pointA, pointB) {
  return dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom));
}

function getPointsByDuration(pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
}

function getEPointsByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (arr) => arr[getRandomInteger(0, arr.length - 1)];

const generateID = () => Math.random().toString(36).substring(2, 10);

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

export {getRandomInteger, getRandomArrayElement, generateID, formatDate, isSameDates, isSamePrices,
  formatDuration, getPointsByDate, getPointsByDuration, getEPointsByPrice, Mode,
  SortType, FormatsDate, filter, UserAction, EditType, UpdateType, FilterType};
