(function() {

	/**
	 * Variables
	 */
	var user_id       = '';
	var user_fullname = '';
	//var user_id = '1111';
	var lng = -122.08;
	var lat = 37.38;
	var category = "restaurant";
	var service = "nearby";

	/**
	 * Initialize
	 */
	function init() {
		// Register event listeners
		$('register-btn').addEventListener('click', register);
		$('login-btn').addEventListener('click', login);
		$('restaurant-btn').addEventListener('click', restaurant);
		$('event-btn').addEventListener('click', event);
		$('nearby-btn').addEventListener('click', nearby);
		$('search-btn').addEventListener('click', search);
		$('searchsubmit-btn').addEventListener('click', searchsubmit);
		$('fav-btn').addEventListener('click', favorite);
		$('recommend-btn').addEventListener('click', recommend);
		validateSession();
		//initGeoLocation();
	}

	function restaurant() {
		category = "restaurant";
		var btn1 = $('event-btn');
		btn1.className = btn1.className.replace(/\bactive\b/, '');
		// active the one that has id = btnId
		var btn2 = $('restaurant-btn');
		btn2.className += ' active';
		if (service === "nearby") {
			loadNearbyRestaurants();
		} else if (service === "search") {
			search();
		} else if (service === "favorite") {
			loadFavoriteRestaurants();
		} else {
			loadRecommendedRestaurants();
		}
	}
	function event() {
		category = "event";
		var btn1 = $('restaurant-btn');
		btn1.className = btn1.className.replace(/\bactive\b/, '');
		// active the one that has id = btnId
		var btn2 = $('event-btn');
		btn2.className += ' active';
		if (service === "nearby") {
			loadNearbyItems();
		} else if (service === "search") {
			search();
		} else if (service === "favorite") {
			loadFavoriteItems();
		} else {
			loadRecommendedItems();
		}
	}

	function nearby() {
		service = "nearby";
		if (category === 'event') {
			loadNearbyItems();
		} else {
			loadNearbyRestaurants();
		}
	}

	function search() {
		service = "search";
		activeBtn('search-btn');
		var searchbar = $('search-bar');
		var itemList = $('item-list');
		$('searchterm').value = "";  
		showElement(searchbar);
		hideElement(itemList);
	}

	function searchsubmit() {
		service = "search";
		activeBtn('search-btn');
		if (category === 'event') {
			loadSearchItems();
		} else {
			loadSearchRestaurants();
		}
	}

	function favorite() {
		service = "favorite";
		if (category === 'event') {
			loadFavoriteItems();
		} else {
			loadFavoriteRestaurants();
		}
	}
	function recommend() {
		service = "recommend";
		if (category === 'event') {
			loadRecommendedItems();
		} else {
			loadRecommendedRestaurants();
		}
	}

	function validateSession() {
		// The request parameters
		var url = './LoginServlet';
		var req = JSON.stringify({});

		// display loading message
		showLoadingMessage('Validating session...');

		// make AJAX call
		ajax('GET', url, req,
				// session is still valid
				function (res) {
			var result = JSON.parse(res);

			if (result.status === 'OK') {
				onSessionValid(result);
			}
		}
		);
	}

	function onSessionValid(result) {
		user_id = result.user_id;
		user_fullname = result.name;

		var form = $('form');
		var bar = $('nav-bar');
		var itemNav = $('item-nav');
		var itemList = $('item-list');
		var avatar = $('avatar');
		var welcomeMsg = $('welcome-msg');
		var logoutBtn = $('logout-link');

		welcomeMsg.innerHTML = '<i class="fa fa-smile-o"></i> Welcome, ' + user_fullname;
		showElement(bar);
		showElement(itemNav);
		showElement(itemList);
		showElement(avatar);
		showElement(welcomeMsg);
		showElement(logoutBtn, 'inline-block');
		hideElement(form);

		initGeoLocation();
	}

	function onSessionInvalid() {
		var form = $('form');
		var bar = $('nav-bar');
		var itemNav = $('item-nav');
		var itemList = $('item-list');
		var avatar = $('avatar');
		var welcomeMsg = $('welcome-msg');
		var logoutBtn = $('logout-link');

		hideElement(bar);
		hideElement(itemNav);
		hideElement(itemList);
		hideElement(avatar);
		hideElement(logoutBtn);
		hideElement(welcomeMsg);

		showElement(form);
	}
	function initGeoLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(onPositionUpdated,
					onLoadPositionFailed, {
				maximumAge : 60000
			});
			showLoadingMessage('Retrieving your location...');
		} else {
			onLoadPositionFailed();
		}
	}

	function onPositionUpdated(position) {
		lat = position.coords.latitude;
		lng = position.coords.longitude;

		nearby();
	}

	function onLoadPositionFailed() {
		console.warn('navigator.geolocation is not available');
		getLocationFromIP();
	}

	function getLocationFromIP() {
		// Get location from http://ipinfo.io/json
		var url = 'http://ipinfo.io/json'
			var req = null;
		ajax('GET', url, req, function(res) {
			var result = JSON.parse(res);
			if ('loc' in result) {
				var loc = result.loc.split(',');
				lat = loc[0];
				lng = loc[1];
			} else {
				console.warn('Getting location by IP failed.');
			}
			nearby();
		});
	}

	//-----------------------------------
	//	Login
	//	-----------------------------------

	function register() {
		var username = $('registername').value;
		var password = $('registerpassword').value;
		var repassword = $('re-password').value;
		if (password === repassword) {
			var firstname = $('firstname').value;
			var lastname = $('lastname').value;
			if (firstname && lastname) {

				password = md5(username + md5(password));

				//The request parameters
				var url = './RegisterServlet';
				var params = 'user_id=' + username + '&password=' + password + '&first_name=' + firstname + '&last_name=' + lastname;
				var req = JSON.stringify({});

				ajax('POST', url + '?' + params, req,
						// successful callback
						function (res) {
					var result = JSON.parse(res);

					// successfully logged in
					if (result.status === 'OK') {
						onSessionValid(result);
					}
				},
				// error
				function () {
					showRegistrationError();
				}
				);
			} else {
				$('register-error').innerHTML = '<i class="fa fa-exclamation-circle"></i> Name required';
				return;
			}
		} else {
			$('register-error').innerHTML = '<i class="fa fa-exclamation-circle"></i> Password does not match';
			return;
		}
	}

	function showRegistrationError() {
		$('register-error').innerHTML = '<i class="fa fa-exclamation-circle"></i> User already exists';
	}

	function clearRegistrationError() {
		$('register-error').innerHTML = '';
	}

	function login() {
		var username = $('username').value;
		var password = $('password').value;
		password = md5(username + md5(password));

		//The request parameters
		var url = './LoginServlet';
		var params = 'user_id=' + username + '&password=' + password;
		var req = JSON.stringify({});

		ajax('POST', url + '?' + params, req,
				// successful callback
				function (res) {
			var result = JSON.parse(res);

			// successfully logged in
			if (result.status === 'OK') {
				onSessionValid(result);
			}
		},
		// error
		function () {
			showLoginError();
		}
		);
	}

	function showLoginError() {
		$('login-error').innerHTML = '<i class="fa fa-exclamation-circle"></i> Invalid username or password';
	}

	function clearLoginError() {
		$('login-error').innerHTML = '';
	}

	// -----------------------------------
	// Helper Functions
	// -----------------------------------

	/**
	 * A helper function that makes a navigation button active
	 * 
	 * @param btnId -
	 *            The id of the navigation button
	 */
	function activeBtn(btnId) {
		var btns = document.getElementsByClassName('main-nav-btn');

		// deactivate all navigation buttons
		for (var i = 0; i < btns.length; i++) {
			btns[i].className = btns[i].className.replace(/\bactive\b/, '');
		}

		// active the one that has id = btnId
		var btn = $(btnId);
		btn.className += ' active';
	}

	function showLoadingMessage(msg) {
		var itemList = $('item-list');
		itemList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i> '
			+ msg + '</p>';
	}

	function showWarningMessage(msg) {
		var itemList = $('item-list');
		itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i> '
			+ msg + '</p>';
	}

	function showErrorMessage(msg) {
		var itemList = $('item-list');
		itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-circle"></i> '
			+ msg + '</p>';
	}

	/**
	 * A helper function that creates a DOM element <tag options...>
	 * 
	 * @param tag
	 * @param options
	 * @returns
	 */
	function $(tag, options) {
		if (!options) {
			return document.getElementById(tag);
		}

		var element = document.createElement(tag);

		for ( var option in options) {
			if (options.hasOwnProperty(option)) {
				element[option] = options[option];
			}
		}

		return element;
	}
	function hideElement(element) {
		element.style.display = 'none';
	}

	function showElement(element, style) {
		var displayStyle = style ? style : 'block';
		element.style.display = displayStyle;
	}
	/**
	 * AJAX helper
	 * 
	 * @param method -
	 *            GET|POST|PUT|DELETE
	 * @param url -
	 *            API end point
	 * @param callback -
	 *            This the successful callback
	 * @param errorHandler -
	 *            This is the failed callback
	 */
	function ajax(method, url, data, callback, errorHandler) {
		var xhr = new XMLHttpRequest();

		xhr.open(method, url, true);

		xhr.onload = function() {
			switch (xhr.status) {
			case 200:
				callback(xhr.responseText);
				break;
			case 403:
				onSessionInvalid();
				break;
			case 401:
				errorHandler();
				break;
			}
		};

		xhr.onerror = function() {
			console.error("The request couldn't be completed.");
			errorHandler();
		};

		if (data === null) {
			xhr.send();
		} else {
			xhr.setRequestHeader("Content-Type",
			"application/json;charset=utf-8");
			xhr.send(data);
		}
	}

	// -------------------------------------
	// AJAX call server-side APIs
	// -------------------------------------

	/**
	 * API #1 Load the nearby items API end point: [GET]
	 * /Recommendation/search?user_id=1111&lat=37.38&lon=-122.08
	 */
	function loadNearbyItems() {
		console.log('loadNearbyItems');
		activeBtn('nearby-btn');

		var searchbar = $('search-bar');
		var itemList = $('item-list');
		hideElement(searchbar);
		showElement(itemList);
		// The request parameters
		var url = './search';
		var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng + '&category=' + category;
		var req = JSON.stringify({});

		// display loading message
		showLoadingMessage('Loading nearby events...');

		// make AJAX call
		ajax('GET', url + '?' + params, req,
				// successful callback
				function(res) {
			var items = JSON.parse(res);
			if (!items || items.length === 0) {
				showWarningMessage('No nearby event.');
			} else {
				listItems(items);
			}
		},
		// failed callback
		function() {
			showErrorMessage('Cannot load nearby events.');
		});
	}

	function loadSearchItems() {
		console.log('loadSearchItems');
		activeBtn('search-btn');

		var searchbar = $('search-bar');
		var itemList = $('item-list');
		hideElement(searchbar);
		showElement(itemList);
		// The request parameters
		var term = $('searchterm').value;
		var url = './search';
		var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng + '&term=' + term + '&category=' + category;
		var req = JSON.stringify({});

		// display loading message
		showLoadingMessage('Loading search events...');

		// make AJAX call
		ajax('GET', url + '?' + params, req,
				// successful callback
				function(res) {
			var items = JSON.parse(res);
			if (!items || items.length === 0) {
				showWarningMessage('No search event.');
			} else {
				listItems(items);
			}
		},
		// failed callback
		function() {
			showErrorMessage('Cannot load search events.');
		});
	}

	/**
	 * API #2 Load favorite (or visited) items API end point: [GET]
	 * /Recommendation/history?user_id=1111
	 */
	function loadFavoriteItems() {
		activeBtn('fav-btn');

		var searchbar = $('search-bar');
		var itemList = $('item-list');
		hideElement(searchbar);
		showElement(itemList);
		// The request parameters
		var url = './history';
		var params = 'user_id=' + user_id + '&category=' + category;
		var req = JSON.stringify({});

		// display loading message
		showLoadingMessage('Loading favorite events...');

		// make AJAX call
		ajax('GET', url + '?' + params, req, function(res) {
			var items = JSON.parse(res);
			if (!items || items.length === 0) {
				showWarningMessage('No favorite event.');
			} else {
				listItems(items);
			}
		}, function() {
			showErrorMessage('Cannot load favorite events.');
		});
	}

	/**
	 * API #3 Load recommended items API end point: [GET]
	 * /Recommendation/recommendation?user_id=1111
	 */
	function loadRecommendedItems() {
		activeBtn('recommend-btn');

		var searchbar = $('search-bar');
		var itemList = $('item-list');
		hideElement(searchbar);
		showElement(itemList);
		// The request parameters
		var url = './recommendation';
		var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng + '&category=' + category;

		var req = JSON.stringify({});

		// display loading message
		showLoadingMessage('Loading recommended events...');

		// make AJAX call
		ajax(
				'GET',
				url + '?' + params,
				req,
				// successful callback
				function(res) {
					var items = JSON.parse(res);
					if (!items || items.length === 0) {
						showWarningMessage('No recommended event. Make sure you have favorites.');
					} else {
						listItems(items);
					}
				},
				// failed callback
				function() {
					showErrorMessage('Cannot load recommended events.');
				});
	}

	/**
	 * API #4 Toggle favorite (or visited) items
	 * 
	 * @param item_id -
	 *            The item business id
	 * 
	 * API end point: [POST]/[DELETE] /Recommendation/history request json data: {
	 * user_id: 1111, visited: [a_list_of_business_ids] }
	 */
	function changeFavoriteItem(item_id) {
		// Check whether this item has been visited or not
		var li = $('item-' + item_id);
		var favIcon = $('fav-icon-' + item_id);
		var favorite = li.dataset.favorite !== 'true';

		// The request parameters
		var url = './history';
		var params = 'user_id=' + user_id + '&category=' + category;

		var req = JSON.stringify({
			user_id : user_id,
			favorite : [ item_id ],
		});
		var method = favorite ? 'POST' : 'DELETE';

		ajax(method, url + '?' + params, req,
				// successful callback
				function(res) {
			var result = JSON.parse(res);
			if (result.result === 'SUCCESS') {
				li.dataset.favorite = favorite;
				favIcon.className = favorite ? 'fa fa-heart' : 'fa fa-heart-o';
			}
		});
	}

	// -------------------------------------
	// Create item list
	// -------------------------------------

	/**
	 * List items
	 * 
	 * @param items -
	 *            An array of item JSON objects
	 */
	function listItems(items) {
		// Clear the current results
		var itemList = $('item-list');
		itemList.innerHTML = '';

		for (var i = 0; i < items.length; i++) {
			addItem(itemList, items[i]);
		}
	}

	/**
	 * Add item to the list
	 * 
	 * @param itemList -
	 *            The
	 *            <ul id="item-list">
	 *            tag
	 * @param item -
	 *            The item data (JSON object)
	 */
	function addItem(itemList, item) {
		var item_id = item.item_id;

		// create the <li> tag and specify the id and class attributes
		var li = $('li', {
			id : 'item-' + item_id,
			className : 'item'
		});

		// set the data attribute
		li.dataset.item_id = item_id;
		li.dataset.favorite = item.favorite;

		// item image
		if (item.image_url) {
			li.appendChild($('img', {
				src : item.image_url
			}));
		} else {
			li.appendChild($('img', {
				src : 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png'
			}))
		}
		// section
		var section = $('div', {});

		// title
		var title = $('a', {
			href : item.url,
			target : '_blank',
			className : 'item-name'
		});
		title.innerHTML = item.name;
		section.appendChild(title);

		// category
		var category = $('p', {
			className : 'item-category'
		});
		category.innerHTML = 'Category: ' + item.categories.join(', ');
		section.appendChild(category);

		var stars = $('div', {
			className : 'stars'
		});

		for (var i = 0; i < item.rating; i++) {
			var star = $('i', {
				className : 'fa fa-star'
			});
			stars.appendChild(star);
		}

		if (('' + item.rating).match(/\.5$/)) {
			stars.appendChild($('i', {
				className : 'fa fa-star-half-o'
			}));
		}

		section.appendChild(stars);

		li.appendChild(section);

		// address
		var address = $('p', {
			className : 'item-address'
		});

		address.innerHTML = item.address.replace(/,/g, '<br/>').replace(/\"/g,
		'') + '<br/>' + item.city.replace(/,/g, '<br/>').replace(/\"/g,
		'') + '<br/>' + item.state.replace(/,/g, '<br/>').replace(/\"/g,
		'') + ' ' + item.zipcode.replace(/,/g, '<br/>').replace(/\"/g,
		'');
		li.appendChild(address);

		// favorite link
		var favLink = $('p', {
			className : 'fav-link'
		});

		favLink.onclick = function() {
			changeFavoriteItem(item_id);
		};

		favLink.appendChild($('i', {
			id : 'fav-icon-' + item_id,
			className : item.favorite ? 'fa fa-heart' : 'fa fa-heart-o'
		}));

		li.appendChild(favLink);

		itemList.appendChild(li);
	}


	// -------------------------------------
//	AJAX call server-side APIs
//	-------------------------------------

	/**
	 * API #1
	 * Load the nearby restaurants
	 * API end point: [GET] /Recommendation/restaurants?user_id=1111&lat=37.38&lon=-122.08
	 */
	function loadNearbyRestaurants() {
		console.log('loadNearbyRestaurants');
		activeBtn('nearby-btn');

		var searchbar = $('search-bar');
		var itemList = $('item-list');
		hideElement(searchbar);
		showElement(itemList);
		// The request parameters
		var url = './search';
		var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng + '&category=' + category; 
		var req = JSON.stringify({});

		// display loading message
		showLoadingMessage('Loading nearby restaurants...');

		// make AJAX call
		ajax('GET', url + '?' + params, req, 
				// successful callback
				function (res) {
			var restaurants = JSON.parse(res);
			if (!restaurants || restaurants.length === 0) {
				showWarningMessage('No nearby restaurant.');
			} else {
				listRestaurants(restaurants);
			}
		},
		// failed callback
		function () {
			showErrorMessage('Cannot load nearby restaurants.');
		}  
		);
	}

	function loadSearchRestaurants() {
		console.log('loadSearchRestaurants');
		activeBtn('search-btn');

		var searchbar = $('search-bar');
		var itemList = $('item-list');
		hideElement(searchbar);
		showElement(itemList);
		// The request parameters
		var term = $('searchterm').value;
		var url = './search';
		var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng + '&term=' + term + '&category=' + category; 
		var req = JSON.stringify({});

		// display loading message
		showLoadingMessage('Loading search restaurants...');

		// make AJAX call
		ajax('GET', url + '?' + params, req, 
				// successful callback
				function (res) {
			var restaurants = JSON.parse(res);
			if (!restaurants || restaurants.length === 0) {
				showWarningMessage('No search restaurant.');
			} else {
				listRestaurants(restaurants);
			}
		},
		// failed callback
		function () {
			showErrorMessage('Cannot load search restaurants.');
		}  
		);
	}


	/**
	 * API #2
	 * Load favorite (or visited) restaurants
	 * API end point: [GET] /Recommendation/history?user_id=1111
	 */
	function loadFavoriteRestaurants(event) {
		activeBtn('fav-btn');

		var searchbar = $('search-bar');
		var itemList = $('item-list');
		hideElement(searchbar);
		showElement(itemList);
		// The request parameters
		var url = './history';
		var params = 'user_id=' + user_id + '&category=' + category;
		var req = JSON.stringify({});

		// display loading message
		showLoadingMessage('Loading favorite restaurants...');

		// make AJAX call
		ajax('GET', url + '?' + params, req, 
				function (res) {
			var restaurants = JSON.parse(res);
			if (!restaurants || restaurants.length === 0) {
				showWarningMessage('No favorite restaurant.');
			} else {
				listRestaurants(restaurants);
			}
		},
		function () {
			showErrorMessage('Cannot load favorite restaurants.');
		}  
		);
	}

	/**
	 * API #3
	 * Load recommended restaurants
	 * API end point: [GET] /Recommendation/recommendation?user_id=1111
	 */
	function loadRecommendedRestaurants() {
		activeBtn('recommend-btn');

		var searchbar = $('search-bar');
		var itemList = $('item-list');
		hideElement(searchbar);
		showElement(itemList);
		// The request parameters
		var url = './recommendation';
		var params = 'user_id=' + user_id + '&category=' + category;
		var req = JSON.stringify({});

		// display loading message
		showLoadingMessage('Loading recommended restaurants...');

		// make AJAX call
		ajax('GET', url + '?' + params, req,
				// successful callback
				function (res) {
			var restaurants = JSON.parse(res);
			if (!restaurants || restaurants.length === 0) {
				showWarningMessage('No recommended restaurant. Make sure you have favorites.');
			} else {
				listRestaurants(restaurants);
			}
		},
		// failed callback
		function () {
			showErrorMessage('Cannot load recommended restaurants.');
		} 
		);
	}

	/**
	 * API #4
	 * Toggle favorite (or visited) restaurants
	 * 
	 * @param business_id - The restaurant business id
	 * 
	 * API end point: [POST]/[DELETE] /Recommendation/history
	 * request json data: { user_id: 1111, visited: [a_list_of_business_ids] }
	 */
	function changeFavoriteRestaurant(business_id) {
		// Check whether this restaurant has been visited or not
		var li = $('item-' + business_id);
		var favIcon = $('fav-icon-' + business_id);
		var isVisited = li.dataset.visited !== 'true';

		// The request parameters
		var url = './history';
		var params = 'category=' + category;
		var req = JSON.stringify({
			user_id: user_id,
			visited: [business_id],
		});
		var method = isVisited ? 'POST' : 'DELETE';

		ajax(method, url + '?' + params, req,
				// successful callback
				function (res) {
			var result = JSON.parse(res);
			if (result.status === 'OK') {
				li.dataset.visited = isVisited;
				favIcon.className = isVisited ? 'fa fa-heart' : 'fa fa-heart-o';
			}
		}
		);
	}

//	-------------------------------------
//	Create restaurant list
//	-------------------------------------

	/**
	 * List restaurants
	 * 
	 * @param restaurants - An array of restaurant JSON objects
	 */
	function listRestaurants(restaurants) {
		// Clear the current results
		var restaurantList = $('item-list');
		restaurantList.innerHTML = '';

		for (var i = 0; i < restaurants.length; i++) {
			addRestaurant(restaurantList, restaurants[i]);
		}
	}

	/**
	 * Add restaurant to the list
	 * 
	 * @param restaurantList - The <ul id="restaurant-list"> tag
	 * @param restaurant - The restaurant data (JSON object)
	 */
	function addRestaurant(restaurantList, restaurant) {
		var business_id = restaurant.business_id;

		// create the <li> tag and specify the id and class attributes
		var li = $('li', {
			id: 'item-' + business_id,
			className: 'item'
		});

		// set the data attribute
		li.dataset.business = business_id;
		li.dataset.visited = restaurant.is_visited;

		// restaurant image
		li.appendChild($('img', {src: restaurant.image_url}));

		// section
		var section = $('div', {});

		// title
		var title = $('a', {href: restaurant.url, target: '_blank', className: 'item-name'});
		title.innerHTML = restaurant.name;
		section.appendChild(title);

		// category
		var category = $('p', {className: 'item-category'});
		category.innerHTML = 'Category: ' + restaurant.categories.join(', ');
		section.appendChild(category);

		// stars
		var stars = $('div', {className: 'stars'});
		for (var i = 0; i < restaurant.stars; i++) {
			var star = $('i', {className: 'fa fa-star'});
			stars.appendChild(star);
		}

		if (('' + restaurant.stars).match(/\.5$/)) {
			stars.appendChild($('i', {className: 'fa fa-star-half-o'}));
		}

		section.appendChild(stars);

		li.appendChild(section);

		// address
		var address = $('p', {className: 'item-address'});

		address.innerHTML = restaurant.full_address.replace(/,/g, '<br/>');
		li.appendChild(address);

		// favorite link
		var favLink = $('p', {className: 'fav-link'});

		favLink.onclick = function () {
			changeFavoriteRestaurant(business_id);
		};

		favLink.appendChild($('i', {
			id: 'fav-icon-' + business_id,
			className: restaurant.is_visited ? 'fa fa-heart' : 'fa fa-heart-o'
		}));

		li.appendChild(favLink);

		restaurantList.appendChild(li);
	}


	init();

})();

//END
