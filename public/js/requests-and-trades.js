document.addEventListener('DOMContentLoaded', () => {
  const requestsList = document.getElementById('water-requests-list');
  const waterForm = document.getElementById('water-request-form');

  // Handle water request form submission
  if (waterForm) {
    waterForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const data = {
        litres: document.getElementById('litres').value,
        urgency: document.getElementById('urgency').value,
        contact: document.getElementById('contact').value
      };

      try {
        const response = await fetch('/api/request-water', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
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

  // Load all water requests and trades
  async function loadAll() {
    requestsList.innerHTML = '';

    // Water requests
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

    // Trades
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

  // Socket.io for live updates
  const socket = io();

  socket.on('new-request', (data) => {
    const item = document.createElement('li');
    item.classList.add('request-item');
    item.innerHTML = `<strong>Water Request:</strong> ${data.litres} Litres | Urgency: ${data.urgency} | Completed: false`;
    requestsList.appendChild(item);
  });

  socket.on('new-trade', (data) => {
    const item = document.createElement('li');
    item.classList.add('trade-item');
    const direction = data.trade_type === 'water' ? 'Water → Electricity' : 'Electricity → Water';
    item.innerHTML = `<strong>Trade:</strong> ${direction} | Amount: ${data.amount} | You Receive: ${data.calculated_return} | Contact: ${data.contact_info}`;
    requestsList.appendChild(item);
  });
});