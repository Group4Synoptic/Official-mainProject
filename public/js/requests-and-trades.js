// --- MAIN LOGIC ON PAGE LOAD ---
document.addEventListener('DOMContentLoaded', () => {
  const requestsList = document.getElementById('water-requests-list');
  const waterForm = document.getElementById('water-request-form');
  const socket = io();

  // --- SOCKET.IO LIVE UPDATES ---
  // When a new water request is made , update the graph and add to the list
  socket.on('new-request', (data) => {
    renderReservoirGraph();
    const item = document.createElement('li');
    item.classList.add('request-item');
    item.innerHTML = `<strong>Water Request:</strong> ${data.litres} Litres | Urgency: ${data.urgency} | Completed: false`;
    requestsList.appendChild(item);
  });

  // When a new trade is made, add it to the list
  socket.on('new-trade', (data) => {
    const item = document.createElement('li');
    item.classList.add('trade-item');
    const direction = data.trade_type === 'water' ? 'Water → Electricity' : 'Electricity → Water';
    item.innerHTML = `<strong>Trade:</strong> ${direction} | Amount: ${data.amount} | You Receive: ${data.calculated_return} | Contact: ${data.contact_info}`;
    requestsList.appendChild(item);
  });

  // --- WATER REQUEST FORM SUBMISSION ---
  if (waterForm) {
    waterForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Gather form data
      const data = {
        litres: document.getElementById('litres').value,
        urgency: document.getElementById('urgency').value,
        contact: document.getElementById('contact').value,
        reservoir_id: document.getElementById('reservoir-select').value
      };

      try {
        const response = await fetch('/api/request-water', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          // Try to get a nice error message from the server
          let errorMsg = 'Something went wrong';
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const errData = await response.json();
            errorMsg = errData.message || errorMsg;
          } else {
            errorMsg = await response.text();
          }
          throw new Error(errorMsg);
        }

        const result = await response.json();
        alert(result.message);

      } catch (err) {
        alert(err.message || 'Something went wrong');
        console.error(err);
      }
    });
  }

  // --- INITIAL DATA LOAD ---
  // Loads all water requests and trades on page load
  async function loadAll() {
    requestsList.innerHTML = '';

    // Load water requests
    try {
      const waterRes = await fetch('/api/water-request');
      if (waterRes.ok) {
        const waterData = await waterRes.json();
        waterData.forEach(req => {
          const item = document.createElement('li');
          item.classList.add('request-item');
          item.innerHTML = `<strong>Water Request:</strong> ${req.litres} Litres | Urgency: ${req.urgency} | Completed: ${req.request_completed}`;
          requestsList.appendChild(item);
        });
      }
    } catch (err) {
      console.error('Error loading water requests:', err);
    }

    // Load trades
    try {
      const tradeRes = await fetch('/api/trades');
      if (tradeRes.ok) {
        const tradeData = await tradeRes.json();
        tradeData.forEach(trade => {
          const item = document.createElement('li');
          item.classList.add('trade-item');
          const direction = trade.trade_type === 'water' ? 'Water → Electricity' : 'Electricity → Water';
          item.innerHTML = `<strong>Trade:</strong> ${direction} | Amount: ${trade.amount} | You Receive: ${trade.calculated_return} | Contact: ${trade.contact_info}`;
          requestsList.appendChild(item);
        });
      }
    } catch (err) {
      console.error('Error loading trades:', err);
    }
  }

  loadAll();
  renderReservoirGraph();
  populateReservoirDropdown();
});


// --- RESERVOIR DROPDOWN POPULATION ---
// This function fills the dropdown with all reservoirs, disabling any under maintenance
async function populateReservoirDropdown() {
  const select = document.getElementById('reservoir-select');
  if (!select) return;
  select.innerHTML = '<option value="">Select Reservoir</option>';
  try {
    const res = await fetch('/api/reservoirs');
    const reservoirs = await res.json();
    reservoirs.forEach(r => {
      const option = document.createElement('option');
      option.value = r.id;
      option.textContent = r.name + (r.status === 'maintenance' ? ' (Under Maintenance)' : '');
      if (r.status === 'maintenance') option.disabled = true;
      select.appendChild(option);
    });
  } catch (e) {
    select.innerHTML = '<option>Error loading reservoirs</option>';
  }
}


// --- RESERVOIR GRAPH RENDERING ---
// This draws the bar chart showing current and post-request water levels
async function renderReservoirGraph() {
  const ctx = document.getElementById('reservoir-graph')?.getContext('2d');
  if (!ctx) return;

  // Destroy previous chart if it exists (Chart.js requirement)
  if (window.reservoirChart) {
    window.reservoirChart.destroy();
  }

  // Get all reservoirs and all water requests
  const [reservoirsRes, requestsRes] = await Promise.all([
    fetch('/api/reservoirs'),
    fetch('/api/water-request', { credentials: 'include' })
  ]);
  const reservoirs = await reservoirsRes.json();
  const requests = await requestsRes.json();

  // Calculate total requested per reservoir
  const requestedMap = {};
  requests.forEach(req => {
    if (!requestedMap[req.reservoir_id]) requestedMap[req.reservoir_id] = 0;
    requestedMap[req.reservoir_id] += Number(req.litres);
  });

  // Prepare data for the chart
  const labels = reservoirs.map(r => r.name);
  const currentLevels = reservoirs.map(r => Number(r.current_level));
  const afterRequests = reservoirs.map(r => {
    const requested = requestedMap[r.id] || 0;
    return Math.max(0, Number(r.current_level) - requested);
  });

  // Draw the chart
  window.reservoirChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Current Water Available (L)',
          data: currentLevels,
          backgroundColor: 'rgba(0, 123, 255, 0.6)'
        },
        {
          label: 'After Your Requests (L)',
          data: afterRequests,
          backgroundColor: 'rgba(40, 167, 69, 0.6)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Reservoir Water Levels' }
      }
    }
  });
}