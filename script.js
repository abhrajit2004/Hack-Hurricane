mapboxgl.accessToken = 'pk.eyJ1IjoiYWJocmFqaXRndXB0YSIsImEiOiJjbHF3Zno4dzYwMmp3MmtteHJkMWhkb3V6In0.wiASQJiI6y28GUr1h-ReBQ';

// Default Place
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-73.99209, 40.68933],
    zoom: 14
});

// Shows user's current location

navigator.geolocation.getCurrentPosition((position)=>{
  const userLocation = [position.coords.longitude, position.coords.latitude];
  map.setCenter(userLocation);
  new mapboxgl.Marker().setLngLat(userLocation).addTo(map);
},(error) => {
  console.error('Error getting user location:', error);
})


// Shows nearest places 

let marker;

document.getElementById("btn").addEventListener("click",(e)=>{
  e.preventDefault();
  let searchInput = document.getElementById("mySearch").value;
  let search = fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInput}.json?access_token=${mapboxgl.accessToken}&session_token=${mapboxgl.accessToken}`);
  search.then(response=> response.json()).then(data=>{
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
    }
    else{
      alert('Place not found. Please try again.');
    }
  }).catch((error)=>{
    console.error('Error fetching data:', error);
  })
})
