

/******************************************/
/*       AS2 Locations Map and Filter     */
/******************************************/


/******************************************************************************/
/***************************    URL Parameters    *****************************/
/******************************************************************************/

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}


/******************************************************************************/

/******************************************************************************/
/***************************    DistanceMatrix   ******************************/
/******************************************************************************/

var ltlg = [],
    sLat = parseFloat(getParameterByName('lat')),
    sLng = parseFloat(getParameterByName('lng')),
    sAddress = getParameterByName('address'),
    sLatLng = {
      lat: sLat,
      lng: sLng
    },
    locLat,
    locLng,
    locLatLng = [],
    counter = 0,
    searchBox = $('.location-search');

if (sAddress) {
  var address = sAddress.split('%').join(' ');

  searchBox.append('<div class="this-search"><b>Current Search: <b>' + address + '<a href="/find-a-location"> - Clear Search</a></div>');
}

if (sLat && sLng) {
  $(document).ready(function(){
    var items = $('.mf-item'),
        count = items.length;

    items.each(function(x, y) {
      var item = $(this),
          locLat = parseFloat($(this).data('latlng').split(",")[0]),
          locLng = parseFloat($(this).data('latlng').split(",")[1]),
          service = new google.maps.DistanceMatrixService;

      service.getDistanceMatrix({
        origins: [sLatLng],
        destinations: [{
          lat: locLat,
          lng: locLng
        }],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
      }, function(response, status){
        if (status !== 'OK') {
          console.log('status is: ' + status);
        } else {
          var distance = response.rows[0].elements[0].distance.value;
          var miles = response.rows[0].elements[0].distance.text;
          var time = response.rows[0].elements[0].duration.text;
          item.attr("data-matrix", distance).trigger("refresh");
          item.find('.mf-item_info').append('<div class="distance"><b>' + miles + '</b> and <b>' + time + '</b> away from <b>your location</b></div>');
        }
      });

     });

    var $wrapper = $('.mf-list');
        console.log($wrapper.find('.mf-item').sort(sortit));
        $wrapper.find('.mf-item').sort(sortit).appendTo($wrapper);
      }

    function sortit(a, b) {
      return (getDistance($(b))) < (getDistance($(b))) ? 1 : -1;
    }

    function getDistance(x) {
      var item = x,
          locLat = parseFloat(item.data('latlng').split(",")[0]),
          locLng = parseFloat(item.data('latlng').split(",")[1]),
          service = new google.maps.DistanceMatrixService;

      service.getDistanceMatrix({
        origins: [sLatLng],
        destinations: [{
          lat: locLat,
          lng: locLng
        }],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
      }, function(response, status){
        if (status !== 'OK') {
          console.log('status is: ' + status);
        } else {
          var distance = response.rows[0].elements[0].distance.value;
          return distance;
        }
      });
    }


  });
}

/******************************************************************************/

/******************************************************************************/
/****************************    Generate Map    ******************************/
/******************************************************************************/

var map,
    settings,
    icon,
    bound,
    origin = {lat: 36.522242, lng: -97.32032};

function pan(latlon) {
	var coords = latlon.split(",");
	var panPoint = new google.maps.LatLng(coords[0], coords[1]);

	map.setZoom(14);
	map.panTo(panPoint);

}

function initMap() {

  settings = {
    center: new google.maps.LatLng(origin),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    zoom: 8,
    styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#000000"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#989998"},{"lightness":40}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#989998"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#000000"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"color":"#ffffff"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#eb2a3d"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"transit","elementType":"geometry.fill","stylers":[{"color":"#989998"},{"lightness":-25}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#1c3664"}]}]
  };

  map = new google.maps.Map(document.getElementById('map'), settings);

  var infowindow = new google.maps.InfoWindow();

  icon = {
    url: "https://cdn2.hubspot.net/hubfs/3266276/Site_Assets_2017/marker3-02.png",
    scaledSize: new google.maps.Size(22, 36)
	}

  bound = new google.maps.LatLngBounds();

  $('.mf-item').each(function(x, y){
    var dataCoords = $(this).data("latlng"),
        plotCoords = dataCoords.split(","),
        locatitle = $(this).find("h2").text();

    var marker = new google.maps.Marker({
      map: map,
      icon: icon,
      position: new google.maps.LatLng(plotCoords[0], plotCoords[1]),
      title: 'location title'
    });

    bound.extend(marker.getPosition());

    var infowindow = new google.maps.InfoWindow({
          content: locatitle
        });

    $(this).on({
			mouseenter: function() {
			    infowindow.open(map, marker);
		    },
		    mouseleave: function() {
    			infowindow.close();
		    }
     });
  });

  map.fitBounds(bound);

}

$(document).on({
		mouseenter: function() {
			pan($(this).data("latlng"));
		},
		mouseleave: function() {
			map.fitBounds(bound);
		}
	}, ".mf-item");

$(document).ready(function() {
  initMap();
});

/******************************************************************************/

/******************************************************************************/
/**************************    Map Positioning   ******************************/
/******************************************************************************/

$(window).on("load resize scroll", function(e) {

  var win = $(window),
      winScroll = win.scrollTop(),
      winHeight = win.height(),
      searchBox = $('.location-search').offset().top,
      siteHeader = $('.as2-header').height(),
      siteFooter = $('.as2-footer').offset().top,
      offset = searchBox - siteHeader;

  var map = $('#map'),
      mapParent = map.parent('.mf-map'),
      mapContainerWidth = mapParent.width(),
      mapContainerRight = mapParent.offset().right,
      mapContainerBottom = mapParent.offset().bottom;

	if (winScroll >= offset) {
		map.removeClass('stick_bottom');
		if ((winScroll + winHeight) > siteFooter) {
			map.removeClass('stickToTop');
			map.addClass('stickToBot');
		} else {
			map.removeClass('stickToBot');
			map.addClass('stickToTop');
			map.width(mapContainerWidth);
			map.css('right', mapContainerRight);
		}
	} else {
		map.removeClass('stickToBot');
		map.removeClass('stickToTop');
	}
});


/******************************************************************************/

/******************************************************************************/
/****************************    AutoComplete   ******************************/
/******************************************************************************/

initAutocomplete();
