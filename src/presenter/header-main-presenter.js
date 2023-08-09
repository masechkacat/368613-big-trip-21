import FilterView from '../view/filter-view';
import TripInfoView from '../view/trip-info-view';
import { render } from '../render.js';

export default class HeaderMainPresenter {
  tripFilterComponent = new FilterView();
  tripInfoComponent = new TripInfoView();

  constructor ({tripInfoContainer, tripFilterContainer}) {
    this.tripInfoContainer = tripInfoContainer;
    this.tripFilterContainer = tripFilterContainer;
  }

  init() {
    render(this.tripInfoComponent, this.tripInfoContainer, 'afterbegin');
    render(this.tripFilterComponent, this.tripFilterContainer, 'afterbegin');
  }
}
