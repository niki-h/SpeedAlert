import document from 'document';
import { getLocationName } from '../commands';
import { getStateItem, setStateCallback, removeStateCallback } from '../state';
import { gettext } from "i18n";

let $button = null;
let $locationName = null;

function doSomething() {
  console.log('hallo detail');
  console.log(gettext('welcome'));
}

function draw() {
  $locationName.text = getStateItem('location');
}

export function destroy() {
  console.log('destroy detail page');
  $locationName = null;
  $button = null;
  removeStateCallback('detail');
}

export function init() {
  console.log('init detail page');
  $locationName = document.getElementById('location');
  $button = document.getElementById('back-button');
  $button.onclick = () => {
    destroy();
    document.history.back();
  };

  doSomething();
  getLocationName();
  setStateCallback('detail', draw);
  // draw();
}
