import dayjs from 'dayjs';
import { getRandomArrayElement, generateID, getRandomInteger } from '../utils/utiles';
import { POINT_TYPES, OFFER_TITLES, CITY_DESCRIPTIONS } from './const.js';

const OFFERS = Object.keys(OFFER_TITLES).reduce((acc, type) => {
  acc[type] = OFFER_TITLES[type].map((title) => ({
    id: generateID(),
    title,
    price: getRandomInteger(5, 250)
  }));
  return acc;
}, {});

const generatePictures = () => {
  const picturesCount = getRandomInteger(1, 5);
  return new Array(picturesCount).fill().map(() => ({
    src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
    description: getRandomArrayElement(['nature', 'city', 'sea', 'mountaines'])
  }));
};


const generateDestination = () => {
  const name = getRandomArrayElement(Object.keys(CITY_DESCRIPTIONS));
  return {
    id: generateID(),
    description: CITY_DESCRIPTIONS[name],
    name,
    pictures: generatePictures()
  };
};

const destinationsMock = new Array(10).fill().map(generateDestination);

const generatePoint = () => {
  const type = getRandomArrayElement(POINT_TYPES);
  return {
    id: generateID(),
    basePrice: getRandomInteger(500, 2000),
    dateFrom: '2022-11-23T18:28:01.397Z',
    dateTo: '2022-11-24T23:28:01.397Z',
    /*dateFrom: dayjs().add(getRandomInteger(5, 15), 'day'),
    dateTo: dayjs().add(getRandomInteger(16, 30), 'day'),*/
    destination: getRandomArrayElement(destinationsMock).id,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: OFFERS[type].map((offer) => offer.id).slice(0,getRandomInteger(0,3)),
    type
  };
};

const pointsMock = new Array(10).fill().map(generatePoint);
const offersMock = POINT_TYPES.map((type) => ({ type, offers: OFFERS[type] }));

export {pointsMock, destinationsMock, offersMock};

//export { generatePoint, generateDestination, OFFERS};
