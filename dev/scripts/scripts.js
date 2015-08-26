document.addEventListener('DOMContentLoaded', function() {


	// Global Variables
	// ----------------------------------------------------------------------------
	var elHTML          = document.documentElement,
		elBody          = document.body,
		elHeader        = document.getElementsByTagName('header')[0],
		elBgAngels      = document.getElementById('bg_angels'),
		elNavPrimary    = document.getElementById('nav_primary'),
		elIntro         = document.getElementById('sec_intro'),
		elSales         = document.getElementById('sec_sales'),
		elBgStripes     = document.getElementById('bg_stripes'),
		elBlog          = document.getElementById('sec_blog'),
		elPost          = document.getElementById('sec_post'),
		el404           = document.getElementById('sec_404'),
		elPageLoader    = document.getElementById('page_loader'),
		elPkryContainer = document.getElementById('pkry_container'),
		objPkry;

	// page booleans
	var boolHomePage = classie.has(elBody, 'home') ? true : false,
		boolBlogPage = classie.has(elBody, 'blog') ? true : false,
		boolPostPage = classie.has(elBody, 'single') ? true : false;

	// window measurement variables
	var numScrollPos      = window.pageYOffset,
		numWinWidth       = window.innerWidth,
		numClientWidth    = document.documentElement.clientWidth,
		numScrollbarWidth = numWinWidth - numClientWidth,
		hasScrollbar      = numScrollbarWidth > 0 ? true : false;

	// parallax header & stripes / fixed nav / smoothScroll
	var boolEnabledSS  = false, // assumes below 1200px by default - smoothScroll is not initialized
		numAngelsPosX  = 50,    // default X % position
		numAngelsPosY  = 50,    // default Y % position
		numStripesPosX = 50,    // default X % position
		numStripesPosY = 50,    // default Y % position
		numStripeWidth = 62,    // width of gradient stripe
		numNavTopPos   = boolHomePage ? 910 : 36; // top position of nav as defined in CSS (should instead be retrieved from computed value instead)

	// declare section heights (only required for 1200px and up... remeasured in window resize event)
	var numSectionOffset = 120,
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

	// home page smoothscrolll variables
	if (boolHomePage) {

		var elIntroLink   = document.getElementById('link_intro').getElementsByTagName('a')[0],
			elBlogLink    = document.getElementById('link_blog').getElementsByTagName('a')[0],
			elContactLink = document.getElementById('link_contact').getElementsByTagName('a')[0],
			strIntroOffset,
			strBlogOffset,
			strContactOffset;

	}


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


	// onPageLoad: Main Function To Fire on Window Load
	// ----------------------------------------------------------------------------
	function onPageLoad() {

		// add 'has_scrollbar' class to document for styling
		if (hasScrollbar) {
			classie.add(elHTML, 'has_scrollbar');
		}

		// load page at top of document...
		window.scroll(0, 0);

/*
		// chrome remembers your scroll position on reload, so using pushState helps return us to the top of the page every time...
		// problem is, we then have to hit 'Back' twice... so, not worth it
		if (history.pushState) {
			history.pushState(null, null, '');
			window.scroll(0, 0);
		}
*/

		// functions not dependant on document measurements
		pageAnimate();
		secretMail();
		toggleModal();
		mailchimpAJAX();

		// after all images on the page have been loaded:
		// unlock scrolling, layout Packery, measure all section heights
		imagesLoaded(elBody, function(instance) {

			elHTML.setAttribute('data-ready', 'ready');
			unlockBody();

			// determine whether or not to wait until packery layoutComplete to fire our primary functions
			if (elPkryContainer == null) {
				initPrimaryFunctions();
			} else {
				initPkry();
			}

		});

	}


	// initPrimaryFunctions: Initialize our primary functions
	// ----------------------------------------------------------------------------
	function initPrimaryFunctions() {

		if (numWinWidth >= 768) {
			initSmoothScrollJS();
		}

		if (numWinWidth >= 1200) {
			measureSectionHeight();
			fixedHeader();
			navTrackSection();
			parallaxAngels();
			parallaxStripes();
		}

	}


	// initPkry: Initialize Packery.js
	// ----------------------------------------------------------------------------
	function initPkry() {

		objPkry = new Packery(elPkryContainer, {

			itemSelector: 'a.pkry_brick',
			columnWidth: 'a.pkry_brick',
			gutter: 'div.pkry_gutter'

		});

		objPkry.once('layoutComplete', function() {
			initPrimaryFunctions();
		});

		objPkry.layout(); // required in ordered for layoutComplete to be fired

	}


	// pageAnimate: Remove our page loader once the animation has finished
	// ----------------------------------------------------------------------------
	function pageAnimate() {

		var elPageLoader = document.getElementById('page_loader');

		elPageLoader.addEventListener(animationEvent, removePageLoader);

		function removePageLoader(e) {

			// transition / animation events bubble, and we have a child element that animates as well...
			// so we need to make sure that we are looking at the correct element
			if (e.target === elPageLoader) {

				elPageLoader.removeEventListener(animationEvent, removePageLoader);
				elBody.removeChild(elPageLoader);

				// inform the document we have removed the loader
				elHTML.setAttribute('data-loader', 'removed');

			}

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

						// $elResponse.html(data.msg);

						if (elHTML.getAttribute('lang') == 'en-US') {
							$elResponse.html('Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.');
						} else {
							$elResponse.html('Vous avez presque termin&eacute;... Nous devons confirmer votre adresse courriel. Pour terminer le processus d’inscription, veuillez cliquer sur le lien dans le courriel que nous venons de vous envoyer.');
						}

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
		numBlogHeight   = elBlog.offsetHeight;

		if (boolHomePage) {

			numIntroHeight  = elIntro.offsetHeight;
			numSalesHeight  = elSales.offsetHeight;
			numBeginSales   = numHeaderHeight + numIntroHeight;
			numBeginBlog    = numBeginSales + numSalesHeight - numSectionOffset;
			numBeginContact = numBeginBlog + numBlogHeight - numSectionOffset;

		} else if (boolBlogPage) {

			numBeginSales = numHeaderHeight + numBlogHeight;

		} else {

			numPostHeight = (boolPostPage) ? elPost.offsetHeight : el404.offsetHeight;
			numBeginSales = numHeaderHeight + numPostHeight + numBlogHeight;

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

		// now only being used on home page
		if (!boolHomePage) {
			return;
		}

		adjustSmoothscrollOffset();

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


	// adjustSmoothscrollOffset: Adjust the offsets for each home page nav link
	// ----------------------------------------------------------------------------
	function adjustSmoothscrollOffset() {

		if (numWinWidth >= 1200) {
			strIntroOffset   = '{"offset":-2}';
			strBlogOffset    = '{"offset":65}';
			strContactOffset = '{"offset":65}';
		} else {
			strIntroOffset   = '{"offset":0}';
			strBlogOffset    = '{"offset":0}';
			strContactOffset = '{"offset":0}';
		}

		elIntroLink.setAttribute('data-options', strIntroOffset);
		elBlogLink.setAttribute('data-options', strBlogOffset);
		elContactLink.setAttribute('data-options', strContactOffset);

	}


	// Window Events
	// ----------------------------------------------------------------------------
	window.addEventListener('resize', function(e) {

		// console.log('begin resize');

		// do not fire resize event for every pixel... wait until finished
		waitForFinalEvent(function() {

			// re-measure window width on resize
			numWinWidth = window.innerWidth;

			if (numWinWidth >= 768) {
				initSmoothScrollJS();
			}

			if (numWinWidth >= 1200) {
				measureSectionHeight();
				fixedHeader();
				navTrackSection();
				parallaxAngels();
				parallaxStripes();
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


	// Initialize Page Load Functions
	// ----------------------------------------------------------------------------
	onPageLoad();


}, false);