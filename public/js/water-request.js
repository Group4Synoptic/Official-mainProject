document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('water-request-form').addEventListener('submit', async function (e) {
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
        // If backend returns error status, try to read error message or fallback
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


async function loadWaterRequests() {
  try {
    const response = await fetch('/api/water-request');

    if (!response.ok) {
      let errorMsg = 'Failed to load requests';
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const errData = await response.json();
        errorMsg = errData.message || errorMsg;
      } else {
        errorMsg = await response.text();
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log(data)

    const requestsList = document.getElementById('water-requests-list');
    requestsList.innerHTML = ''; // clear existing items

data.forEach(req => {
  const item = document.createElement('li');
  item.classList.add('request-item'); // for styling the container
  
  const litres = document.createElement('span');
  litres.classList.add('litres');
  litres.textContent = `${req.litres} Litres`;

  const urgency = document.createElement('span');
  urgency.classList.add('urgency');
  urgency.textContent = `Urgency: ${req.urgency}`;

  const completed = document.createElement('span');
  completed.classList.add('completed');
  completed.textContent = `Completed: ${req.request_completed}`;

  item.appendChild(litres);
  item.appendChild(document.createTextNode(' ')); // space between items
  item.appendChild(urgency);
  item.appendChild(document.createTextNode(' '));
  item.appendChild(completed);

  requestsList.appendChild(item);
});


  } catch (err) {
    console.error('Error fetching water requests:', err);
  }
}

loadWaterRequests();

const socket = io();


// ADDS NEW REQUESTS LIVE WITH THE SERVER 
socket.on('new-request', (data) => {

  const requestsList = document.getElementById('water-requests-list');
  if (requestsList) {
  const item = document.createElement('li');
  item.classList.add('request-item'); // for styling the container
  
  const litres = document.createElement('span');
  litres.classList.add('litres');
  litres.textContent = `${data.litres} Litres`;

  const urgency = document.createElement('span');
  urgency.classList.add('urgency');
  urgency.textContent = `Urgency: ${data.urgency}`;

  const completed = document.createElement('span');
  completed.classList.add('completed');
  completed.textContent = `Completed: false`;

  item.appendChild(litres);
  item.appendChild(document.createTextNode(' ')); // space between items
  item.appendChild(urgency);
  item.appendChild(document.createTextNode(' '));
  item.appendChild(completed);

  requestsList.appendChild(item);
  }
});
});
