import FilterView from '../view/filter-view';
import TripInfoView from '../view/trip-info-view';
import { render, RenderPosition } from '../framework/render.js';

export default class HeaderMainPresenter {
  constructor ({tripInfoContainer, tripFilterContainer, filters}) {
    this.tripInfoContainer = tripInfoContainer;
    this.tripFilterContainer = tripFilterContainer;

    this.tripFilterComponent = new FilterView({filters});
    this.tripInfoComponent = new TripInfoView();
  }

  init() {
    render(this.tripInfoComponent, this.tripInfoContainer, RenderPosition.AFTERBEGIN);
    render(this.tripFilterComponent, this.tripFilterContainer, RenderPosition.AFTERBEGIN);
  }
}
