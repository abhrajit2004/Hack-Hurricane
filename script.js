mapboxgl.accessToken = 'pk.eyJ1IjoiYWJocmFqaXRndXB0YSIsImEiOiJjbHF3Zno4dzYwMmp3MmtteHJkMWhkb3V6In0.wiASQJiI6y28GUr1h-ReBQ';
let marker;
let newmarker;
let popup;
let lng;
let lat;
let start = [];
let end = [];
let counter = 0;

const lngDisplay = document.getElementById('lng');
const latDisplay = document.getElementById('lat');

// Default Place
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-73.99209, 40.68933],
  zoom: 14
});

// Fetch user's location
navigator.geolocation.getCurrentPosition((position)=>{
  const userLocation = [position.coords.longitude, position.coords.latitude];
  map.setCenter(userLocation);
  marker = new mapboxgl.Marker().setLngLat(userLocation).addTo(map);
  popup =  new mapboxgl.Popup({className : 'mapboxgl-popup-content'}).setText("You are here");
  marker.setPopup(popup);
});

// Shows nearest places 
function searchPOI(coordinates){
  let category = 'landmark';
  let url = fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${category}.json?proximity=${coordinates[0]},${coordinates[1]}&access_token=${mapboxgl.accessToken}&session_token=${mapboxgl.accessToken}`);

  url.then((response)=>response.json()).then((data)=>{
    data.features.forEach(feature => {
      new mapboxgl.Marker({color: 'green'}).setLngLat(feature.geometry.coordinates).addTo(map);
    });
  })
}

// Shows user-entered location with name
document.getElementById("btn").addEventListener("click",(e)=>{
  e.preventDefault();
  let searchInput = document.getElementById("mySearch").value;
  let search = fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInput}.json?access_token=${mapboxgl.accessToken}`);
  search.then(response=> response.json()).then(data=>{
    lng = data.features[0].center[0];
    lat = data.features[0].center[1];
    const coords = [lng, lat];
    lngDisplay.innerHTML = lng;
    latDisplay.innerHTML = lat;
    document.querySelector(".ele-info").style.display = "block";
    if(data.features.length > 0){
      let newCoordinates = data.features[0].center;
      map.flyTo({
        center: newCoordinates,
        zoom: 14,
      });
      if(marker){
        marker.remove();
      }
      marker = new mapboxgl.Marker({color: 'red'}).setLngLat(newCoordinates).addTo(map);

      popup =  new mapboxgl.Popup({className : 'mapboxgl-popup-content'}).setText(data.features[0].text);
      marker.setPopup(popup);
    }
    else{
      alert('Place not found. Please try again.');
    }
  }).catch((error)=>{
    console.error('Error fetching data:', error);
  })
})

// It shows routes
function showRoute() {
  map.on('click',(e)=>{
    navigator.geolocation.getCurrentPosition((position)=>{
       const userLocation = [position.coords.longitude, position.coords.latitude];
      start = userLocation;
      end = [e.lngLat.lng, e.lngLat.lat];
      const routesURL = fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`);
      routesURL.then((response)=>response.json()).then((data)=>{
        const route = data.routes[0].geometry;

         // If a route is already loaded, remove it
         if (map.getSource(`route${counter-1}`)) {
          map.removeLayer(`route${counter-1}`);
          map.removeSource(`route${counter-1}`);
        }
        
         // Add the route to the map
         map.addSource(`route${counter}`,{
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: route
            }
         });

         map.addLayer({
           id: `route${counter}`,
           type: 'line',
           source: `route${counter}`,
           paint:{
            'line-color': '#3887be',
            'line-width': 5
           }
         });

         counter++;
      });
    });
  });
}

// Shows the location when clicked on map
map.on('click',(e)=>{
  lng = e.lngLat.lng;
  lat = e.lngLat.lat;
  const coords = [lng, lat];
  lngDisplay.innerHTML = lng;
  latDisplay.innerHTML = lat;
  document.querySelector(".ele-info").style.display = "block";
  if(newmarker){
    newmarker.remove();
  }
  newmarker = new mapboxgl.Marker({color: 'red'}).setLngLat(coords).addTo(map);
});

showRoute();

