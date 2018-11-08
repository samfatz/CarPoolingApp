

$(document).one("pageinit" , function () {
    console.log("a");
    $.getJSON("control/ajax-handler.php?data=rides", function(data){
        for(var i=0; i<data.length; i++){
            //onclick='+showInfo("+data[i]['id']+");'
            $('#active-rides-table').find('tbody').append("<tr id='row"+i+"'><td id='time"+i+"'></td>" +
                                                                "<td id='from"+i+"'>" +
                                                                "</td><td id='to"+i+"'>" +
                                                                "</td><td id='seats"+i+"'></td><td><input onclick='joinRide("+data[i]['id']+")' type='button' value='Join'></td>" +
                "<td><a href='ride-details.html?id=" + data[i]['id'] + "' rel='external'>View Route</a></td></tr>");
            $('#time' + i).append(data[i]['time']);
            updateFrom(data[i]['setoff_location'], i);
            updateTo(data[i]['dest_location'], i);
            updateSeatsLeft(data[i]['id'], i);
            if(i%2 === 0)
                $('#row'+i).css('background-color', '#d3d3d3');



        }
        $('#active-rides-table').table("refresh");


    });
});

function joinRide(rideId) {
    $.ajax({
        url: 'control/ajax-handler.php',
        type: 'POST',
        data: 'rideID='+rideId,
        success: function (data) {
            if(data === "fail"){
                alert("You have already joined this ride");
            }else
                window.location.href = "findride.html";
        }
    });




}

function showInfo(rideId) {
  //  window.console.log('ride-details.html?id='+rideId);
    var pagename = "ride-details.html?id="+rideId;
    window.console.log(pagename);
   // $.mobile.changePage(pagename, {transition:"pop"});
$.mobile.pageContainer.pagecontainer("change","ride-details.html?id="+rideId,{transition:"pop"});

}

function updateSeatsLeft(vehicleID, tableRow) {
    $.ajax({
        url: 'control/ajax-handler.php',
        type: 'POST',
        data: "vehicleID="+vehicleID,
        success: function (data) {
            if(data == 0){
                $('#row' + tableRow).remove();
            }else
             $('#seats' + tableRow).append(data);
        }
    });
}

function updateFrom(locationID, tableRow) {
    $.ajax({
        url: 'control/ajax-handler.php',
        type: 'POST',
        data: "locationID="+locationID,
        success: function (data) {
            console.log("data");
            $('#from' + tableRow).append(data);
        }
    });
}

function updateTo(locationID, tableRow) {
    $.ajax({
        url: 'control/ajax-handler.php',
        type: 'POST',
        data: "locationID="+locationID,
        success: function (data) {
            $('#to' + tableRow).append(data);
        }
    });
}






