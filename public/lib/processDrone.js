var map;
  function initialize(lat, lng, zoom, marker) {
    var mapOptions = {
      center: { lat: lat, lng: lng },
                zoom: zoom
               };
    map = new google.maps.Map(document.getElementById('map-canvas'),
              mapOptions); 
    console.log('Loaded map successfully');
    console.log('Map Options ' + JSON.stringify(mapOptions));
    if(marker != null) 
      marker.setMap(map);
  }

 google.maps.event.addDomListener(window, 'load', initialize(-34.397, 150.644, 8));
 

 setTimeout(function() {
   var latLng = new google.maps.LatLng(40.84947,-74.50898,15);
   var marker = new google.maps.Marker({
         position: latLng,
           title:"Accident ..."
   });
   initialize(40.84947,-74.50898,15,marker);
 }, 2000);
