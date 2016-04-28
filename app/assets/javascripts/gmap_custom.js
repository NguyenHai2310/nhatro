var markers = [];
$(document).ready(function(){
  $("#mylocation").click(function() {
    geoLocation();
  });
});

var directionsDisplay, map, geolocate, geo_marker = null;
var directionsService = new google.maps.DirectionsService();
var infowindow = new google.maps.InfoWindow({size: new google.maps.Size(150, 50)});

function initialize() {
  var myLatlng = new google.maps.LatLng(21.017030, 105.783902);
  var lat = document.getElementById("form-lat");
  var lng = document.getElementById("form-lng");
  var input = document.getElementById("pac-input");
  var image = "/assets/pin.png";
  var markers = [];
  var option = {
    zoom: 13,
    center: myLatlng,
    mapTypeControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map)

  map = new google.maps.Map(document.getElementById("map-canvas"), option);

  var marker;

  var position = new google.maps.LatLng(lat.value, lng.value);

  marker = new google.maps.Marker({position: position, map: map});
  marker.setMap(map);
  map.setCenter(position);
  map.setZoom(14);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox((input));

  google.maps.event.addListener(map, 'click', function(event) {
    validateClickPoint(event.latLng);
  });

  google.maps.event.addListener(searchBox, "places_changed", function() {
    var places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    markers = [];
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0, place; place = places[i]; i++) {
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);
      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });

  google.maps.event.addListener(map, "bounds_changed", function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });

  google.maps.event.addListener(map, "click", function() {
    infowindow.close();
  });

  google.maps.event.addListener(map, "click", function(event) {
    if (marker) {
      marker.setMap(null);
      marker = null;
    }

    myLatLng = event.latLng;

    marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: image,
      title:"Property Location"
    });

    lat.value = event.latLng.lat();
    lng.value = event.latLng.lng();
  });

  if(lat.value === "" || lng.value === "") {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Your location!'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    marker = new google.maps.Marker({position: position, map: map});
    marker.setMap(map);
    map.setCenter(position);
    map.setZoom(14);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = "Error: The Geolocation service failed.";
  } else {
    var content = "Error: Your browser doesn\'t support geolocation.";
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function geoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("No Gelocation Support!");
  }
}

function showPosition(position) {
  geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  if(geo_marker === null) {
    geo_marker = new google.maps.Marker({
      map: map,
      position: geolocate,
      icon: "/assets/geo.png"
    });
  } else {
    geo_marker.setPosition(geolocate);
  }

  map.setCenter(geolocate);
}

function calcRoute(target_lat, target_lng) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var start = new google.maps.LatLng(lat, lng);
      var end = new google.maps.LatLng(target_lat, target_lng);
      var selectedMode = document.getElementById("travel-mode").value;
      var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode[selectedMode]
      };
      directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
          var dis = result.routes[0].legs[0].distance.value;
          document.getElementById("distance").innerHTML = dis/1000;
        }
      });
      document.getElementById("mode").style.visibility = "visible";
    });
  } else {
    console.log("No Gelocation Support!");
  }
}

$(document).on("click", ".icon-map", function(){
  var address_id = $(this).data("address-id");
  $.fancybox({
    "type" : "iframe",
    "href" : "http://" + location.host + "/maps/" + address_id,
    "overlayShow" : true,
    "centerOnScroll" : true,
    "speedIn" : 100,
    "speedOut" : 50,
    "width" : "80%",
    "height" : "80%"
  });
});

$(document).ready(function(){
    $("#address_address").change(function(){
        var url = "https://maps.googleapis.com/maps/api/geocode/json";
        var address = $("#address_address").val();
        var key = "AIzaSyDtjwVAXkx4qFNhHJWglsyQIMX-7WF_7zs";

        $.get(url, {address: address, key: key}, function(data, status){
            switch (data.status){
                case "OK":
                    processResponseOK(data);
                    break;
                case "ZERO_RESULTS":
                    processResponseZeroResult();
                    break;
                default:
                    break;
            }
        });
    });

    function processResponseOK(data){
        var location = data.results[0].geometry.location;
        var address = data.results[0].formatted_address;

        map.setCenter(new google.maps.LatLng(location.lat, location.lng));
        if (markers[0] == undefined){
            markers[0] = new google.maps.Marker({
                position: location,
                map: map
            });
        } else
            markers[0].setPosition(location);
    }

    function processResponseZeroResult(){
        alert("Have 0 result!");
    }
})

var rad = function(x) {
    return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

function validateClickPoint(location){
    if (markers[0] == undefined) alert("Please enter the address name!");
    else {
        var distance = getDistance(markers[0].getPosition(), location);
        console.log(distance);
        if (distance > 1000.0) alert("Please choose true location!");

    }
}