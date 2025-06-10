// This script dynamically loads the interactive map and reservoir/trading data
document.addEventListener('DOMContentLoaded', () => {
    //  Custom marker icons for different types/statuses 
    const yellowIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    const blackIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
  
    //  Example data for water reservoirs (spread across Makers Valley) 
    const reservoirs = [
      {
        name: "Main Community Reservoir",
        lat: -26.1976, lng: 28.0781,
        capacity: "500,000 L", status: "Operational",
        description: "Primary water supply for Makers Valley. Monitored 24/7."
      },
      {
        name: "East Valley Tank",
        lat: -26.1992, lng: 28.0905,
        capacity: "200,000 L", status: "Under Maintenance",
        description: "Currently being upgraded for increased capacity."
      },
      {
        name: "Youth Centre Reservoir",
        lat: -26.1928, lng: 28.0739,
        capacity: "120,000 L", status: "Operational",
        description: "Supports local schools and youth programs."
      },
      {
        name: "Community Park Tank",
        lat: -26.2010, lng: 28.0830,
        capacity: "150,000 L", status: "Operational",
        description: "Provides water for the community park and recreational areas."
      },
      {
        name: "North Valley Reservoir",
        lat: -26.1900, lng: 28.0825,
        capacity: "300,000 L", status: "Operational",
        description: "Serves the northern part of Makers Valley, ensuring consistent supply."
      },
      {
        name: "Westside Water Tank",
        lat: -26.1965, lng: 28.0680,
        capacity: "180,000 L", status: "Operational",
        description: "Supports residential areas and local businesses."
      },
      {
        name: "Central Market Reservoir",
        lat: -26.1970, lng: 28.0790,
        capacity: "250,000 L", status: "Operational",
        description: "Critical supply for the central market area, ensuring water availability for vendors."
      },
      {
        name: "South Valley Tank",
        lat: -26.2050, lng: 28.0810,
        capacity: "220,000 L", status: "Operational",
        description: "Supports the southern residential areas and local businesses."
      },
      {
        name: "Heritage Site Reservoir",
        lat: -26.1935, lng: 28.0945,
        capacity: "100,000 L", status: "Operational",
        description: "Located near the heritage site, providing water for preservation efforts."
      },
      {
        name: "Sports Complex Tank",
        lat: -26.2005, lng: 28.0705,
        capacity: "130,000 L", status: "Operational",
        description: "Supplies water for the local sports complex and events."
      }
    ];
  
    // Example data for electricity trading points (black markers) 
    const tradingPoints = [
      {
        name: "East Valley Electricity Exchange",
        lat: -26.1995, lng: 28.0925,
        description: "Local hub for trading electricity credits and resources."
      },
      {
        name: "North Market Power Swap",
        lat: -26.1905, lng: 28.0800,
        description: "Community-driven electricity trading point."
      },
      {
        name: "Southside Energy Hub",
        lat: -26.2055, lng: 28.0780,
        description: "Trade and share electricity with your neighbors."
      }
    ];
  
    //  Initialize the Leaflet map, centered on Makers Valley 
    const map = L.map('reservoir-map').setView([-26.1976, 28.0781], 13);
  
    //  Add OpenStreetMap tiles 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  
    //  Add markers for each reservoir 
    reservoirs.forEach(res => {
      const markerOptions = res.status === "Under Maintenance" ? { icon: yellowIcon } : {};
      const marker = L.marker([res.lat, res.lng], markerOptions).addTo(map);
      marker.bindPopup(
        `<strong>${res.name}</strong><br>
        Capacity: ${res.capacity}<br>
        Status: <span style="color:${res.status === 'Operational' ? 'green' : 'orange'}">${res.status}</span><br>
        <em>${res.description}</em>`
      );
    });
  
    //  Add black markers for electricity trading points 
    tradingPoints.forEach(tp => {
      const marker = L.marker([tp.lat, tp.lng], { icon: blackIcon }).addTo(map);
      marker.bindPopup(
        `<strong>${tp.name}</strong><br>
        <span style="color:#ffd60a;">Electricity Trading Point</span><br>
        <em>${tp.description}</em>`
      );
    });
  
    //  Fit map to show all markers (reservoirs + trading points) 
    const allLatLngs = [
      ...reservoirs.map(r => [r.lat, r.lng]),
      ...tradingPoints.map(tp => [tp.lat, tp.lng])
    ];
    const group = new L.featureGroup(allLatLngs.map(latlng => L.marker(latlng)));
    map.fitBounds(group.getBounds().pad(0.2));
  });

// DYNAMICALLY LOAD SECTION UNDER MAP
  // Dynamically load the reservoir info section from app.json
fetch('json/app.json')
.then(res => res.json())
.then(data => {
  const info = data.reservoirInfo;
  const container = document.getElementById('reservoirs-info-row');
  if (!container) return;

  // Create info section
  const infoSection = document.createElement('section');
  infoSection.className = 'reservoir-info';
  infoSection.innerHTML = `
    <h2>${info.title}</h2>
    <p>${info.text}</p>
    <ul>
      ${info.points.map(point => `<li>${point}</li>`).join('')}
    </ul>
  `;

  // Create image section
  const imgSection = document.createElement('div');
  imgSection.className = 'reservoir-info-img';
  imgSection.innerHTML = `
    <img src="${info.image}" alt="Reservoirs in Makers Valley" />
  `;

  // Add both to the row
  container.appendChild(infoSection);
  container.appendChild(imgSection);
});