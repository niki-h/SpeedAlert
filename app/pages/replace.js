import document from 'document';
import { getLocationName } from '../commands';
import { getStateItem, setStateCallback, removeStateCallback } from '../state';
import { gettext } from 'i18n';

let $button = null;
let $locationName = null;

function doSomething() {
  console.log('hallo replace');
  console.log(gettext('welcome'));
}

function draw() {
  $locationName.text = getStateItem('location');
}

export function destroy() {
  console.log('destroy replace page');
  $locationName = null;
  $button = null;
  removeStateCallback('replace');
}

export function init() {
  console.log('init replace page');
  $locationName = document.getElementById('location');
  $button = document.getElementById('back-button');
  $button.onclick = () => {
    destroy();
    document.history.back();
  };

  doSomething();
  getLocationName();
  setStateCallback('replace', draw);
  // draw();
}
