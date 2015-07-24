document.addEventListener('DOMContentLoaded', function() {


	// Global Variables
	// ----------------------------------------------------------------------------
	var elHTML       = document.documentElement,
		elBody       = document.body,
		elHeader     = document.getElementsByTagName('header')[0],
		elNavPrimary = document.getElementById('nav_primary'),
		elIntro      = document.getElementById('sec_intro'),
		elSales      = document.getElementById('sec_sales'),
		elBlog       = document.getElementById('sec_blog'),
		objPkry;

	// window measurement variables
	var numScrollPos      = window.pageYOffset,
		numWinWidth       = window.innerWidth,
		numClientWidth    = document.documentElement.clientWidth,
		numScrollbarWidth = numWinWidth - numClientWidth,
		hasScrollbar      = numScrollbarWidth > 0 ? true : false;

	// parallax header & stripes / fixed nav / smoothScroll
	var boolEnabledSS  = false, // assumes below 1200px by default - smoothScroll is not initialized
		numHeaderPosX  = 50,    // default X % position
		numHeaderPosY  = 50,    // default Y % position
		numNavTopPos   = 910,   // top position of nav as defined in CSS... should instead be retrieved from computed value
		numStripeWidth = 62     // width of gradient stripe;

	// declare section heights (only required for 1200px and up... remeasured in window resize event)
	var numSectionOffset = 65,
		numBodyHeight,
		numHeaderHeight,
		numIntroHeight,
		numSalesHeight,
		numBlogHeight,
		numBeginBlog,
		numBeginContact,
		numSalesStart,
		numSalesMiddle;


	// Helper: Lock / Unlock Body Scrolling
	// ----------------------------------------------------------------------------
	function lockBody() {

		// enable overflow-y: hidden on <body>
		elHTML.setAttribute('data-overflow', 'locked');

		// if necessary, accomodate for scrollbar width
		if (hasScrollbar) {
			elBody.style.paddingRight = numScrollbarWidth + 'px';
		}

	}

	function unlockBody() {

		// disable overflow-y: hidden on <body>
		elHTML.setAttribute('data-overflow', 'scrollable');

		// if necessary, remove scrollbar width styles
		// should be expanded to restore original padding if needed
		if (hasScrollbar) {
			elBody.style.paddingRight = '0px';
		}

	}


/*
	// secretMail: Add mailto link to home section
	// ----------------------------------------------------------------------------
	function secretMail() {

		var mailLink = document.getElementById('contact'),
			prefix    = 'mailto',
			local    = 'curtis',
			domain   = 'dulmage',
			suffix    = 'me';

		mailLink.setAttribute('href', prefix + ':' + local + '@' + domain + '.' + suffix);

	}
*/


	// onPageLoad: Main Function To Fire on Window Load
	// ----------------------------------------------------------------------------
	function onPageLoad() {

		initPkry();

		if (numWinWidth >= 1200) {

			measureSectionHeight();
			fixedHeader();
			navTrackSection();
			scrollParallax(); // need to calculate bg positions on page load in case of refresh
			initSmoothScrollJS();

		}

	}


	// initPkry: Initialize Packery.js + imagesLoaded
	// ----------------------------------------------------------------------------
	function initPkry() {

		var elPkryContainer = document.getElementById('pkry_container');

		// check if iso_container exists
		if (elPkryContainer == null) {
			return;
		}

		// it does exist! continue on...
		// var elIsoLoader   = document.getElementById('iso_loader');

		// layout Isotope after all images have loaded
		imagesLoaded(elPkryContainer, function(instance) {

			objPkry = new Packery(elPkryContainer, {

				itemSelector: 'a.pkry_brick',
				columnWidth: 'div.pkry_sizer',
				gutter: 'div.pkry_gutter'

			});

/*
			// IE9 does not support animations...
			if ( !classie.has(elHTML, 'ie9') ) {

				// listen for CSS transitionEnd before removing the element
				elIsoLoader.addEventListener(transitionEvent, removeLoader);

				// hide loader
				classie.remove(elIsoLoader, 'visible');

			}
*/

		});

/*
		function removeLoader(e) {

			// only listen for the opacity property
			if (e.propertyName == 'opacity') {

				// unlockBody();

				elPkryContainer.removeChild(elIsoLoader);
				elIsoLoader.removeEventListener(transitionEvent, removeLoader);

			}

		}
*/

	}


/*
	// finalAnimate: Inform the document when we have finished our loading animations
	// ----------------------------------------------------------------------------
	function finalAnimate() {

		var elFooter = document.getElementsByTagName('footer')[0];

		elFooter.addEventListener(animationEvent, applyReadyState);

		function applyReadyState() {

			classie.add(elHTML, 'ready');
			elFooter.removeEventListener(animationEvent, applyReadyState);

		}

	}
*/




	// measureSectionHeight: Get the height of each required section
	// ----------------------------------------------------------------------------
	function measureSectionHeight() {

		// measure section heights
		numBodyHeight   = elBody.clientHeight;
		numHeaderHeight = elHeader.offsetHeight;
		numIntroHeight  = elIntro.offsetHeight;
		numSalesHeight  = elSales.offsetHeight;
		numBlogHeight   = elBlog.offsetHeight;
		numBeginBlog    = numHeaderHeight + numIntroHeight + numSalesHeight - numSectionOffset;
		numBeginContact = numBeginBlog + numBlogHeight - numSectionOffset;
		numSalesStart   = numBodyHeight - numStripeWidth * 2;
		numSalesMiddle  = numBodyHeight - numStripeWidth;

	}


	// fixedNav: Position Fix the nav once scrolled
	// ----------------------------------------------------------------------------
	function fixedHeader() {

		// if we have scrolled to or past the top position of .nav_primary
		if (numScrollPos >= numNavTopPos) {
			classie.add(elHeader, 'nav_fixed');
		} else {
			classie.remove(elHeader, 'nav_fixed');
		}

		// if we have scrolled to or past the full height of the <header>
		if (numScrollPos >= numHeaderHeight) {
			classie.add(elHeader, 'nav_fixed-full');
		} else {
			classie.remove(elHeader, 'nav_fixed-full');
		}

	}


	// navTrackSection: Track 'current' section (scroll distance < distance from top of doc)
	// ----------------------------------------------------------------------------
	function navTrackSection() {

		switch (true) {
			case (numScrollPos < numHeaderHeight):
				elNavPrimary.setAttribute('data-current', 'header');
				break;
			case (numScrollPos < numBeginBlog):
				elNavPrimary.setAttribute('data-current', 'intro');
				break;
			case (numScrollPos < numBeginContact):
				elNavPrimary.setAttribute('data-current', 'blog');
				break;
			case (numScrollPos < numBodyHeight):
				elNavPrimary.setAttribute('data-current', 'contact');
				break;
			default:
				elNavPrimary.setAttribute('data-current', 'footer');
				break;
		}

	}


	// scrollParallax: Update section backgrounds on scroll
	// ----------------------------------------------------------------------------
	function scrollParallax() {

		// no point in updating the <header> background pos if its off screen
		if (numScrollPos < numHeaderHeight) {

			// calculate X and Y positions... X needs to be more subtle than Y
			numHeaderPosX = numScrollPos / 180 + 50;
			numHeaderPosY = numScrollPos / 80 + 50;

			// apply new positions to first background, leave 2nd background centered
			elHeader.style.backgroundPosition = numHeaderPosX + '% ' + numHeaderPosY + '%, 50% 50%';

		}

		// update background gradient co-ordinates for #sec_sales
		elSales.style.backgroundImage = 'repeating-linear-gradient(-45deg,' +
											'rgb(19,52,92) ' + (numSalesStart  - numScrollPos / 4) + 'px,' +
											'rgb(19,52,92) ' + (numSalesMiddle - numScrollPos / 4) + 'px,' +
											'rgb(18,41,69) ' + (numSalesMiddle - numScrollPos / 4) + 'px,' +
											'rgb(18,41,69) ' + (numBodyHeight   - numScrollPos / 4) + 'px'  +
										')';

	}


	// initSmoothScrollJS: Initialize smoothScroll plugin
	// ----------------------------------------------------------------------------
	function initSmoothScrollJS() {

		// exit function if smoothScroll has already been initialized
		if (boolEnabledSS) {
			return;
		}

		smoothScroll.init({
			speed: 900,
			easing: 'easeInOutQuint',
			updateURL: false
		});

		// set to true so this doesn't get reinitialized on window resize
		boolEnabledSS = true;

	}


	// Window Events
	// ----------------------------------------------------------------------------
	window.addEventListener('resize', function(e) {

		// do not fire resize event for every pixel... wait until finished
		waitForFinalEvent(function() {

			// re-measure window width on resize
			numWinWidth = window.innerWidth;

			if (numWinWidth >= 1200) {

				measureSectionHeight();
				fixedHeader();
				navTrackSection();
				scrollParallax(); // need to calculate bg positions on page load in case of refresh
				initSmoothScrollJS();

			} else {

				// remove style attributes from parallax elements
				elHeader.removeAttribute('style');
				elSales.removeAttribute('style');

			}

		}, 500, 'unique string');

	}, false);

	window.addEventListener('scroll', function(e) {

		// re-measure the window scroll distance
		numScrollPos = window.pageYOffset;

		if (numWinWidth >= 1200) {
			fixedHeader();
			navTrackSection();
			scrollParallax();
		}

	});


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	onPageLoad();


}, false);