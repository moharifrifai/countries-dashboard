const container = document.getElementById('countriesContainer');
const searchInput = document.getElementById('search');
const regionSelect = document.getElementById('region');

let countries = [];

async function fetchCountries() {
  const res = await fetch('https://restcountries.com/v3.1/all');
  const data = await res.json();

  countries = data;
  renderCountries(countries);
}

function renderCountries(data) {
  container.innerHTML = '';

  data.forEach(country => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common}">
      <div class="card-body">
        <h3>${country.name.common}</h3>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${formatNumber(country.population)}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

function formatNumber(num) {
  return num.toLocaleString();
}

function applyFilters() {
  const searchValue = searchInput.value.toLowerCase();
  const regionValue = regionSelect.value;

  let filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(searchValue)
  );

  if (regionValue !== 'all') {
    filtered = filtered.filter(c => c.region === regionValue);
  }

  renderCountries(filtered);
}

searchInput.addEventListener('input', applyFilters);
regionSelect.addEventListener('change', applyFilters);

fetchCountries();
