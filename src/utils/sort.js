import { SortType, getPointsByDate, getPointsByDuration,getEPointsByPrice } from './utiles';

if(!Array.prototype.toSorted){
  Array.prototype.toSorted = function (fn){
    return [...this].sort(fn);
  };
}

const sort = {
  [SortType.DAY]: (events) => events.toSorted(getPointsByDate),
  [SortType.PRICE]: (events) => events.toSorted(getEPointsByPrice),
  [SortType.TIME]: (events) => events.toSorted(getPointsByDuration),
  [SortType.EVENT]: () => {
    throw new Error(`Сортивка по ${SortType.EVENT} недоступна`);
  },
  [SortType.OFFER]: () => {
    throw new Error(`Сортивка по ${SortType.OFFER} недоступна`);
  }
};

export {sort};
