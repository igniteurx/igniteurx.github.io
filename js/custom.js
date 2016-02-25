// Custom JS for the Theme

// Config 
//-------------------------------------------------------------

var countdownDate = "2014/10/10"; // Enter your countdown date

var locationTitle = "The EventLand Conference"; // Enter your event title
var locationAddress = "4 Yawkey Way Boston, MA 02215"; // Enter your event address

var twitterWidgetId = "345650238654136320"; // Enter your twitter widgetId


// Preloader 
//-------------------------------------------------------------------------------

$(window).load(function(){

	$('#status').fadeOut(); 
	$('#preloader').delay(350).fadeOut('slow');
	$('body').delay(350).css({'overflow':'visible'});

	$('.event-info-bg-left').addClass('animated fadeInLeftBig delay1');
	$('.event-info-bg-right').addClass('animated fadeInRightBig delay1');
	$('.event-info').addClass('animated fadeIn delay2');

	$('img.img-fade').hide();

	function anim() {

		var fadeSpeed	= 1500;	// = 1.5 sec
		var displayTime	= 6000;	// = 8 sec

		$("#header-bg-fade img.img-fade").first().appendTo('#header-bg-fade').fadeOut(fadeSpeed);
		$("#header-bg-fade img").first().fadeIn(fadeSpeed);
		setTimeout(anim, displayTime);
	}

	anim();
});


// Placeholder Support for older browsers 
//-------------------------------------------------------------------------------

$('input, textarea').placeholder();


// Tooltip 
//-------------------------------------------------------------------------------

$(".my-tooltip").tooltip();



// Event Countdown  
//-------------------------------------------------------------------------------

$('.event-countdown').countdown(countdownDate, function(event) {
	$(this).html(event.strftime('only <span class="days">%D</span> days, <span class="hours">%H</span> hours, <span class="minutes">%M</span> minutes and <span class="seconds">%S</span> seconds left'));
});



// Navigation 
//-------------------------------------------------------------------------------

$(document).scroll(function () {
     var y = $(this).scrollTop();
     if (y > 580) {
         $('.navbar').fadeIn();
     } else {
         $('.navbar').fadeOut();
     }
 });

var navigation_links = $("nav li a");

navigation_links.click( function(event) {
  var position = $(this).attr('href');
  $('html, body').animate({ scrollTop: $(position).offset().top - 72}, 'slow', function(){
  });
  return false;
});



// Eventinfo Buttons 
//-------------------------------------------------------------------------------

var eventinfo_links = $(".event-info-nav-button");

eventinfo_links.click( function(event) {
  var link = $(this).find("a");
  var position = link.attr('href');
  $('html, body').animate({ scrollTop: $(position).offset().top - 73}, 'slow', function(){
  });
  return false;
});



// Register Button 
//-------------------------------------------------------------------------------

var register_button = $(".event-info-register-btn");

register_button.click( function(event) {
  var link = $(this);
  var position = link.attr('href');
  $('html, body').animate({ scrollTop: $(position).offset().top - 73}, 'slow', function(){
  });
  return false;
});



// Scroll to Top Button
//-------------------------------------------------------------------------------

  $(window).scroll(function(){
    if ($(this).scrollTop() > 100) {
      $('.scrollup').removeClass("animated fadeOutRight");
      $('.scrollup').fadeIn().addClass("animated fadeInRight");
      } else {
      $('.scrollup').removeClass("animated fadeInRight");
      $('.scrollup').fadeOut().addClass("animated fadeOutRight");
    }
  });
  
  $('.scrollup, .navbar-brand').click(function(){
    $("html, body").animate({ scrollTop: 0 }, 'slow', function(){
      $("nav li a").removeClass('active');
    });
    return false;
  });



// Speakers
//-------------------------------------------------------------------------------
$(".speaker").mouseover(function(){
  $(this).addClass("active");
});

$(".speaker").mouseout(function(){
  $(this).removeClass("active");
});


// Location Map 
//-------------------------------------------------------------------------------

var locationContent =     "<h2>"+locationTitle+"</h2>"
                         +"<p>"+locationAddress+"</p>";

$("#location-map").height("500px").gmap3({
	map: {
		options: {
			maxZoom: 16,
      scrollwheel: false
		}  
	},
	infowindow:{
     address: locationAddress,
     options:{
       content: locationContent
     }
  },
  marker:{
    address: locationAddress,
    options: {
     icon: new google.maps.MarkerImage(
       "/img/map-icon.png",
       new google.maps.Size(34, 34, "px", "px"), 
       new google.maps.Point(0, 0),    //sets the origin point of the icon
       new google.maps.Point(16, 18)   //sets the anchor point for the icon
     
     )
    }
 }
}, "autofit");



// Newslettr Form
//-------------------------------------------------------------------------------
$("#newsletter-form").submit(function() {

    var registerFormAlert = $("#newsletter .alert");

    registerFormAlert.hide();
    registerFormAlert.removeClass("alert-success");
    registerFormAlert.removeClass("alert-danger");
    registerFormAlert.addClass("alert-success").html('Adding email address...').show();

    $.ajax({
      type: "POST",
      url: "inc/form-mail.php",
      data: $("#newsletter-form").serialize(),
      dataType: "json",
      success: function(data) {
          registerFormAlert.hide();
          $("input").removeClass("validation-error");
          $.each(data, function(index, value){
            if("error" == value.status)
            {
              registerFormAlert.addClass("alert-danger").html(value.msg).show().delay(3000).fadeOut("slow");
              highlightError("#newsletter-form", value.field);
            }
            if("success" == value.status){
              registerFormAlert.addClass("alert-success").html(value.msg).show().delay(5000).fadeOut("slow");
              $("#newsletter-form")[0].reset();
            }
          });
      }
    });

    return false;
  });


// Register Form
//-------------------------------------------------------------------------------
$(".plan").on("click", function(){

  $(".plan").removeClass("active");
  $(".checkbox i").removeClass("fa-check-square-o");
  $(".checkbox i").addClass("fa-square-o");
  $("input[name=plan]").removeAttr("value");

  $(this).toggleClass("active");
  $(this).find(".checkbox i").toggleClass("fa-check-square-o fa-square-o");
  var plan = $(this).find(".offer h4").text();
  $("input[name=plan]").attr('value', plan);
});

$("#register input").on("focus", function(){
  $(this).addClass("active");
});

$("#register input").on("focusout", function(){
  $("#register input").removeClass("active");
});

$("#register-form").submit(function() {

    var registerFormAlert = $("#register .alert");

    registerFormAlert.hide();
    registerFormAlert.removeClass("alert-success");
    registerFormAlert.removeClass("alert-danger");
    registerFormAlert.addClass("alert-success").html('Adding email address...').show();

    $.ajax({
      type: "POST",
      url: "inc/form-mail.php",
      data: $("#register-form").serialize(),
      dataType: "json",
      success: function(data) {
        registerFormAlert.hide();
        $("input").removeClass("validation-error");
        $("div .plan").removeClass("validation-error");
        $.each(data, function(index, value){
          if("error" == value.status)
          {
            registerFormAlert.addClass("alert-danger").html("All highlighted fields are required!").show().delay(3000).fadeOut("slow");
            highlightError("#register-form", value.field);
            if("plan" == value.field){
              $("div .plan").addClass("validation-error");
            }
          }
          if("success" == value.status){
            registerFormAlert.addClass("alert-success").html(value.msg).show().delay(5000).fadeOut("slow");
            $("#register-form")[0].reset();
          }
        });
}
});

    return false;
  });

function highlightError(formId, field)
{
  $(formId+" input[name="+field+"]").addClass('validation-error',500);
}


// Last Tweets
//-------------------------------------------------------------------------------

function fadeTweets(tweets) {

  var x = tweets.length;
  var n = 0;
  var element = document.getElementById('tweets');
  var html = '<ul>';
  while(n < x) {
    html += '<li>' + tweets[n] + '</li>';
    n++;
  }
  html += '</ul>';
  element.innerHTML = html;

  var list_slideshow = $("#tweets ul"),
  listItems = list_slideshow.children('li'),
  listLen = listItems.length,
  i = 0,
  changeList = function () {
    listItems.eq(i).fadeOut(1000, function () {
      i += 1;
      if (i === listLen) {
        i = 0;
      }
      listItems.eq(i).fadeIn(1000);
    });
  };
  listItems.not(':first').hide();
  setInterval(changeList, 5000);

  //console.log(tweets);
}

twitterFetcher.fetch(twitterWidgetId, 'tweets', 5, true, false, false, 'default', false, fadeTweets);

