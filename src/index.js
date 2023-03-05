import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryData: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch() {
  const country = refs.input.value.trim();
  if (!country) {
    clearCountryCard();
    return;
  }

  fetchCountries(country)
    .then(countries => {
      if (countries.length > 10) {
        clearCountryCard();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countries.length >= 2 && countries.length <= 10) {
        clearCountryCard();
        addingCountryName(countries);
      }
      if (countries.length === 1) {
        clearCountryCard();
        addingCountryData(countries);
        addingCountryName(countries);
      }
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function addingCountryName(arrayCountryName) {
  const countryCardMarkup = arrayCountryName
    .map(({ name, flags }) => {
      return `<li class = "country-list__item"><img src="${flags.svg}" alt="${name.common}" width="60" height="45"><span class = "country-list__name">${name.official}</span></li>`;
    })
    .join('');
  refs.countriesList.innerHTML = countryCardMarkup;
}

function addingCountryData(countryName) {
  const countryCardMarkup = countryName.map(
    ({ capital, population, languages }) => {
      return `<p class = "country-info__data"><b>Capital:</b> ${capital}</p>
      <p class = "country-info__data"><b>Population:</b> ${population}</p>
      <p class = "country-info__data"><b>Languages:</b> ${Object.values(
        languages
      ).join(', ')}</p>`;
    }
  );
  refs.countryData.innerHTML = countryCardMarkup;
}

function clearCountryCard() {
  refs.countriesList.innerHTML = '';
  refs.countryData.innerHTML = '';
}
