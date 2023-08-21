import {Filters} from '../utils/utiles.js';


function generateFilter(points) {
  return Object.entries(Filters).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      count: filterPoints(points).length,
    }),
  );
}

export {generateFilter};
