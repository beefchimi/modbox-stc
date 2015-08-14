document.addEventListener('DOMContentLoaded', function() {


	// there is a serious problem with most of the code:
	// we need to wait for packery images to load before initializing packery...
	// but then we need to be able to wait until packery has compelted layout before calculating height of blog section...
	// this cannot be done in time and I have no good solution to occupying the user until this has finished.
	// so, there is currently no on completion event for packery and scroll events are inacurate


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
		elPost       = document.getElementById('sec_post'),
		objPkry;

	// page booleans
	var boolHomePage = classie.has(elBody, 'home') ? true : false,
		boolBlogPage = classie.has(elBody, 'blog') ? true : false,
		boolPostPage = classie.has(elBody, 'single') ? true : false;

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
		numPostHeight,
		numBeginSales,
		numBeginBlog,
		numBeginContact,
		numStartStripes,
		numAdjustedSalesScroll;


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
			$elForm        = $('#mc-embedded-subscribe-form'),
			strFormAction  = $elForm.attr('action'),
			elFormParent   = document.getElementById('wrap_shake'),
			$elInputEmail  = $('#mce-EMAIL'),
			$elResponse    = $('#mce-response-text'),
			isValid        = true,
			strInputValue;

		$elForm.submit(function(e) {

			e.preventDefault();

			strInputValue = $elInputEmail.val();

			validateEmail();

			// if text has been entered and the email filter validates...
			if (strInputValue.length > 0 && isValid) {

				// we may have added an error class, so let's go ahead and remove it
				// classie.remove(elForm, 'submit_error');
				$elForm.removeClass('submit_error');

				$.ajax({

					type: 'GET',
					url: strFormAction,
					data: $(this).serialize(),
					dataType: 'json',
					contentType: 'application/json; charset=utf-8',
					error: function(jqXHR, textStatus, errorThrown) {

						$elResponse.html(data.msg);
						$elForm.addClass('form_response');

					},
					success: function(data) {

						$elResponse.html(data.msg);
						$elForm.addClass('form_response');
						// $(this)[0].reset();

					}

				});

			} else {

				// classie.add(elForm, 'submit_error');
				$elForm.addClass('submit_error');

				if ( !classie.has(elHTML, 'ie9') ) {
					classie.add(elFormParent, 'animate_shake');
					elFormParent.addEventListener(animationEvent, removeShake);
				}

			}

		});

		function validateEmail() {

			// email input validation
			if (rgxEmailFilter.test(strInputValue) == false) {

				// classie.addClass(elForm, 'submit_error');
				$elForm.addClass('submit_error');
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

		if (boolHomePage) {

			numIntroHeight  = elIntro.offsetHeight;
			numSalesHeight  = elSales.offsetHeight;
			numBlogHeight   = elBlog.offsetHeight;
			numBeginSales   = numHeaderHeight + numIntroHeight;
			numBeginBlog    = numBeginSales + numSalesHeight - numSectionOffset;
			numBeginContact = numBeginBlog + numBlogHeight - numSectionOffset;

		} else if (boolBlogPage) {

			numBeginSales = numHeaderHeight;

		} else if (boolPostPage) {

			numPostHeight = elPost.offsetHeight;
			numBeginSales = numHeaderHeight + numPostHeight;

		} else {

			numBeginSales = 0;

		}

		numStartStripes = numBeginSales / 2;

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
				numAngelsPosX = numScrollPos / 220 - 50;
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

		// really, what needs to happen is certain functions are executed only after Packery has completed layout for blog section
		// then, we can always include the blog height in our math

		// if we have scrolled past our point of calculating the stripes transform:
		// start subtracting the start point from the scroll position:
		// otherwise, leave the value at 0 so our X and Y positions will remain at -50%
		numAdjustedSalesScroll = (numScrollPos > numStartStripes) ? (numScrollPos - numStartStripes) : 0;

		// calculate X and Y positions... X needs to be more subtle than Y
		numStripesPosX = numAdjustedSalesScroll / 120 - 50;
		numStripesPosY = numAdjustedSalesScroll / 100 - 50;

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

		// console.log('begin resize');

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

			if (objPkry) {
				objPkry.layout();
			}

			// console.log('end resize');

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