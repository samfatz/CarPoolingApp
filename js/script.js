
$(document).ready(function() {

    $("#get-data").on("click", function() {

        $.getJSON("control/ajax-handler.php?data=rides", function(data){
            for (var i = 0, len = data.length; i < len; i++) {
                $("#ride-data").append("ID: " + data[i].id + "<br>");
                $("#ride-data").append("Description: " + data[i].description + "<br>");

                $("#ride-data").append("<br>");
            }
        });

        /*
        $.ajax({
            url: "control/ajax-handler.php?data=rides",
            type: "POST",
            beforeSend: function () {
            },
            success: function (result) {
                //$("#ride-data").html(result);
                parseJSON(result);
            }
        }).error(function () {
            alert("wrong");
        });
        */
    });


});