// Shelter data (replace with real entries later if needed)
const shelters = [
    {
        name: "Disaster Recovery Center - Belfry Public Library",
        address: "24371 US-119, Belfry, KY 41514",
        lat: 37.613083,
        lon: -82.272395
    },
    {
        name: "1505 Jenkins Rd",
        address: "1505 Jenkins Rd, Whitesburg, KY 41858",
        lat: 37.118641,
        lon: -82.820503
    },
    {
        name: "508 3rd St",
        address: "508 3rd St, Paintsville, KY 41240",
        lat: 37.815384,
        lon: -82.809566
    },
    {
        name: "419 Jenny Wiley Dr",
        address: "419 Jenny Wiley Dr, Prestonsburg, KY 41653",
        lat: 37.689060,
        lon: -82.728729
    },
    {
        name: "Embry Rucker Shelter",
        address: "11975 Bowman Towne Dr, Reston, VA 20190",
        lat: 38.9616335,
        lon: -77.3596142
    },
    {
        name: "NVFS' SERVE Campus",
        address: "10056 Dean Dr, Manassas, VA 20110",
        lat: 38.7446355, 
        lon: -77.5006915
    },
    {
        name: "Cornerstones",
        address: "2244 Stone Wheel Dr, Reston, VA 20191",
        lat: 38.939511,
        lon: -77.365865
    },
    {
        name: "CARITAS Works",
        address: "2220 Stockton St, Richmond, VA 23224",
        lat:37.5135568,
        lon: -77.4507034
    },
    {
        name: "Westside Men's Emergency Shelter",
        address: "309 Redwood Cir, Catonsville, MD 21228",
        lat: 39.2647693,
        lon: -76.7172082
    },
    {
        name: "The Salvation Army - Baltimore Area Command",
        address: "814 Light St, Baltimore, MD 21230",
        lat: 39.282494,
        lon: -76.611464
    },
    {
        name: "The Baltimore Station",
        address: "140 W West St, Baltimore, MD 21230",
        lat: 39.285568,
        lon: -76.621933
    },
    {
        name: "The Midnight Mission",
        address: "601 San Pedro St, Los Angeles, CA 90014",
        lat: 34.0422635,
        lon: -118.2459874
    },
    {
        name: "Family Emergency Shelter",
        address: "22671 3rd St, Hayward, CA 94541",
        lat: 37.6756771,
        lon: -122.0770961
    },
    {
        name: "Cap K Navagiton Center",
        address: "2900 M St, Bakersfield, CA 93301",
        lat: 35.385869,
        lon: -119.011514
    }
  ];
  
  // Initialize map
  const map = L.map('map').setView([39.8283, -98.5795], 4); // Center on USA
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  
  // Distance calculation (Haversine formula)
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // miles
    const toRad = deg => deg * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  }
  
  // Display list of shelters
  function displayShelterList(sortedShelters) {
    const list = document.getElementById("shelter-list");
    list.innerHTML = "<h3>Nearest Shelters</h3>";
    
    // Show only the first 10 nearest shelters
    sortedShelters.slice(0, 10).forEach((shelter, index) => {
      const div = document.createElement("div");
      div.style.cursor = "pointer";
      div.style.marginBottom = "10px";
      div.innerHTML = `
        <strong>${index + 1}. 🚩 ${shelter.name}</strong><br>
        📍 ${shelter.address}<br>
        📏 ${shelter.distance} miles away
        <hr>
      `;
      div.onclick = () => {
        map.setView([shelter.lat, shelter.lon], 14);
      };
      list.appendChild(div);
    });
  }
  
  
  // Add shelter markers to map
  function showShelterMarkers(shelters) {
    shelters.forEach(shelter => {
      L.marker([shelter.lat, shelter.lon])
        .addTo(map)
        .bindPopup(`<strong>${shelter.name}</strong><br>${shelter.address}`);
    });
  }
  
  // Try to get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;
  
      // Show user location on map
      const userIcon = L.icon({
        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
        iconSize: [38, 38],
      });
      L.marker([userLat, userLon], { icon: userIcon }).addTo(map)
        .bindPopup("📍 You are here").openPopup();
      map.setView([userLat, userLon], 10);
  
      // Calculate distance from user to each shelter
      shelters.forEach(shelter => {
        shelter.distance = calculateDistance(userLat, userLon, shelter.lat, shelter.lon);
      });
  
      // Sort and display shelters
      shelters.sort((a, b) => a.distance - b.distance);
      showShelterMarkers(shelters);
      displayShelterList(shelters);
  
    }, () => {
      alert("Unable to get your location. Showing default view.");
      showShelterMarkers(shelters);
      displayShelterList(shelters);
    });
  } else {
    alert("Geolocation not supported. Showing default view.");
    showShelterMarkers(shelters);
    displayShelterList(shelters);
  }
  