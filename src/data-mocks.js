import { pointTypes, cities, DESCRIPTIONS } from './const.js';
import { getRandomInteger, getRandomDescription } from './utils.js';

const generateMockPoint = () => {
  const id = `point-${getRandomInteger(1, 100)}`;
  const type = pointTypes[getRandomDescription(Object.keys(pointTypes))];
  const city = cities[getRandomInteger(0, cities.length - 1)];
  const description = getRandomDescription(DESCRIPTIONS);

  return {
    id,
    type,
    city,
    description
  };
};

const generateMockDestination = () => {
  const id = `destination-${getRandomInteger(1, 100)}`;
  const name = cities[getRandomInteger(0, cities.length - 1)];
  const description = getRandomDescription(DESCRIPTIONS);

  return {
    id,
    name,
    description
  };
};

const generateMockOffer = (type) => {
  const id = `offer-${type}-${getRandomInteger(1, 100)}`;
  const title = getRandomDescription(DESCRIPTIONS);
  const price = getRandomInteger(10, 100);

  return {
    id,
    title,
    price
  };
};

export const MOCK_OFFERS = Object.keys(pointTypes).map((type) => ({
  type,
  offers: Array.from({ length: 2 }, () => generateMockOffer(type)),
}));

export const MOCK_DESTINATIONS = Array.from({ length: 5 }, generateMockDestination);

export const MOCK_POINTS = Array.from({ length: 10 }, generateMockPoint);
