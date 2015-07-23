document.addEventListener('DOMContentLoaded', function() {


	// Global Variables
	// ----------------------------------------------------------------------------
	var elHTML   = document.documentElement,
		elBody   = document.body,
		elHeader = document.getElementsByTagName('header')[0];

	// window measurement variables
	var numScrollPos      = window.pageYOffset,
		numWinWidth       = window.innerWidth,
		numClientWidth    = document.documentElement.clientWidth,
		numScrollbarWidth = numWinWidth - numClientWidth,
		hasScrollbar      = numScrollbarWidth > 0 ? true : false;

	// parallax header / fixed nav / smoothScroll
	var boolEnabledSS   = false, // assumes below 1200px by default - smoothScroll is not initialized
		boolHeaderStop  = true, // assumes below 1200px by default - parallax not executed
		numHeaderPosX   = 50,
		numHeaderPosY   = 50,
		numHeaderHeight = 1040, // height of the header (this should really be grabbed from the element)
		numNavTopPos    = 910; // top position of nav


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

		fixedHeader();
		parallaxHeader(); // need to calculate bg positions on page load in case of refresh
		initSmoothScrollJS();

	}


/*
	// initIsotope: Initialize Isotope.js
	// ----------------------------------------------------------------------------
	function initIsotope() {

		var elIsoContainer = document.getElementById('iso_container');

		// check if iso_container exists
		if (elIsoContainer == null) {
			return;
		}

		// lock body on initial page load
		// (should be doing this only if images are NOT loaded)
		// lockBody();

		// it does exist! continue on...
		var elIsoLoader   = document.getElementById('iso_loader'),
			strCurrentCat = elNavCat.getAttribute('data-current');

		// layout Isotope after all images have loaded
		imagesLoaded(elIsoContainer, function(instance) {

			objISO = new Isotope(elIsoContainer, {

				itemSelector: '.iso_brick',
				percentPosition: true,
				masonry: {
					columnWidth: '.iso_sizer',
					gutter: '.iso_gutter'
				},
				filter: strCurrentCat

			});

			// initalize and pass objISO to categoryDropdown once ready
			categoryDropdown(objISO);

			// IE9 does not support animations...
			if ( !classie.has(elHTML, 'ie9') ) {

				// listen for CSS transitionEnd before removing the element
				elIsoLoader.addEventListener(transitionEvent, removeLoader);

				// hide loader
				classie.remove(elIsoLoader, 'visible');

			}

		});

		function removeLoader(e) {

			// only listen for the opacity property
			if (e.propertyName == 'opacity') {

				// unlockBody();

				elIsoContainer.removeChild(elIsoLoader);
				elIsoLoader.removeEventListener(transitionEvent, removeLoader);

			}

		}

	}
*/


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


	// fixedNav: Position Fix the nav once scrolled
	// ----------------------------------------------------------------------------
	function fixedHeader() {

		// exit function if we are below 1200px wide
		if (numWinWidth < 1200) {
			return;
		}

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


	// parallaxHeader: Update X and Y positions on scroll
	// ----------------------------------------------------------------------------
	function parallaxHeader() {

		if (numWinWidth >= 1200) {

			// true by default: set this to false so that we can revert the background pos in case of decreased window width
			boolHeaderStop = false;

			// no point in updating the background pos if its off screen
			if (numScrollPos < numHeaderHeight) {

				// calculate X and Y positions... X needs to be more subtle than Y
				numHeaderPosX = numScrollPos / 100 + 50;
				numHeaderPosY = numScrollPos / 30 + 50;

				// apply new positions to first background, leave 2nd background centered
				elHeader.style.backgroundPosition = numHeaderPosX + '% ' + numHeaderPosY + '%, 50% 50%';

			}

		} else {

			// exit the function on scroll because we dont want it executing below 1200px...
			// but we do need to reset the bg position first
			if (boolHeaderStop) {
				return;
			}

			// reset background position
			elHeader.style.backgroundPosition = '50% 50%, 50% 50%';

			// set back to true so background pos isn't continuosly updated
			boolHeaderStop = true;

		}

	}


	// initSmoothScrollJS: Initialize smoothScroll plugin
	// ----------------------------------------------------------------------------
	function initSmoothScrollJS() {

		// exit function if smoothScroll has already been initialized
		if (boolEnabledSS) {
			return;
		}

		// nav is only fixed above 1200px, so no point in initializing smoothScroll if less than that width
		if (numWinWidth >= 1200) {

			smoothScroll.init({
				speed: 900,
				easing: 'easeInOutQuint',
				updateURL: false
			});

			// set to true so this doesn't get reinitialized on window resize
			boolEnabledSS = true;

		}

	}


	// Window Events
	// ----------------------------------------------------------------------------
	window.addEventListener('resize', function(e) {

		// do not fire resize event for every pixel... wait until finished
		waitForFinalEvent(function() {

			// re-measure window width on resize
			numWinWidth = window.innerWidth;

			fixedHeader();
			parallaxHeader();
			initSmoothScrollJS();

		}, 500, 'unique string');

	}, false);

	window.addEventListener('scroll', function(e) {

		// re-measure the window scroll distance
		numScrollPos = window.pageYOffset;

		fixedHeader();
		parallaxHeader();

	});


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	onPageLoad();


}, false);