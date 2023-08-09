import FilterView from './view/filter-view.js';
import {render} from './render.js';

const siteHeaderContainer = document.querySelector('.page-header');
const siteFilterControls = siteHeaderContainer.querySelector('.trip-controls__filters');

render(new FilterView(), siteFilterControls);
