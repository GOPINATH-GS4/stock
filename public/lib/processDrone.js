var init = new google.maps.LatLng(59.327383, 18.06747);
var marker;
var map;
var infoWindow;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function dispatch(drone) {
    // Add logic to send the drone to the co-ordinates 
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log('data = ' + data);
    console.log('Dispatching drone');
    dispatch(data);
}

function drawMap(loc, anim, info) {
    var mapOptions = {
        zoom: 13,
        center: loc
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: loc
    });
    if (anim) marker.setAnimation(google.maps.Animation.BOUNCE);
    google.maps.event.addListener(marker, 'click', toggleBounce);
    if (info) {
        infoWindow = new google.maps.InfoWindow({
            content: info
        });
        infoWindow.open(map, marker);
    }

}

function toggleBounce() {

    if (marker.getAnimation() != null) {
        marker.setAnimation(null);
        infoWindow.close();
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infoWindow.open(map, marker);
    }
}

google.maps.event.addDomListener(window, 'load', drawMap(init, false, null));


setTimeout(function() {

    var lat = 40.84947;
    var lng = -74.50896;

    var latLng = new google.maps.LatLng(40.84947, -74.50898, 15);

    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyCX1regHOyNj2m0CTZsWTfQzzFFqm9EbUU';

    HTTPRequest.get(url, function(status, headers, content) {
        var result = JSON.parse(content);
        console.log(result.results[0].formatted_address);
        drawMap(latLng, true, result.results[0].formatted_address);
    });


}, 5000);