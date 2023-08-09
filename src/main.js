import FilterView from './view/filter-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import {render} from './render.js';

const siteHeaderContainer = document.querySelector('.page-header');
const siteFilterControls = siteHeaderContainer.querySelector('.trip-controls__filters');
const siteBodyContainer = document.querySelector('.page-main');
const siteEventsElement = siteBodyContainer.querySelector('.trip-events');
const tripEventsPresenter = new TripEventsPresenter({tripEventsContainer: siteEventsElement});


render(new FilterView(), siteFilterControls);

tripEventsPresenter.init();
