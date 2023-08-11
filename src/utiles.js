import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (arr) => arr[getRandomInteger(0, arr.length - 1)];

const generateID = () => Math.random().toString(36).substring(2, 10);

const formatDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

export {getRandomInteger, getRandomArrayElement, generateID, formatDate};
