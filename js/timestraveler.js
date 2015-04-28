jQuery(document).ready(function(){
	
function gps_distance(lat1, lon1, lat2, lon2)
{
	// http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var dLat = (lat2-lat1) * (Math.PI / 180);
    var dLon = (lon2-lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    
    return d;
}

var counter=0;

function get_gtag()
{
   count1 = 0;
   while (count1<40) {
   $.ajax({
      url: 'http://api.nytimes.com/svc/semantic/v2/geocodes/query.json?feature_class=A&limit=20&api-key=c34e5e17a323be0ca75c4a998e965b35%3A5%3A70275564&offset='+count1,
      dataType: 'json',
      success: function(json) {
	if ( json.status != 'OK') {
    $('body').append( 'Things do not look good, ERROR?' );
	}
	else
	{
    alert('num_results: ' + ( json.num_results || 'ERROR' ) + '<br>' 
	  + '  count1=' + count1);
$.each(json.results, function(index, element) {
    alert('concept_name: ' + ( element.concept_name || 'ERROR' ) + '<br>'
	  + 'lat is: ' + element.geocode.latitude + '<br>'
	  + 'lon is: ' + element.geocode.longitude + '<br>'
	  + 'Country: ' + element.geocode.country_code + '<br>'
	  + 'Country: ' +  element.geocode.country_name + '<br>'
	  + 'feature_code_name: ' + element.geocode.feature_code_name ); 
   L.marker([element.geocode.latitude, element.geocode.longitude]).addTo(map);
});
    current_results = json.results;
	}

    // including the google map part
}, error: function( xhr, status, errorThrown ) {
alert( "Sorry, there was a problem!" );
console.log( "Error: " + errorThrown );
console.log( "Status: " + status );
console.dir( xhr );
}
});
	count1=count1+20;
   }
	return true;
}


document.addEventListener("deviceready", function(){
	
	if(navigator.network.connection.type == Connection.NONE){
		$("#home_network_button").text('No Internet Access')
								 .attr("data-icon", "delete")
								 .button('refresh');
	}
	//setTimeout(function() {location.href = "#vote";},1250);

});

var track_id = '';      // Name/ID of the exercise
var watch_id = null;    // ID of the geolocation
var tracking_data = []; // Array containing GPS position objects

var current_pics = [];  // array of pics from GET
var current_results = [];  // array of pics from GET


// from trailer only - from vote page
$("#map-vote").on('click', function(){
	rest_status = get_gtag();
	location.href = "#mapview";
});

});
