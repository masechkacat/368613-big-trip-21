import AbstractView from '../framework/view/abstract-view.js';
import { formatDate, FormatsDate } from '../utils/utiles.js';

function createRouteTemplate(names){
  if(names.length > 3){
    return `${names[0]} - ... - ${names[names.length - 1]}`;
  }else{
    return names.map((name) => name).join(' &mdash; ');
  }
}

function createTripInfoTemplate(totalSumm, namesDestinations, datesTrip){
  return `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${createRouteTemplate(namesDestinations)}</h1>

      <p class="trip-info__dates">${formatDate(datesTrip.tripDateFrom, FormatsDate.MONTHDAY)}&nbsp;&mdash;&nbsp;${formatDate(datesTrip.tripDateTo, FormatsDate.MONTHDAY)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalSumm}</span>
    </p>
  </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #totalSumm = null;
  #namesDestinations = null;
  #datesTrip = null;

  constructor({totalSumm, namesDestinations, datesTrip}){
    super();
    this.#totalSumm = totalSumm;
    this.#namesDestinations = namesDestinations;
    this.#datesTrip = datesTrip;
  }

  get template(){
    return createTripInfoTemplate(this.#totalSumm, this.#namesDestinations, this.#datesTrip);
  }
}

/*function createTripInfoTemplate() {
  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>
  </section>
`
  );
}

export default class TripInfoView extends AbstractView {
  get template() {
    return createTripInfoTemplate();
  }
}*/
