mapboxgl.accessToken = 'pk.eyJ1IjoiYWJocmFqaXRndXB0YSIsImEiOiJjbHF3Zno4dzYwMmp3MmtteHJkMWhkb3V6In0.wiASQJiI6y28GUr1h-ReBQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [88.30976, 22.5050624],
    zoom: 14
});

function fetchNearbyPlaces(location) {
  const geocodingEndpoint = fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location[0]},${location[1]}.json?types=poi&access_token=${mapboxgl.accessToken}`);
  geocodingEndpoint.then((response)=>{
    response.json();
  }).then(data=>{
    const nearbyPlaces = data;
    console.log(data);
  })

}

navigator.geolocation.getCurrentPosition((position)=>{
  const userLocation = [position.coords.longitude, position.coords.latitude];
  map.setCenter(userLocation);
  new mapboxgl.Marker().setLngLat(userLocation).addTo(map);
  fetchNearbyPlaces(userLocation);
},(error) => {
  console.error('Error getting user location:', error);
})
// console.log(map);