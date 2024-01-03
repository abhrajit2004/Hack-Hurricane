mapboxgl.accessToken = 'pk.eyJ1IjoiYWJocmFqaXRndXB0YSIsImEiOiJjbHF3Zno4dzYwMmp3MmtteHJkMWhkb3V6In0.wiASQJiI6y28GUr1h-ReBQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [88.30976, 22.5050624],
    zoom: 14
});


navigator.geolocation.getCurrentPosition((position)=>{
  const userLocation = [position.coords.longitude, position.coords.latitude];
  map.setCenter(userLocation);
  new mapboxgl.Marker().setLngLat(userLocation).addTo(map);
},(error) => {
  console.error('Error getting user location:', error);
})


document.getElementById("btn").addEventListener("click",(e)=>{
  e.preventDefault();
  let searchInput = document.getElementById("search").value;
  let search = fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInput}.json?access_token=${mapboxgl.accessToken}`);
  search.then((response)=>{
    console.log(response.json());
  }).then((data)=>{
    if(data.features.length > 0){
      let coordinates = data.features[0].center;
      map.flyTo({
        center: coordinates,
        zoom: 14
      });
    }
    else{
      alert('Place not found. Please try again.');
    }
  }).catch((error)=>{
    console.error('Error fetching data:', error);
  })
})