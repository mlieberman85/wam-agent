$(document).ready(function () {

    if($('#fileupload').length) {
    $('#fileupload').fileupload({
        multipart:true,
        url:'/tracks/upload',
        done:function (e, data) {
            location.reload(true);
        },
        fail:function (e, data) {

        }
    });
    }

    $(".track-search").each(function () {
        //var data = $(this).attr('data-image');
        $(this).tokenInput("/tracks/search/", {
        tokenValue:'_id',
        propertyToSearch:'track',
        minChars:2,
        tokenLimit:1,
        processPrePopulate:true,
        resultsFormatter:function (item) {
            console.log(item);
            return "<li><<div style='display: inline-block; padding-left: 10px;'>" + "<b>" + item.artist + "</b>" +  " - " + item.track + "</div></li>"
        },
        tokenFormatter:function (item) {
            console.log(item);
            //return "<div>" + item.title + "</div>";
            return "<li><div style='display: inline-block; padding-left: 10px;'>" + "<b>" + item.artist + "</b>" + " - " + item.track + "</div></li>"
        }
        
          //  prePopulate:eval(data)
        });
    });
});

