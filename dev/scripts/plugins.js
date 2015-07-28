// Helper: Animation / Transition Event Listener
// --------------------------------------------------------------------------------------------------------------------------------------------------------
function whichAnimationEvent() {

	var anim,
		element    = document.createElement('fakeelement'),
		animations = {
			'animation'       : 'animationend',
			'OAnimation'      : 'oAnimationEnd',
			'MozAnimation'    : 'animationend',
			'WebkitAnimation' : 'webkitAnimationEnd'
		}

	for (anim in animations) {
		if (element.style[anim] !== undefined) {
			return animations[anim];
		}
	}

}

function whichTransitionEvent() {

	var trans,
		element     = document.createElement('fakeelement'),
		transitions = {
			'transition'       : 'transitionend',
			'OTransition'      : 'oTransitionEnd',
			'MozTransition'    : 'transitionend',
			'WebkitTransition' : 'webkitTransitionEnd'
		}

	for (trans in transitions) {
		if (element.style[trans] !== undefined) {
			return transitions[trans];
		}
	}

}

var animationEvent  = whichAnimationEvent(),
	transitionEvent = whichTransitionEvent();


// Helper: Fire Window Resize Event Upon Finish
// --------------------------------------------------------------------------------------------------------------------------------------------------------
var waitForFinalEvent = (function() {

	var timers = {};

	return function(callback, ms, uniqueId) {

		if (!uniqueId) {
			uniqueId = 'beefchimi'; // Don't call this twice without a uniqueId
		}

		if (timers[uniqueId]) {
			clearTimeout(timers[uniqueId]);
		}

		timers[uniqueId] = setTimeout(callback, ms);

	};

})();


// Helper: CSS Fade In / Out
// --------------------------------------------------------------------------------------------------------------------------------------------------------
function fadeIn(thisElement) {

	// make the element fully transparent
	// (don't rely on a predefined CSS style... declare this with JS to getComputedStyle)
	thisElement.style.opacity = 0;

	// make sure the initial state is applied
	window.getComputedStyle(thisElement).opacity;

	// set opacity to 1 (CSS transition will handle the fade)
	thisElement.style.opacity = 1;

}

function fadeOut(thisElement) {

	// set opacity to 0 (CSS transition will handle the fade)
	thisElement.style.opacity = 0;

}


// Helper: Get a random number between a min and max range
// --------------------------------------------------------------------------------------------------------------------------------------------------------
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


// classie v1.0.1
// copyright David DeSandro | class helper functions | from bonzo https://github.com/ded/bonzo | MIT license
// --------------------------------------------------------------------------------------------------------------------------------------------------------
(function(window) {

	'use strict';

	function classReg( className ) {
		return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}

	// classList support for class management
	// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;

	if ( 'classList' in document.documentElement ) {

		hasClass = function( elem, c ) {
			return elem.classList.contains( c );
		};
		addClass = function( elem, c ) {
			elem.classList.add( c );
		};
		removeClass = function( elem, c ) {
			elem.classList.remove( c );
		};

	} else {

		hasClass = function( elem, c ) {
			return classReg( c ).test( elem.className );
		};
		addClass = function( elem, c ) {
			if ( !hasClass( elem, c ) ) {
				elem.className = elem.className + ' ' + c;
			}
		};
		removeClass = function( elem, c ) {
			elem.className = elem.className.replace( classReg( c ), ' ' );
		};
	}

	function toggleClass( elem, c ) {
		var fn = hasClass( elem, c ) ? removeClass : addClass;
		fn( elem, c );
	}

	var classie = {
		// full names
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		toggleClass: toggleClass,
		// short names
		has: hasClass,
		add: addClass,
		remove: removeClass,
		toggle: toggleClass
	};

	// transport
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( classie );
	} else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = classie;
	} else {
		// browser global
		window.classie = classie;
	}

})(window);


// Packery PACKAGED v1.4.2 [removed: bridget, classie]
// by David DeSandro | http://packery.metafizzy.co | Copyright 2015 Metafizzy | Licensed GPLv3 for open source use or Flickity Commercial License for commercial use
// --------------------------------------------------------------------------------------------------------------------------------------------------------

/*!
 * getStyleProperty v1.0.4
 * original by kangax
 * http://perfectionkills.com/feature-testing-css-properties/
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false, exports: false, module: false */

( function( window ) {

var prefixes = 'Webkit Moz ms Ms O'.split(' ');
var docElemStyle = document.documentElement.style;

function getStyleProperty( propName ) {
	if ( !propName ) {
		return;
	}

	// test standard property first
	if ( typeof docElemStyle[ propName ] === 'string' ) {
		return propName;
	}

	// capitalize
	propName = propName.charAt(0).toUpperCase() + propName.slice(1);

	// test vendor specific properties
	var prefixed;
	for ( var i=0, len = prefixes.length; i < len; i++ ) {
		prefixed = prefixes[i] + propName;
		if ( typeof docElemStyle[ prefixed ] === 'string' ) {
			return prefixed;
		}
	}
}

// transport
if ( typeof define === 'function' && define.amd ) {
	// AMD
	define( 'get-style-property/get-style-property',[],function() {
		return getStyleProperty;
	});
} else if ( typeof exports === 'object' ) {
	// CommonJS for Component
	module.exports = getStyleProperty;
} else {
	// browser global
	window.getStyleProperty = getStyleProperty;
}

})( window );

/*!
 * getSize v1.2.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, exports: false, require: false, module: false, console: false */

( function( window, undefined ) {



// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
	var num = parseFloat( value );
	// not a percent like '100%', and a number
	var isValid = value.indexOf('%') === -1 && !isNaN( num );
	return isValid && num;
}

function noop() {}

var logError = typeof console === 'undefined' ? noop :
	function( message ) {
		console.error( message );
	};

// -------------------------- measurements -------------------------- //

var measurements = [
	'paddingLeft',
	'paddingRight',
	'paddingTop',
	'paddingBottom',
	'marginLeft',
	'marginRight',
	'marginTop',
	'marginBottom',
	'borderLeftWidth',
	'borderRightWidth',
	'borderTopWidth',
	'borderBottomWidth'
];

function getZeroSize() {
	var size = {
		width: 0,
		height: 0,
		innerWidth: 0,
		innerHeight: 0,
		outerWidth: 0,
		outerHeight: 0
	};
	for ( var i=0, len = measurements.length; i < len; i++ ) {
		var measurement = measurements[i];
		size[ measurement ] = 0;
	}
	return size;
}



function defineGetSize( getStyleProperty ) {

// -------------------------- setup -------------------------- //

var isSetup = false;

var getStyle, boxSizingProp, isBoxSizeOuter;

/**
 * setup vars and functions
 * do it on initial getSize(), rather than on script load
 * For Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function setup() {
	// setup once
	if ( isSetup ) {
		return;
	}
	isSetup = true;

	var getComputedStyle = window.getComputedStyle;
	getStyle = ( function() {
		var getStyleFn = getComputedStyle ?
			function( elem ) {
				return getComputedStyle( elem, null );
			} :
			function( elem ) {
				return elem.currentStyle;
			};

			return function getStyle( elem ) {
				var style = getStyleFn( elem );
				if ( !style ) {
					logError( 'Style returned ' + style +
						'. Are you running this code in a hidden iframe on Firefox? ' +
						'See http://bit.ly/getsizebug1' );
				}
				return style;
			};
	})();

	// -------------------------- box sizing -------------------------- //

	boxSizingProp = getStyleProperty('boxSizing');

	/**
	 * WebKit measures the outer-width on style.width on border-box elems
	 * IE & Firefox measures the inner-width
	 */
	if ( boxSizingProp ) {
		var div = document.createElement('div');
		div.style.width = '200px';
		div.style.padding = '1px 2px 3px 4px';
		div.style.borderStyle = 'solid';
		div.style.borderWidth = '1px 2px 3px 4px';
		div.style[ boxSizingProp ] = 'border-box';

		var body = document.body || document.documentElement;
		body.appendChild( div );
		var style = getStyle( div );

		isBoxSizeOuter = getStyleSize( style.width ) === 200;
		body.removeChild( div );
	}

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
	setup();

	// use querySeletor if elem is string
	if ( typeof elem === 'string' ) {
		elem = document.querySelector( elem );
	}

	// do not proceed on non-objects
	if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
		return;
	}

	var style = getStyle( elem );

	// if hidden, everything is 0
	if ( style.display === 'none' ) {
		return getZeroSize();
	}

	var size = {};
	size.width = elem.offsetWidth;
	size.height = elem.offsetHeight;

	var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
		style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

	// get all measurements
	for ( var i=0, len = measurements.length; i < len; i++ ) {
		var measurement = measurements[i];
		var value = style[ measurement ];
		value = mungeNonPixel( elem, value );
		var num = parseFloat( value );
		// any 'auto', 'medium' value will be 0
		size[ measurement ] = !isNaN( num ) ? num : 0;
	}

	var paddingWidth = size.paddingLeft + size.paddingRight;
	var paddingHeight = size.paddingTop + size.paddingBottom;
	var marginWidth = size.marginLeft + size.marginRight;
	var marginHeight = size.marginTop + size.marginBottom;
	var borderWidth = size.borderLeftWidth + size.borderRightWidth;
	var borderHeight = size.borderTopWidth + size.borderBottomWidth;

	var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

	// overwrite width and height if we can get it from style
	var styleWidth = getStyleSize( style.width );
	if ( styleWidth !== false ) {
		size.width = styleWidth +
			// add padding and border unless it's already including it
			( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
	}

	var styleHeight = getStyleSize( style.height );
	if ( styleHeight !== false ) {
		size.height = styleHeight +
			// add padding and border unless it's already including it
			( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
	}

	size.innerWidth = size.width - ( paddingWidth + borderWidth );
	size.innerHeight = size.height - ( paddingHeight + borderHeight );

	size.outerWidth = size.width + marginWidth;
	size.outerHeight = size.height + marginHeight;

	return size;
}

// IE8 returns percent values, not pixels
// taken from jQuery's curCSS
function mungeNonPixel( elem, value ) {
	// IE8 and has percent value
	if ( window.getComputedStyle || value.indexOf('%') === -1 ) {
		return value;
	}
	var style = elem.style;
	// Remember the original values
	var left = style.left;
	var rs = elem.runtimeStyle;
	var rsLeft = rs && rs.left;

	// Put in the new values to get a computed value out
	if ( rsLeft ) {
		rs.left = elem.currentStyle.left;
	}
	style.left = value;
	value = style.pixelLeft;

	// Revert the changed values
	style.left = left;
	if ( rsLeft ) {
		rs.left = rsLeft;
	}

	return value;
}

return getSize;

}

// transport
if ( typeof define === 'function' && define.amd ) {
	// AMD for RequireJS
	define( 'get-size/get-size',[ 'get-style-property/get-style-property' ], defineGetSize );
} else if ( typeof exports === 'object' ) {
	// CommonJS for Component
	module.exports = defineGetSize( require('desandro-get-style-property') );
} else {
	// browser global
	window.getSize = defineGetSize( window.getStyleProperty );
}

})( window );

/*!
 * eventie v1.0.6
 * event binding helper
 *	 eventie.bind( elem, 'click', myFn )
 *	 eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
	var event = window.event;
	// add event.target
	event.target = event.target || event.srcElement || obj;
	return event;
}

if ( docElem.addEventListener ) {
	bind = function( obj, type, fn ) {
		obj.addEventListener( type, fn, false );
	};
} else if ( docElem.attachEvent ) {
	bind = function( obj, type, fn ) {
		obj[ type + fn ] = fn.handleEvent ?
			function() {
				var event = getIEEvent( obj );
				fn.handleEvent.call( fn, event );
			} :
			function() {
				var event = getIEEvent( obj );
				fn.call( obj, event );
			};
		obj.attachEvent( "on" + type, obj[ type + fn ] );
	};
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
	unbind = function( obj, type, fn ) {
		obj.removeEventListener( type, fn, false );
	};
} else if ( docElem.detachEvent ) {
	unbind = function( obj, type, fn ) {
		obj.detachEvent( "on" + type, obj[ type + fn ] );
		try {
			delete obj[ type + fn ];
		} catch ( err ) {
			// can't delete window object properties
			obj[ type + fn ] = undefined;
		}
	};
}

var eventie = {
	bind: bind,
	unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
	// AMD
	define( 'eventie/eventie',eventie );
} else if ( typeof exports === 'object' ) {
	// CommonJS
	module.exports = eventie;
} else {
	// browser global
	window.eventie = eventie;
}

})( window );

/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {


		/**
		 * Class for managing events.
		 * Can be extended to provide event functionality in other classes.
		 *
		 * @class EventEmitter Manages event registering and emitting.
		 */
		function EventEmitter() {}

		// Shortcuts to improve speed and size
		var proto = EventEmitter.prototype;
		var exports = this;
		var originalGlobalValue = exports.EventEmitter;

		/**
		 * Finds the index of the listener for the event in its storage array.
		 *
		 * @param {Function[]} listeners Array of listeners to search through.
		 * @param {Function} listener Method to look for.
		 * @return {Number} Index of the specified listener, -1 if not found
		 * @api private
		 */
		function indexOfListener(listeners, listener) {
				var i = listeners.length;
				while (i--) {
						if (listeners[i].listener === listener) {
								return i;
						}
				}

				return -1;
		}

		/**
		 * Alias a method while keeping the context correct, to allow for overwriting of target method.
		 *
		 * @param {String} name The name of the target method.
		 * @return {Function} The aliased method
		 * @api private
		 */
		function alias(name) {
				return function aliasClosure() {
						return this[name].apply(this, arguments);
				};
		}

		/**
		 * Returns the listener array for the specified event.
		 * Will initialise the event object and listener arrays if required.
		 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
		 * Each property in the object response is an array of listener functions.
		 *
		 * @param {String|RegExp} evt Name of the event to return the listeners from.
		 * @return {Function[]|Object} All listener functions for the event.
		 */
		proto.getListeners = function getListeners(evt) {
				var events = this._getEvents();
				var response;
				var key;

				// Return a concatenated array of all matching events if
				// the selector is a regular expression.
				if (evt instanceof RegExp) {
						response = {};
						for (key in events) {
								if (events.hasOwnProperty(key) && evt.test(key)) {
										response[key] = events[key];
								}
						}
				}
				else {
						response = events[evt] || (events[evt] = []);
				}

				return response;
		};

		/**
		 * Takes a list of listener objects and flattens it into a list of listener functions.
		 *
		 * @param {Object[]} listeners Raw listener objects.
		 * @return {Function[]} Just the listener functions.
		 */
		proto.flattenListeners = function flattenListeners(listeners) {
				var flatListeners = [];
				var i;

				for (i = 0; i < listeners.length; i += 1) {
						flatListeners.push(listeners[i].listener);
				}

				return flatListeners;
		};

		/**
		 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
		 *
		 * @param {String|RegExp} evt Name of the event to return the listeners from.
		 * @return {Object} All listener functions for an event in an object.
		 */
		proto.getListenersAsObject = function getListenersAsObject(evt) {
				var listeners = this.getListeners(evt);
				var response;

				if (listeners instanceof Array) {
						response = {};
						response[evt] = listeners;
				}

				return response || listeners;
		};

		/**
		 * Adds a listener function to the specified event.
		 * The listener will not be added if it is a duplicate.
		 * If the listener returns true then it will be removed after it is called.
		 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
		 *
		 * @param {String|RegExp} evt Name of the event to attach the listener to.
		 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.addListener = function addListener(evt, listener) {
				var listeners = this.getListenersAsObject(evt);
				var listenerIsWrapped = typeof listener === 'object';
				var key;

				for (key in listeners) {
						if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
								listeners[key].push(listenerIsWrapped ? listener : {
										listener: listener,
										once: false
								});
						}
				}

				return this;
		};

		/**
		 * Alias of addListener
		 */
		proto.on = alias('addListener');

		/**
		 * Semi-alias of addListener. It will add a listener that will be
		 * automatically removed after its first execution.
		 *
		 * @param {String|RegExp} evt Name of the event to attach the listener to.
		 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.addOnceListener = function addOnceListener(evt, listener) {
				return this.addListener(evt, {
						listener: listener,
						once: true
				});
		};

		/**
		 * Alias of addOnceListener.
		 */
		proto.once = alias('addOnceListener');

		/**
		 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
		 * You need to tell it what event names should be matched by a regex.
		 *
		 * @param {String} evt Name of the event to create.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.defineEvent = function defineEvent(evt) {
				this.getListeners(evt);
				return this;
		};

		/**
		 * Uses defineEvent to define multiple events.
		 *
		 * @param {String[]} evts An array of event names to define.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.defineEvents = function defineEvents(evts) {
				for (var i = 0; i < evts.length; i += 1) {
						this.defineEvent(evts[i]);
				}
				return this;
		};

		/**
		 * Removes a listener function from the specified event.
		 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
		 *
		 * @param {String|RegExp} evt Name of the event to remove the listener from.
		 * @param {Function} listener Method to remove from the event.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.removeListener = function removeListener(evt, listener) {
				var listeners = this.getListenersAsObject(evt);
				var index;
				var key;

				for (key in listeners) {
						if (listeners.hasOwnProperty(key)) {
								index = indexOfListener(listeners[key], listener);

								if (index !== -1) {
										listeners[key].splice(index, 1);
								}
						}
				}

				return this;
		};

		/**
		 * Alias of removeListener
		 */
		proto.off = alias('removeListener');

		/**
		 * Adds listeners in bulk using the manipulateListeners method.
		 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
		 * You can also pass it a regular expression to add the array of listeners to all events that match it.
		 * Yeah, this function does quite a bit. That's probably a bad thing.
		 *
		 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
		 * @param {Function[]} [listeners] An optional array of listener functions to add.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.addListeners = function addListeners(evt, listeners) {
				// Pass through to manipulateListeners
				return this.manipulateListeners(false, evt, listeners);
		};

		/**
		 * Removes listeners in bulk using the manipulateListeners method.
		 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
		 * You can also pass it an event name and an array of listeners to be removed.
		 * You can also pass it a regular expression to remove the listeners from all events that match it.
		 *
		 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
		 * @param {Function[]} [listeners] An optional array of listener functions to remove.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.removeListeners = function removeListeners(evt, listeners) {
				// Pass through to manipulateListeners
				return this.manipulateListeners(true, evt, listeners);
		};

		/**
		 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
		 * The first argument will determine if the listeners are removed (true) or added (false).
		 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
		 * You can also pass it an event name and an array of listeners to be added/removed.
		 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
		 *
		 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
		 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
		 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
				var i;
				var value;
				var single = remove ? this.removeListener : this.addListener;
				var multiple = remove ? this.removeListeners : this.addListeners;

				// If evt is an object then pass each of its properties to this method
				if (typeof evt === 'object' && !(evt instanceof RegExp)) {
						for (i in evt) {
								if (evt.hasOwnProperty(i) && (value = evt[i])) {
										// Pass the single listener straight through to the singular method
										if (typeof value === 'function') {
												single.call(this, i, value);
										}
										else {
												// Otherwise pass back to the multiple function
												multiple.call(this, i, value);
										}
								}
						}
				}
				else {
						// So evt must be a string
						// And listeners must be an array of listeners
						// Loop over it and pass each one to the multiple method
						i = listeners.length;
						while (i--) {
								single.call(this, evt, listeners[i]);
						}
				}

				return this;
		};

		/**
		 * Removes all listeners from a specified event.
		 * If you do not specify an event then all listeners will be removed.
		 * That means every event will be emptied.
		 * You can also pass a regex to remove all events that match it.
		 *
		 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.removeEvent = function removeEvent(evt) {
				var type = typeof evt;
				var events = this._getEvents();
				var key;

				// Remove different things depending on the state of evt
				if (type === 'string') {
						// Remove all listeners for the specified event
						delete events[evt];
				}
				else if (evt instanceof RegExp) {
						// Remove all events matching the regex.
						for (key in events) {
								if (events.hasOwnProperty(key) && evt.test(key)) {
										delete events[key];
								}
						}
				}
				else {
						// Remove all listeners in all events
						delete this._events;
				}

				return this;
		};

		/**
		 * Alias of removeEvent.
		 *
		 * Added to mirror the node API.
		 */
		proto.removeAllListeners = alias('removeEvent');

		/**
		 * Emits an event of your choice.
		 * When emitted, every listener attached to that event will be executed.
		 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
		 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
		 * So they will not arrive within the array on the other side, they will be separate.
		 * You can also pass a regular expression to emit to all events that match it.
		 *
		 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
		 * @param {Array} [args] Optional array of arguments to be passed to each listener.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.emitEvent = function emitEvent(evt, args) {
				var listeners = this.getListenersAsObject(evt);
				var listener;
				var i;
				var key;
				var response;

				for (key in listeners) {
						if (listeners.hasOwnProperty(key)) {
								i = listeners[key].length;

								while (i--) {
										// If the listener returns true then it shall be removed from the event
										// The function is executed either with a basic call or an apply if there is an args array
										listener = listeners[key][i];

										if (listener.once === true) {
												this.removeListener(evt, listener.listener);
										}

										response = listener.listener.apply(this, args || []);

										if (response === this._getOnceReturnValue()) {
												this.removeListener(evt, listener.listener);
										}
								}
						}
				}

				return this;
		};

		/**
		 * Alias of emitEvent
		 */
		proto.trigger = alias('emitEvent');

		/**
		 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
		 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
		 *
		 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
		 * @param {...*} Optional additional arguments to be passed to each listener.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.emit = function emit(evt) {
				var args = Array.prototype.slice.call(arguments, 1);
				return this.emitEvent(evt, args);
		};

		/**
		 * Sets the current value to check against when executing listeners. If a
		 * listeners return value matches the one set here then it will be removed
		 * after execution. This value defaults to true.
		 *
		 * @param {*} value The new value to check for when executing listeners.
		 * @return {Object} Current instance of EventEmitter for chaining.
		 */
		proto.setOnceReturnValue = function setOnceReturnValue(value) {
				this._onceReturnValue = value;
				return this;
		};

		/**
		 * Fetches the current value to check against when executing listeners. If
		 * the listeners return value matches this one then it should be removed
		 * automatically. It will return true by default.
		 *
		 * @return {*|Boolean} The current value to check for or the default, true.
		 * @api private
		 */
		proto._getOnceReturnValue = function _getOnceReturnValue() {
				if (this.hasOwnProperty('_onceReturnValue')) {
						return this._onceReturnValue;
				}
				else {
						return true;
				}
		};

		/**
		 * Fetches the events object and creates one if required.
		 *
		 * @return {Object} The events storage object.
		 * @api private
		 */
		proto._getEvents = function _getEvents() {
				return this._events || (this._events = {});
		};

		/**
		 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
		 *
		 * @return {Function} Non conflicting EventEmitter class.
		 */
		EventEmitter.noConflict = function noConflict() {
				exports.EventEmitter = originalGlobalValue;
				return EventEmitter;
		};

		// Expose the class either via AMD, CommonJS or the global object
		if (typeof define === 'function' && define.amd) {
				define('eventEmitter/EventEmitter',[],function () {
						return EventEmitter;
				});
		}
		else if (typeof module === 'object' && module.exports){
				module.exports = EventEmitter;
		}
		else {
				exports.EventEmitter = EventEmitter;
		}
}.call(this));

/*!
 * docReady v1.0.4
 * Cross browser DOMContentLoaded event emitter
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false, require: false, module: false */

( function( window ) {



var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
	// throw out non-functions
	if ( typeof fn !== 'function' ) {
		return;
	}

	if ( docReady.isReady ) {
		// ready now, hit it
		fn();
	} else {
		// queue function when ready
		queue.push( fn );
	}
}

docReady.isReady = false;

// triggered on various doc ready events
function onReady( event ) {
	// bail if already triggered or IE8 document is not ready just yet
	var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
	if ( docReady.isReady || isIE8NotReady ) {
		return;
	}

	trigger();
}

function trigger() {
	docReady.isReady = true;
	// process queue
	for ( var i=0, len = queue.length; i < len; i++ ) {
		var fn = queue[i];
		fn();
	}
}

function defineDocReady( eventie ) {
	// trigger ready if page is ready
	if ( document.readyState === 'complete' ) {
		trigger();
	} else {
		// listen for events
		eventie.bind( document, 'DOMContentLoaded', onReady );
		eventie.bind( document, 'readystatechange', onReady );
		eventie.bind( window, 'load', onReady );
	}

	return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
	// AMD
	define( 'doc-ready/doc-ready',[ 'eventie/eventie' ], defineDocReady );
} else if ( typeof exports === 'object' ) {
	module.exports = defineDocReady( require('eventie') );
} else {
	// browser global
	window.docReady = defineDocReady( window.eventie );
}

})( window );

/**
 * matchesSelector v1.0.3
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( ElemProto ) {



	var matchesMethod = ( function() {
		// check for the standard method name first
		if ( ElemProto.matches ) {
			return 'matches';
		}
		// check un-prefixed
		if ( ElemProto.matchesSelector ) {
			return 'matchesSelector';
		}
		// check vendor prefixes
		var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

		for ( var i=0, len = prefixes.length; i < len; i++ ) {
			var prefix = prefixes[i];
			var method = prefix + 'MatchesSelector';
			if ( ElemProto[ method ] ) {
				return method;
			}
		}
	})();

	// ----- match ----- //

	function match( elem, selector ) {
		return elem[ matchesMethod ]( selector );
	}

	// ----- appendToFragment ----- //

	function checkParent( elem ) {
		// not needed if already has parent
		if ( elem.parentNode ) {
			return;
		}
		var fragment = document.createDocumentFragment();
		fragment.appendChild( elem );
	}

	// ----- query ----- //

	// fall back to using QSA
	// thx @jonathantneal https://gist.github.com/3062955
	function query( elem, selector ) {
		// append to fragment if no parent
		checkParent( elem );

		// match elem with all selected elems of parent
		var elems = elem.parentNode.querySelectorAll( selector );
		for ( var i=0, len = elems.length; i < len; i++ ) {
			// return true if match
			if ( elems[i] === elem ) {
				return true;
			}
		}
		// otherwise return false
		return false;
	}

	// ----- matchChild ----- //

	function matchChild( elem, selector ) {
		checkParent( elem );
		return match( elem, selector );
	}

	// ----- matchesSelector ----- //

	var matchesSelector;

	if ( matchesMethod ) {
		// IE9 supports matchesSelector, but doesn't work on orphaned elems
		// check for that
		var div = document.createElement('div');
		var supportsOrphans = match( div, 'div' );
		matchesSelector = supportsOrphans ? match : matchChild;
	} else {
		matchesSelector = query;
	}

	// transport
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( 'matches-selector/matches-selector',[],function() {
			return matchesSelector;
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = matchesSelector;
	}
	else {
		// browser global
		window.matchesSelector = matchesSelector;
	}

})( Element.prototype );

/**
 * Fizzy UI utils v1.0.1
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
	/*global define: false, module: false, require: false */

	// universal module definition

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'fizzy-ui-utils/utils',[
			'doc-ready/doc-ready',
			'matches-selector/matches-selector'
		], function( docReady, matchesSelector ) {
			return factory( window, docReady, matchesSelector );
		});
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory(
			window,
			require('doc-ready'),
			require('desandro-matches-selector')
		);
	} else {
		// browser global
		window.fizzyUIUtils = factory(
			window,
			window.docReady,
			window.matchesSelector
		);
	}

}( window, function factory( window, docReady, matchesSelector ) {



var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
	for ( var prop in b ) {
		a[ prop ] = b[ prop ];
	}
	return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
	return ( ( num % div ) + div ) % div;
};

// ----- isArray ----- //

var objToString = Object.prototype.toString;
utils.isArray = function( obj ) {
	return objToString.call( obj ) == '[object Array]';
};

// ----- makeArray ----- //

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
	var ary = [];
	if ( utils.isArray( obj ) ) {
		// use object if already an array
		ary = obj;
	} else if ( obj && typeof obj.length == 'number' ) {
		// convert nodeList to array
		for ( var i=0, len = obj.length; i < len; i++ ) {
			ary.push( obj[i] );
		}
	} else {
		// array of single index
		ary.push( obj );
	}
	return ary;
};

// ----- indexOf ----- //

// index of helper cause IE8
utils.indexOf = Array.prototype.indexOf ? function( ary, obj ) {
		return ary.indexOf( obj );
	} : function( ary, obj ) {
		for ( var i=0, len = ary.length; i < len; i++ ) {
			if ( ary[i] === obj ) {
				return i;
			}
		}
		return -1;
	};

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
	var index = utils.indexOf( ary, obj );
	if ( index != -1 ) {
		ary.splice( index, 1 );
	}
};

// ----- isElement ----- //

// http://stackoverflow.com/a/384380/182183
utils.isElement = ( typeof HTMLElement == 'function' || typeof HTMLElement == 'object' ) ?
	function isElementDOM2( obj ) {
		return obj instanceof HTMLElement;
	} :
	function isElementQuirky( obj ) {
		return obj && typeof obj == 'object' &&
			obj.nodeType == 1 && typeof obj.nodeName == 'string';
	};

// ----- setText ----- //

utils.setText = ( function() {
	var setTextProperty;
	function setText( elem, text ) {
		// only check setTextProperty once
		setTextProperty = setTextProperty || ( document.documentElement.textContent !== undefined ? 'textContent' : 'innerText' );
		elem[ setTextProperty ] = text;
	}
	return setText;
})();

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
	while ( elem != document.body ) {
		elem = elem.parentNode;
		if ( matchesSelector( elem, selector ) ) {
			return elem;
		}
	}
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
	if ( typeof elem == 'string' ) {
		return document.querySelector( elem );
	}
	return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
	var method = 'on' + event.type;
	if ( this[ method ] ) {
		this[ method ]( event );
	}
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
	// make array of elems
	elems = utils.makeArray( elems );
	var ffElems = [];

	for ( var i=0, len = elems.length; i < len; i++ ) {
		var elem = elems[i];
		// check that elem is an actual element
		if ( !utils.isElement( elem ) ) {
			continue;
		}
		// filter & find items if we have a selector
		if ( selector ) {
			// filter siblings
			if ( matchesSelector( elem, selector ) ) {
				ffElems.push( elem );
			}
			// find children
			var childElems = elem.querySelectorAll( selector );
			// concat childElems to filterFound array
			for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
				ffElems.push( childElems[j] );
			}
		} else {
			ffElems.push( elem );
		}
	}

	return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
	// original method
	var method = _class.prototype[ methodName ];
	var timeoutName = methodName + 'Timeout';

	_class.prototype[ methodName ] = function() {
		var timeout = this[ timeoutName ];
		if ( timeout ) {
			clearTimeout( timeout );
		}
		var args = arguments;

		var _this = this;
		this[ timeoutName ] = setTimeout( function() {
			method.apply( _this, args );
			delete _this[ timeoutName ];
		}, threshold || 100 );
	};
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
	return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
		return $1 + '-' + $2;
	}).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-option attribute
 */
utils.htmlInit = function( WidgetClass, namespace ) {
	docReady( function() {
		var dashedNamespace = utils.toDashed( namespace );
		var elems = document.querySelectorAll( '.js-' + dashedNamespace );
		var dataAttr = 'data-' + dashedNamespace + '-options';

		for ( var i=0, len = elems.length; i < len; i++ ) {
			var elem = elems[i];
			var attr = elem.getAttribute( dataAttr );
			var options;
			try {
				options = attr && JSON.parse( attr );
			} catch ( error ) {
				// log error, do not initialize
				if ( console ) {
					console.error( 'Error parsing ' + dataAttr + ' on ' +
						elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
						error );
				}
				continue;
			}
			// initialize
			var instance = new WidgetClass( elem, options );
			// make available via $().data('layoutname')
			var jQuery = window.jQuery;
			if ( jQuery ) {
				jQuery.data( elem, namespace, instance );
			}
		}
	});
};

// -----	----- //

return utils;

}));

/**
 * Outlayer Item
 */

( function( window, factory ) {

	// universal module definition
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( 'outlayer/item',[
				'eventEmitter/EventEmitter',
				'get-size/get-size',
				'get-style-property/get-style-property',
				'fizzy-ui-utils/utils'
			],
			function( EventEmitter, getSize, getStyleProperty, utils ) {
				return factory( window, EventEmitter, getSize, getStyleProperty, utils );
			}
		);
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = factory(
			window,
			require('wolfy87-eventemitter'),
			require('get-size'),
			require('desandro-get-style-property'),
			require('fizzy-ui-utils')
		);
	} else {
		// browser global
		window.Outlayer = {};
		window.Outlayer.Item = factory(
			window,
			window.EventEmitter,
			window.getSize,
			window.getStyleProperty,
			window.fizzyUIUtils
		);
	}

}( window, function factory( window, EventEmitter, getSize, getStyleProperty, utils ) {


// ----- helpers ----- //

var getComputedStyle = window.getComputedStyle;
var getStyle = getComputedStyle ?
	function( elem ) {
		return getComputedStyle( elem, null );
	} :
	function( elem ) {
		return elem.currentStyle;
	};


function isEmptyObj( obj ) {
	for ( var prop in obj ) {
		return false;
	}
	prop = null;
	return true;
}

// -------------------------- CSS3 support -------------------------- //

var transitionProperty = getStyleProperty('transition');
var transformProperty = getStyleProperty('transform');
var supportsCSS3 = transitionProperty && transformProperty;
var is3d = !!getStyleProperty('perspective');

var transitionEndEvent = {
	WebkitTransition: 'webkitTransitionEnd',
	MozTransition: 'transitionend',
	OTransition: 'otransitionend',
	transition: 'transitionend'
}[ transitionProperty ];

// properties that could have vendor prefix
var prefixableProperties = [
	'transform',
	'transition',
	'transitionDuration',
	'transitionProperty'
];

// cache all vendor properties
var vendorProperties = ( function() {
	var cache = {};
	for ( var i=0, len = prefixableProperties.length; i < len; i++ ) {
		var prop = prefixableProperties[i];
		var supportedProp = getStyleProperty( prop );
		if ( supportedProp && supportedProp !== prop ) {
			cache[ prop ] = supportedProp;
		}
	}
	return cache;
})();

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
	if ( !element ) {
		return;
	}

	this.element = element;
	// parent layout class, i.e. Masonry, Isotope, or Packery
	this.layout = layout;
	this.position = {
		x: 0,
		y: 0
	};

	this._create();
}

// inherit EventEmitter
utils.extend( Item.prototype, EventEmitter.prototype );

Item.prototype._create = function() {
	// transition objects
	this._transn = {
		ingProperties: {},
		clean: {},
		onEnd: {}
	};

	this.css({
		position: 'absolute'
	});
};

// trigger specified handler for event type
Item.prototype.handleEvent = function( event ) {
	var method = 'on' + event.type;
	if ( this[ method ] ) {
		this[ method ]( event );
	}
};

Item.prototype.getSize = function() {
	this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
Item.prototype.css = function( style ) {
	var elemStyle = this.element.style;

	for ( var prop in style ) {
		// use vendor property if available
		var supportedProp = vendorProperties[ prop ] || prop;
		elemStyle[ supportedProp ] = style[ prop ];
	}
};

 // measure position, and sets it
Item.prototype.getPosition = function() {
	var style = getStyle( this.element );
	var layoutOptions = this.layout.options;
	var isOriginLeft = layoutOptions.isOriginLeft;
	var isOriginTop = layoutOptions.isOriginTop;
	var xValue = style[ isOriginLeft ? 'left' : 'right' ];
	var yValue = style[ isOriginTop ? 'top' : 'bottom' ];
	var x = parseInt( xValue, 10 );
	var y = parseInt( yValue, 10 );
	// convert percent to pixels
	var layoutSize = this.layout.size;
	x = xValue.indexOf('%') != -1 ? ( x / 100 ) * layoutSize.width : x;
	y = yValue.indexOf('%') != -1 ? ( y / 100 ) * layoutSize.height : y;

	// clean up 'auto' or other non-integer values
	x = isNaN( x ) ? 0 : x;
	y = isNaN( y ) ? 0 : y;
	// remove padding from measurement
	x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
	y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

	this.position.x = x;
	this.position.y = y;
};

// set settled position, apply padding
Item.prototype.layoutPosition = function() {
	var layoutSize = this.layout.size;
	var layoutOptions = this.layout.options;
	var style = {};

	// x
	var xPadding = layoutOptions.isOriginLeft ? 'paddingLeft' : 'paddingRight';
	var xProperty = layoutOptions.isOriginLeft ? 'left' : 'right';
	var xResetProperty = layoutOptions.isOriginLeft ? 'right' : 'left';

	var x = this.position.x + layoutSize[ xPadding ];
	// set in percentage or pixels
	style[ xProperty ] = this.getXValue( x );
	// reset other property
	style[ xResetProperty ] = '';

	// y
	var yPadding = layoutOptions.isOriginTop ? 'paddingTop' : 'paddingBottom';
	var yProperty = layoutOptions.isOriginTop ? 'top' : 'bottom';
	var yResetProperty = layoutOptions.isOriginTop ? 'bottom' : 'top';

	var y = this.position.y + layoutSize[ yPadding ];
	// set in percentage or pixels
	style[ yProperty ] = this.getYValue( y );
	// reset other property
	style[ yResetProperty ] = '';

	this.css( style );
	this.emitEvent( 'layout', [ this ] );
};

Item.prototype.getXValue = function( x ) {
	var layoutOptions = this.layout.options;
	return layoutOptions.percentPosition && !layoutOptions.isHorizontal ?
		( ( x / this.layout.size.width ) * 100 ) + '%' : x + 'px';
};

Item.prototype.getYValue = function( y ) {
	var layoutOptions = this.layout.options;
	return layoutOptions.percentPosition && layoutOptions.isHorizontal ?
		( ( y / this.layout.size.height ) * 100 ) + '%' : y + 'px';
};


Item.prototype._transitionTo = function( x, y ) {
	this.getPosition();
	// get current x & y from top/left
	var curX = this.position.x;
	var curY = this.position.y;

	var compareX = parseInt( x, 10 );
	var compareY = parseInt( y, 10 );
	var didNotMove = compareX === this.position.x && compareY === this.position.y;

	// save end position
	this.setPosition( x, y );

	// if did not move and not transitioning, just go to layout
	if ( didNotMove && !this.isTransitioning ) {
		this.layoutPosition();
		return;
	}

	var transX = x - curX;
	var transY = y - curY;
	var transitionStyle = {};
	transitionStyle.transform = this.getTranslate( transX, transY );

	this.transition({
		to: transitionStyle,
		onTransitionEnd: {
			transform: this.layoutPosition
		},
		isCleaning: true
	});
};

Item.prototype.getTranslate = function( x, y ) {
	// flip cooridinates if origin on right or bottom
	var layoutOptions = this.layout.options;
	x = layoutOptions.isOriginLeft ? x : -x;
	y = layoutOptions.isOriginTop ? y : -y;
	x = this.getXValue( x );
	y = this.getYValue( y );

	if ( is3d ) {
		return 'translate3d(' + x + ', ' + y + ', 0)';
	}

	return 'translate(' + x + ', ' + y + ')';
};

// non transition + transform support
Item.prototype.goTo = function( x, y ) {
	this.setPosition( x, y );
	this.layoutPosition();
};

// use transition and transforms if supported
Item.prototype.moveTo = supportsCSS3 ?
	Item.prototype._transitionTo : Item.prototype.goTo;

Item.prototype.setPosition = function( x, y ) {
	this.position.x = parseInt( x, 10 );
	this.position.y = parseInt( y, 10 );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
Item.prototype._nonTransition = function( args ) {
	this.css( args.to );
	if ( args.isCleaning ) {
		this._removeStyles( args.to );
	}
	for ( var prop in args.onTransitionEnd ) {
		args.onTransitionEnd[ prop ].call( this );
	}
};

/**
 * proper transition
 * @param {Object} args - arguments
 *	 @param {Object} to - style to transition to
 *	 @param {Object} from - style to start transition from
 *	 @param {Boolean} isCleaning - removes transition styles after transition
 *	 @param {Function} onTransitionEnd - callback
 */
Item.prototype._transition = function( args ) {
	// redirect to nonTransition if no transition duration
	if ( !parseFloat( this.layout.options.transitionDuration ) ) {
		this._nonTransition( args );
		return;
	}

	var _transition = this._transn;
	// keep track of onTransitionEnd callback by css property
	for ( var prop in args.onTransitionEnd ) {
		_transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
	}
	// keep track of properties that are transitioning
	for ( prop in args.to ) {
		_transition.ingProperties[ prop ] = true;
		// keep track of properties to clean up when transition is done
		if ( args.isCleaning ) {
			_transition.clean[ prop ] = true;
		}
	}

	// set from styles
	if ( args.from ) {
		this.css( args.from );
		// force redraw. http://blog.alexmaccaw.com/css-transitions
		var h = this.element.offsetHeight;
		// hack for JSHint to hush about unused var
		h = null;
	}
	// enable transition
	this.enableTransition( args.to );
	// set styles that are transitioning
	this.css( args.to );

	this.isTransitioning = true;

};

// dash before all cap letters, including first for
// WebkitTransform => -webkit-transform
function toDashedAll( str ) {
	return str.replace( /([A-Z])/g, function( $1 ) {
		return '-' + $1.toLowerCase();
	});
}

var transitionProps = 'opacity,' +
	toDashedAll( vendorProperties.transform || 'transform' );

Item.prototype.enableTransition = function(/* style */) {
	// HACK changing transitionProperty during a transition
	// will cause transition to jump
	if ( this.isTransitioning ) {
		return;
	}

	// make `transition: foo, bar, baz` from style object
	// HACK un-comment this when enableTransition can work
	// while a transition is happening
	// var transitionValues = [];
	// for ( var prop in style ) {
	//	 // dash-ify camelCased properties like WebkitTransition
	//	 prop = vendorProperties[ prop ] || prop;
	//	 transitionValues.push( toDashedAll( prop ) );
	// }
	// enable transition styles
	this.css({
		transitionProperty: transitionProps,
		transitionDuration: this.layout.options.transitionDuration
	});
	// listen for transition end event
	this.element.addEventListener( transitionEndEvent, this, false );
};

Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

// ----- events ----- //

Item.prototype.onwebkitTransitionEnd = function( event ) {
	this.ontransitionend( event );
};

Item.prototype.onotransitionend = function( event ) {
	this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
	'-webkit-transform': 'transform',
	'-moz-transform': 'transform',
	'-o-transform': 'transform'
};

Item.prototype.ontransitionend = function( event ) {
	// disregard bubbled events from children
	if ( event.target !== this.element ) {
		return;
	}
	var _transition = this._transn;
	// get property name of transitioned property, convert to prefix-free
	var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

	// remove property that has completed transitioning
	delete _transition.ingProperties[ propertyName ];
	// check if any properties are still transitioning
	if ( isEmptyObj( _transition.ingProperties ) ) {
		// all properties have completed transitioning
		this.disableTransition();
	}
	// clean style
	if ( propertyName in _transition.clean ) {
		// clean up style
		this.element.style[ event.propertyName ] = '';
		delete _transition.clean[ propertyName ];
	}
	// trigger onTransitionEnd callback
	if ( propertyName in _transition.onEnd ) {
		var onTransitionEnd = _transition.onEnd[ propertyName ];
		onTransitionEnd.call( this );
		delete _transition.onEnd[ propertyName ];
	}

	this.emitEvent( 'transitionEnd', [ this ] );
};

Item.prototype.disableTransition = function() {
	this.removeTransitionStyles();
	this.element.removeEventListener( transitionEndEvent, this, false );
	this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
Item.prototype._removeStyles = function( style ) {
	// clean up transition styles
	var cleanStyle = {};
	for ( var prop in style ) {
		cleanStyle[ prop ] = '';
	}
	this.css( cleanStyle );
};

var cleanTransitionStyle = {
	transitionProperty: '',
	transitionDuration: ''
};

Item.prototype.removeTransitionStyles = function() {
	// remove transition
	this.css( cleanTransitionStyle );
};

// ----- show/hide/remove ----- //

// remove element from DOM
Item.prototype.removeElem = function() {
	this.element.parentNode.removeChild( this.element );
	// remove display: none
	this.css({ display: '' });
	this.emitEvent( 'remove', [ this ] );
};

Item.prototype.remove = function() {
	// just remove element if no transition support or no transition
	if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
		this.removeElem();
		return;
	}

	// start transition
	var _this = this;
	this.once( 'transitionEnd', function() {
		_this.removeElem();
	});
	this.hide();
};

Item.prototype.reveal = function() {
	delete this.isHidden;
	// remove display: none
	this.css({ display: '' });

	var options = this.layout.options;

	var onTransitionEnd = {};
	var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
	onTransitionEnd[ transitionEndProperty ] = this.onRevealTransitionEnd;

	this.transition({
		from: options.hiddenStyle,
		to: options.visibleStyle,
		isCleaning: true,
		onTransitionEnd: onTransitionEnd
	});
};

Item.prototype.onRevealTransitionEnd = function() {
	// check if still visible
	// during transition, item may have been hidden
	if ( !this.isHidden ) {
		this.emitEvent('reveal');
	}
};

/**
 * get style property use for hide/reveal transition end
 * @param {String} styleProperty - hiddenStyle/visibleStyle
 * @returns {String}
 */
Item.prototype.getHideRevealTransitionEndProperty = function( styleProperty ) {
	var optionStyle = this.layout.options[ styleProperty ];
	// use opacity
	if ( optionStyle.opacity ) {
		return 'opacity';
	}
	// get first property
	for ( var prop in optionStyle ) {
		return prop;
	}
};

Item.prototype.hide = function() {
	// set flag
	this.isHidden = true;
	// remove display: none
	this.css({ display: '' });

	var options = this.layout.options;

	var onTransitionEnd = {};
	var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
	onTransitionEnd[ transitionEndProperty ] = this.onHideTransitionEnd;

	this.transition({
		from: options.visibleStyle,
		to: options.hiddenStyle,
		// keep hidden stuff hidden
		isCleaning: true,
		onTransitionEnd: onTransitionEnd
	});
};

Item.prototype.onHideTransitionEnd = function() {
	// check if still hidden
	// during transition, item may have been un-hidden
	if ( this.isHidden ) {
		this.css({ display: 'none' });
		this.emitEvent('hide');
	}
};

Item.prototype.destroy = function() {
	this.css({
		position: '',
		left: '',
		right: '',
		top: '',
		bottom: '',
		transition: '',
		transform: ''
	});
};

return Item;

}));

/*!
 * Outlayer v1.4.1
 * the brains and guts of a layout library
 * MIT license
 */

( function( window, factory ) {

	// universal module definition

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'outlayer/outlayer',[
				'eventie/eventie',
				'eventEmitter/EventEmitter',
				'get-size/get-size',
				'fizzy-ui-utils/utils',
				'./item'
			],
			function( eventie, EventEmitter, getSize, utils, Item ) {
				return factory( window, eventie, EventEmitter, getSize, utils, Item);
			}
		);
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory(
			window,
			require('eventie'),
			require('wolfy87-eventemitter'),
			require('get-size'),
			require('fizzy-ui-utils'),
			require('./item')
		);
	} else {
		// browser global
		window.Outlayer = factory(
			window,
			window.eventie,
			window.EventEmitter,
			window.getSize,
			window.fizzyUIUtils,
			window.Outlayer.Item
		);
	}

}( window, function factory( window, eventie, EventEmitter, getSize, utils, Item ) {


// ----- vars ----- //

var console = window.console;
var jQuery = window.jQuery;
var noop = function() {};

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
	var queryElement = utils.getQueryElement( element );
	if ( !queryElement ) {
		if ( console ) {
			console.error( 'Bad element for ' + this.constructor.namespace +
				': ' + ( queryElement || element ) );
		}
		return;
	}
	this.element = queryElement;
	// add jQuery
	if ( jQuery ) {
		this.$element = jQuery( this.element );
	}

	// options
	this.options = utils.extend( {}, this.constructor.defaults );
	this.option( options );

	// add id for Outlayer.getFromElement
	var id = ++GUID;
	this.element.outlayerGUID = id; // expando
	instances[ id ] = this; // associate via id

	// kick it off
	this._create();

	if ( this.options.isInitLayout ) {
		this.layout();
	}
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
	containerStyle: {
		position: 'relative'
	},
	isInitLayout: true,
	isOriginLeft: true,
	isOriginTop: true,
	isResizeBound: true,
	isResizingContainer: true,
	// item options
	transitionDuration: '0.4s',
	hiddenStyle: {
		opacity: 0,
		transform: 'scale(0.001)'
	},
	visibleStyle: {
		opacity: 1,
		transform: 'scale(1)'
	}
};

// inherit EventEmitter
utils.extend( Outlayer.prototype, EventEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
Outlayer.prototype.option = function( opts ) {
	utils.extend( this.options, opts );
};

Outlayer.prototype._create = function() {
	// get items from children
	this.reloadItems();
	// elements that affect layout, but are not laid out
	this.stamps = [];
	this.stamp( this.options.stamp );
	// set container style
	utils.extend( this.element.style, this.options.containerStyle );

	// bind resize method
	if ( this.options.isResizeBound ) {
		this.bindResize();
	}
};

// goes through all children again and gets bricks in proper order
Outlayer.prototype.reloadItems = function() {
	// collection of item elements
	this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
Outlayer.prototype._itemize = function( elems ) {

	var itemElems = this._filterFindItemElements( elems );
	var Item = this.constructor.Item;

	// create new Outlayer Items for collection
	var items = [];
	for ( var i=0, len = itemElems.length; i < len; i++ ) {
		var elem = itemElems[i];
		var item = new Item( elem, this );
		items.push( item );
	}

	return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
Outlayer.prototype._filterFindItemElements = function( elems ) {
	return utils.filterFindElements( elems, this.options.itemSelector );
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
Outlayer.prototype.getItemElements = function() {
	var elems = [];
	for ( var i=0, len = this.items.length; i < len; i++ ) {
		elems.push( this.items[i].element );
	}
	return elems;
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
Outlayer.prototype.layout = function() {
	this._resetLayout();
	this._manageStamps();

	// don't animate first layout
	var isInstant = this.options.isLayoutInstant !== undefined ?
		this.options.isLayoutInstant : !this._isLayoutInited;
	this.layoutItems( this.items, isInstant );

	// flag for initalized
	this._isLayoutInited = true;
};

// _init is alias for layout
Outlayer.prototype._init = Outlayer.prototype.layout;

/**
 * logic before any new layout
 */
Outlayer.prototype._resetLayout = function() {
	this.getSize();
};


Outlayer.prototype.getSize = function() {
	this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
Outlayer.prototype._getMeasurement = function( measurement, size ) {
	var option = this.options[ measurement ];
	var elem;
	if ( !option ) {
		// default to 0
		this[ measurement ] = 0;
	} else {
		// use option as an element
		if ( typeof option === 'string' ) {
			elem = this.element.querySelector( option );
		} else if ( utils.isElement( option ) ) {
			elem = option;
		}
		// use size of element, if element
		this[ measurement ] = elem ? getSize( elem )[ size ] : option;
	}
};

/**
 * layout a collection of item elements
 * @api public
 */
Outlayer.prototype.layoutItems = function( items, isInstant ) {
	items = this._getItemsForLayout( items );

	this._layoutItems( items, isInstant );

	this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
Outlayer.prototype._getItemsForLayout = function( items ) {
	var layoutItems = [];
	for ( var i=0, len = items.length; i < len; i++ ) {
		var item = items[i];
		if ( !item.isIgnored ) {
			layoutItems.push( item );
		}
	}
	return layoutItems;
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
Outlayer.prototype._layoutItems = function( items, isInstant ) {
	this._emitCompleteOnItems( 'layout', items );

	if ( !items || !items.length ) {
		// no items, emit event with empty array
		return;
	}

	var queue = [];

	for ( var i=0, len = items.length; i < len; i++ ) {
		var item = items[i];
		// get x/y object from method
		var position = this._getItemLayoutPosition( item );
		// enqueue
		position.item = item;
		position.isInstant = isInstant || item.isLayoutInstant;
		queue.push( position );
	}

	this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
Outlayer.prototype._getItemLayoutPosition = function( /* item */ ) {
	return {
		x: 0,
		y: 0
	};
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
Outlayer.prototype._processLayoutQueue = function( queue ) {
	for ( var i=0, len = queue.length; i < len; i++ ) {
		var obj = queue[i];
		this._positionItem( obj.item, obj.x, obj.y, obj.isInstant );
	}
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
Outlayer.prototype._positionItem = function( item, x, y, isInstant ) {
	if ( isInstant ) {
		// if not transition, just set CSS
		item.goTo( x, y );
	} else {
		item.moveTo( x, y );
	}
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
Outlayer.prototype._postLayout = function() {
	this.resizeContainer();
};

Outlayer.prototype.resizeContainer = function() {
	if ( !this.options.isResizingContainer ) {
		return;
	}
	var size = this._getContainerSize();
	if ( size ) {
		this._setContainerMeasure( size.width, true );
		this._setContainerMeasure( size.height, false );
	}
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *	 @param {Number} width
 *	 @param {Number} height
 */
Outlayer.prototype._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
Outlayer.prototype._setContainerMeasure = function( measure, isWidth ) {
	if ( measure === undefined ) {
		return;
	}

	var elemSize = this.size;
	// add padding and border width if border box
	if ( elemSize.isBorderBox ) {
		measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
			elemSize.borderLeftWidth + elemSize.borderRightWidth :
			elemSize.paddingBottom + elemSize.paddingTop +
			elemSize.borderTopWidth + elemSize.borderBottomWidth;
	}

	measure = Math.max( measure, 0 );
	this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * emit eventComplete on a collection of items events
 * @param {String} eventName
 * @param {Array} items - Outlayer.Items
 */
Outlayer.prototype._emitCompleteOnItems = function( eventName, items ) {
	var _this = this;
	function onComplete() {
		_this.dispatchEvent( eventName + 'Complete', null, [ items ] );
	}

	var count = items.length;
	if ( !items || !count ) {
		onComplete();
		return;
	}

	var doneCount = 0;
	function tick() {
		doneCount++;
		if ( doneCount === count ) {
			onComplete();
		}
	}

	// bind callback
	for ( var i=0, len = items.length; i < len; i++ ) {
		var item = items[i];
		item.once( eventName, tick );
	}
};

/**
 * emits events via eventEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
Outlayer.prototype.dispatchEvent = function( type, event, args ) {
	// add original event to arguments
	var emitArgs = event ? [ event ].concat( args ) : args;
	this.emitEvent( type, emitArgs );

	if ( jQuery ) {
		// set this.$element
		this.$element = this.$element || jQuery( this.element );
		if ( event ) {
			// create jQuery event
			var $event = jQuery.Event( event );
			$event.type = type;
			this.$element.trigger( $event, args );
		} else {
			// just trigger with type if no event available
			this.$element.trigger( type, args );
		}
	}
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
Outlayer.prototype.ignore = function( elem ) {
	var item = this.getItem( elem );
	if ( item ) {
		item.isIgnored = true;
	}
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
Outlayer.prototype.unignore = function( elem ) {
	var item = this.getItem( elem );
	if ( item ) {
		delete item.isIgnored;
	}
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
Outlayer.prototype.stamp = function( elems ) {
	elems = this._find( elems );
	if ( !elems ) {
		return;
	}

	this.stamps = this.stamps.concat( elems );
	// ignore
	for ( var i=0, len = elems.length; i < len; i++ ) {
		var elem = elems[i];
		this.ignore( elem );
	}
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
Outlayer.prototype.unstamp = function( elems ) {
	elems = this._find( elems );
	if ( !elems ){
		return;
	}

	for ( var i=0, len = elems.length; i < len; i++ ) {
		var elem = elems[i];
		// filter out removed stamp elements
		utils.removeFrom( this.stamps, elem );
		this.unignore( elem );
	}

};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
Outlayer.prototype._find = function( elems ) {
	if ( !elems ) {
		return;
	}
	// if string, use argument as selector string
	if ( typeof elems === 'string' ) {
		elems = this.element.querySelectorAll( elems );
	}
	elems = utils.makeArray( elems );
	return elems;
};

Outlayer.prototype._manageStamps = function() {
	if ( !this.stamps || !this.stamps.length ) {
		return;
	}

	this._getBoundingRect();

	for ( var i=0, len = this.stamps.length; i < len; i++ ) {
		var stamp = this.stamps[i];
		this._manageStamp( stamp );
	}
};

// update boundingLeft / Top
Outlayer.prototype._getBoundingRect = function() {
	// get bounding rect for container element
	var boundingRect = this.element.getBoundingClientRect();
	var size = this.size;
	this._boundingRect = {
		left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
		top: boundingRect.top + size.paddingTop + size.borderTopWidth,
		right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
		bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
	};
};

/**
 * @param {Element} stamp
**/
Outlayer.prototype._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
Outlayer.prototype._getElementOffset = function( elem ) {
	var boundingRect = elem.getBoundingClientRect();
	var thisRect = this._boundingRect;
	var size = getSize( elem );
	var offset = {
		left: boundingRect.left - thisRect.left - size.marginLeft,
		top: boundingRect.top - thisRect.top - size.marginTop,
		right: thisRect.right - boundingRect.right - size.marginRight,
		bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
	};
	return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
Outlayer.prototype.handleEvent = function( event ) {
	var method = 'on' + event.type;
	if ( this[ method ] ) {
		this[ method ]( event );
	}
};

/**
 * Bind layout to window resizing
 */
Outlayer.prototype.bindResize = function() {
	// bind just one listener
	if ( this.isResizeBound ) {
		return;
	}
	eventie.bind( window, 'resize', this );
	this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
Outlayer.prototype.unbindResize = function() {
	if ( this.isResizeBound ) {
		eventie.unbind( window, 'resize', this );
	}
	this.isResizeBound = false;
};

// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Outlayer.prototype.onresize = function() {
	if ( this.resizeTimeout ) {
		clearTimeout( this.resizeTimeout );
	}

	var _this = this;
	function delayed() {
		_this.resize();
		delete _this.resizeTimeout;
	}

	this.resizeTimeout = setTimeout( delayed, 100 );
};

// debounced, layout on resize
Outlayer.prototype.resize = function() {
	// don't trigger if size did not change
	// or if resize was unbound. See #9
	if ( !this.isResizeBound || !this.needsResizeLayout() ) {
		return;
	}

	this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
Outlayer.prototype.needsResizeLayout = function() {
	var size = getSize( this.element );
	// check that this.size and size are there
	// IE8 triggers resize on body size change, so they might not be
	var hasSizes = this.size && size;
	return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
Outlayer.prototype.addItems = function( elems ) {
	var items = this._itemize( elems );
	// add items to collection
	if ( items.length ) {
		this.items = this.items.concat( items );
	}
	return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.appended = function( elems ) {
	var items = this.addItems( elems );
	if ( !items.length ) {
		return;
	}
	// layout and reveal just the new items
	this.layoutItems( items, true );
	this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.prepended = function( elems ) {
	var items = this._itemize( elems );
	if ( !items.length ) {
		return;
	}
	// add items to beginning of collection
	var previousItems = this.items.slice(0);
	this.items = items.concat( previousItems );
	// start new layout
	this._resetLayout();
	this._manageStamps();
	// layout new stuff without transition
	this.layoutItems( items, true );
	this.reveal( items );
	// layout previous items
	this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.reveal = function( items ) {
	this._emitCompleteOnItems( 'reveal', items );

	var len = items && items.length;
	for ( var i=0; len && i < len; i++ ) {
		var item = items[i];
		item.reveal();
	}
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.hide = function( items ) {
	this._emitCompleteOnItems( 'hide', items );

	var len = items && items.length;
	for ( var i=0; len && i < len; i++ ) {
		var item = items[i];
		item.hide();
	}
};

/**
 * reveal item elements
 * @param {Array}, {Element}, {NodeList} items
 */
Outlayer.prototype.revealItemElements = function( elems ) {
	var items = this.getItems( elems );
	this.reveal( items );
};

/**
 * hide item elements
 * @param {Array}, {Element}, {NodeList} items
 */
Outlayer.prototype.hideItemElements = function( elems ) {
	var items = this.getItems( elems );
	this.hide( items );
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
Outlayer.prototype.getItem = function( elem ) {
	// loop through items to get the one that matches
	for ( var i=0, len = this.items.length; i < len; i++ ) {
		var item = this.items[i];
		if ( item.element === elem ) {
			// return item
			return item;
		}
	}
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
Outlayer.prototype.getItems = function( elems ) {
	elems = utils.makeArray( elems );
	var items = [];
	for ( var i=0, len = elems.length; i < len; i++ ) {
		var elem = elems[i];
		var item = this.getItem( elem );
		if ( item ) {
			items.push( item );
		}
	}

	return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.remove = function( elems ) {
	var removeItems = this.getItems( elems );

	this._emitCompleteOnItems( 'remove', removeItems );

	// bail if no items to remove
	if ( !removeItems || !removeItems.length ) {
		return;
	}

	for ( var i=0, len = removeItems.length; i < len; i++ ) {
		var item = removeItems[i];
		item.remove();
		// remove item from collection
		utils.removeFrom( this.items, item );
	}
};

// ----- destroy ----- //

// remove and disable Outlayer instance
Outlayer.prototype.destroy = function() {
	// clean up dynamic styles
	var style = this.element.style;
	style.height = '';
	style.position = '';
	style.width = '';
	// destroy items
	for ( var i=0, len = this.items.length; i < len; i++ ) {
		var item = this.items[i];
		item.destroy();
	}

	this.unbindResize();

	var id = this.element.outlayerGUID;
	delete instances[ id ]; // remove reference to instance by id
	delete this.element.outlayerGUID;
	// remove data for jQuery
	if ( jQuery ) {
		jQuery.removeData( this.element, this.constructor.namespace );
	}

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
	elem = utils.getQueryElement( elem );
	var id = elem && elem.outlayerGUID;
	return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
	// sub-class Outlayer
	function Layout() {
		Outlayer.apply( this, arguments );
	}
	// inherit Outlayer prototype, use Object.create if there
	if ( Object.create ) {
		Layout.prototype = Object.create( Outlayer.prototype );
	} else {
		utils.extend( Layout.prototype, Outlayer.prototype );
	}
	// set contructor, used for namespace and Item
	Layout.prototype.constructor = Layout;

	Layout.defaults = utils.extend( {}, Outlayer.defaults );
	// apply new options
	utils.extend( Layout.defaults, options );
	// keep prototype.settings for backwards compatibility (Packery v1.2.0)
	Layout.prototype.settings = {};

	Layout.namespace = namespace;

	Layout.data = Outlayer.data;

	// sub-class Item
	Layout.Item = function LayoutItem() {
		Item.apply( this, arguments );
	};

	Layout.Item.prototype = new Item();

	// -------------------------- declarative -------------------------- //

	utils.htmlInit( Layout, namespace );


	return Layout;
};

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}));


/**
 * Rect
 * low-level utility class for basic geometry
 */

( function( window, factory ) {

	// universal module definition
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'packery/js/rect',factory );
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory();
	} else {
		// browser global
		window.Packery = window.Packery || {};
		window.Packery.Rect = factory();
	}

}( window, function factory() {


// -------------------------- Packery -------------------------- //

// global namespace
var Packery = window.Packery = function() {};

// -------------------------- Rect -------------------------- //

function Rect( props ) {
	// extend properties from defaults
	for ( var prop in Rect.defaults ) {
		this[ prop ] = Rect.defaults[ prop ];
	}

	for ( prop in props ) {
		this[ prop ] = props[ prop ];
	}

}

// make available
Packery.Rect = Rect;

Rect.defaults = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
};

/**
 * Determines whether or not this rectangle wholly encloses another rectangle or point.
 * @param {Rect} rect
 * @returns {Boolean}
**/
Rect.prototype.contains = function( rect ) {
	// points don't have width or height
	var otherWidth = rect.width || 0;
	var otherHeight = rect.height || 0;
	return this.x <= rect.x &&
		this.y <= rect.y &&
		this.x + this.width >= rect.x + otherWidth &&
		this.y + this.height >= rect.y + otherHeight;
};

/**
 * Determines whether or not the rectangle intersects with another.
 * @param {Rect} rect
 * @returns {Boolean}
**/
Rect.prototype.overlaps = function( rect ) {
	var thisRight = this.x + this.width;
	var thisBottom = this.y + this.height;
	var rectRight = rect.x + rect.width;
	var rectBottom = rect.y + rect.height;

	// http://stackoverflow.com/a/306332
	return this.x < rectRight &&
		thisRight > rect.x &&
		this.y < rectBottom &&
		thisBottom > rect.y;
};

/**
 * @param {Rect} rect - the overlapping rect
 * @returns {Array} freeRects - rects representing the area around the rect
**/
Rect.prototype.getMaximalFreeRects = function( rect ) {

	// if no intersection, return false
	if ( !this.overlaps( rect ) ) {
		return false;
	}

	var freeRects = [];
	var freeRect;

	var thisRight = this.x + this.width;
	var thisBottom = this.y + this.height;
	var rectRight = rect.x + rect.width;
	var rectBottom = rect.y + rect.height;

	// top
	if ( this.y < rect.y ) {
		freeRect = new Rect({
			x: this.x,
			y: this.y,
			width: this.width,
			height: rect.y - this.y
		});
		freeRects.push( freeRect );
	}

	// right
	if ( thisRight > rectRight ) {
		freeRect = new Rect({
			x: rectRight,
			y: this.y,
			width: thisRight - rectRight,
			height: this.height
		});
		freeRects.push( freeRect );
	}

	// bottom
	if ( thisBottom > rectBottom ) {
		freeRect = new Rect({
			x: this.x,
			y: rectBottom,
			width: this.width,
			height: thisBottom - rectBottom
		});
		freeRects.push( freeRect );
	}

	// left
	if ( this.x < rect.x ) {
		freeRect = new Rect({
			x: this.x,
			y: this.y,
			width: rect.x - this.x,
			height: this.height
		});
		freeRects.push( freeRect );
	}

	return freeRects;
};

Rect.prototype.canFit = function( rect ) {
	return this.width >= rect.width && this.height >= rect.height;
};

return Rect;

}));

/**
 * Packer
 * bin-packing algorithm
 */

( function( window, factory ) {

	// universal module definition
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'packery/js/packer',[ './rect' ], factory );
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory(
			require('./rect')
		);
	} else {
		// browser global
		var Packery = window.Packery = window.Packery || {};
		Packery.Packer = factory( Packery.Rect );
	}

}( window, function factory( Rect ) {


// -------------------------- Packer -------------------------- //

/**
 * @param {Number} width
 * @param {Number} height
 * @param {String} sortDirection
 *	 topLeft for vertical, leftTop for horizontal
 */
function Packer( width, height, sortDirection ) {
	this.width = width || 0;
	this.height = height || 0;
	this.sortDirection = sortDirection || 'downwardLeftToRight';

	this.reset();
}

Packer.prototype.reset = function() {
	this.spaces = [];
	this.newSpaces = [];

	var initialSpace = new Rect({
		x: 0,
		y: 0,
		width: this.width,
		height: this.height
	});

	this.spaces.push( initialSpace );
	// set sorter
	this.sorter = sorters[ this.sortDirection ] || sorters.downwardLeftToRight;
};

// change x and y of rect to fit with in Packer's available spaces
Packer.prototype.pack = function( rect ) {
	for ( var i=0, len = this.spaces.length; i < len; i++ ) {
		var space = this.spaces[i];
		if ( space.canFit( rect ) ) {
			this.placeInSpace( rect, space );
			break;
		}
	}
};

Packer.prototype.placeInSpace = function( rect, space ) {
	// place rect in space
	rect.x = space.x;
	rect.y = space.y;

	this.placed( rect );
};

// update spaces with placed rect
Packer.prototype.placed = function( rect ) {
	// update spaces
	var revisedSpaces = [];
	for ( var i=0, len = this.spaces.length; i < len; i++ ) {
		var space = this.spaces[i];
		var newSpaces = space.getMaximalFreeRects( rect );
		// add either the original space or the new spaces to the revised spaces
		if ( newSpaces ) {
			revisedSpaces.push.apply( revisedSpaces, newSpaces );
		} else {
			revisedSpaces.push( space );
		}
	}

	this.spaces = revisedSpaces;

	this.mergeSortSpaces();
};

Packer.prototype.mergeSortSpaces = function() {
	// remove redundant spaces
	Packer.mergeRects( this.spaces );
	this.spaces.sort( this.sorter );
};

// add a space back
Packer.prototype.addSpace = function( rect ) {
	this.spaces.push( rect );
	this.mergeSortSpaces();
};

// -------------------------- utility functions -------------------------- //

/**
 * Remove redundant rectangle from array of rectangles
 * @param {Array} rects: an array of Rects
 * @returns {Array} rects: an array of Rects
**/
Packer.mergeRects = function( rects ) {
	for ( var i=0, len = rects.length; i < len; i++ ) {
		var rect = rects[i];
		// skip over this rect if it was already removed
		if ( !rect ) {
			continue;
		}
		// clone rects we're testing, remove this rect
		var compareRects = rects.slice(0);
		// do not compare with self
		compareRects.splice( i, 1 );
		// compare this rect with others
		var removedCount = 0;
		for ( var j=0, jLen = compareRects.length; j < jLen; j++ ) {
			var compareRect = compareRects[j];
			// if this rect contains another,
			// remove that rect from test collection
			var indexAdjust = i > j ? 0 : 1;
			if ( rect.contains( compareRect ) ) {
				// console.log( 'current test rects:' + testRects.length, testRects );
				// console.log( i, j, indexAdjust, rect, compareRect );
				rects.splice( j + indexAdjust - removedCount, 1 );
				removedCount++;
			}
		}
	}

	return rects;
};


// -------------------------- sorters -------------------------- //

// functions for sorting rects in order
var sorters = {
	// top down, then left to right
	downwardLeftToRight: function( a, b ) {
		return a.y - b.y || a.x - b.x;
	},
	// left to right, then top down
	rightwardTopToBottom: function( a, b ) {
		return a.x - b.x || a.y - b.y;
	}
};


// --------------------------	-------------------------- //

return Packer;

}));
/**
 * Packery Item Element
**/

( function( window, factory ) {

	// universal module definition

	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( 'packery/js/item',[
				'get-style-property/get-style-property',
				'outlayer/outlayer',
				'./rect'
			],
			factory );
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory(
			require('desandro-get-style-property'),
			require('outlayer'),
			require('./rect')
		);
	} else {
		// browser global
		window.Packery.Item = factory(
			window.getStyleProperty,
			window.Outlayer,
			window.Packery.Rect
		);
	}

}( window, function factory( getStyleProperty, Outlayer, Rect ) {


// -------------------------- Item -------------------------- //

var transformProperty = getStyleProperty('transform');

// sub-class Item
var Item = function PackeryItem() {
	Outlayer.Item.apply( this, arguments );
};

Item.prototype = new Outlayer.Item();

var protoCreate = Item.prototype._create;
Item.prototype._create = function() {
	// call default _create logic
	protoCreate.call( this );
	this.rect = new Rect();
	// rect used for placing, in drag or Packery.fit()
	this.placeRect = new Rect();
};

// -------------------------- drag -------------------------- //

Item.prototype.dragStart = function() {
	this.getPosition();
	this.removeTransitionStyles();
	// remove transform property from transition
	if ( this.isTransitioning && transformProperty ) {
		this.element.style[ transformProperty ] = 'none';
	}
	this.getSize();
	// create place rect, used for position when dragged then dropped
	// or when positioning
	this.isPlacing = true;
	this.needsPositioning = false;
	this.positionPlaceRect( this.position.x, this.position.y );
	this.isTransitioning = false;
	this.didDrag = false;
};

/**
 * handle item when it is dragged
 * @param {Number} x - horizontal position of dragged item
 * @param {Number} y - vertical position of dragged item
 */
Item.prototype.dragMove = function( x, y ) {
	this.didDrag = true;
	var packerySize = this.layout.size;
	x -= packerySize.paddingLeft;
	y -= packerySize.paddingTop;
	this.positionPlaceRect( x, y );
};

Item.prototype.dragStop = function() {
	this.getPosition();
	var isDiffX = this.position.x != this.placeRect.x;
	var isDiffY = this.position.y != this.placeRect.y;
	// set post-drag positioning flag
	this.needsPositioning = isDiffX || isDiffY;
	// reset flag
	this.didDrag = false;
};

// -------------------------- placing -------------------------- //

/**
 * position a rect that will occupy space in the packer
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} isMaxYContained
 */
Item.prototype.positionPlaceRect = function( x, y, isMaxYOpen ) {
	this.placeRect.x = this.getPlaceRectCoord( x, true );
	this.placeRect.y = this.getPlaceRectCoord( y, false, isMaxYOpen );
};

/**
 * get x/y coordinate for place rect
 * @param {Number} coord - x or y
 * @param {Boolean} isX
 * @param {Boolean} isMaxOpen - does not limit value to outer bound
 * @returns {Number} coord - processed x or y
 */
Item.prototype.getPlaceRectCoord = function( coord, isX, isMaxOpen ) {
	var measure = isX ? 'Width' : 'Height';
	var size = this.size[ 'outer' + measure ];
	var segment = this.layout[ isX ? 'columnWidth' : 'rowHeight' ];
	var parentSize = this.layout.size[ 'inner' + measure ];

	// additional parentSize calculations for Y
	if ( !isX ) {
		parentSize = Math.max( parentSize, this.layout.maxY );
		// prevent gutter from bumping up height when non-vertical grid
		if ( !this.layout.rowHeight ) {
			parentSize -= this.layout.gutter;
		}
	}

	var max;

	if ( segment ) {
		segment += this.layout.gutter;
		// allow for last column to reach the edge
		parentSize += isX ? this.layout.gutter : 0;
		// snap to closest segment
		coord = Math.round( coord / segment );
		// contain to outer bound
		// contain non-growing bound, allow growing bound to grow
		var mathMethod;
		if ( this.layout.options.isHorizontal ) {
			mathMethod = !isX ? 'floor' : 'ceil';
		} else {
			mathMethod = isX ? 'floor' : 'ceil';
		}
		var maxSegments = Math[ mathMethod ]( parentSize / segment );
		maxSegments -= Math.ceil( size / segment );
		max = maxSegments;
	} else {
		max = parentSize - size;
	}

	coord = isMaxOpen ? coord : Math.min( coord, max );
	coord *= segment || 1;

	return Math.max( 0, coord );
};

Item.prototype.copyPlaceRectPosition = function() {
	this.rect.x = this.placeRect.x;
	this.rect.y = this.placeRect.y;
};

// -----	----- //

// remove element from DOM
Item.prototype.removeElem = function() {
	this.element.parentNode.removeChild( this.element );
	// add space back to packer
	this.layout.packer.addSpace( this.rect );
	this.emitEvent( 'remove', [ this ] );
};

// -----	----- //

return Item;

}));

/*!
 * Packery v1.4.2
 * bin-packing layout library
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * http://packery.metafizzy.co
 * Copyright 2015 Metafizzy
 */

( function( window, factory ) {

	// universal module definition
	if ( typeof define == 'function' && define.amd ) {
		// AMD
		define( [
				'classie/classie',
				'get-size/get-size',
				'outlayer/outlayer',
				'packery/js/rect',
				'packery/js/packer',
				'packery/js/item'
			],
			factory );
	} else if ( typeof exports == 'object' ) {
		// CommonJS
		module.exports = factory(
			require('desandro-classie'),
			require('get-size'),
			require('outlayer'),
			require('./rect'),
			require('./packer'),
			require('./item')
		);
	} else {
		// browser global
		window.Packery = factory(
			window.classie,
			window.getSize,
			window.Outlayer,
			window.Packery.Rect,
			window.Packery.Packer,
			window.Packery.Item
		);
	}

}( window, function factory( classie, getSize, Outlayer, Rect, Packer, Item ) {


// ----- Rect ----- //

// allow for pixel rounding errors IE8-IE11 & Firefox; #227
Rect.prototype.canFit = function( rect ) {
	return this.width >= rect.width - 1 && this.height >= rect.height - 1;
};

// -------------------------- Packery -------------------------- //

// create an Outlayer layout class
var Packery = Outlayer.create('packery');
Packery.Item = Item;

Packery.prototype._create = function() {
	// call super
	Outlayer.prototype._create.call( this );

	// initial properties
	this.packer = new Packer();

	// Left over from v1.0
	this.stamp( this.options.stamped );

	// create drag handlers
	var _this = this;
	this.handleDraggabilly = {
		dragStart: function() {
			_this.itemDragStart( this.element );
		},
		dragMove: function() {
			_this.itemDragMove( this.element, this.position.x, this.position.y );
		},
		dragEnd: function() {
			_this.itemDragEnd( this.element );
		}
	};

	this.handleUIDraggable = {
		start: function handleUIDraggableStart( event, ui ) {
			// HTML5 may trigger dragstart, dismiss HTML5 dragging
			if ( !ui ) {
				return;
			}
			_this.itemDragStart( event.currentTarget );
		},
		drag: function handleUIDraggableDrag( event, ui ) {
			if ( !ui ) {
				return;
			}
			_this.itemDragMove( event.currentTarget, ui.position.left, ui.position.top );
		},
		stop: function handleUIDraggableStop( event, ui ) {
			if ( !ui ) {
				return;
			}
			_this.itemDragEnd( event.currentTarget );
		}
	};

};


// ----- init & layout ----- //

/**
 * logic before any new layout
 */
Packery.prototype._resetLayout = function() {
	this.getSize();

	this._getMeasurements();

	// reset packer
	var packer = this.packer;
	// packer settings, if horizontal or vertical
	if ( this.options.isHorizontal ) {
		packer.width = Number.POSITIVE_INFINITY;
		packer.height = this.size.innerHeight + this.gutter;
		packer.sortDirection = 'rightwardTopToBottom';
	} else {
		packer.width = this.size.innerWidth + this.gutter;
		packer.height = Number.POSITIVE_INFINITY;
		packer.sortDirection = 'downwardLeftToRight';
	}

	packer.reset();

	// layout
	this.maxY = 0;
	this.maxX = 0;
};

/**
 * update columnWidth, rowHeight, & gutter
 * @private
 */
Packery.prototype._getMeasurements = function() {
	this._getMeasurement( 'columnWidth', 'width' );
	this._getMeasurement( 'rowHeight', 'height' );
	this._getMeasurement( 'gutter', 'width' );
};

Packery.prototype._getItemLayoutPosition = function( item ) {
	this._packItem( item );
	return item.rect;
};


/**
 * layout item in packer
 * @param {Packery.Item} item
 */
Packery.prototype._packItem = function( item ) {
	this._setRectSize( item.element, item.rect );
	// pack the rect in the packer
	this.packer.pack( item.rect );
	this._setMaxXY( item.rect );
};

/**
 * set max X and Y value, for size of container
 * @param {Packery.Rect} rect
 * @private
 */
Packery.prototype._setMaxXY = function( rect ) {
	this.maxX = Math.max( rect.x + rect.width, this.maxX );
	this.maxY = Math.max( rect.y + rect.height, this.maxY );
};

/**
 * set the width and height of a rect, applying columnWidth and rowHeight
 * @param {Element} elem
 * @param {Packery.Rect} rect
 */
Packery.prototype._setRectSize = function( elem, rect ) {
	var size = getSize( elem );
	var w = size.outerWidth;
	var h = size.outerHeight;
	// size for columnWidth and rowHeight, if available
	// only check if size is non-zero, #177
	if ( w || h ) {
		w = this._applyGridGutter( w, this.columnWidth );
		h = this._applyGridGutter( h, this.rowHeight );
	}
	// rect must fit in packer
	rect.width = Math.min( w, this.packer.width );
	rect.height = Math.min( h, this.packer.height );
};

/**
 * fits item to columnWidth/rowHeight and adds gutter
 * @param {Number} measurement - item width or height
 * @param {Number} gridSize - columnWidth or rowHeight
 * @returns measurement
 */
Packery.prototype._applyGridGutter = function( measurement, gridSize ) {
	// just add gutter if no gridSize
	if ( !gridSize ) {
		return measurement + this.gutter;
	}
	gridSize += this.gutter;
	// fit item to columnWidth/rowHeight
	var remainder = measurement % gridSize;
	var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
	measurement = Math[ mathMethod ]( measurement / gridSize ) * gridSize;
	return measurement;
};

Packery.prototype._getContainerSize = function() {
	if ( this.options.isHorizontal ) {
		return {
			width: this.maxX - this.gutter
		};
	} else {
		return {
			height: this.maxY - this.gutter
		};
	}
};


// -------------------------- stamp -------------------------- //

/**
 * makes space for element
 * @param {Element} elem
 */
Packery.prototype._manageStamp = function( elem ) {

	var item = this.getItem( elem );
	var rect;
	if ( item && item.isPlacing ) {
		rect = item.placeRect;
	} else {
		var offset = this._getElementOffset( elem );
		rect = new Rect({
			x: this.options.isOriginLeft ? offset.left : offset.right,
			y: this.options.isOriginTop ? offset.top : offset.bottom
		});
	}

	this._setRectSize( elem, rect );
	// save its space in the packer
	this.packer.placed( rect );
	this._setMaxXY( rect );
};

// -------------------------- methods -------------------------- //

function verticalSorter( a, b ) {
	return a.position.y - b.position.y || a.position.x - b.position.x;
}

function horizontalSorter( a, b ) {
	return a.position.x - b.position.x || a.position.y - b.position.y;
}

Packery.prototype.sortItemsByPosition = function() {
	var sorter = this.options.isHorizontal ? horizontalSorter : verticalSorter;
	this.items.sort( sorter );
};

/**
 * Fit item element in its current position
 * Packery will position elements around it
 * useful for expanding elements
 *
 * @param {Element} elem
 * @param {Number} x - horizontal destination position, optional
 * @param {Number} y - vertical destination position, optional
 */
Packery.prototype.fit = function( elem, x, y ) {
	var item = this.getItem( elem );
	if ( !item ) {
		return;
	}

	// prepare internal properties
	this._getMeasurements();

	// stamp item to get it out of layout
	this.stamp( item.element );
	// required for positionPlaceRect
	item.getSize();
	// set placing flag
	item.isPlacing = true;
	// fall back to current position for fitting
	x = x === undefined ? item.rect.x: x;
	y = y === undefined ? item.rect.y: y;

	// position it best at its destination
	item.positionPlaceRect( x, y, true );

	this._bindFitEvents( item );
	item.moveTo( item.placeRect.x, item.placeRect.y );
	// layout everything else
	this.layout();

	// return back to regularly scheduled programming
	this.unstamp( item.element );
	this.sortItemsByPosition();
	// un set placing flag, back to normal
	item.isPlacing = false;
	// copy place rect position
	item.copyPlaceRectPosition();
};

/**
 * emit event when item is fit and other items are laid out
 * @param {Packery.Item} item
 * @private
 */
Packery.prototype._bindFitEvents = function( item ) {
	var _this = this;
	var ticks = 0;
	function tick() {
		ticks++;
		if ( ticks != 2 ) {
			return;
		}
		_this.dispatchEvent( 'fitComplete', null, [ item ] );
	}
	// when item is laid out
	item.on( 'layout', function() {
		tick();
		return true;
	});
	// when all items are laid out
	this.on( 'layoutComplete', function() {
		tick();
		return true;
	});
};

// -------------------------- resize -------------------------- //

// debounced, layout on resize
Packery.prototype.resize = function() {
	// don't trigger if size did not change
	var size = getSize( this.element );
	// check that this.size and size are there
	// IE8 triggers resize on body size change, so they might not be
	var hasSizes = this.size && size;
	var innerSize = this.options.isHorizontal ? 'innerHeight' : 'innerWidth';
	if ( hasSizes && size[ innerSize ] == this.size[ innerSize ] ) {
		return;
	}

	this.layout();
};

// -------------------------- drag -------------------------- //

/**
 * handle an item drag start event
 * @param {Element} elem
 */
Packery.prototype.itemDragStart = function( elem ) {
	this.stamp( elem );
	var item = this.getItem( elem );
	if ( item ) {
		item.dragStart();
	}
};

/**
 * handle an item drag move event
 * @param {Element} elem
 * @param {Number} x - horizontal change in position
 * @param {Number} y - vertical change in position
 */
Packery.prototype.itemDragMove = function( elem, x, y ) {
	var item = this.getItem( elem );
	if ( item ) {
		item.dragMove( x, y );
	}

	// debounce
	var _this = this;
	// debounce triggering layout
	function delayed() {
		_this.layout();
		delete _this.dragTimeout;
	}

	this.clearDragTimeout();

	this.dragTimeout = setTimeout( delayed, 40 );
};

Packery.prototype.clearDragTimeout = function() {
	if ( this.dragTimeout ) {
		clearTimeout( this.dragTimeout );
	}
};

/**
 * handle an item drag end event
 * @param {Element} elem
 */
Packery.prototype.itemDragEnd = function( elem ) {
	var item = this.getItem( elem );
	var itemDidDrag;
	if ( item ) {
		itemDidDrag = item.didDrag;
		item.dragStop();
	}
	// if elem didn't move, or if it doesn't need positioning
	// unignore and unstamp and call it a day
	if ( !item || ( !itemDidDrag && !item.needsPositioning ) ) {
		this.unstamp( elem );
		return;
	}
	// procced with dragged item

	classie.add( item.element, 'is-positioning-post-drag' );

	// save this var, as it could get reset in dragStart
	var onLayoutComplete = this._getDragEndLayoutComplete( elem, item );

	if ( item.needsPositioning ) {
		item.on( 'layout', onLayoutComplete );
		item.moveTo( item.placeRect.x, item.placeRect.y );
	} else if ( item ) {
		// item didn't need placement
		item.copyPlaceRectPosition();
	}

	this.clearDragTimeout();
	this.on( 'layoutComplete', onLayoutComplete );
	this.layout();

};

/**
 * get drag end callback
 * @param {Element} elem
 * @param {Packery.Item} item
 * @returns {Function} onLayoutComplete
 */
Packery.prototype._getDragEndLayoutComplete = function( elem, item ) {
	var itemNeedsPositioning = item && item.needsPositioning;
	var completeCount = 0;
	var asyncCount = itemNeedsPositioning ? 2 : 1;
	var _this = this;

	return function onLayoutComplete() {
		completeCount++;
		// don't proceed if not complete
		if ( completeCount != asyncCount ) {
			return true;
		}
		// reset item
		if ( item ) {
			classie.remove( item.element, 'is-positioning-post-drag' );
			item.isPlacing = false;
			item.copyPlaceRectPosition();
		}

		_this.unstamp( elem );
		// only sort when item moved
		_this.sortItemsByPosition();

		// emit item drag event now that everything is done
		if ( itemNeedsPositioning ) {
			_this.dispatchEvent( 'dragItemPositioned', null, [ item ] );
		}
		// listen once
		return true;
	};
};

/**
 * binds Draggabilly events
 * @param {Draggabilly} draggie
 */
Packery.prototype.bindDraggabillyEvents = function( draggie ) {
	draggie.on( 'dragStart', this.handleDraggabilly.dragStart );
	draggie.on( 'dragMove', this.handleDraggabilly.dragMove );
	draggie.on( 'dragEnd', this.handleDraggabilly.dragEnd );
};

/**
 * binds jQuery UI Draggable events
 * @param {jQuery} $elems
 */
Packery.prototype.bindUIDraggableEvents = function( $elems ) {
	$elems
		.on( 'dragstart', this.handleUIDraggable.start )
		.on( 'drag', this.handleUIDraggable.drag )
		.on( 'dragstop', this.handleUIDraggable.stop );
};

Packery.Rect = Rect;
Packery.Packer = Packer;

return Packery;

}));


// imagesLoaded v3.1.8 - JavaScript is all like "You images are done yet or what?" | MIT License
// --------------------------------------------------------------------------------------------------------------------------------------------------------
(function(window, factory) {
	// universal module definition
	/*global define: false, module: false, require: false */
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['eventEmitter/EventEmitter', 'eventie/eventie'], function(EventEmitter, eventie) {
			return factory(window, EventEmitter, eventie);
		});
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = factory(
		window, require('wolfy87-eventemitter'), require('eventie'));
	} else {
		// browser global
		window.imagesLoaded = factory(
		window, window.EventEmitter, window.eventie);
	}
})(window,


// --------------------------  factory -------------------------- //
function factory(window, EventEmitter, eventie) {

	var $ = window.jQuery;
	var console = window.console;
	var hasConsole = typeof console !== 'undefined';

	// -------------------------- helpers -------------------------- //
	// extend objects
	function extend(a, b) {
		for (var prop in b) {
			a[prop] = b[prop];
		}
		return a;
	}
	var objToString = Object.prototype.toString;

	function isArray(obj) {
		return objToString.call(obj) === '[object Array]';
	}

	// turn element or nodeList into an array
	function makeArray(obj) {
		var ary = [];
		if (isArray(obj)) {
			// use object if already an array
			ary = obj;
		} else if (typeof obj.length === 'number') {
			// convert nodeList to array
			for (var i = 0, len = obj.length; i < len; i++) {
				ary.push(obj[i]);
			}
		} else {
			// array of single index
			ary.push(obj);
		}
		return ary;
	}

	// -------------------------- imagesLoaded -------------------------- //
	/**
	 * @param {Array, Element, NodeList, String} elem
	 * @param {Object or Function} options - if function, use as callback
	 * @param {Function} onAlways - callback function
	 */
	function ImagesLoaded(elem, options, onAlways) {
		// coerce ImagesLoaded() without new, to be new ImagesLoaded()
		if (!(this instanceof ImagesLoaded)) {
			return new ImagesLoaded(elem, options);
		}
		// use elem as selector string
		if (typeof elem === 'string') {
			elem = document.querySelectorAll(elem);
		}
		this.elements = makeArray(elem);
		this.options = extend({}, this.options);
		if (typeof options === 'function') {
			onAlways = options;
		} else {
			extend(this.options, options);
		}
		if (onAlways) {
			this.on('always', onAlways);
		}
		this.getImages();
		if ($) {
			// add jQuery Deferred object
			this.jqDeferred = new $.Deferred();
		}
		// HACK check async to allow time to bind listeners
		var _this = this;
		setTimeout(function() {
			_this.check();
		});
	}
	ImagesLoaded.prototype = new EventEmitter();
	ImagesLoaded.prototype.options = {};
	ImagesLoaded.prototype.getImages = function() {
		this.images = [];
		// filter & find items if we have an item selector
		for (var i = 0, len = this.elements.length; i < len; i++) {
			var elem = this.elements[i];
			// filter siblings
			if (elem.nodeName === 'IMG') {
				this.addImage(elem);
			}
			// find children
			// no non-element nodes, #143
			var nodeType = elem.nodeType;
			if (!nodeType || !(nodeType === 1 || nodeType === 9 || nodeType === 11)) {
				continue;
			}
			var childElems = elem.querySelectorAll('img');
			// concat childElems to filterFound array
			for (var j = 0, jLen = childElems.length; j < jLen; j++) {
				var img = childElems[j];
				this.addImage(img);
			}
		}
	};
	/**
	 * @param {Image} img
	 */
	ImagesLoaded.prototype.addImage = function(img) {
		var loadingImage = new LoadingImage(img);
		this.images.push(loadingImage);
	};
	ImagesLoaded.prototype.check = function() {
		var _this = this;
		var checkedCount = 0;
		var length = this.images.length;
		this.hasAnyBroken = false;
		// complete if no images
		if (!length) {
			this.complete();
			return;
		}

		function onConfirm(image, message) {
			if (_this.options.debug && hasConsole) {
				console.log('confirm', image, message);
			}
			_this.progress(image);
			checkedCount++;
			if (checkedCount === length) {
				_this.complete();
			}
			return true; // bind once
		}
		for (var i = 0; i < length; i++) {
			var loadingImage = this.images[i];
			loadingImage.on('confirm', onConfirm);
			loadingImage.check();
		}
	};
	ImagesLoaded.prototype.progress = function(image) {
		this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
		// HACK - Chrome triggers event before object properties have changed. #83
		var _this = this;
		setTimeout(function() {
			_this.emit('progress', _this, image);
			if (_this.jqDeferred && _this.jqDeferred.notify) {
				_this.jqDeferred.notify(_this, image);
			}
		});
	};
	ImagesLoaded.prototype.complete = function() {
		var eventName = this.hasAnyBroken ? 'fail' : 'done';
		this.isComplete = true;
		var _this = this;
		// HACK - another setTimeout so that confirm happens after progress
		setTimeout(function() {
			_this.emit(eventName, _this);
			_this.emit('always', _this);
			if (_this.jqDeferred) {
				var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
				_this.jqDeferred[jqMethod](_this);
			}
		});
	};

	// -------------------------- jquery -------------------------- //
	if ($) {
		$.fn.imagesLoaded = function(options, callback) {
			var instance = new ImagesLoaded(this, options, callback);
			return instance.jqDeferred.promise($(this));
		};
	}

	// --------------------------  -------------------------- //
	function LoadingImage(img) {
		this.img = img;
	}
	LoadingImage.prototype = new EventEmitter();
	LoadingImage.prototype.check = function() {
		// first check cached any previous images that have same src
		var resource = cache[this.img.src] || new Resource(this.img.src);
		if (resource.isConfirmed) {
			this.confirm(resource.isLoaded, 'cached was confirmed');
			return;
		}
		// If complete is true and browser supports natural sizes,
		// try to check for image status manually.
		if (this.img.complete && this.img.naturalWidth !== undefined) {
			// report based on naturalWidth
			this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
			return;
		}
		// If none of the checks above matched, simulate loading on detached element.
		var _this = this;
		resource.on('confirm', function(resrc, message) {
			_this.confirm(resrc.isLoaded, message);
			return true;
		});
		resource.check();
	};
	LoadingImage.prototype.confirm = function(isLoaded, message) {
		this.isLoaded = isLoaded;
		this.emit('confirm', this, message);
	};

	// -------------------------- Resource -------------------------- //
	// Resource checks each src, only once
	// separate class from LoadingImage to prevent memory leaks. See #115
	var cache = {};

	function Resource(src) {
		this.src = src;
		// add to cache
		cache[src] = this;
	}
	Resource.prototype = new EventEmitter();
	Resource.prototype.check = function() {
		// only trigger checking once
		if (this.isChecked) {
			return;
		}
		// simulate loading on detached element
		var proxyImage = new Image();
		eventie.bind(proxyImage, 'load', this);
		eventie.bind(proxyImage, 'error', this);
		proxyImage.src = this.src;
		// set flag
		this.isChecked = true;
	};

	// ----- events ----- //
	// trigger specified handler for event type
	Resource.prototype.handleEvent = function(event) {
		var method = 'on' + event.type;
		if (this[method]) {
			this[method](event);
		}
	};
	Resource.prototype.onload = function(event) {
		this.confirm(true, 'onload');
		this.unbindProxyEvents(event);
	};
	Resource.prototype.onerror = function(event) {
		this.confirm(false, 'onerror');
		this.unbindProxyEvents(event);
	};

	// ----- confirm ----- //
	Resource.prototype.confirm = function(isLoaded, message) {
		this.isConfirmed = true;
		this.isLoaded = isLoaded;
		this.emit('confirm', this, message);
	};
	Resource.prototype.unbindProxyEvents = function(event) {
		eventie.unbind(event.target, 'load', this);
		eventie.unbind(event.target, 'error', this);
	};

	// -----  ----- //
	return ImagesLoaded;

});


// smooth-scroll v7.0.2
// copyright Chris Ferdinandi | http://github.com/cferdinandi/smooth-scroll | Licensed under MIT: http://gomakethings.com/mit/
// --------------------------------------------------------------------------------------------------------------------------------------------------------
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.smoothScroll = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//

	var smoothScroll = {}; // Object for public APIs
	var supports = !!root.document.querySelector && !!root.addEventListener; // Feature test
	var settings, eventTimeout, fixedHeader, headerHeight;

	// Default settings
	var defaults = {
		speed: 500,
		easing: 'easeInOutCubic',
		offset: 0,
		updateURL: true,
		callback: function () {}
	};


	//
	// Methods
	//

	/**
	 * Merge two or more objects. Returns a new object.
	 * @private
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Get the height of an element.
	 * @private
	 * @param  {Node} elem The element to get the height of
	 * @return {Number}    The element's height in pixels
	 */
	var getHeight = function ( elem ) {
		return Math.max( elem.scrollHeight, elem.offsetHeight, elem.clientHeight );
	};

	/**
	 * Get the closest matching element up the DOM tree.
	 * @private
	 * @param  {Element} elem     Starting element
	 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
	 * @return {Boolean|Element}  Returns null if not match found
	 */
	var getClosest = function ( elem, selector ) {

		// Variables
		var firstChar = selector.charAt(0);
		var supports = 'classList' in document.documentElement;
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( firstChar === '[' ) {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split( '=' );

			if ( attribute.length > 1 ) {
				value = true;
				attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
			}
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {

			// If selector is a class
			if ( firstChar === '.' ) {
				if ( supports ) {
					if ( elem.classList.contains( selector.substr(1) ) ) {
						return elem;
					}
				} else {
					if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
						return elem;
					}
				}
			}

			// If selector is an ID
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}

			// If selector is a data attribute
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( attribute[0] ) ) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Escape special characters for use with querySelector
	 * @private
	 * @param {String} id The anchor ID to escape
	 * @author Mathias Bynens
	 * @link https://github.com/mathiasbynens/CSS.escape
	 */
	var escapeCharacters = function ( id ) {
		var string = String(id);
		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = '';
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);
			// Note: there’s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then throw an
			// `InvalidCharacterError` exception and terminate these steps.
			if (codeUnit === 0x0000) {
				throw new InvalidCharacterError(
					'Invalid character: the input contains U+0000.'
				);
			}

			if (
				// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
				// U+007F, […]
				(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
				// If the character is the first character and is in the range [0-9]
				// (U+0030 to U+0039), […]
				(index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				// If the character is the second character and is in the range [0-9]
				// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
				(
					index === 1 &&
					codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
					firstCodeUnit === 0x002D
				)
			) {
				// http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}

			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), […]
			if (
				codeUnit >= 0x0080 ||
				codeUnit === 0x002D ||
				codeUnit === 0x005F ||
				codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
				codeUnit >= 0x0041 && codeUnit <= 0x005A ||
				codeUnit >= 0x0061 && codeUnit <= 0x007A
			) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// http://dev.w3.org/csswg/cssom/#escape-a-character
			result += '\\' + string.charAt(index);

		}
		return result;
	};

	/**
	 * Calculate the easing pattern
	 * @private
	 * @link https://gist.github.com/gre/1650294
	 * @param {String} type Easing pattern
	 * @param {Number} time Time animation should take to complete
	 * @returns {Number}
	 */
	var easingPattern = function ( type, time ) {
		var pattern;
		if ( type === 'easeInQuad' ) pattern = time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuad' ) pattern = time * (2 - time); // decelerating to zero velocity
		if ( type === 'easeInOutQuad' ) pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
		if ( type === 'easeInCubic' ) pattern = time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutCubic' ) pattern = (--time) * time * time + 1; // decelerating to zero velocity
		if ( type === 'easeInOutCubic' ) pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
		if ( type === 'easeInQuart' ) pattern = time * time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuart' ) pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
		if ( type === 'easeInOutQuart' ) pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
		if ( type === 'easeInQuint' ) pattern = time * time * time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuint' ) pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
		if ( type === 'easeInOutQuint' ) pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
		return pattern || time; // no easing, no acceleration
	};

	/**
	 * Calculate how far to scroll
	 * @private
	 * @param {Element} anchor The anchor element to scroll to
	 * @param {Number} headerHeight Height of a fixed header, if any
	 * @param {Number} offset Number of pixels by which to offset scroll
	 * @returns {Number}
	 */
	var getEndLocation = function ( anchor, headerHeight, offset ) {
		var location = 0;
		if (anchor.offsetParent) {
			do {
				location += anchor.offsetTop;
				anchor = anchor.offsetParent;
			} while (anchor);
		}
		location = location - headerHeight - offset;
		return location >= 0 ? location : 0;
	};

	/**
	 * Determine the document's height
	 * @private
	 * @returns {Number}
	 */
	var getDocumentHeight = function () {
		return Math.max(
			root.document.body.scrollHeight, root.document.documentElement.scrollHeight,
			root.document.body.offsetHeight, root.document.documentElement.offsetHeight,
			root.document.body.clientHeight, root.document.documentElement.clientHeight
		);
	};

	/**
	 * Convert data-options attribute into an object of key/value pairs
	 * @private
	 * @param {String} options Link-specific options as a data attribute string
	 * @returns {Object}
	 */
	var getDataOptions = function ( options ) {
		return !options || !(typeof JSON === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse( options );
	};

	/**
	 * Update the URL
	 * @private
	 * @param {Element} anchor The element to scroll to
	 * @param {Boolean} url Whether or not to update the URL history
	 */
	var updateUrl = function ( anchor, url ) {
		if ( root.history.pushState && (url || url === 'true') ) {
			root.history.pushState( null, null, [root.location.protocol, '//', root.location.host, root.location.pathname, root.location.search, anchor].join('') );
		}
	};

	var getHeaderHeight = function ( header ) {
		return header === null ? 0 : ( getHeight( header ) + header.offsetTop );
	};

	/**
	 * Start/stop the scrolling animation
	 * @public
	 * @param {Element} toggle The element that toggled the scroll event
	 * @param {Element} anchor The element to scroll to
	 * @param {Object} options
	 */
	smoothScroll.animateScroll = function ( toggle, anchor, options ) {

		// Options and overrides
		var overrides = getDataOptions( toggle ? toggle.getAttribute('data-options') : null );
		var settings = extend( settings || defaults, options || {}, overrides ); // Merge user options with defaults
		anchor = '#' + escapeCharacters(anchor.substr(1)); // Escape special characters and leading numbers

		// Selectors and variables
		var anchorElem = anchor === '#' ? root.document.documentElement : root.document.querySelector(anchor);
		var startLocation = root.pageYOffset; // Current location on the page
		if ( !fixedHeader ) { fixedHeader = root.document.querySelector('[data-scroll-header]'); }  // Get the fixed header if not already set
		if ( !headerHeight ) { headerHeight = getHeaderHeight( fixedHeader ); } // Get the height of a fixed header if one exists and not already set
		var endLocation = getEndLocation( anchorElem, headerHeight, parseInt(settings.offset, 10) ); // Scroll to location
		var animationInterval; // interval timer
		var distance = endLocation - startLocation; // distance to travel
		var documentHeight = getDocumentHeight();
		var timeLapsed = 0;
		var percentage, position;

		// Update URL
		updateUrl(anchor, settings.updateURL);

		/**
		 * Stop the scroll animation when it reaches its target (or the bottom/top of page)
		 * @private
		 * @param {Number} position Current position on the page
		 * @param {Number} endLocation Scroll to location
		 * @param {Number} animationInterval How much to scroll on this loop
		 */
		var stopAnimateScroll = function (position, endLocation, animationInterval) {
			var currentLocation = root.pageYOffset;
			if ( position == endLocation || currentLocation == endLocation || ( (root.innerHeight + currentLocation) >= documentHeight ) ) {
				clearInterval(animationInterval);
				anchorElem.focus();
				settings.callback( toggle, anchor ); // Run callbacks after animation complete
			}
		};

		/**
		 * Loop scrolling animation
		 * @private
		 */
		var loopAnimateScroll = function () {
			timeLapsed += 16;
			percentage = ( timeLapsed / parseInt(settings.speed, 10) );
			percentage = ( percentage > 1 ) ? 1 : percentage;
			position = startLocation + ( distance * easingPattern(settings.easing, percentage) );
			root.scrollTo( 0, Math.floor(position) );
			stopAnimateScroll(position, endLocation, animationInterval);
		};

		/**
		 * Set interval timer
		 * @private
		 */
		var startAnimateScroll = function () {
			animationInterval = setInterval(loopAnimateScroll, 16);
		};

		/**
		 * Reset position to fix weird iOS bug
		 * @link https://github.com/cferdinandi/smooth-scroll/issues/45
		 */
		if ( root.pageYOffset === 0 ) {
			root.scrollTo( 0, 0 );
		}

		// Start scrolling animation
		startAnimateScroll();

	};

	/**
	 * If smooth scroll element clicked, animate scroll
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = getClosest(event.target, '[data-scroll]');
		if ( toggle && toggle.tagName.toLowerCase() === 'a' ) {
			event.preventDefault(); // Prevent default click event
			smoothScroll.animateScroll( toggle, toggle.hash, settings); // Animate scroll
		}
	};

	/**
	 * On window scroll and resize, only run events at a rate of 15fps for better performance
	 * @private
	 * @param  {Function} eventTimeout Timeout function
	 * @param  {Object} settings
	 */
	var eventThrottler = function (event) {
		if ( !eventTimeout ) {
			eventTimeout = setTimeout(function() {
				eventTimeout = null; // Reset timeout
				headerHeight = getHeaderHeight( fixedHeader ); // Get the height of a fixed header if one exists
			}, 66);
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	smoothScroll.destroy = function () {

		// If plugin isn't already initialized, stop
		if ( !settings ) return;

		// Remove event listeners
		root.document.removeEventListener( 'click', eventHandler, false );
		root.removeEventListener( 'resize', eventThrottler, false );

		// Reset varaibles
		settings = null;
		eventTimeout = null;
		fixedHeader = null;
		headerHeight = null;
	};

	/**
	 * Initialize Smooth Scroll
	 * @public
	 * @param {Object} options User settings
	 */
	smoothScroll.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		smoothScroll.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		fixedHeader = root.document.querySelector('[data-scroll-header]'); // Get the fixed header
		headerHeight = getHeaderHeight( fixedHeader );

		// When a toggle is clicked, run the click handler
		root.document.addEventListener('click', eventHandler, false );
		if ( fixedHeader ) { root.addEventListener( 'resize', eventThrottler, false ); }

	};


	//
	// Public APIs
	//

	return smoothScroll;

});