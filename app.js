const container = document.getElementById('countriesContainer');
const searchInput = document.getElementById('search');
const regionSelect = document.getElementById('region');

let countries = [];

/* ================= MAP INIT ================= */
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const markersLayer = L.layerGroup().addTo(map);

/* ================= FETCH DATA ================= */
async function fetchCountries() {
  const res = await fetch(
    'https://restcountries.com/v3.1/all?fields=name,region,population,flags,latlng'
  );
  const data = await res.json();

  countries = data;
  renderCountries(countries);
}

/* ================= RENDER ================= */
function renderCountries(data) {
  container.innerHTML = '';
  markersLayer.clearLayers();

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

    if (country.latlng) {
      const marker = L.marker(country.latlng).bindPopup(`
        <strong>${country.name.common}</strong><br>
        Region: ${country.region}<br>
        Population: ${formatNumber(country.population)}
      `);

      markersLayer.addLayer(marker);

      // Click card → zoom map
      card.addEventListener('click', () => {
        map.setView(country.latlng, 5);
        marker.openPopup();
      });
    }
  });
}

/* ================= FILTER ================= */
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

/* ================= HELPERS ================= */
function formatNumber(num) {
  return num.toLocaleString();
}

searchInput.addEventListener('input', applyFilters);
regionSelect.addEventListener('change', applyFilters);

fetchCountries();
