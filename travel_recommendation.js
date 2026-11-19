const resultsDiv = document.getElementById('results');

function localTime(name) {
  const zones = {
    'Sydney': 'Australia/Sydney', 'Melbourne': 'Australia/Melbourne',
    'Tokyo': 'Asia/Tokyo', 'Kyoto': 'Asia/Tokyo',
    'Rio de Janeiro': 'America/Sao_Paulo', 'São Paulo': 'America/Sao_Paulo',
    'Cambodia': 'Asia/Phnom_Penh', 'India': 'Asia/Kolkata',
    'French Polynesia': 'Pacific/Tahiti', 'Brazil': 'America/Sao_Paulo'
  };
  const key = Object.keys(zones).find(k => name.includes(k));
  if (!key) return '';
  return new Date().toLocaleTimeString('en-US', { timeZone: zones[key], hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' });
}

function render(items) {
  resultsDiv.innerHTML = '';
  if (!items.length) {
    resultsDiv.innerHTML = '<div class="msg">No recommendations found. Try "beach", "temple" or "country".</div>';
    return;
  }
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    const t = localTime(item.name);
    card.innerHTML = `<img src="${item.imageUrl}" alt="${item.name}">
      <div class="body"><h3>${item.name}</h3>${t ? `<p class="time">Local time: ${t}</p>` : ''}
      <p>${item.description}</p><br><button class="btn">Visit</button></div>`;
    resultsDiv.appendChild(card);
  });
}

function searchCondition() {
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  fetch('travel_recommendation_api.json')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      let items = [];
      if (['beach', 'beaches'].includes(keyword)) items = data.beaches;
      else if (['temple', 'temples'].includes(keyword)) items = data.temples;
      else if (['country', 'countries'].includes(keyword)) items = data.countries.flatMap(c => c.cities);
      else {
        const country = data.countries.find(c => c.name.toLowerCase() === keyword);
        if (country) items = country.cities;
      }
      render(items);
    })
    .catch(err => {
      console.error('Error:', err);
      resultsDiv.innerHTML = '<div class="msg">An error occurred while fetching data.</div>';
    });
}

function clearResults() {
  document.getElementById('searchInput').value = '';
  resultsDiv.innerHTML = '';
}

document.getElementById('btnSearch').addEventListener('click', searchCondition);
document.getElementById('btnClear').addEventListener('click', clearResults);
document.getElementById('searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') searchCondition(); });
