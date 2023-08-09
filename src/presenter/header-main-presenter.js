import FilterView from '../view/filter-view';
import TripInfoView from '../view/trip-info-view';
import { render } from '../render.js';

export default class HeaderMainPresenter {
  tripFilterComponent = new FilterView();
  tripInfoComponent = new TripInfoView();

  constructor ({tripFilterContainer}) {
    this.tripFilterContainer = tripFilterContainer;
  }

  init() {
    render(this.tripInfoComponent, this.tripFilterContainer, 'afterbegin');
    render(this.tripFilterComponent, this.tripFilterContainer, 'beforeend');
  }
}
