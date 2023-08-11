import dayjs from 'dayjs';
import { getRandomArrayElement, generateID, getRandomInteger, formatDate } from './utiles';
import { POINT_TYPES, OFFER_TITLES, CITY_DESCRIPTIONS } from './const,js';

const OFFERS = Object.keys(OFFER_TITLES).reduce((acc, type) => {
  acc[type] = OFFER_TITLES[type].map((title) => ({
    id: generateID(),
    title,
    price: getRandomInteger(5, 250)
  }));
  return acc;
}, {});

const generatePictures = () => ({
  src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 1000)}`,
  description: getRandomArrayElement(['nature', 'city', 'sea', 'mountaines'])
});


const generateDestination = () => {
  const name = getRandomArrayElement(Object.keys(CITY_DESCRIPTIONS));
  return {
    id: generateID(),
    description: CITY_DESCRIPTIONS[name],
    name,
    pictures: generatePictures()
  };
};

const generatePoint = () => {
  const type = getRandomArrayElement(POINT_TYPES);
  const dateFrom = dayjs().add(getRandomInteger(1, 10), 'day');
  const dateTo = dayjs(dateFrom).add(getRandomInteger(1, 10), 'day');
  return {
    id: generateID(),
    basePrice: getRandomInteger(500, 2000),
    dateFrom: formatDate(dateFrom),
    dateTo: formatDate(dateTo),
    destination: generateDestination().id,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: OFFERS[type].map((offer) => offer.id),
    type
  };
};

const points = new Array(10).fill().map(generatePoint);
const destinations = new Array(10).fill().map(generateDestination);
const offers = POINT_TYPES.map((type) => ({ type, offers: OFFERS[type] }));

export { points, destinations, offers };
