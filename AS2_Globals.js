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
