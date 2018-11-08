$(document).one('pageinit', function () {
    $.getJSON("control/ajax-handler.php?data=myrides", function(data){
        for(var i=0; i<data.length; i++){
            $('#my-rides-table').find('tbody').append("<tr id='rowMy"+i+"'><td id='timeMy"+i+"'></td>" +
                "<td id='fromMy"+i+"'>");
            $('#timeMy' + i).append(data[i].time);
            $('#fromMy' + i).append(data[i].location);
            // updateTo(data[i]['dest_location'], i);
            // updateSeatsLeft(data[i]['vehicle'], i);
            if(i%2 === 0)
                $('#rowMy'+i).css('background-color', '#d3d3d3');



        }
        $('#my-rides-table').table("refresh");
    });

});

function showInfo() {
    $.mobile.changePage('ride-details.html', 'pop', true, true);
}