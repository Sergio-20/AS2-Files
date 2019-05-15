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








/******************************************/
/*              AS2 Header                */
/******************************************/

$(window).on('scroll resize load', function() {
  var winTop = $(window).scrollTop(),
      header = $('.as2-header');

  if (winTop > 0) {
    header.addClass('scrolled');
  } else {
    header.removeClass('scrolled');
  }
});

$(document).ready(function(){
  var ham = $('.hamburger'),
      nav = $('.ah-nav_wrap');

  ham.on('click touch', function(){
    if ($(this).hasClass('is-active')) {
      $(this).removeClass('is-active');
      nav.removeClass('nav-open');
    } else {
      $(this).addClass('is-active');
      nav.addClass('nav-open');
    }
  });
});


/******************************************/
/*              AS2 Home Banner           */
/******************************************/


function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('autocomplete')), {
      types: ['geocode']
    });
  autocomplete.addListener('place_changed');
}

function direct() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  var lat = place.geometry.location.lat();
  var lng = place.geometry.location.lng();
  var add = place.formatted_address;
  document.location.href = 'https://americanselfstorageok-3266276.hs-sites.com/find-a-location?lat=' + lat + '&lng=' + lng + '&address=' + add;
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}


/******************************************/
/*              AS2 Reviews               */
/******************************************/


var entityNumbersGet = {
	"async": true,
  "CrossDomain": true,
  "url": "https://khaotic-staging.com/american-self-storage/wss_api/wss_api.php?method=hello&format=json",
  "dataType": "json",
  "method": "GET"
}

var entitiesConnect = $.ajax(entityNumbersGet),
		reviewEndpoint = [],
    reviewList = [];

$.when(entitiesConnect).done(function(result) {
	var json = JSON.parse(result.data);
  $.each(json.Entities, function(i, id) {
  	reviewEndpoint.push({
    	entity: id,
      url: "https://khaotic-staging.com/american-self-storage/wss_api/locationreviews.php?method=hello&format=json&entity=" + id
    })
  });
  getReviewList(reviewEndpoint);
});

function getReviewList(endpoints) {
	var filteredReviews = [];

	function reviewConnect(url) {
  	return $.ajax({
  	"async": true,
    "crossDomain": true,
    "dataType": "json",
    "url": url,
    "method": "GET"
   });
  }

  for (var url in endpoints) {
  	reviewList.push(reviewConnect(endpoints[url].url))
  }

  $.when.apply(this, reviewList).done(function() {
  	for ( var x = 0; x < arguments.length; x++) {
    	var json = $.parseJSON(arguments[x][0].data),
      		review = json.Reviews;

      $.each(review, function(x, y){
      	if((this.Rating >= 8)){
        	filteredReviews.push(this);
        }
      });
    }
    filteredReviews = shuffle(filteredReviews);
    serveReviews(filteredReviews);
  });
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function serveReviews(finalList) {
	var limit = 0,
  		container = $('.review_wrap');

  $.each(finalList, function(x, y) {
  	if (limit <= 10) {
      var date = JSON.stringify(this.Date).replace(/\"/g, "");
      var name = JSON.stringify(this.CustomerName).replace(/\"/g, "");
      var rate = this.Rating;
      var revw = JSON.stringify(this.Review).replace(/\"/g, "");
      var ratingclass;
      if (rate == 1) {
        ratingclass = "half";
      } else if (rate == 2) {
        ratingclass = "one_full";
      } else if (rate == 3) {
        ratingclass = "one_half";
      } else if (rate == 4) {
        ratingclass = "two_full";
      } else if (rate == 5) {
        ratingclass = "two_half";
      } else if (rate == 6) {
        ratingclass = "three_full";
      } else if (rate == 7) {
        ratingclass = "three_half";
      } else if (rate == 8) {
        ratingclass = "four_full";
      } else if (rate == 9) {
        ratingclass = "four_half";
      } else if (rate == 10) {
        ratingclass = "five_full";
      }

      container.append('<div class="reviews_box"><div class="reviews_wrap"><div class="review_content"><div class="review_content_wrap"><p>"' + revw + '"</p><p class="author">- ' + name + ' (via eMove)</p><div class="rating ' + ratingclass + '"><span>&#9734;</span><span>&#9734;</span><span>&#9734;</span><span>&#9734;</span><span>&#9734;</span></div></div></div></div></div>');

  	}
  	limit++;
  });
  slickit();
}


function slickit() {
  $(".review_wrap").slick({
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: '<i class="slickprev fa fa-chevron-left"></i>',
    prevArrow: '<i class="slicknext fa fa-chevron-right"></i>'
  });
}


/******************************************/
/*              AS2 Size Guide            */
/******************************************/


$(document).ready(function(){
  var tabs = $('.sg-link'),
      content = $('.sg-content');

  tabs.on('click touch', function(){
    var size = $(this).data('link');

    tabs.removeClass('active');
    content.removeClass('active');

    $(this).addClass('active');

    content.each(function() {
      if($(this).data('slide') == size) {
        $(this).addClass('active');
      }
    });
  });

  var sizeTrig = $('a span.sizeGuide');

  sizeTrig.on('click touch', function(e) {
    e.preventDefault();

    if ($('.size-guide').css('display') == 'none') {
        $('.size-guide').show();
    } else {
      $('.size-guide').hide();
    }
  });

  if($('.size-guide').is(':visible')) {
    $('.size-guide').on('click touch', function(e) {
      e.preventDefault();
      console.log('yup');
      $('.size-guide').hide();
    });
    $('.sg-stage').on('click touch', function(e) {
      e.stopPropigation();
    });
  }

  var close = $('.sg-close');

  close.on('click touch', function () {
    if($('.size-guide').css('display') == 'none') {

    } else {
      $('.size-guide').hide();
    }
  });
});
