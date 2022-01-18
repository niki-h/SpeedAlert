import * as cbor from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import * as messaging from 'messaging';
import { geolocation } from 'geolocation';
import { API_KEY } from './keys';
import { API_KEYY } from './keys';

/* Settings */
function sendSettings() {
  const settings = {
    list: settingsStorage.getItem('alert')
      ? JSON.parse(settingsStorage.getItem('alert')).map((item) => item.value)
      : [],
    soortalert: settingsStorage.getItem('soortalert')
      ? JSON.parse(settingsStorage.getItem('soortalert')).values[0].value
      : '',
    alert: settingsStorage.getItem('list')
      ? JSON.parse(settingsStorage.getItem('list')).map((item) => item.value)
      : [],
    letter: settingsStorage.getItem('letter')
      ? JSON.parse(settingsStorage.getItem('letter')).values[0].value
      : '',
  };

  outbox
    .enqueue('settings.cbor', cbor.encode(settings))
    .then(() => console.log('settings sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

settingsStorage.addEventListener('change', sendSettings);

/* Sending short messages */
function sendShortMessage() {
  const data = {
    companionTimestamp: new Date().getTime(),
  };

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

messaging.peerSocket.addEventListener('open', () => {
  setInterval(sendShortMessage, 10000);
});

messaging.peerSocket.addEventListener('error', (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

/* API Fetch */
async function fetchLocationName(coords) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=${API_KEY}`;

  const response = await fetch(url);
  const json = await response.json();

  let location = '';
  json.features.forEach((feature) => {
    if (
      !location /*feature.place_type[0] === 'locality' ||
        feature.place_type[0] === 'place' ||*/ &&
      feature.place_type[0] === 'address'
    ) {
      location = feature.text;
    }
  });

  outbox
    .enqueue('location.cbor', cbor.encode({ location }))
    .then(() => console.log(location + ' as location sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

/* Location functions */
var watchID = geolocation.watchPosition(locationSuccess, locationError, {
  timeout: 60 * 1000,
});

/*API Fetch snap to road*/
async function getLimits(points) {
  const url = `https://dev.virtualearth.net/REST/v1/Routes/SnapToRoadAsync?points=${points}&interpolate=true&includeSpeedLimit=true&includeTruckSpeedLimit=false&speedUnit=MPH&travelMode=driving&key=${API_KEYY}`;
  console.log(url);
  const response = await fetch(url);
  console.log(response);
}

function locationSuccess(location) {
  fetchLocationName(location.coords);
  getLimits(location.coords.longitude + ',' + location.coords.latitude);
}

function locationError(error) {
  console.log(`Error: ${error.code}`, `Message: ${error.message}`);
  // Handle location error (send message to device to show error)
}

/* Handle messages coming from device */
function processMessaging(evt) {
  console.log(evt.data);
  switch (evt.data.command) {
    case 'location':
      geolocation.getCurrentPosition(locationSuccess, locationError);
      break;
    default:
      //
      break;
  }
}

messaging.peerSocket.addEventListener('message', processMessaging);
