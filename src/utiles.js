import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const FormatsDate = {
  MONTHDAY: 'MMM DD',
  HOURMIN: 'HH:mm',
  DMYHM: 'DD/MM/YY HH:mm'
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (arr) => arr[getRandomInteger(0, arr.length - 1)];

const generateID = () => Math.random().toString(36).substring(2, 10);

const formatDate = (date, neededFormat) => dayjs(date).format(neededFormat);

function formatDuration(startDate, endDate) {
  const diff = endDate.diff(startDate);
  const durationObj = dayjs.duration(diff);

  const days = durationObj.days() > 0 ? `${durationObj.format('DD')}D ` : '';
  const hours = (durationObj.hours() > 0 || days) ? `${durationObj.format('HH')}H ` : '';
  const minutes = `${durationObj.format('mm')}M`;

  return `${days}${hours}${minutes}`.trim();
}

export {getRandomInteger, getRandomArrayElement, generateID, formatDate, formatDuration, FormatsDate};
