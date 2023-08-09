import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import NewPointView from '../view/new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import ListView from '../view/list-view.js';
import { render } from '../render.js';

export default class TripEventsPresenter {
  tripSortComponent = new SortView();
  tripEventsComponent = new ListView();

  constructor ({tripEventsContainer}) {
    this.tripEventsContainer = tripEventsContainer;
  }

  init() {
    render(this.tripSortComponent, this.tripEventsContainer);
    render(this.tripEventsComponent, this.tripEventsContainer);
    render(new EditPointView(),this.tripEventsComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.tripEventsComponent.getElement());
    }

    render(new NewPointView(), this.tripEventsComponent.getElement());
  }
}
