/**
 * Created by jamessadri on 10/07/2014.
 */

var israelis;
var palestinians;
var palper; // = (palestinians / israelis).toFixed(1);
var percent;
var lovelyData = {};

$(document).ready(function(){



    $.ajax({
        type: 'GET',
        url: "https://spreadsheets.google.com/feeds/list/1shp9PQK7EH7t2pc-6o8vkKmA_Eez9AyoILbs5LhYo5c/1/public/basic?alt=json-in-script&callback?",
        async: false,
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: processData,
        error: function(e) {
            console.log(e.message);
            alert('Oops there\'s a problem with the data, try reloading the page.');
        }
    });


});


function processData(data){
    // console.log(data.feed.entry);
    // var lovelyData = {};
    for (var i = 0; i < data.feed.entry.length; i++){
        var properties = data.feed.entry[i].content.$t.split(', ');
        var obj = {};
        properties.forEach(function(property) {
            var tup = property.split(':');
            obj[tup[0]] = +tup[1];
        });
        lovelyData[data.feed.entry[i].title.$t] = obj;
    }
    // console.log(lovelyData);
    // console.log(lovelyData.Total);

    israelis = lovelyData.Total.israeli;
    palestinians = lovelyData.Total.palestinian;
    palper = (palestinians / israelis).toFixed(1);
    percent = (palestinians/(israelis+palestinians)).toFixed(2) * 100;
    console.log(percent);

    loadingStuff(lovelyData);

}


function loadingStuff(data){

    var whole = Math.floor(palper);
    var percentage = (palper - whole).toFixed(2) * 100;

    $('.palnum').text(palper); // swap palestinians per israeli into text
    $('.percent').text(percent); // swap percentage of kids killed into text
    $('.whole').text(whole);

    makePalestinians(whole, percentage);

    $('.loader').hide();
    $('.palestinian, .israeli, .palestiniansmall, .israelismall, .forevery').show();
    loadYears(data);
    loadTotal(data);
    $('.about').show();
    // $('.israeli').show();

}


function makePalestinians(num,bit){
    for(var i=0;i<num;i++){
        $('.foreverypal').append('<img src="images/palestinian_kid.png">');
    }

    var imgWidth = 960 / (num + 2);
    var crop = bit * (imgWidth/100);

    $('.foreverypal').append('<img src="images/palestinian_kid.png" style="position: absolute; clip: rect(0 ' + crop +  'px auto auto)">');



    $('.forevery img').css('width',imgWidth);


}


function loadYears(years){

    $('#years').append('<div class="sixteen columns"><h1>In Years</h1></div>');

    years = convertToArray(years);
    // console.log(years);
    years.sort(function(a,b){return b[0]-a[0]});

    $.each(years,function(key, value){
        // console.log(value[0]);
        if (isNaN(value[0])){
            return;
        }
        var ppix = "";
        var ipix = "";
        for(var i = 0; i < value[1].palestinian; i++){
            ppix += '<img src="images/palestinian_kid.png" class="palestinian">';
        }
        for(var i = 0; i < value[1].israeli; i++){
            ipix += '<img src="images/israeli_kid.png" class="israeli">';
        }
        var row = '<br class="clear"/><div class="row clearfix"><div class="two columns years year'+value[0]+'"><h2>' + value[0] + '</h2></div>';
            row += '<div class="fourteen columns yearskids yearskids'+value[0]+'"">'+ipix+ppix+'</div></div>';
        $('#years').append(row);
    })

   // $('.')
}

function loadTotal(data){

    // console.log(data);

    var ppix = "";
    var ipix = "";
    for(var i = 0; i < data.Total.palestinian; i++){
        ppix += '<img src="images/palestinian_kid.png" class="palestinian">';
    }
    for(var i = 0; i < data.Total.israeli; i++){
        ipix += '<img src="images/israeli_kid.png" class="israeli">';
    }

    var row = '<br class="clear"/><div class="row clearfix"><div class="two columns years total"><h2>Total</h2></div>';
    row += '<div class="fourteen columns yearskids yearskidstotal">'+ipix+ppix+'</div></div>';
    $('#total').append(row);
}


function convertToArray (object){
    var newArray = []
    for (var year in object) {
        newArray.push([+year, object[year]]);
    }
    return newArray;
}


