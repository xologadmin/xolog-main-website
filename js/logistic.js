/*jslint browser: true*/
/*jslint white: true */
/*global $,jQuery,ozy_headerType,Parallax,alert,$OZY_WP_AJAX_URL,$OZY_WP_IS_HOME,$OZY_WP_HOME_URL,addthis*/

/* Logistic WordPress Theme Main JS File */

/**
* Call Close Fancybox
*/
function close_fancybox(){
	"use strict";
	jQuery.fancybox.close();
}

/*
Some of dynamic elements like essential grid are not
sizing correctly when you refresh the page and jump to
another tab and back. Following handlers will fix it.
*/
window.onblur = function(){ jQuery(window).resize(); }
window.onfocus = function(){ jQuery(window).resize(); }

/**
* Read cookie
*
* @key - Cookie key
*/
function getCookieValue(key) {
	"use strict";
    var currentcookie = document.cookie, firstidx, lastidx;
    if (currentcookie.length > 0)
    {
        firstidx = currentcookie.indexOf(key + "=");
        if (firstidx !== -1)
        {
            firstidx = firstidx + key.length + 1;
            lastidx = currentcookie.indexOf(";", firstidx);
            if (lastidx === -1)
            {
                lastidx = currentcookie.length;
            }
            return decodeURIComponent(currentcookie.substring(firstidx, lastidx));
        }
    }
    return "";
}

/**
* Cookie checker for like system
*
* @post_id - WordPress post ID
*/
function check_favorite_like_cookie(post_id) {
	"use strict";
	var str = getCookieValue( "post_id" );
	if(str.indexOf("[" + post_id + "]") > -1) {
		return true;
	}

	return false;
}

/**
* Cokie writer for like system
*
* @post_id - WordPress post ID
*/
function write_favorite_like_cookie(post_id) {
	"use strict";
	var now = new Date();
	now.setMonth( now.getYear() + 1 );
	post_id = "[" + post_id + "]," + getCookieValue("post_id");
	document.cookie="post_id=" + post_id + "; expires=" + now.toGMTString() + "; path=/; ";
}

/**
* Cookie Notice Banner
*/
function ozy_cookie_notice_banner() {
	"use strict";
	if(getCookieValue( "logistic_cookie_banner" ) != '1') {
		jQuery('#ozy-cookie_notice_banner').addClass('show');

		jQuery('#ozy-cookie_notice_banner a.generic-button').on("click", function(e){
			e.preventDefault();

			var now = new Date();
			now.setMonth( now.getYear() + 1 );
			document.cookie="logistic_cookie_banner=" + "1; expires=" + now.toGMTString() + "; path=/; ";
			jQuery('#ozy-cookie_notice_banner').removeClass('show');

			return false;
		});
	}
}

/**
* Like buttons handler
*
* @post_id - WordPress post ID
* @p_post_type
* @p_vote_type
* @obj
*/
function ajax_favorite_like(post_id, p_post_type, p_vote_type, $obj) {
	"use strict";
	if( !check_favorite_like_cookie( post_id ) ) { //check, if there is no id in cookie
		jQuery.ajax({
			url: $OZY_WP_AJAX_URL,
			data: { action: 'ozy_ajax_like', vote_post_id: post_id, vote_post_type: p_post_type, vote_type: p_vote_type },
			cache: false,
			success: function(data) {
				//not integer returned, so error message
				if( parseInt(data,0) > 0 ){
					write_favorite_like_cookie(post_id);
					jQuery('span', $obj).text(data);
				} else {
					alert(data);
				}
			},
			error: function(MLHttpRequest, textStatus, errorThrown){
				alert("MLHttpRequest: " + MLHttpRequest + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
			}
		});
	}
}

/**
* Popup window launcher
*
* @url - Url address for the popup window
* @title - Popup window title
* @w - Width of the window
* @h - Height of the window
*/
function ozyPopupWindow(url, title, w, h) {
	"use strict";
	var left = (screen.width/2)-(w/2), top = (screen.height/2)-(h/2);
	return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}

/**
* To check iOS devices and versions
*/
function ozyGetOsVersion() {
	"use strict";
    var agent = window.navigator.userAgent.toLowerCase(),
        start = agent.indexOf( 'os ' );

    if ( /iphone|ipod|ipad/.test( agent ) && start > -1 ) {
        return window.Number( agent.substr( start + 3, 3 ).replace( '_', '.' ) );
    }

	return 0;
}

function ozyCheckIsMobile() {
	"use strict";
	return (/Mobi/.test(navigator.userAgent));
}

function ozyCheckMac(){
	"use strict";
	var isMac = /(mac)/.exec( window.navigator.userAgent.toLowerCase() );
	return ( isMac != null && isMac.length );
}

function ozyCheckChrome() {
	"use strict";
	var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
	var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
	return isChrome || isSafari;
}

/**
* ozy_full_row_fix
*
* Set sections to document height which matches with selector
*/
function ozy_full_row_fix() {
	"use strict";
	jQuery('.ozy-custom-fullheight-row').each(function() {
		jQuery(this).css('min-height', jQuery(window).innerHeight() - ((jQuery(this).outerHeight() - jQuery(this).height())) + 'px' );
    });
}

/**
* ozy_floating_box_init
*
* Floating box compnent fix
*/
function ozy_floating_box_init() {
	"use strict";
	setTimeout(function(){
		jQuery('.ozy-floating-box').each(function() {
			var h = jQuery(this).parents('.wpb_row').css('min-height') !== '0px'? jQuery(this).parents('.wpb_row').css('min-height') : jQuery(this).parents('.wpb_row').height()+'px';
			jQuery(this).css('height', h);
		});

	}, (parseInt(ozyGetOsVersion()) <= 0 ? 0 : 1000));
}

function ozy_fix_row_video(){
	"use strict";
	if(parseInt(ozyGetOsVersion()) <= 0) {
		jQuery('.wpb_row>video').each( function() {
			var videoAspectRatio,viewportWidth,viewportHeight,viewportAspectRatio;
			videoAspectRatio = jQuery(this).outerWidth() / jQuery(this).outerHeight();
			viewportWidth = jQuery(this).parent('div.wpb_row').outerWidth();
			viewportHeight = jQuery(this).parent('div.wpb_row').outerHeight();
			viewportAspectRatio = viewportWidth / viewportHeight;
			if (viewportAspectRatio > videoAspectRatio) {
				// Very-wide viewport, so use the width
				jQuery(this).css({width: viewportWidth + 'px', height: 'auto'});
			}else {
				// Very-tall viewport, so use the height
				jQuery(this).css({width: 'auto', height: viewportHeight + 'px'});
			}
		});
	}
}

function ozy_share_button() {
	"use strict";
	jQuery(document).on('click', '.post-submeta>div>div.button>a', function(e) {
		e.preventDefault();
		ozyPopupWindow(jQuery(this).attr('href'), 'Share', 640, 440);
	});
}

/**
* ozy_hash_scroll_fix
*
* Check if there is a hash and scrolls to there, onload
*/
function ozy_hash_scroll_fix() {
	"use strict";
	setTimeout(function(){
	if(window.location.hash) {
		var hash = window.location.hash;
		if(jQuery(hash).length) {
			jQuery('html,body').animate({scrollTop: jQuery(hash).offset().top - (jQuery('#header').height())}, 1600, 'easeInOutExpo');
			return false;
		}
	}}, 200);
}

/**
* ozy_simple_select_box
*
* Simple jquery selectbox
*/
function ozy_simple_select_box() {
	jQuery('div.ozy-selectBox').each(function(){
		jQuery(this).children('span.ozy-selected').html(jQuery(this).children('div.ozy-selectOptions').children('span.ozy-selectOption:first').html());
		jQuery(this).attr('value',jQuery(this).children('div.ozy-selectOptions').children('span.ozy-selectOption:first').attr('value'));

		jQuery(this).children('span.ozy-selected,span.ozy-selectArrow').click(function(e){
			e.preventDefault();
			jQuery('div.ozy-selectBox').toggleClass('open');
			if(jQuery(this).parent().children('div.ozy-selectOptions').css('display') == 'none'){jQuery(this).parent().children('div.ozy-selectOptions').css('display','block');}
			else{jQuery(this).parent().children('div.ozy-selectOptions').css('display','none');}
		});

		jQuery(this).find('span.ozy-selectOption').click(function(e){
			e.preventDefault();
			jQuery(this).parent().css('display','none');
			jQuery(this).closest('div.ozy-selectBox').removeClass('open').attr('value',jQuery(this).attr('value'));
			jQuery(this).parent().siblings('span.ozy-selected').html(jQuery(this).html());

			jQuery('div[class^="top-info-line"]').css('display', 'none');
			jQuery('div[class^="top-info-line-'+ jQuery('a', this).data('index') +'"]').css('display', 'inline-block');
		});
	});

	jQuery(document).on("touchstart, click", function(e) {
		var searchbox_div = jQuery("div.ozy-selectBox");
		if (!searchbox_div.is(e.target) && !searchbox_div.has(e.target).length && jQuery("div.ozy-selectBox").hasClass("open")) {
			searchbox_div.children('span.ozy-selectArrow').click();
		}
	});
}

/* Resets windows scroll position if there is a hash to make it work smooth scroll*/
var windowScrollTop = jQuery(window).scrollTop();
window.scrollTo(0, 0);
setTimeout(function() {
	"use strict";
	window.scrollTo(0, windowScrollTop);
}, 1);

jQuery(window).resize(function() {
	"use strict";

	ozy_full_row_fix();
	ozy_floating_box_init();
	ozy_fix_row_video();
});

jQuery(window).on('load', function(){
	if (jQuery().masonry) {
		/* Search page */
		if(jQuery('body.search-results').length) {
			jQuery('body.search-results .post-content>div').imagesLoaded( function(){
				jQuery('body.search-results .post-content>div').masonry({
					itemSelector : 'article.result',
					gutter : 20
				});
			});
		}

		/*pag-masonry-gallery.php*/
		if(jQuery('body.page-template-page-masonry-gallery-php').length) {
			jQuery('.ozy-grid-gallery div.thumb>a').imagesLoaded( function(){
				jQuery('.ozy-masonry-gallery').masonry({
					itemSelector : 'div.thumb',
					gutter : 0,
					animate: true
				});
			});
		}
	}

	if(jQuery('#ozy_announcement_window').length>0) {
		jQuery.fancybox({
			'content' : jQuery("#ozy_announcement_window").html()
		});
	}

	/* Row Background Slider */
	if(jQuery('#ozy-background-cycler').length>0) {
		jQuery('#ozy-background-cycler').fadeIn(1500); //fade the background back in once all the images are loaded
		setInterval('ozy_cycle_images()', 5000);	// run every 5s
	}
});

/**
*
* Original Idea: Simon Battersby @ http://goo.gl/CsWVJL
*/
function ozy_cycle_images(){
	var $active = jQuery('#ozy-background-cycler>div.active');
	var $next = (jQuery('#ozy-background-cycler>div.active').next().length > 0) ? jQuery('#ozy-background-cycler>div.active').next() : jQuery('#ozy-background-cycler>div:first');
	$next.css('z-index',2);//move the next image up the pile
	$active.fadeOut(1500,function(){//fade out the top image
		$active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
		$next.css('z-index',3).addClass('active');//make the next image the top one
	});
}

(function($) {
	$.fn.menumaker = function(options) {
		var cssmenu = $(this), settings = $.extend({
			format: "dropdown",
			sticky: false
		}, options);
		return this.each(function() {
			$(this).find(".menu-button").on('click', function(){
				$(this).toggleClass('menu-opened');
				var mainmenu = $(this).next('ul');
				if (mainmenu.hasClass('open')) {
					mainmenu.find('ul').removeClass('open').slideUp(); //close open menu items
					mainmenu.find('li').removeClass('sub-active'); //close open menu items : remove active color on child items
					mainmenu.find('span.submenu-opened').removeClass('submenu-opened'); //close open menu items : set to normal + buttons
					mainmenu.removeClass('open');

				}else{
					mainmenu.addClass('open');
					if (settings.format === "dropdown") {
						mainmenu.find('ul').show();
					}
				}
			});
			var $cssmenu = cssmenu.find('li ul').parent();
			$cssmenu.addClass('has-sub');
			$cssmenu.on('mouseenter',function(){
				var doc_w = $(document).width();
				var sub_pos = $(this).find('ul').offset();
				var sub_width = $(this).find('ul').width();
				if((sub_pos.left + sub_width) > doc_w) {
					$(this).find('ul').css('margin-left', '-' + ((sub_pos.left + sub_width) - doc_w) + 'px');
				}
			});
			multiTg = function() {
				cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
				cssmenu.find('.submenu-button').on('click', function() {
					$(this).toggleClass('submenu-opened');
					$(this).parents('li').toggleClass('sub-active');//mobile fix//
					if ($(this).siblings('ul').hasClass('open')) {
						$(this).siblings('ul').removeClass('open').slideToggle();
					}else{
						$(this).siblings('ul').addClass('open').slideToggle();
					}
				});
			};

			if (settings.format === 'multitoggle') multiTg(); else cssmenu.addClass('dropdown');

			if (settings.sticky === true) cssmenu.css('position', 'fixed');
			resizeFix = function() {
				var mediasize = 1120;
				if ($( window ).width() > mediasize) {
					cssmenu.find('ul').show();
				}
				if ($(window).width() <= mediasize) {
					cssmenu.find('div.button').removeClass('menu-opened');
				}
			};
			resizeFix();
			return $(window).on('resize', resizeFix);
		});
	};
})(jQuery);

jQuery(document).ready(function($) {
	"use strict";

	var ozyIosVersion;
	ozyIosVersion = parseInt(ozyGetOsVersion());

	ozy_share_button();

	ozy_hash_scroll_fix();

	ozy_full_row_fix();

	ozy_floating_box_init();

	ozy_cookie_notice_banner();

	/* Primary Menu */
	$("body.classic-menu #top-menu").menumaker({
	   format: "multitoggle"
	});

	/* Overlay Menu */

	/* Show primary menu when burger button clicked */
	$('body.overlay-menu .primary-menu-bar-wrapper button').on('click', function(){
		$('body').toggleClass('open');
	});

	/* First close all menu items on initialization */
	$('body.overlay-menu .primary-menu-bar-wrapper .menu li a').each(function() {
		$(this).parent().children('ul:first').slideToggle();
    });

	/* Create custom css for menu animation */
	var custom_css_for_menu_items = '', custom_css_for_menu_item_delay = .75 ,custom_css_for_menu_item_counter = 1;
	$('body.overlay-menu .primary-menu-bar-wrapper .menu>li').each(function(index, element) {
		custom_css_for_menu_items += 'body.overlay-menu.open .primary-menu-bar-wrapper ul.menu li:nth-child('+ custom_css_for_menu_item_counter +') {-webkit-transition-delay: '+ custom_css_for_menu_item_delay.toFixed(2) +'s;transition-delay: '+ custom_css_for_menu_item_delay.toFixed(2) +'s;}';
		custom_css_for_menu_item_counter++;
		custom_css_for_menu_item_delay = custom_css_for_menu_item_delay + .10;
    });
	$('<style type="text/css">'+ custom_css_for_menu_items +'</style>').appendTo('head');

	/* Menu Item Handler */
	$('body.overlay-menu .primary-menu-bar-wrapper .menu li a:not(#wpml-language-switcher)').click(function (e) {
		if($(this).parent('li').hasClass('dropdown')) {
			e.preventDefault();
			var $that = $(this).parent('li');
			$('body.overlay-menu .primary-menu-bar-wrapper .menu li').each(function() { if(!$that.is($(this))) { $(this).removeClass('open'); }});
			var ullist = $(this).parent().toggleClass('open').children('ul:first');
			ullist.slideToggle();
			$(this).parent().siblings().children().next().slideUp();
		}else{
			if (/#/.test(this.href)) {
				e.preventDefault();
				if($OZY_WP_IS_HOME != 'false') {
					ozy_click_hash_check(this);
				}else{
					if(ozy_Animsition.is_active) {
						$('.animsition').animsition('out', $(e.target), $OZY_WP_HOME_URL + $(this).attr('href'));
					}else{
						window.location = $OZY_WP_HOME_URL + $(this).attr('href');
					}
				}
			}else{
				if(ozy_Animsition.is_active) {
					e.preventDefault();
					$('.animsition').animsition('out', $(e.target), $(this).attr('href'));
				}
			}
			$('body').toggleClass('open');
		}
	});
	/*overlay menu end*/

	/* Cookie Notice Banner Visibility */
	jQuery(window).scroll(function() {
		jQuery.doTimeout('scroll', 5, function(){
			if(jQuery('#ozy-cookie_notice_banner').length) {
				if(jQuery(window).scrollTop() >= 150) {
					jQuery('#ozy-cookie_notice_banner').addClass('in-viewport');
				}else{
					jQuery('#ozy-cookie_notice_banner').removeClass('in-viewport');
				}
			}
		});
	});

	/* Request Rate Form */
	if($('#request-a-rate').length && ozy_requestARate.menu_id !== 'undefined' && ozy_requestARate.menu_id !== '0') {
		$('#menu-item-' + ozy_requestARate.menu_id + ',.comp-request-a-rate').on('click', function(e) {
			e.preventDefault();
			var top_pos = $('body.admin-bar').length ? 32 : 0;
			$('#request-a-rate').animate({top: top_pos + 'px'}, 600, 'easeInOutExpo');
		});

		$('#request-a-rate>a.close').on('click', function(e){
			e.preventDefault();
			$('#request-a-rate').animate({top:'-100%'}, 600, 'easeInOutExpo');
		});
	}

	/* Tracking Form */
	$('a#tracking-form').click(function(e) {
        e.preventDefault();
		$('body').toggleClass('tracker-form-open');
		setTimeout(function(){ //in case no-captcha version used
			$('#freevision_tracker_form input[type="text"]').focus();
		}, 200);		
		return false;
    });

	/* Close overlay boxes when clicked somewhere on the document, if opened already */
	$(document).on("click", function(e) {
		var tracker_form_elm = $("body.tracker-form-open #header #freevision_tracker_form,body.tracker-form-open #header #freevision_tracker_form");
		if (!$('a#tracking-form').is(e.target) && !tracker_form_elm.is(e.target) && !tracker_form_elm.has(e.target).length && tracker_form_elm.is(':visible')) {
			$('body').removeClass('tracker-form-open');
		}
	});

	/* fix for if last item is not side menu */
	$('#nav-primary>nav>div>ul>li:visible:last>a').css('padding', '0');

	/* Checks elements matches with hashes or not */
	function ozy_click_hash_check($this) {
		if (location.pathname.replace(/^\//,'') == $this.pathname.replace(/^\//,'')
			|| location.hostname == $this.hostname) {

			var target = $($this.hash);
			target = target.length ? target : $('[name=' + $this.hash.slice(1) +']');
		   	if (target.length) {
				$('html,body').animate({
					 scrollTop: target.offset().top
				}, 1600, 'easeInOutExpo');
				return false;
			}
		}
	}

	/* Menu Link */
	$('#top-menu ul>li>a[href*="#"]:not([href="#"])').click(function(e) {
		if($OZY_WP_IS_HOME) {
			e.preventDefault();
			ozy_click_hash_check(this);
		}
	});

	/* full page */
	if (jQuery().fullpage) {
		$('#content.full-row-slider').fullpage({
			verticalCentered: false,
			'css3': false,
			'scrollingSpeed': 1e3,
			'easing': 'easeInOutCubic',
			anchors: fullPageParams.anchors.split(','),
			sectionSelector: '#full-page>.wpb_row',
			slideSelector: '#full-page>.wpb_row>div>div>div>.wpb_row',
			'navigation': true,
			'navigationPosition': 'right',
			afterLoad : function(anchorLink, index)	{
				var $elm = $('#full-page>.wpb_row').eq(index-1);
				$elm.find('.wpb_appear').addClass('wpb_start_animation');
			},
			onLeave : function(index, nextIndex, direction)	{
				var $elm = $('#full-page>.wpb_row').eq(index-1);
				setTimeout(function(){
					$elm.find('.wpb_appear').removeClass('wpb_start_animation');
				}, 1000);
			}
		});
	}

	/* page-isotope-blog.php*/
	if($('body.page-template-page-isotope-blog-php').length>0) {
			var $container;
		$('.isotope').imagesLoaded( function() {
			$container = $('.isotope').isotope({
				itemSelector: '.post',
				layoutMode: 'masonry',
				masonry: {
					gutter: 0
				}
			});
		});

		// bind filter button click
		$('#filters').on( 'click', 'a.button', function(e) {
			e.preventDefault();
			var filterValue = $( this ).attr('data-filter');
			// use filterFn if matches value
			$container.isotope({ filter: filterValue });
		});

		// change is-checked class on buttons
		$('.button-group').each( function( i, buttonGroup ) {
			var $buttonGroup = $( buttonGroup );
			$buttonGroup.on( 'click', 'a.button', function() {
				$buttonGroup.find('.is-checked').removeClass('is-checked');
				$( this ).addClass('is-checked');
			});
		});
	}

	/* page-grid-gallery.php */

	//http://www.8bit-code.com/tutorials/direction-aware-image-gallery-effect
	if($('body.page-template-page-grid-gallery-php').length>0) {
		$(function () {
			$(".ozy-grid-gallery li").on("mouseenter mouseleave", function(e){
				var w = $(this).width();
				var h = $(this).height();
				var x = (e.pageX - this.offsetLeft - (w/2)) * ( w > h ? (h/w) : 1 );
				var y = (e.pageY - this.offsetTop  - (h/2)) * ( h > w ? (w/h) : 1 );
				var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180 ) / 90 ) + 3 )  % 4;
				switch(direction) {
					case 0:
						var slideFrom = {"top":"-100%", "right":"0"};
						var slideTo = {"top":0};
						var imgSlide = "0, 60";
						break;
					case 1: //
						var slideFrom = {"top":"0", "right":"-100%"};
						var slideTo = {"right":0};

						var imgSlide = "-60, 0";
						break;
					case 2:
						var slideFrom = {"top":"100%", "right":"0"};
						var slideTo = {"top":0};
						var imgSlide = "0, -60";
						break;
					case 3:
						var slideFrom = {"top":"0", "right":"100%"};
						var slideTo = {"right":0};
						var imgSlide = "60, 0";
					break;
				}
				if( e.type === 'mouseenter' ) {
					var element = $(this);
					element.find(".info").removeClass("transform").css(slideFrom);
					element.find("img").addClass("transform").css("transform","matrix(1, 0, 0, 1,"+imgSlide+")");
					setTimeout(function(){element.find(".info").addClass("transform").css(slideTo);},1);
				}else {
					var element = $(this);
					element.find(".info").addClass("transform").css(slideFrom);
					element.find("img").removeClass("transform").css("transform","matrix(1, 0, 0, 1,"+imgSlide+")");
					setTimeout(function(){element.find("img").addClass("transform").css("transform","matrix(1, 0, 0, 1,0,0)");},1);
				}
			});
		});
	}

	/* Animsition */
	if(ozy_Animsition.is_active) {
		var linkElement_str = '#top-menu li>a:not([target="_blank"]):not([href^="#"]):not(#tracking-form):not(#wpml-language-switcher)';
		if(!$OZY_WP_IS_HOME) {
			var linkElement_str = '#top-menu>ul>li>a:not([target="_blank"]):not([href^="#"]):not(#tracking-form):not(#wpml-language-switcher)';
		}

		if($('#request-a-rate').length
			&& ozy_requestARate.menu_id !== 'undefined'
			&& ozy_requestARate.menu_id !== '0')
		{
			linkElement_str += ':not([data-id="'+ ozy_requestARate.menu_id +'"])';
		}
		$(".animsition").animsition({
			inClass: 'fade-in',
			outClass: 'fade-out',
			inDuration: 1500,
			outDuration: 800,
			linkElement: linkElement_str,
			loading: true,
			loadingParentElement: 'body', //animsition wrapper element
			loadingClass: 'animsition-loading',
			loadingInner: '', // e.g '<img src="loading.svg" />'
			timeout: true,
			timeoutCountdown: 3000,
			onLoadEvent: true,
			browser: [ 'animation-duration', '-webkit-animation-duration'],
			overlay : false,
			overlayClass : 'animsition-overlay-slide',
			overlayParentElement : 'body',
			transition: function(url){ window.location.href = url; }
		});
	}

	// Search Button & Stuff
	var main_margin_top = $('#main').css('margin-top');
	$(document).on('touchstart, click', '#ozy-close-search,.menu-item-search>a', function(e) {
		if($('#top-search').hasClass('open')){
			$('#top-search').removeClass('open').delay(200);
			$('#main').animate({'margin-top': parseInt(main_margin_top) + 'px'}, 300, 'easeInOutExpo');
			$('#top-search').animate({height:'0px'}, 200, 'easeInOutExpo');
		}else{
			$('#main').animate({'margin-top':  (parseInt(main_margin_top) + 120) + 'px'}, 300, 'easeInOutExpo');
			$('#top-search').animate({height:'120px', opacity:1}, 200, 'easeInOutExpo',function(){$('#top-search>form>input').focus();$('#top-search').addClass('open');});
		}
		e.preventDefault();
	});

	// Close search box when clicked somewhere on the document, if opened already
	$(document).on("click", function(e) {
		if(parseInt(ozyIosVersion) === 0 ||
		parseInt(ozyIosVersion) >= 7 ) {
			var searchbox_div = $("#top-search");
			if (!searchbox_div.is(e.target) && !searchbox_div.has(e.target).length) {
				if($(searchbox_div).hasClass('open')){
					$(searchbox_div).removeClass('open').delay(200);
					$('#main').animate({'margin-top': parseInt(main_margin_top) + 'px'}, 300, 'easeInOutExpo');
					$(searchbox_div).animate({height:'0px'}, 200, 'easeInOutExpo');
				}
			}
		}
	});

	function ozy_visual_stuff() {
		/* copies Email Address label of Mail Chimp form into Subscribe field as a placeholder */
		if($('#mc_signup_form').length>0) {
			$('input[name="mc_mv_EMAIL"]').each(function() {
				$(this).attr('placeholder', $('.mc_header_email').first().text() );
            });
			$('#mc_signup_submit.button').removeClass('button');
		}

		/* row scrolling effect */
		$('.wpb_row[data-bgscroll]').each(function() {
			var params = $(this).data('bgscroll').split(',');
			$(this).ozyBgScroller({direction:params[0], step:params[1]});
		});

		/* flipbox requires to parent has overflow hidden on chrome to work as expected */
		$('.flip-container').each(function() {
			$(this).parents('.wpb_row').css('overflow', 'hidden');
		});

		/* title with icon connected border color fix */
		var inline_style = '';
		$('.title-with-icon-wrapper.connected').each(function() {
			inline_style += '#' + $(this).attr('id') + ':before{border-color:'+ $(this).data('color') +';}';
		});
		if(inline_style) { $('head').append('<style>'+ inline_style +'</style>'); }

		if(ozyIosVersion <= 0) {
			$('.wpb_row.ozy-custom-row.parallax').each( function() {
				$(this).rParallax("center", 0.3, true);
			});
			/* bouncing arrow row bottom button */
			$('.row-botton-button').addClass('animation animated bounce');
		}else{
			$('.wpb_row.ozy-custom-row.parallax').each( function() {
				$(this).css('background-repeat','repeat');
			});
		}

		/* Blog Share Button*/
		$(document).on('click', '.post-submeta>a.post-share', function(e) {
			if($(this).data('open') !== '1') {
				$(this).data('open', '1').next('div').stop().animate({'margin-left': '0', opacity: 'show'}, 300, 'easeInOutExpo');
			}else{
				$(this).data('open', '0').next('div').stop().animate({'margin-left': '30px', opacity: 'hide'}, 300, 'easeInOutExpo');
			}
			e.preventDefault();
		});
		$(document).on("click", function(e) {
			var post_share_button = $(".post-submeta>a.post-share");
			if (!post_share_button.is(e.target) && !post_share_button.has(e.target).length) {
				post_share_button.data('open', '0').next('div').stop().animate({'margin-left': '30px', opacity: 'hide'}, 300, 'easeInOutExpo');
			}
		});

		/* Tooltip plugin init */
		$(function(){
			$('.tooltip-top').tooltipsy({className:'tooltipsy white', offset: [0, 20]});
			$('.tooltip').tooltipsy();
		});

		/*google maps scroll fix*/
		$('.wpb_map_wraper').each(function() {
			$(this).append(
				$('<div class="gmaps-cover"></div>').click(function(){ $(this).remove(); })
			);
        });

		/* Spinner List */
		$('.ozy-spinner-list>ul>li').on('mouseenter',function() {
			$(this).addClass('over');
			$(this).parents('ul').find('li:not(.over)').stop().animate({opacity:0.7}, 500, 'easeInOutExpo');
		}).on('mouseleave',function() {
			$(this).removeClass('over');
			$(this).parents('ul').find('li').stop().animate({opacity:1}, 500, 'easeInOutExpo');
		});

		/* Fancy Blog List */
		$('.ozy-fancyaccordion-feed>a').click(function(e){
			e.preventDefault();
			var $that = $(this).find('.plus-icon'), ullist = $(this).next('div.panel');

			if($that.hasClass('open')) {$that.removeClass('open').addClass('close');}else{$that.removeClass('close').addClass('open');}
			if(!$(this).hasClass('open')) {
				$(this).parent('div.ozy-fancyaccordion-feed').find('a.open').each(function() {
					$(this).removeClass('open');
					$(this).next('div.panel').slideToggle(400, 'easeInOutExpo');
					$(this).find('.plus-icon').removeClass('open').addClass('close');
				});
			}
			$(this).toggleClass('open');
			ullist.slideToggle(400, 'easeInOutExpo');
		});

		/* Simple Info Box Equal Height */
		$('.vc_row').each(function() {
			$(this).find('.ozy-simlple-info-box').equalHeights();
		});

		/* Hover Card Default View Height Fix*/
		$('.ozy-hover-card').each(function() {
			$(this).parents('.vc_row:not(.vc_inner)').find('.ozy-hover-card').equalHeights();
		});
	}

	ozy_visual_stuff();

	/* Simple select box init */
	ozy_simple_select_box();

	function ozy_vc_components() {
		/* Textilate */
		$('.ozy-tlt').each(function() {
			$(this).textillate({
				minDisplayTime: $(this).data('display_time'),
				selector: '.ozy-tlt-texts',
				loop: true,
				in: {
					effect: $(this).data('in_effect'),
					sync: ($(this).data('in_effect_type') == 'sync' ? true:false),
					shuffle: ($(this).data('in_effect_type') == 'shuffle' ? true:false),
					'reverse': ($(this).data('in_effect_type') == 'reverse' ? true:false),
					sequence: ($(this).data('in_effect_type') == 'sequence' ? true:false)
				},
				out: {
					effect: $(this).data('out_effect'),
					sync: ($(this).data('out_effect_type') == 'sync' ? true:false),
					shuffle: ($(this).data('out_effect_type') == 'shuffle' ? true:false),
					'reverse': ($(this).data('out_effect_type') == 'reverse' ? true:false),
					sequence: ($(this).data('out_effect_type') == 'sequence' ? true:false)
				}
			});
		});

		/* Icon Shadow */
		$('.title-with-icon-wrapper>div>span[data-color],.ozy-icon[data-color]').flatshadow({angle: "SE", fade: false, boxShadow: false });

		/* Morph Text */
		$('.ozy-morph-text').each(function() {
			$(this).find(".text-rotate").Morphext({
				animation: $(this).data('effect'),
				separator: $(this).data('separator'),
				speed: $(this).data('speed')
			});
		});

		/* Owl Carousel */
		$('.ozy-owlcarousel').each(function() {
			var $owl = $(this);
			$owl.owlCarousel({
				lazyLoad : true,
				autoPlay: $(this).data('autoplay'),
				items : $(this).data('items'),
				singleItem : $(this).data('singleitem'),
				slideSpeed : $(this).data('slidespeed'),
				autoHeight : $(this).data('autoheight'),
				itemsDesktop : [1199,3],
				itemsDesktopSmall : [979,3],
				addClassActive: true,
				navigation: ($owl.hasClass('single') ? true : false),
				navigationText : ($owl.hasClass('single') ? ['<i class="oic-left-open-mini"></i>','<i class="oic-right-open-mini"></i>'] : false),
				afterInit:function(elem){
					owlCreateBar(this);
					setTimeout(function(){ $owl.find('.owl-item>.item').css({'width': '', 'height': ''}); }, 3000);
				},
				afterLazyLoad: function() {

				},
				afterUpdate:function(elem){
					owlCreateBar(this);
					owlMoveBar(this, elem);
					$(window).trigger('resize');
				},
				afterMove:function(elem){
					owlMoveBar(this, elem);
				}
			});
		});
		function owlAfterAction() {	}
		function owlCreateBar(owl){
			var owlPagination = owl.owlControls.find('.owl-pagination');
			owlPagination.append( "<span class='progressbar'></span>" );
	  	}
	  	function owlMoveBar(owl, elem){
			var owlPagination = owl.owlControls.find('.owl-pagination');
			var ProgressBar = owlPagination.find('.progressbar');
			var currentIndex = owlPagination.find($('.active')).index();
			var totalSlide = $(elem).find($('.owl-item')).length;
			ProgressBar.css({width: ( currentIndex * 100 / (totalSlide-1) ) + '%' });
	  	}

		/* Counter */
		if ('undefined' !== typeof jQuery.fn.waypoint) {
			jQuery('.ozy-counter>.timer').waypoint(function() {
				if(!$(this.element).hasClass('ran')) {
					$(this.element).addClass('ran').countTo({
						from: $(this.element).data('from'),
						to: $(this.element).data('to'),
						speed: 5000,
						refreshInterval: 25,
						sign: $(this.element).data('sign'),
						signpos: $(this.element).data('signpos')
					});
				}
			},{
				offset: '85%'
			});
		}

		/* Google Map */
		if ('undefined' !== typeof jQuery.fn.prettyMaps) {
			$('.ozy-google-map').each(function(index, element) {
				$(this).parent().append(
					$('<div class="gmaps-cover"></div>').click(function(){ $(this).remove(); })
				);
				$(this).prettyMaps({
					address: $(this).data('address'),
					zoom: $(this).data('zoom'),
					panControl: true,
					zoomControl: true,
					mapTypeControl: true,
					scaleControl: true,
					streetViewControl: true,
					overviewMapControl: true,
					scrollwheel: true,
					image: $(this).data('icon'),
					hue: $(this).data('hue'),
					saturation: $(this).data('saturation'),
					lightness: $(this).data('lightness')
				});
			});
		}

		/* Multi Google Map */
		if ('undefined' !== typeof jQuery.fn.ozyGmap) {
			$('.ozy-multi-google-map').each(function(index, element) {
				$(this).parent().append(
					$('<div class="gmaps-cover"></div>').click(function(){ $(this).remove(); })
				);
				$(this).ozyGmap({
					dataPath: $(this).data('path'),
					zoom: $(this).data('zoom'),
					panControl: true,
					zoomControl: true,
					mapTypeControl: true,
					scaleControl: true,
					streetViewControl: true,
					overviewMapControl: true,
					scrollwheel: true,
					image: $(this).data('icon'),
					hue: $(this).data('hue'),
					saturation: $(this).data('saturation'),
					lightness: $(this).data('lightness')
				});
			});
		}

		/* Before / After */
		jQuery('.ozy-before_after').imagesLoaded(function() {
			if (jQuery().twentytwenty) { jQuery(".ozy-before_after").twentytwenty().css('visibility','visible').hide().fadeIn('slow'); }
		});
	}

	ozy_vc_components();

	/* Check if section ID and menu target is match */
	$('.wpb_row').bind('inview', function (event, visible) {
		var $elm = $('#top-menu a[href*="#'+ jQuery(this).attr('id') +'"]:not([href="#"])').parent();
		if (visible == true) {
			$elm.addClass('current-menu-item');
		}else{
			$elm.removeClass('current-menu-item');
		}
	});

	/* Fix Element min-height */
	$('.ozy-custom-fullheight-row').each(function() {
		$(this).css('min-height', $(window).innerHeight() - (($(this).outerHeight() - $(this).height())) + 'px' );
    });

	/* Contact Form 7 Date Time Picker */
	if ('undefined' !== typeof jQuery.fn.datetimepicker) {
		$('input.datetimepicker').datetimepicker({minDate:0,minTime:0});
	}

	function ozy_click_hash_check($this) {
		if (location.pathname.replace(/^\//,'') == $this.pathname.replace(/^\//,'')
			|| location.hostname == $this.hostname) {

			var target = $($this.hash);
			target = target.length ? target : $('[name=' + $this.hash.slice(1) +']');
		   	if (target.length) {
				$('html,body').animate({
					 scrollTop: target.offset().top - ($('#header').height())
				}, 1600, 'easeInOutExpo');
				return false;
			}
		}
	}

	/* Drag scroll to section whenever an anchor clicked with mathcing section ID */
	$('#content a.row-botton-button[href*="#"]:not([href="#"]), .master-slider a.ms-layer[href*="#"]:not([href="#"])').click(function(e) {
		e.preventDefault();
		if($('body').hasClass('page-template-page-row-slider-php')) {
			$.fn.fullpage.moveSectionDown();
		}else{
			ozy_click_hash_check(this);
		}
	});

	/* Waypoint animations */
	if ('undefined' !== typeof jQuery.fn.waypoint) {
	    jQuery('.ozy-waypoint-animate').waypoint(function() {
			jQuery(this.element).addClass('ozy-start-animation');
		},{
			offset: '85%'
		});
	}

	/* Blog post like function */
	$(document).on('click', '.blog-like-link', function(e) {
		ajax_favorite_like($(this).data('post_id'), 'like', 'blog', this);
		e.preventDefault();
    });

	/* FancyBox initialization */
	$('.woocommerce-page a.zoom').each(function() { $(this).attr('rel', 'product-gallery'); }); //WooCommerce Version 2.1.6 fancybox fix
	$(".wp-caption>p").click(  function(){ jQuery(this).prev('a').attr('title', jQuery(this).text()).click(); } ); //WordPress captioned image fix
	$(".fancybox, .wp-caption>a, .woocommerce-page .zoom,.single-image-fancybox a").fancybox({
		beforeLoad: function() {
		},
		padding : 0,
		helpers		: {
			title	: { type : 'inside' },
			buttons	: {}
		}
	});
	$('.fancybox-media').fancybox({openEffect  : 'none',closeEffect : 'none',helpers : {title	: { type : 'inside' }, media : {}}});

	$('.menu-item-wc').click(function(e){
		e.preventDefault();
		$("#woocommerce-lightbox-cart-wrapper").addClass("active");
	});

	$('#woocommerce-lightbox-cart #woocommerce-cart-close,#woocommerce-lightbox-cart-wrapper').click(function(e) {
		$("#woocommerce-lightbox-cart-wrapper").removeClass("active");
    });

	/* Back to top button */
	$(window).scroll(function() {
		if($(this).scrollTop() >= 100) {
			$('#to-top-button').stop().animate({bottom:'32px', opacity: 1}, 200, 'easeInOutExpo');
		} else {
			$('#to-top-button').stop().animate({bottom:'-32px', opacity: 0}, 200, 'easeInOutExpo');
		}
	});

	$('#to-top-button').click(function(e) {
		e.preventDefault();
		$('body,html').animate({scrollTop:0},800);
	});

	/* Menu WPML language switcher */
	jQuery('#ozy-language-selector-title').click(function(e) {
		e.preventDefault();
		jQuery('#ozy-language-selector').slideToggle(500, 'easeInOutExpo',function(){
			jQuery(this).toggleClass('open');
		});
	});
});

/**
* SVG replacer. Replaces <img src=svg/> into SVG element.
*
* Credits: How to change color of SVG image using CSS (jQuery SVG image replacement)?, http://stackoverflow.com/q/11978995
*/
jQuery(function(){
    jQuery('img.svg').each(function(){
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, else we gonna set it if we can.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });
});
