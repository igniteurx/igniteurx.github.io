// ---------------------------------------------------------------------
// Global JavaScript
// Authors: Andrew Ross & a little help from my friends
// ---------------------------------------------------------------------

var andrewrossco = andrewrossco || {};

(function($, APP) {

    $(function() {
        APP.Global.init();
        //APP.ScrollTo.init();
        APP.Viewport.init();
        //APP.Sections.init();
        APP.Modal.init();
        APP.Tabs.init();
        //APP.faqs.init();
        //APP.Circles.init();
        //APP.Map.init();
        APP.Accordion.init();
        APP.Countdown.init();
    });

// ---------------------------------------------------------------------
// Browser and Feature Detection
// ---------------------------------------------------------------------

APP.Global = {
    init: function() {

        function pageHeight() {
            var w = window,
                e = document.documentElement,
                y = w.innerHeight||e.clientHeight||g.clientHeight,
                mh = y - 96;
            document.getElementById('content').style.minHeight = mh + "px";
        }

        $(function(){
            document.body.classList.add("page-ready");
            document.body.classList.remove("page-loading");

            if(window.location.hostname == 'localhost'){
                document.body.classList.add('localhost');
            }
            pageHeight();
        });

        window.onresize = function(event) {
           pageHeight();
        };


    	if ( ! ('ontouchstart' in window) ) {
            document.documentElement.classList.add('no-touch');
        }

    	if ( 'ontouchstart' in window ) {
            document.documentElement.classList.add('is-touch');
        }

    	if (document.documentMode || /Edge/.test(navigator.userAgent)) {
            if(navigator.appVersion.indexOf('Trident') === -1) {
                document.documentElement.classList.add('isEDGE');
            } else {
                $('html').addClass('isIE isIE11');
            }
        }
        if(window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1'){
            document.body.classList.add('localhost');
        }

        var el = document.querySelectorAll('.nav-trigger');
        for (var i=0; i < el.length; i++) {
            el.item(i).onclick = function(){
                bd = document.body;
                if( bd.classList.contains('menu-is-active') ) {
                    bd.classList.remove('menu-is-active');
                } else {
                    bd.classList.add('menu-is-active');
                }
            };
        }
    }
}



// ---------------------------------------------------------------------
// Detect when an element is in the viewport
// ---------------------------------------------------------------------

APP.Viewport = {

    init: function() {
		$.fn.isOnScreen = function(){
			var elementTop = $(this).offset().top,
				elementBottom = elementTop + $(this).outerHeight(),
				viewportTop = $(window).scrollTop(),
				viewportBottom = viewportTop + $(window).height();
			return elementBottom > viewportTop && elementTop < viewportBottom;
		};

		var items = document.querySelectorAll('*[data-animate-in], *[data-detect-viewport]');

		function detection(el) {
			if( el.isOnScreen() ){
				if(!el.hasClass('in-view')){
					el.addClass('in-view');
				}
			}
		}

		$(window).on("resize scroll", function(){
			for(var i = 0; i < items.length; i++) {
				var el = $( items[i] );
				detection(el);
			}
		});

		$(document).ready(function(){
			for(var i = 0; i < items.length; i++) {
				var d = 0,
					el = $( items[i] );
				if( items[i].getAttribute('data-animate-in-delay') ) {
					d = items[i].getAttribute('data-animate-in-delay') / 1000 + 's';
				} else {
					d = 0;
				}
				el.css('transition-delay', d);

				 detection(el);
			}
		});
    }
};



// ---------------------------------------------------------------------
// Scroll to
// ---------------------------------------------------------------------

APP.ScrollTo = {

    init: function() {

        $('*[data-scroll-to]').on('click touchstart:not(touchmove)', function() {

            var trigger = $(this).attr('data-scroll-to'),
                target = $("#" + trigger),
                ss = 1000, //scroll speed
                o = 0; // offset

            $('body').removeClass('menu-is-open');


            if( $(this).attr('data-scroll-speed') ) {
                ss = $(this).attr('data-scroll-speed');
            }

            if( $(this).attr('data-scroll-offset') ) {
                o = $(this).attr('data-scroll-offset');
            }

            $('html, body').animate({
                scrollTop: target.offset().top - o
            }, ss);
        });

    }
};


// ---------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------

APP.Modal = {

    init: function() {

        var modal = $('#speaker-modal'),
            speakerModalContent = $('#speaker-modal .modal__bd'),
            b = $('body');

        $('.js-show-speaker').click(function(e){
            e.preventDefault();
            var speaker = $(this);

            getSpeakerModal(speaker);
        });


        function getSpeakerModal(el) {
            speakerModalContent.empty();
            history.replaceState(null, '', ' ');

            // Copy speaker profile
            var sc = el.find('.speaker-profile');
            var scc = sc.clone();
            var id = el.attr('id');

            // Add copy to modal
            speakerModalContent.append(scc);

            // Open Modal
            modal.addClass('is-active').attr('data-speaker', id);
            modal.find('.modal-controls__prev').filter(':visible').focus();
            b.addClass('modal-is-active');

            history.replaceState(null, '', '#' + id);

            setTimeout(function(){
                $('#speaker-modal .speaker-image').addClass('in-view');
            }, 400);
        }


        // Check for open modal on load
        $(document).ready(function(){
            var hash = window.location.hash.replace('#', ''),
                aLink = $('.js-show-speaker');

            $('.speaker').each(function() {
                var el = $(this),
                    modalId = el.attr('ID');

                if( modalId === hash && modalId != '' ) {
                    getSpeakerModal(el);
                    modal.addClass('is-active');
                    b.addClass('modal-is-active');
                }
            });
        });

        $('.js-modal-close').click(function(){
            speakerModalContent.empty();
            modal.removeClass('is-active').attr('data-speaker', '');

            $('#talk-modal .modal__bd').empty();
            $('#talk-modal').removeClass('is-active').attr('data-talk', '');
            b.removeClass('modal-is-active');
            history.replaceState(null, '', ' ');
        });

        function prevSpeaker(el) {
            var cur = $('.speaker-list').find('#' + el);
            var target = cur.prev('.speaker');
            if( target.length ) {
                target.click();
            } else {
                $('.js-modal-close').click();
            }

        }
        function nextSpeaker(el) {
            var cur = $('.speaker-list').find('#' + el);
            var target = cur.next('.speaker');
            if( target.length ) {
                target.click();
            } else {
                $('.js-modal-close').click();
            }
        }

        $('.js-next-speaker').click(function(){
            var speakerId = $(this).parents('#speaker-modal').attr('data-speaker');
            nextSpeaker(speakerId);
        });
        $('.js-prev-speaker').click(function(){
            var speakerId = $(this).parents('#speaker-modal').attr('data-speaker');
            prevSpeaker(speakerId);
        });


        var talkModal = $('#talk-modal'),
            talkModalContent = $('#talk-modal .modal__bd'),
            b = $('body');

        $('.js-show-talk').click(function(e){
            e.preventDefault();
            var talk = $(this);
            getTalkModal(talk);
        });

        function getTalkModal(el) {
            talkModalContent.empty();
            history.replaceState(null, '', ' ');

            // Copy speaker profile
            var tc = el.find('.talk-profile');
            var tcc = tc.clone();
            var id = el.attr('id');

            // Add copy to modal
            talkModalContent.append(tcc);

            // Open Modal
            talkModal.addClass('is-active').attr('data-talk', id);
            talkModal.find('.modal-controls__prev').filter(':visible').focus();
            b.addClass('modal-is-active');

            history.replaceState(null, '', '#' + id);
        }

        // Check for open modal on load
        $(document).ready(function(){
            var hash = window.location.hash.replace('#', ''),
                aLink = $('.js-show-talk');

            $('.talk').each(function() {
                var el = $(this),
                    modalId = el.attr('ID');

                if( modalId === hash && modalId != '' ) {
                    getTalkModal(el);
                    talkModal.addClass('is-active');
                    b.addClass('modal-is-active');
                }
            });
        });


        function prevTalk(el) {
            var cur = $('.schedule-list').find('#' + el);
            var target = cur.prev('.talk:not(.talk--break)');

            if( target.length ) {
                target.click();
            } else {
                target = cur.prevAll('.talk:not(.talk--break)');
                if( target.length ) {
                    target.click();
                } else {
                    $('.js-modal-close').click();
                }
            }
        }

        function nextTalk(el) {
            var cur = $('.schedule-list').find('#' + el);
            var target = cur.next('.talk:not(.talk--break)');

            if( target.length ) {
                target.click();
            } else {
                target = cur.nextAll('.talk:not(.talk--break)');
                //console.log( "Next all = " + target.attr('id') );

                if( target.length ) {
                    target.click();
                } else {
                    $('.js-modal-close').click();
                }
            }
        }

        $('.js-next-talk').click(function(){
            var talkId = $(this).parents('#talk-modal').attr('data-talk');
            nextTalk(talkId);
        });
        $('.js-prev-talk').click(function(){
            var talkId = $(this).parents('#talk-modal').attr('data-talk');
            prevTalk(talkId);
        });


        document.addEventListener('keydown', function(event) {

            if(talkModal.length && talkModal.hasClass('is-active')){
                if(event.keyCode == 37) {
                    prevTalk($('#talk-modal').attr('data-talk'));
                }
                else if(event.keyCode == 39) {
                    nextTalk($('#talk-modal').attr('data-talk'));
                }
                if(event.keyCode == 27 || event.keyCode == 88) {
                    $('.js-modal-close').click();
                }
            }

            if( modal.length && modal.hasClass('is-active') ){
                if(event.keyCode == 37) {
                    prevSpeaker($('#speaker-modal').attr('data-speaker'));
                }
                if(event.keyCode == 39) {
                    nextSpeaker($('#speaker-modal').attr('data-speaker'));
                }
                if(event.keyCode == 27 || event.keyCode == 88) {
                    $('.js-modal-close').click();
                }
            }
        });

    }






};


// ---------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------

APP.Tabs = {

    init: function() {
        var tab = $('.tabs__tab'),
			tabBody = $('.tabs__content');

        tabBody.hide();
        $('.tabs__content.is-active').show();

		tab.click(function(){
			var group = $(this).parents('.tabs'),
				tabs = group.find('.tabs__tab'),
				tabsBody = group.find('.tabs__content');
			tabs.removeClass('is-active');
            $('.tabs__content').hide().removeClass('is-active');
            var tabId = $(this).attr('data-tab'),
				target = $('#' + tabId);

            history.replaceState(null, '', '#' + tabId);

			$(this).addClass('is-active');
			target.fadeIn(300).addClass('is-active');
            $(window).trigger('resize');
		});

        $(document).ready(function(){
            var hash = window.location.hash.replace('#', '');
            $('.tabs__tab').each(function() {
                var el = $(this),
                    tabId = el.attr('data-tab');
                if( tabId === hash && tabId != '' ) {
                    el.click();
                }
            });
        });
    }
};



// ---------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------

APP.faqs = {

    init: function() {
        var faq = $('.faqs'),
            group = $('.faq-group'),
            gt = $('.faq-group__hd'),
            bd = $('.faq-group__bd');

        TweenMax.to(bd, 1, {height: 0});

        gt.click(function(){
            var el = $(this),
                g = el.parents('.faq-group'),
                b = el.next('.faq-group__bd');

            if( g.hasClass('is-active') ){
                g.removeClass('is-active');
                TweenLite.to(b, 0.6, {height:0})
            } else {
                g.addClass('is-active');
                TweenLite.set(b, {height:"auto"})
                TweenLite.from(b, 0.6, {height:0});
            }
        });
    }
};





// ---------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------

APP.Accordion = {

    init: function() {
        if( $('.accordion').length ) {
            this.bind();
        } else {
            return;
        }
    },

    bind: function() {

        $(document).on('click','.accordion__hd',function(e){
            this.parentNode.classList.toggle("is-open");
            var panel = this.nextElementSibling;

            if (panel.style.maxHeight){
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });

    }
};


// ---------------------------------------------------------------------
// Countdown Timer
// ---------------------------------------------------------------------

APP.Countdown = {

    init: function() {
        if( $('#countdown').length ) {
            this.bind();
        } else {
            return;
        }
    },

    bind: function() {

        var countDownDate = new Date("November 13, 2019 09:00:00").getTime(),
            countdownWrap = document.getElementById('countdown-wrap');
            //liveStream = document.getElementById('livestream');

        countdownWrap.classList.remove('d-none');

        var x = setInterval(function() {
            d = new Date();
            localOffset = d.getTimezoneOffset() * 60000;
            utc = d.getTime() + localOffset;

            sf = utc - (3600000*7);
            now = new Date(sf).getTime();
            distance = countDownDate - now;
            days = Math.floor(distance / (1000 * 60 * 60 * 24));
            hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("countdown").innerHTML = days + "<span>days</span> " + hours + "<span>hours</span> " + minutes + "<span>minutes</span> " + seconds + "<span>seconds</span> ";
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("countdown").innerHTML = "";
                //countdownWrap.classList.add('d-none');
                //liveStream.classList.remove('d-none');
            }
        }, 1000);
    }
};



}(jQuery, andrewrossco));