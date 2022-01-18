import { gettext } from 'i18n';

const car = gettext('car');
const truck = gettext('truck');
const both = gettext('both');

const list = [
  { name: car, value: car },
  { name: truck, value: truck },
  { name: both, value: both },
];

const short = gettext('short');
const long = gettext('long');

const alert = [
  { name: short, value: short },
  { name: long, value: long },
];

/* Main Settings Page */
function renderMainPage(props) {
  return (
    <Page>
      <Section title="Settings">
        <Text>{gettext('hello_world')}</Text>
        <Select
          settingsKey="letter"
          label={gettext('remember_vehicle')}
          options={list}
        />
        <Select
          settingsKey="soortalert"
          label={gettext('alert')}
          options={alert}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage((props) => {
  let result = renderMainPage;

  return result(props);
});
