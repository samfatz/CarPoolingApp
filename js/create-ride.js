var map, map2;

var centre;
var setoffMarker, destMarker;
var marker;

var setoffMap, destinationMap;

var directionsDisplay;
var directionsService;

$(document).one('pageinit', function() {
    setoffMap = null;
    destinationMap = null;
    marker = null;

    var setoffLat, setoffLng;
    var destinationLat, destinationLng;
    var rideDestription, rideTime;
    var vehicleID, vehicleDesc;

    $("#location-selection").hide();
    $("#confirmation").hide();
    $("#success").hide();

    // Load in users' vehicles to the dropdown
    reloadVehicles();


    // Go from ride info screen to location selections
    $("#continue").on("click", function () {

        var inputTime = $("#time").val();
        var inputDesc = $("#description").val();
        var inputVehicle = $("#vehicle").val();
        var inputVehicleDesc = $("#vehicle option:selected").text();
        var success = true;

        if (inputTime == "") {
            alert("You havent provided a time for the journey!");
            success = false;
        }
        if (inputDesc == "") {
            alert("It's important for you to provide details of this journey in the description");
            success = false;
        }

        if (success) {
            $("#ride-information").hide();
            $("#location-selection").show();
            initMap();
            rideDestription = inputDesc;
            rideTime = inputTime;
            vehicleID = inputVehicle;
            vehicleDesc = inputVehicleDesc;
        }
    });

    // Go back from map to initial information screen
    $("#back2").on("click", function () {
        $("#location-selection").hide();
        $("#ride-information").show()
    });

    // Go back from confirmation to map
    $("#back3").on("click", function () {
        $("#confirmation").hide();
        $("#location-selection").show();
    });

    $("#submit-button").on("click", function () {

        if (!checkMarker()) {
            alert("Please select a location before continuing!");
        }
        else
        {
            if (destinationMap == null) {
                $("#instruction-area").html("Finally, select your <strong>destination:</strong>");

                setoffLat = setoffMarker.getPosition().lat();
                setoffLng = setoffMarker.getPosition().lng();
                destinationMap = createMap('map', true);
                //destinationMap = initMap();
            } else {
                destinationLat = destMarker.getPosition().lat();
                destinationLng = destMarker.getPosition().lng();

                $("#location-selection").hide();
                $("#confirmation-description").text(rideDestription);
                $("#confirmation-vehicle").text(vehicleDesc);
                $("#confirmation-time").text(rideTime);

                $("#confirmation").show();

                createMap('map2', false);
                drawRoute();

                //$("#content-area").html("Added ride information<br> SETOFF: " + setoffCoords + "<br>DEST: " + desintationCoords);
            }
        }

    });

    $("#confirm").on("click", function () {
        console.log(setoffMarker);

        geocodeLatLngTo(setoffLat, setoffLng);
        geocodeLatLngTo(destinationLat, destinationLng);

        // AJAX to create ride
        var postData = {
            setoffLat: setoffLat,
            setoffLng: setoffLng,
            destLat: destinationLat,
            destLng: destinationLng,
            description: rideDestription,
            vehicle: vehicleID,
            time: rideTime};


        $("#confirmation").hide();
        $.post("control/create-ride-handler.php",
            postData,
            function(response, status) {
            if (response == '1') {
                $("#success").show();
            } else {
                $("#content-area").html("Error whilst trying to add ride:" + response);
            }
            });

    });
});

this.updateVehiclesText = function() {
    $.get( "control/ajax-handler.php?data=vehicles", function( data ) {
        if (data == "NONE-FOUND") {
            $("#add-vehicle-text").html("It appears you don't have any vehicles linked to your account!");
            return true;
        }
    });
    return false;
};

this.reloadVehicles = function() {
    $("#vehicle").html("<option value='0'>---</option>");
    $.getJSON("control/ajax-handler.php?data=vehicles", function(data){
        for (var i = 0, len = data.length; i < len; i++) {
            $("#vehicle").append("<option value="+ data[i].id +">"+ data[i].type + " (" + data[i].seats + " seats)</option>");
        }
    });

    updateVehiclesText();
    $('#vehicle').selectmenu('refresh');
};

this.createMap = function(id, clickable) {
    var search = document.getElementById('search');
    var searchButton = document.getElementById('search_button');

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();

    centre = {lat: 55.864304, lng: -4.251686};

    map = new google.maps.Map(document.getElementById(id), {
        zoom: 11,
        center: centre,
        componentRestrictions: {country: 'gb'}
    });


    var searchBox = new google.maps.places.SearchBox(search);

    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        places.forEach(function (place) {
            map.panTo(place.geometry.location);
            map.setZoom(16);

            moveMarker(place.geometry.location);
        });
    });

    if (setoffMarker != null) {
        new google.maps.Marker({
            position: setoffMarker.getPosition(),
            draggable:false,
            map: map
        });
    }

    if (destMarker != null) {
        new google.maps.Marker({
            position: destMarker.getPosition(),
            draggable:false,
            map: map
        });
    }

    if (clickable) {
        map.addListener('click', function (event) {
            moveMarker(event.latLng);
        });
    }

    return map;
};


// Attempts to fetche address for given latiude and longitude, and then sends address to updateAddress once complete.
this.geocodeLatLngTo = function(lat, lng) {
    setTimeout(function () {
        var geocoder = new google.maps.Geocoder;
        var latlng = {lat: lat, lng: lng};
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    updateAddress(lat, lng, results[0].formatted_address);
                    return;
                }
            }else{
                if(status === "OVER_QUERY_LIMIT"){
                    setTimeout(function () {
                        geocodeLatLngTo(lat, lng, i);
                    }, 2000);
                }

            }
        });
    }, 2000);

};

this.updateAddress = function(lat, lng, address) {
    var postData = {
        latitude: lat,
        longitude: lng,
        address: address};

    $.post("control/update-address-handler.php",
        postData);
};


this.drawRoute = function() {

    var start = setoffMarker.getPosition();
    var end = destMarker.getPosition();
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            directionsDisplay.setMap(map);
        } else {
            alert("couldn't get directions:" + status);
        }
    });
};

this.initMap = function () {

    createMap('map', true);

};

this.checkMarker = function() {
    if (setoffMarker == null) {
        return false;
    }else if (setoffMarker == null && destMarker == null) {
        return false;
    }
    return true;
};



// markerMove: false for setoff, true for dest marker
this.moveMarker = function (coords) {

    if (setoffMarker != null && destMarker != null) {
        setoffMarker.setMap(null);
        destMarker.setMap(null);

        setoffMarker = null;
        destMarker = null;
    }



    if (setoffMarker == null) {
        setoffMarker = new google.maps.Marker({
            position: coords,
            draggable:true,
            map: map
        });
    } else {
        destMarker = new google.maps.Marker({
            position: coords,
            draggable:true,
            map: map
        });
    }
};
