document.addEventListener('DOMContentLoaded', function() {


	// Global Variables
	// ----------------------------------------------------------------------------
	var elHTML       = document.documentElement,
		elBody       = document.body,
		elHeader     = document.getElementsByTagName('header')[0],
		elBgAngels   = document.getElementById('bg_angels'),
		elNavPrimary = document.getElementById('nav_primary'),
		elIntro      = document.getElementById('sec_intro'),
		elSales      = document.getElementById('sec_sales'),
		elBgStripes  = document.getElementById('bg_stripes'),
		elBlog       = document.getElementById('sec_blog'),
		objPkry;

	// page booleans
	var boolHomePage = classie.has(elBody, 'home') ? true : false;

	// window measurement variables
	var numScrollPos = window.pageYOffset,
		numWinWidth  = window.innerWidth;

	// parallax header & stripes / fixed nav / smoothScroll
	var boolEnabledSS  = false, // assumes below 1200px by default - smoothScroll is not initialized
		numAngelsPosX  = 50,    // default X % position
		numAngelsPosY  = 50,    // default Y % position
		numStripesPosX = 50,    // default X % position
		numStripesPosY = 50,    // default Y % position
		numStripeWidth = 62,    // width of gradient stripe
		numNavTopPos   = boolHomePage ? 910 : 36; // top position of nav as defined in CSS (should instead be retrieved from computed value instead)

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


	// onPageLoad: Main Function To Fire on Window Load
	// ----------------------------------------------------------------------------
	function onPageLoad() {

		pageAnimate();
		secretMail();
		initPkry();
		toggleModal();
		mailchimpAJAX();

		if (numWinWidth >= 1200) {

			measureSectionHeight();
			fixedHeader();
			navTrackSection();
			parallaxAngels();
			parallaxStripes();
			initSmoothScrollJS();

		}

	}


	// pageAnimate: Remove our page loader once the animation has finished
	// ----------------------------------------------------------------------------
	function pageAnimate() {

		var elPageLoader = document.getElementById('page_loader');

		elPageLoader.addEventListener(animationEvent, removePageLoader);

		function removePageLoader(e) {

			// listening for property name 'opacity' doesn't seem to work here...

			elPageLoader.removeEventListener(animationEvent, removePageLoader);
			elBody.removeChild(elPageLoader);

			// inform the document we are now ready
			elHTML.setAttribute('data-ready', 'ready');

		}

	}


	// secretMail: Add mailto link to home section
	// ----------------------------------------------------------------------------
	function secretMail() {

		var mailLink = document.getElementById('secret_email'),
			prefix    = 'mailto',
			local    = 'hello',
			domain   = 'modbox',
			suffix    = 'com';

		mailLink.setAttribute('href', prefix + ':' + local + '@' + domain + '.' + suffix);

	}


	// initPkry: Initialize Packery.js + imagesLoaded
	// ----------------------------------------------------------------------------
	function initPkry() {

		var elPkryContainer = document.getElementById('pkry_container'),
			elPkryLoader    = document.getElementById('pkry_loader');

		// check if pkry_container exists
		if (elPkryContainer == null) {
			return;
		}

		// layout Packery after all images have loaded
		imagesLoaded(elPkryContainer, function(instance) {

			objPkry = new Packery(elPkryContainer, {

				itemSelector: 'a.pkry_brick',
				columnWidth: 'a.pkry_brick',
				gutter: 'div.pkry_gutter'

			});

			elPkryContainer.setAttribute('data-images', 'loaded');

			// IE9 does not support animations...
			if ( !classie.has(elHTML, 'ie9') ) {

				// listen for CSS transitionEnd before removing the element
				elPkryLoader.addEventListener(transitionEvent, removeLoader);

			}

		});

		// objPkry.bindResize();

		function removeLoader(e) {

			// only listen for the opacity property
			if (e.propertyName == 'opacity') {

				elPkryLoader.removeEventListener(transitionEvent, removeLoader);
				elPkryContainer.removeChild(elPkryLoader);

			}

		}

	}


	// toggleModal: Open and Close modal popups
	// ----------------------------------------------------------------------------
	function toggleModal() {

		var arrModalOpen  = document.getElementsByClassName('modal_open'),
			arrModalClose = document.getElementsByClassName('modal_close'),
			elTargetModal;

		// check if arrModalOpen is empty...
		// assume close links will only be present if there are open links
		if (arrModalOpen.length <= 0) {
			return; // array empty... exit function
		}

		for (var i = 0; i < arrModalOpen.length; i++) {
			arrModalOpen[i].addEventListener('click', openModal, false);
		}

		for (var i = 0; i < arrModalClose.length; i++) {
			arrModalClose[i].addEventListener('click', closeModal, false);
		}

		function openModal(e) {

			e.preventDefault();

			var dataTargetModal = this.getAttribute('href').substring(1); // capture the href of the clicked element, remove the # prefix

			elTargetModal = document.getElementById(dataTargetModal); // get the modal we need to open

			// fade in modal
			elTargetModal.setAttribute('data-modal', 'active');

			document.addEventListener('click', documentClick);

		}

		function closeModal(e) {

			e.preventDefault();

			var dataTargetModal = this.getAttribute('href').substring(1); // capture the href of the clicked element, remove the # prefix

			elTargetModal = document.getElementById(dataTargetModal); // get the modal we need to open

			// once we have found the desired parent element, hide that modal
			elTargetModal.setAttribute('data-modal', 'inactive');

			document.removeEventListener('click', documentClick);

		}

		function documentClick(e) {

			// if this is not the currently toggled dropdown
			if (e.target === elTargetModal) {

				// ignore this event if preventDefault has been called
				if (e.defaultPrevented) {
					return;
				}

				// once we have found the desired parent element, hide that modal (copied from closeModal)
				elTargetModal.setAttribute('data-modal', 'inactive');

			}

		}

	}


	// mailchimpAJAX: Submit newsletter signup with AJAX
	// ----------------------------------------------------------------------------
	function mailchimpAJAX() {

		var rgxEmailFilter = /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i,
			elForm         = document.getElementById('mc-embedded-subscribe-form'),
			strFormAction  = elForm.getAttribute('action'),
			elFormParent   = elForm.parentNode,
			elInputEmail   = document.getElementById('mce-EMAIL'),
			elResponse     = document.getElementById('mce-response-text'),
			isValid        = true,
			strInputValue;

		elForm.addEventListener('submit', function(e) {

			e.preventDefault();

			strInputValue = elInputEmail.value;

			validateEmail();

			// if text has been entered and the email filter validates...
			if (strInputValue.length > 0 && isValid) {

				// we may have added an error class, so let's go ahead and remove it
				classie.remove(elForm, 'submit_error');

				var request = new XMLHttpRequest();

				request.onreadystatechange = function() {

					if (this.readyState == 4) {

						var mailchimpResponse = JSON.parse(this.response);

						if (mailchimpResponse.result === 'success') {

							console.log('SUCCESS!');
							// update response innerHTML
							// reset form

						} else {

							console.log('There appears to have been an error.');
							// update response innerHTML

						}

					}

				}

				request.open('POST', strFormAction, true);
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				request.send('EMAIL=' + strInputValue);

			} else {

				classie.add(elForm, 'submit_error');

				if ( !classie.has(elHTML, 'ie9') ) {
					classie.add(elFormParent, 'animate_shake');
					elFormParent.addEventListener(animationEvent, removeShake);
				}

			}

		});

		function validateEmail() {

			// email input validation
			if (rgxEmailFilter.test(strInputValue) == false) {
				classie.addClass(elForm, 'submit_error');
				isValid = false;
			} else {
				isValid = true;
			}

		}

		function removeShake() {

			classie.remove(elFormParent, 'animate_shake');
			elFormParent.removeEventListener(animationEvent, removeShake);

		}

	}


	// measureSectionHeight: Get the height of each required section
	// ----------------------------------------------------------------------------
	function measureSectionHeight() {

		// measure section heights
		numBodyHeight   = elBody.clientHeight;
		numHeaderHeight = elHeader.offsetHeight;

		// the rest of the sections only matter if on the home page
		if (boolHomePage) {
			numIntroHeight  = elIntro.offsetHeight;
			numSalesHeight  = elSales.offsetHeight;
			numBlogHeight   = elBlog.offsetHeight;
			numBeginBlog    = numHeaderHeight + numIntroHeight + numSalesHeight - numSectionOffset;
			numBeginContact = numBeginBlog + numBlogHeight - numSectionOffset;
			numSalesStart   = numBodyHeight - numStripeWidth * 2;
			numSalesMiddle  = numBodyHeight - numStripeWidth;
		}

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

		if (boolHomePage) {

			// if we have scrolled to or past the full height of the <header>
			if (numScrollPos >= numHeaderHeight) {
				classie.add(elHeader, 'nav_fixed-full');
			} else {
				classie.remove(elHeader, 'nav_fixed-full');
			}

		}

	}


	// navTrackSection: Track 'current' section (scroll distance < distance from top of doc)
	// ----------------------------------------------------------------------------
	function navTrackSection() {

		// exit if not the home page
		if (!boolHomePage) {
			return;
		}

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


	// parallaxAngels: Update home header background on scroll
	// ----------------------------------------------------------------------------
	function parallaxAngels() {

		// if on the home page
		if (boolHomePage) {

			// no point in updating the <header> background pos if its off screen
			if (numScrollPos < numHeaderHeight) {

				// calculate X and Y positions... X needs to be more subtle than Y
				numAngelsPosX = numScrollPos / 260 - 50;
				numAngelsPosY = numScrollPos / 80 - 50;

				// safari sucks and still doesn't support unprefixed transforms... so we need to use setProperty()
				elBgAngels.style.setProperty('-webkit-transform', 'translate3d(' + numAngelsPosX + '%, ' + numAngelsPosY + '%, 0px)');
				elBgAngels.style.setProperty('transform', 'translate3d(' + numAngelsPosX + '%, ' + numAngelsPosY + '%, 0px)');
				// elBgAngels.style.transform = 'translate3d(' + numAngelsPosX + '%, ' + numAngelsPosY + '%, 0px)';

			}

		}

	}


	// parallaxStripes: Update stripes background on scroll
	// ----------------------------------------------------------------------------
	function parallaxStripes() {

		// calculate X and Y positions... X needs to be more subtle than Y
		numStripesPosX = numScrollPos / 120 - 50;
		numStripesPosY = numScrollPos / 100 - 50;

		// safari sucks and still doesn't support unprefixed transforms... so we need to use setProperty()
		elBgStripes.style.setProperty('-webkit-transform', 'translate3d(' + numStripesPosX + '%, ' + numStripesPosY + '%, 0px)');
		elBgStripes.style.setProperty('transform', 'translate3d(' + numStripesPosX + '%, ' + numStripesPosY + '%, 0px)');
		// elBgStripes.style.transform = 'translate3d(' + numStripesPosX + '%, ' + numStripesPosY + '%, 0px)';

	}


	// parallaxRemove: Remove style attribute from designated parallax elements
	// ----------------------------------------------------------------------------
	function parallaxRemove() {

		// should we be using a boolean to determine whether or not to run this function?

		if (elBgAngels) {
			elBgAngels.removeAttribute('style');
		}

		if (elBgStripes) {
			elBgStripes.removeAttribute('style');
		}

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
				parallaxAngels();
				parallaxStripes();
				initSmoothScrollJS();

			} else {

				parallaxRemove();

			}

			// re-layout packery items on resize... only way to be sure it doesn't crap the bed
			objPkry.layout();

		}, 500, 'unique string');

	}, false);

	window.addEventListener('scroll', function(e) {

		// re-measure the window scroll distance
		numScrollPos = window.pageYOffset;

		if (numWinWidth >= 1200) {
			fixedHeader();
			navTrackSection();
			parallaxAngels();
			parallaxStripes();
		}

	});


	// Initialize Primary Functions
	// ----------------------------------------------------------------------------
	onPageLoad();


}, false);