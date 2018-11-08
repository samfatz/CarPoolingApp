$(document).ready(function() {
    event.preventDefault();

    /*
    $.ajax({
        type: 'POST',
        url: 'control/login-handler.php',
        success: function (data) {
            if(data === 'already logged in'){
                $.mobile.navigate("findride.html");
            }
        }
    });
    */

    $("#submit-vehicle").on("click", function () {
        /* Getting input box values */
        var registration = document.getElementById("registration").value;
        var model = document.getElementById("model").value;
        var seats = document.getElementById("seats").value;

        /* Labels */
        var regLabel = document.getElementById("regLabel");
        var modelLabel = document.getElementById("modelLabel");
        var seatsLabel = document.getElementById("seatsLabel");


        var success = true;

        if (registration == "") {
            regLabel.style.color = "Red"
            success = false;
        }
        if (model == "") {
            modelLabel.style.color = "Red"
            success = false;
        }

        if (success == true) {

            /*Posting to php*/
            var postData = {
                registration: registration,
                model: model,
                seats: seats
            };

            $.ajax({
                type: "POST",
                url: "control/add-vehicle-handler.php",
                data: postData,
                success: function (data) {
                    reloadVehicles(data);
                    console.log(data);
                    $('[data-role=dialog]').dialog("close");
                    $('#add-vehicle-text').html("");
                }
            });
        }

    });
});


this.reloadVehicles = function(selectedId) {
    $("#vehicle").html("<option value='0'>---</option>");
    $.getJSON("control/ajax-handler.php?data=vehicles", function(data){
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].id == selectedId) {
                // Making option selected is kinda buggy right now.  Commented out till fixed.
                // $("#vehicle").append("<option value="+i+" selected>"+ data[i].type + " (" + data[i].seats + " seats)</option>");
                $("#vehicle").append("<option value=" + i + ">" + data[i].type + " (" + data[i].seats + " seats)</option>");
            } else {
                $("#vehicle").append("<option value=" + i + ">" + data[i].type + " (" + data[i].seats + " seats)</option>");
            }
        }
    });
    $('#vehicle').selectmenu('refresh');
};