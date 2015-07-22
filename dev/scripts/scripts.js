document.addEventListener('DOMContentLoaded', function() {


	// Global Variables
	// ----------------------------------------------------------------------------
	var elHTML       = document.documentElement,
		elBody       = document.body,
		elHeader     = document.getElementsByTagName('header')[0];

	// window measurement variables
	var numScrollPos      = window.pageYOffset,
		numWinWidth       = window.innerWidth,
		numClientWidth    = document.documentElement.clientWidth,
		numScrollbarWidth = numWinWidth - numClientWidth,
		hasScrollbar      = numScrollbarWidth > 0 ? true : false;


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

		navToggle();

	}


	// navToggle: Toggle Mobile Navigation
	// ----------------------------------------------------------------------------
	function navToggle() {

		var elNavTrigger = document.getElementById('nav_toggle');

		elNavTrigger.addEventListener('click', function(e) {

			e.preventDefault();

			// since we are removing the 'toggled' class if window is < 768...
			// we cannot rely on classie.toggle to switch our nav class
			if ( classie.has(elHeader, 'nav_toggled') ) {

				classie.remove(elHeader, 'nav_toggled');
				unlockBody();

			} else {

				window.scrollTo(0,0);

				classie.add(elHeader, 'nav_toggled');
				lockBody();

			}

		});

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


/*
	// fixedHeader: Decrease Primary Nav Padding Top On Scroll
	// ----------------------------------------------------------------------------
	function fixedHeader() {

		var numNavTravel = 60; // arbitrary number based on what feels good

		if (numWinWidth >= 768) {

			if (numScrollPos >= numNavTravel) {
				classie.add(elNavPrimary, 'scrolled');
			} else {
				classie.remove(elNavPrimary, 'scrolled');
			}

		}

	}
*/

	// Window Events
	// ----------------------------------------------------------------------------
	window.addEventListener('resize', function(e) {

		// do not fire resize event for every pixel... wait until finished
		waitForFinalEvent(function() {

			// re-measure window width on resize
			numWinWidth = window.innerWidth;

			if (numWinWidth >= 768) {

				// remove 'nav_toggled' class from elHeader and restore body scrolling
				classie.remove(elHeader, 'nav_toggled');
				unlockBody();

			}

		}, 500, 'unique string');

	}, false);

	window.addEventListener('scroll', function(e) {

		// re-measure the window scroll distance
		numScrollPos = window.pageYOffset;

		// functions that require scroll data
		// fixedHeader();

	});


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	onPageLoad();


}, false);