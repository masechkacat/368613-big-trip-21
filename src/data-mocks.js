import dayjs from 'dayjs';
import { getRandomArrayElement, generateID, getRandomInteger } from './utiles';


// Генерация данных
const CITY_DESCRIPTIONS = {
  'Paris': 'Paris, known for its romantic ambiance, and its status as the world\'s fashion capital.',
  'London': 'London, a historic city blending modernity and traditions.',
  'New York': 'New York, the city that never sleeps and an epicenter of arts.',
  'Tokyo': 'Tokyo, a bustling hub of innovation and ancient traditions.',
  'Chamonix': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.'
};

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight'];

const OFFERS = {
  'taxi': [
    { id: generateID(), title: 'Upgrade to a business class', price: 120 },
    { id: generateID(), title: 'Choose the radio station', price: 60 },
    { id: generateID(), title: 'Drive quickly, I am in a hurry', price: 100 }
  ],
  'flight': [
    {id: generateID(), title: 'Choose a sit', price: 50},
    {id: generateID(), title: 'Add extra baggage', price: 70},
    {id: generateID(), title: 'Switch to business class', price: 200}
  ],
  'train': [
    {id: generateID(), title: 'First class seat', price: 80},
    {id: generateID(), title: 'Add a meal', price: 20},
    {id: generateID(), title: 'WiFi access', price: 5}
  ]
};

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
  return {
    id: generateID(),
    basePrice: getRandomInteger(500, 2000),
    dateFrom: dayjs().add(getRandomInteger(1, 10), 'day').toISOString(),
    dateTo: dayjs().add(getRandomInteger(11, 20), 'day').toISOString(),
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
