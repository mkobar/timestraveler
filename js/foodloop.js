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

function get_restaurant(rid)
{
   $.ajax({
      url: '/restful/restaurant/' + rid,
      dataType: 'json',
      success: function(json) {
	if ( json.status != 'success') {
    $('body').append( 'Things do not look good, ERROR?' );
	}
	else
	{
		/**
    alert('restid: ' + ( json.restid || 'ERROR' ) + '<br>'
	  + 'name: ' + json.name + '<br>'
          + 'phone: ' + json.phone + '<br>'
          + 'address: ' + json.address + '<br>'
          + 'website: ' + json.website + '<br>'
	  + 'streetview: ' + json.streetview + '<br><br>'
	  + 'lat is: ' + json.lat + '<br>'
	  + 'lon is: ' + json.lon + '<br>'
	  + 'likes: ' + json.likes + '<br>'
	  + 'url: ' + json.url ); 
**/
    current_rest = json;

    // now load data on restaurant page
    $('#rest_sv').attr("src",json.streetview);
    $('#rest_name').html("<h2>" + json.name + "</h2>");
    $('#rest_address').html("<b>" + json.address + "</b>");
    $('#rest_phone').html("<b>" + json.phone + "</b>");
    $('#rest_web').html("<a href=\"json.website\" target=_blank>" + json.website + "</a>");
    // including the google map part
 window.CodiqaControls && window.CodiqaControls.register('googlemaps', 'googlemapsjs1', {
              ready: function(control) {
  
                  control.options = {
                      zoom: 16,
                      mapTypeId: google.maps.MapTypeId.ROADMAP
                  };
  
                  control.el = document.getElementById(control._id);
                  control.map = new google.maps.Map(control.el, control.options);
  
                  var geocoder = new google.maps.Geocoder();
                  geocoder.geocode({
                      //'address': '359 West Broadway New York, NY 10013'
                      'address': current_rest.address
                  }, function(results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
  
                          var marker = new google.maps.Marker({
                              map: control.map,
                              position: results[0].geometry.location
                          });
                          control.center = results[0].geometry.location;
                          control.map.setCenter(control.center);
                      }
                  });
  
              }
          });
}
}, error: function( xhr, status, errorThrown ) {
alert( "Sorry, there was a problem!" );
console.log( "Error: " + errorThrown );
console.log( "Status: " + status );
console.dir( xhr );
}
});

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

var best5_data = []; // array of last best 5 pic objects
var best_count =0;   // count of itmes in best5_data
var pic_index =0;  // where we are in the current pic array
var pic_page =0;   // what page we have loaded with GET
var current_pics = [];  // array of pics from GET
var restid =0;  // 0 = no restaurant selected
var current_rest =null;  // selected restaurant object

$("#startTracking_start").on('click', function(){
    
	// Start tracking the User
    watch_id = navigator.geolocation.getCurrentPosition(
    
    	// Success
        function(position){
            tracking_data.push(position);
	    /**
	    alert("found: lat=" + position.coords.latitude +
		    " lon="+ position.coords.longitude);
		    **/
	    // now lookup pic list by lat/lon
$.ajax({
url: '/restful/pictures',
dataType: 'json',
success: function(json) {
	if ( json.status != 'success') {
    $('body').append( 'Things do not look good, ERROR?' );
	}
	else
	{
$.each(json.pics, function(index, element) {
	/**
    alert('picid: ' + ( element.picid || 'ERROR' ) + '<br>'
	  + 'lat is: ' + element.lat + '<br>'
	  + 'lon is: ' + element.lon + '<br>'
	  + 'restid: ' + element.restid + '<br>'
	  + 'likes: ' + element.likes + '<br>'
	  + 'url: ' + element.url ); 
	  **/

    current_pics = json.pics;

    // now load initial element[pic_index].url to vote page
    $('#vote_pic').attr("src",json.pics[pic_index].url);
    /***
$('body').append('Response 1: ' + ( element.name || 'ERROR' ) + '<br>'
	  + 'restid: ' + element.restid + '<br>'
	  + 'name: ' + element.name + '<br>'
	  + 'Your lat is: ' + element.lat + '<br>'
	  + 'Your lon is: ' + element.lon + '<br>'
          + 'phone: ' + element.phone + '<br>'
          + 'address: ' + element.address + '<br>'
          + 'website: ' + element.website + '<br>'
	  + 'streetview: ' + element.streetview + '<br><br>'
	  + 'picid: ' + element.picid + '<br>'
	  + 'restid: ' + element.restid + '<br>'
	  + 'likes: ' + element.likes + '<br>'
	  + 'url: ' + element.url );
	  **/
});
}
}, error: function( xhr, status, errorThrown ) {
alert( "Sorry, there was a problem!" );
console.log( "Error: " + errorThrown );
console.log( "Status: " + status );
console.dir( xhr );
}
});
        },
        
        // Error
        function(error){
            console.log(error);
        },
        
        // Settings
        { enableHighAccuracy: true });
    
    $("#startTracking_status").html("Tracking location");
});


$("#thumbs-up").on('click', function(){
	//alert("thumbs up: best_count=" + best_count + " pic_index=" + pic_index);
    // inc likes on this pic
    //piclike update via PUT?
    // save this pic to best5 array
    best5_data.push(current_pics[pic_index]);
    best_count++;   // count of items in best5_data
    // display filled in rb?
    //$('#rateit').attr("data-rateit-value",best_count);
    $('#rateit').html("<div id=\"rateit\" class=\"rateit\" data-rateit-value=\"1\" data-rateit-ispreset=\"true\" data-rateit-readonly=\"true\"></div>");
    

    // if this is 5 then goto fork!
    if (best_count > 4) {
	    //goto fork
	    location.href = "#fork";
    } else {
	pic_index++;
    // now load next pic to vote page
    $('#vote_pic').attr("src",current_pics[pic_index].url);
    }

});
$("#thumbs-down").on('click', function(){
	//alert("thumbs down");
	pic_index++;
    // now load next pic to vote page
    $('#vote_pic').attr("src",current_pics[pic_index].url);
});
$("#more-votes").on('click', function(){
	//alert("more-votes");
	// clear best5 and best_count
	best_count =0;
	best5_data = null;
	pic_index++;
    // now load next pic to vote page
    $('#vote_pic').attr("src",current_pics[pic_index].url);
});
$("#best-list").on('click', function(){
	//alert("best-list");
    // now load best5 paage from best5_data
    $('#best_pic0').attr("src",best5_data[0].url);
    $('#best_pic1').attr("src",best5_data[1].url);
    $('#best_pic2').attr("src",best5_data[2].url);
    $('#best_pic3').attr("src",best5_data[3].url);
    $('#best_pic4').attr("src",best5_data[4].url);
});

// from trailer only - from vote page
$("#rest-vote").on('click', function(){
	restid = current_pics[pic_index].restid;
	//alert("restaurant restid=" + restid);
	// get restaurant by id
	rest_status = get_restaurant(restid);
	location.href = "#restaurant";
});

// from best5 page only
$("#rest0").on('click', function(){
	restid = best5_data[0].restid;
	//alert("rest0 restid=" + restid);
	// get restaurant by id
	rest_status = get_restaurant(restid);
	location.href = "#restaurant";
});

// from best5 page only
$("#rest1").on('click', function(){
	restid = best5_data[1].restid;
	//alert("rest1 restid=" + restid);
	// get restaurant by id
	rest_status = get_restaurant(restid);
	location.href = "#restaurant";
});

// from best5 page only
$("#rest2").on('click', function(){
	restid = best5_data[2].restid;
	//alert("rest2 restid=" + restid);
	// get restaurant by id
	rest_status = get_restaurant(restid);
	location.href = "#restaurant";
});

// from best5 page only
$("#rest3").on('click', function(){
	restid = best5_data[3].restid;
	//alert("rest3 restid=" + restid);
	// get restaurant by id
	rest_status = get_restaurant(restid);
	location.href = "#restaurant";
});

// from best5 page only
$("#rest4").on('click', function(){
	restid = best5_data[4].restid;
	//alert("rest4 restid=" + restid);
	// get restaurant by id
	rest_status = get_restaurant(restid);
	location.href = "#restaurant";
});

// from best5 page only
$("#sharepported1").on('click', function(){
	alert("This function not currently supported - sorry.");
	//location.href = "#restaurant";
});

// from best5 page only
$("#restcancel").on('click', function(){
	//alert("This function not currently supported - sorry.");
	location.href = "#restaurant";
});

// from best5 page only
$("#smscancel").on('click', function(){
	//alert("This function not currently supported - sorry.");
	location.href = "#share";
});

$("#sendsms").on('click', function(){
	phone_no = $("#phone_no").val();
 	message = $("#message").val(); 
	// Save the tracking data
	//
	// curl --user "application\d26e6583-7c28-410e-ad59-15e43974d152:Fl+737fNLUO3+aWU1zd4aA==" --data '{"message":"Meet me for lunch"}' -H 'Content-Type: application/json' https://messagingapi.sinch.com/v1/sms/+18885551212

$.ajax({
    url: "https://messagingapi.sinch.com/v1/sms/" + phone_no,
    beforeSend: function(xhr) { 
      xhr.setRequestHeader("application\\d26e6583-7c28-410e-ad59-15e43974d152:Fl+737fNLUO3+aWU1zd4aA=="); 
    },
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    data: '{"message":"'+ message + '"}',
    success: function (data) {
	//alert("SMS = " + phone_no + " message = " +message + " sent");
      alert(JSON.stringify(data));
    },
    error: function(){
      alert("Cannot send SMS ");
    }
});
});


$.mockjax({
  url: '/restful/restaurant/1',
  responseTime: 750,
  responseText: {
    status: 'success',
    name: 'Frank Pepe Pizzeria Napoletana',
    picid: 001,
    restid: 1,
    lat: 41.27,
    lon: -72.25,
    url: 'frank-pepe-pizzeria.jpg',
    phone: '(203) 865-5762',
    address: '157 Wooster St New Haven, CT 06511',
    website: 'http://www.pepespizzeria.com/',
    streetview: 'sv-frank-pepe-pizzeria.jpg',
    reservation: 'http://www.opentable.com/tarry-lodge-enoteca-and-pizzeria-new-haven',
    delivery: 'https://www.grubhub.com/restaurant/272537/',
    likes: 14
  }
});

$.mockjax({
  url: '/restful/restaurant/2',
  responseTime: 750,
  responseText: {
    status: 'success',
    name: 'Modern Apizza',
    picid: 002,
    restid: 2,
    lat: 41.27,
    lon: -72.25,
    url: 'modern-apizza.jpg',
    phone: '(203) 776-5306',
    address: '874 State St New Haven, CT 06511',
    website: 'http://www.modernapizza.com/',
    streetview: 'sv-modern-apizza.jpg',
    reservation: null,
    delivery: null,
    likes: 5
  }
});

$.mockjax({
  url: '/restful/restaurant/3',
  responseTime: 750,
  responseText: {
    status: 'success',
    name: 'Da Legna',
    picid: 003,
    restid: 3,
    lat: 41.27,
    lon: -72.25,
    url: 'da-legna.jpg',
    phone: '(203) 495-9999',
    address: '858 State St New Haven, CT 06511',
    website: 'http://www.dalegna.com/',
    streetview: 'sv-da-legna.jpg',
    reservation: null,
    delivery: null,
    likes: 5
  }
});

$.mockjax({
  url: '/restful/restaurant/4',
  responseTime: 750,
  responseText: {
    status: 'success',
    name: 'Sallys Apizza',
    picid: 004,
    restid: 4,
    lat: 41.27,
    lon: -72.25,
    url: 'sallys-apizza.jpg',
    phone: '(203) 624-5271',
    address: '237 Wooster St New Haven, CT 06511',
    website: 'http://www.sallysapizza.com/',
    streetview: 'sv-sallys-apizza.jpg',
    reservation: null,
    delivery: null,
    likes: 5
  }
});

$.mockjax({
  url: '/restful/pictures',
  responseTime: 750,
  responseText: {
    status: 'success',
    pics: [ {
    picid: 001,
    restid: 1,
    lat: 41.27,
    lon: -72.25,
    url: '001-frank-pepe-pizzeria.jpg',
    likes: 14
    },{
    picid: 002,
    restid: 2,
    lat: 41.27,
    lon: -72.25,
    url: '002-modern-apizza.jpg',
    likes: 7
    }, {
    picid: 003,
    restid: 2,
    lat: 41.27,
    lon: -72.25,
    url: '003-modern-apizza.jpg',
    likes: 14
    },{
    picid: 004,
    restid: 4,
    lat: 41.27,
    lon: -72.25,
    url: '004-sallys-apizza.jpg',
    likes: 7
    },{
    picid: 005,
    restid: 1,
    lat: 41.27,
    lon: -72.25,
    url: '005-frank-pepe-pizzeria.jpg',
    likes: 7
    }, {
    picid: 006,
    restid: 3,
    lat: 41.27,
    lon: -72.25,
    url: '006-da-legna.jpg',
    likes: 14
    },{
    picid: 007,
    restid: 1,
    lat: 41.27,
    lon: -72.25,
    url: '007-frank-pepe-pizzeria.jpg',
    likes: 7
    },{
    picid: 008,
    restid: 4,
    lat: 41.27,
    lon: -72.25,
    url: '008-sallys-apizza.jpg',
    likes: 7
    }, {
    picid: 009,
    restid: 1,
    lat: 41.27,
    lon: -72.25,
    url: '009-frank-pepe-pizzeria.jpg',
    likes: 14
    },{
    picid: 010,
    restid: 3,
    lat: 41.27,
    lon: -72.25,
    url: '010-da-legna.jpg',
    likes: 7
    },{
    picid: 011,
    restid: 4,
    lat: 41.27,
    lon: -72.25,
    url: '011-sallys-apizza.jpg',
    likes: 7
    }, {
    picid: 012,
    restid: 1,
    lat: 41.27,
    lon: -72.25,
    url: '012-frank-pepe-pizzeria.jpg',
    likes: 14
    },{
    picid: 013,
    restid: 4,
    lat: 41.27,
    lon: -72.25,
    url: '013-sallys-apizza.jpg',
    likes: 7
    },{
    picid: 014,
    restid: 3,
    lat: 41.27,
    lon: -72.25,
    url: '014-da-legna.jpg',
    likes: 7
    }, {
    picid: 015,
    restid: 4,
    lat: 41.27,
    lon: -72.25,
    url: '015-sallys-apizza.jpg',
    likes: 14
    },{
    picid: 016,
    restid: 3,
    lat: 41.27,
    lon: -72.25,
    url: '016-da-legna.jpg',
    likes: 7
    },{
    picid: 017,
    restid: 4,
    lat: 41.27,
    lon: -72.25,
    url: '017-sallys-apizza.jpg',
    likes: 7
    } ]
  }
});

});
