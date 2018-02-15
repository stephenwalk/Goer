(function() {

	/**
	 * Variables
	 */
	var user_id       = '';
	var user_fullname = '';
	//var user_id = '1111';
	var lng = 0;
	var lat = 0;
	var city = "";
	var region = "";
	var category = "restaurant";
	var service = "nearby";
	var addressFlag = false;
	var emailFlag = false;
	var phoneFlag = false;
	var titleFlag = false;

	/**
	 * Initialize
	 */
	function init() {
		// Register event listeners
		$('register-selection').addEventListener('click', registerSelection);
		$('login-selection').addEventListener('click', loginSelection);
		$('register-btn').addEventListener('click', register);
		$('login-btn').addEventListener('click', login);
		$('restaurant-btn').addEventListener('click', restaurant);
		$('place-btn').addEventListener('click', place);
		$('event-btn').addEventListener('click', event);
		$('news-btn').addEventListener('click', news);
		$('nearby-btn').addEventListener('click', nearby);
		$('search-btn').addEventListener('click', search);
		$('searchsubmit-btn').addEventListener('click', searchsubmit);
		$('fav-btn').addEventListener('click', favorite);
		$('recommend-btn').addEventListener('click', recommend);
		$('footerTitle').addEventListener('click', changeTitle);
		$('myAddress').addEventListener('click', changeAddress);
		$('myEmail').addEventListener('click', changeEmail);
		$('myPhone').addEventListener('click', changePhone);
		validateSession();
		//initGeoLocation();
	}

	/**
	 * Selection function: register or login
	 */
	function registerSelection(){
		var btn1 = $('login-selection');
		// active the one that has id = btnId
		var btn2 = $('register-selection');
		btn1.className = btn1.className.replace(/\bactive\b/g, '');
		btn2.className += ' active';
		var registerForm = $('register-form');
		var loginForm = $('login-form');
		showElement(registerForm);
		hideElement(loginForm);
		clearRegistrationError();
	}
	function loginSelection(){
		var btn1 = $('register-selection');
		// active the one that has id = btnId
		var btn2 = $('login-selection');
		btn1.className = btn1.className.replace(/\bactive\b/g, '');
		btn2.className += ' active';
		var registerForm = $('register-form');
		var loginForm = $('login-form');
		showElement(loginForm);
		hideElement(registerForm);
		clearLoginError();
	}

	/**
	 * listener functions
	 */
	function restaurant() {
		category = "restaurant";
		var btn1 = $('place-btn');
		btn1.className = btn1.className.replace(/\bactive\b/g, '');
		var btn2 = $('event-btn');
		btn2.className = btn2.className.replace(/\bactive\b/g, '');
		var btn3 = $('news-btn');
		btn3.className = btn3.className.replace(/\bactive\b/g, '');
		// active the one that has id = btnId
		var btn4 = $('restaurant-btn');
		btn4.className += ' active';
		var btn5 = $('restaurant-cutlery');
		var btn6 = $('place-building');
		var btn7 = $('event-futbol');
		var btn8 = $('news-newspaper');//news
		btn5.className += ' fa-spin';
		btn6.className = btn6.className.replace(/\bfa-spin\b/g, '');
		btn7.className = btn7.className.replace(/\bfa-spin\b/g, '');
		btn8.className = btn8.className.replace(/\bfa-spin\b/g, '');
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
	
	function place() {
		category = "place";
		var btn1 = $('restaurant-btn');
		btn1.className = btn1.className.replace(/\bactive\b/g, '');
		var btn2 = $('news-btn');
		btn2.className = btn2.className.replace(/\bactive\b/g, '');
		var btn3 = $('event-btn');
		btn3.className = btn3.className.replace(/\bactive\b/g, '');
		// active the one that has id = btnId
		var btn4 = $('place-btn');
		btn4.className += ' active';
		var btn5 = $('place-building');
		var btn6 = $('restaurant-cutlery');
		var btn7 = $('news-newspaper'); // news
		var btn8 = $('event-futbol');
		btn5.className += ' fa-spin';
		btn6.className = btn6.className.replace(/\bfa-spin\b/g, '');
		btn7.className = btn7.className.replace(/\bfa-spin\b/g, '');
		btn8.className = btn8.className.replace(/\bfa-spin\b/g, '');
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
	function event() {
		category = "event";
		var btn1 = $('restaurant-btn');
		btn1.className = btn1.className.replace(/\bactive\b/g, '');
		var btn2 = $('place-btn');
		btn2.className = btn2.className.replace(/\bactive\b/g, '');
		var btn3 = $('news-btn');
		btn3.className = btn3.className.replace(/\bactive\b/g, '');
		// active the one that has id = btnId
		var btn4 = $('event-btn');
		btn4.className += ' active';
		var btn5 = $('event-futbol');
		var btn6 = $('place-building');
		var btn7 = $('restaurant-cutlery');
		var btn8 = $('news-newspaper'); // news
		btn5.className += ' fa-spin';
		btn6.className = btn6.className.replace(/\bfa-spin\b/g, '');
		btn7.className = btn7.className.replace(/\bfa-spin\b/g, '');
		btn8.className = btn8.className.replace(/\bfa-spin\b/g, '');
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
	function news() {
		category = "new";
		var btn1 = $('restaurant-btn');
		btn1.className = btn1.className.replace(/\bactive\b/g, '');
		var btn2 = $('place-btn');
		btn2.className = btn2.className.replace(/\bactive\b/g, '');
		var btn3 = $('event-btn');
		btn3.className = btn3.className.replace(/\bactive\b/g, '');
		// active the one that has id = btnId
		var btn4 = $('news-btn');
		btn4.className += ' active';
		var btn5 = $('news-newspaper'); // news
		var btn6 = $('restaurant-cutlery');
		var btn7 = $('place-building');
		var btn8 = $('event-futbol');
		btn5.className += ' fa-spin';
		btn6.className = btn6.className.replace(/\bfa-spin\b/g, '');
		btn7.className = btn7.className.replace(/\bfa-spin\b/g, '');
		btn8.className = btn8.className.replace(/\bfa-spin\b/g, '');
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
		loadNearbyItems();
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
		var term = $('searchterm').value;
		if (term) {
			loadSearchItems();
		}
	}

	function favorite() {
		service = "favorite";
		loadFavoriteItems();
	}
	
	function recommend() {
		service = "recommend";
		loadRecommendedItems();
	}
	
	function changeTitle() {
		var footerTitle = $('footerTitle');
		titleFlag = !titleFlag;
		footerTitle.innerHTML = titleFlag ? "Help you find the best restaurant, place, event & news around." : "<i class='fa fa-star fa-lg'></i> All Goer Does";
	}
	
	function changeAddress() {
		var myAddress = $('myAddress');
		addressFlag = !addressFlag;
		myAddress.innerHTML = addressFlag ? "2352 Oak Flat Rd, San Jose, CA, 95131" : "<i class='fa fa-map-marker fa-2x'></i><span class='footerSpan'>my address</span>";
	}
	
	function changeEmail() {
		var myEmail = $('myEmail');
		emailFlag = !emailFlag;
		myEmail.innerHTML = emailFlag ? "tianfengyep@gmail.com" : "<i class='fa fa-envelope-o fa-2x'></i><span class='footerSpan'>my email</span>";
	}
	
	function changePhone() {
		var myPhone = $('myPhone');
		phoneFlag = !phoneFlag;
		myPhone.innerHTML = phoneFlag ? "1.213.400.9607" : "<i class='fa fa-phone fa-2x'></i><span class='footerSpan'>my phone</span>";
	}
	
	//-----------------------------------
	//	Session and initialize location
	//-----------------------------------
	
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
		var welcomeMsg1 = $('welcome-msg1');
		var welcomeMsg2 = $('welcome-msg2');
		var goer = $('goer');
		var copyright = $('section-copyright');
		goer.style.marginRight = '2px';
		var logoutBtn = $('logout-link');
		var selection = $('selection');
		welcomeMsg1.innerHTML = 'Welcome to';
		welcomeMsg2.innerHTML = user_fullname;
		showElement(bar);
		showElement(itemNav);
		showElement(itemList);
		showElement(avatar);
		showElement(welcomeMsg1);
		showElement(welcomeMsg2);
		showElement(logoutBtn, 'inline-block');
		hideElement(form);
		hideElement(selection);
		hideElement(copyright);
		initGeoLocation();
	}

	function onSessionInvalid() {
		var form = $('form');
		var bar = $('nav-bar');
		var itemNav = $('item-nav');
		var itemList = $('item-list');
		var avatar = $('avatar');
		var welcomeMsg1 = $('welcome-msg1');
		var welcomeMsg2 = $('welcome-msg2');
		var logoutBtn = $('logout-link');
		var registerForm = $('register-form');
		var loginForm = $('login-form');
		var selection = $('selection');
		var copyright = $('section-copyright');
		
		hideElement(bar);
		hideElement(itemNav);
		hideElement(itemList);
		hideElement(avatar);
		hideElement(logoutBtn);
		hideElement(welcomeMsg1);
		hideElement(welcomeMsg2);

		showElement(form);
		showElement(selection);
		showElement(copyright);
	}
	function initGeoLocation() {
		getLocationFromIP();
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
			if ('loc' in result && 'city' in result) {
				var loc = result.loc.split(',');
				lat = loc[0];
				lng = loc[1];
				city = result.city;
				region = result.region;
			} else {
				console.warn('Getting location by IP failed.');
			}
			nearby();
		});
	}

	//-----------------------------------
	//	Register or Login
	//-----------------------------------

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
	// AJAX call server-side APIs for items
	// -------------------------------------

	/**
	 * API #1 Load the nearby items API end point: [GET]
	 * /recommendation/search?user_id=1111&lat=37.38&lon=-122.08
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
		var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng + '&city=' + city + '&category=' + category;
		var req = JSON.stringify({});

		// display loading message
		switch (category) {
		case "restaurant": 
			showLoadingMessage('Loading nearby restaurants...');
			break;
		case "place":
			showLoadingMessage('Loading nearby places...');
			break;
		case "event":
			showLoadingMessage('Loading nearby events...');
			break;
		case "new":
			showLoadingMessage('Loading nearby news...');
			break;
		}

		// make AJAX call
		ajax('GET', url + '?' + params, req,
				// successful callback
				function(res) {
			var items = JSON.parse(res);
			if (!items || items.length === 0) {
				switch (category) {
				case "restaurant": 
					showWarningMessage('No nearby restaurant.');
					break;
				case "place":
					showWarningMessage('No nearby place.');
					break;
				case "event":
					showWarningMessage('No nearby event.');
					break;
				case "new":
					showWarningMessage('No nearby news.');
					break;
				}
			} else {
				listItems(items);
			}
		},
		// failed callback
		function() {
			switch (category) {
			case "restaurant": 
				showErrorMessage('Cannot load nearby restaurants.');
				break;
			case "place":
				showErrorMessage('Cannot load nearby places.');
				break;
			case "event":
				showErrorMessage('Cannot load nearby events.');
				break;
			case "new":
				showErrorMessage('Cannot load nearby news.');
				break;
			}
		});
	}

	/**
	 * API #2 Load the search items API end point: [GET]
	 * /recommendation/search?user_id=1111&lat=37.38&lon=-122.08
	 */
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
		var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng + '&city=' + city + '&term=' + term + '&category=' + category;
		var req = JSON.stringify({});

		// display loading message
		switch (category) {
		case "restaurant": 
			showLoadingMessage('Loading search restaurants...');
			break;
		case "place":
			showLoadingMessage('Loading search places...');
			break;
		case "event":
			showLoadingMessage('Loading search events...');
			break;
		case "new":
			showLoadingMessage('Loading search news...');
			break;
		}

		// make AJAX call
		ajax('GET', url + '?' + params, req,
				// successful callback
				function(res) {
			var items = JSON.parse(res);
			if (!items || items.length === 0) {
				switch (category) {
				case "restaurant": 
					showWarningMessage('No search restaurant.');
					break;
				case "place":
					showWarningMessage('No search place.');
					break;
				case "event":
					showWarningMessage('No search event.');
					break;
				case "new":
					loadRegionNews(term);
					break;
				}
			} else {
				listItems(items);
			}
		},
		// failed callback
		function() {
			switch (category) {
			case "restaurant": 
				showErrorMessage('Cannot load search restaurants.');
				break;
			case "place":
				showErrorMessage('Cannot load search places.');
				break;
			case "event":
				showErrorMessage('Cannot load search events.');
				break;
			case "new":
				showErrorMessage('Cannot load search news.');
				break;
			}
		});
	}
	function loadRegionNews(term) {
		city = region;
		// The request parameters
		var url = './search';
		var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng + '&city=' + city + '&term=' + term + '&category=' + category;
		var req = JSON.stringify({});
		// make AJAX call
		ajax('GET', url + '?' + params, req,
				// successful callback
				function(res) {
			var items = JSON.parse(res);
			if (!items || items.length === 0) {
				showWarningMessage('No nearby news.');
			} else {
				listItems(items);
			}
		},
		// failed callback
		function() {
			showErrorMessage('Cannot load nearby news.');
		});
	}

	/**
	 * API #3 Load favorite (or visited) items API end point: [GET]
	 * /recommendation/history?user_id=1111
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
		switch (category) {
		case "restaurant": 
			showLoadingMessage('Loading favorite restaurants...');
			break;
		case "place":
			showLoadingMessage('Loading favorite places...');
			break;
		case "event":
			showLoadingMessage('Loading favorite events...');
			break;
		case "new":
			showLoadingMessage('Loading favorite news...');
			break;
		}

		// make AJAX call
		ajax('GET', url + '?' + params, req, function(res) {
			var items = JSON.parse(res);
			if (!items || items.length === 0) {
				switch (category) {
				case "restaurant": 
					showWarningMessage('No favorite restaurant.');
					break;
				case "place":
					showWarningMessage('No favorite place.');
					break;
				case "event":
					showWarningMessage('No favorite event.');
					break;
				case "new":
					showWarningMessage('No favorite news.');
					break;
				}
			} else {
				listItems(items);
			}
		}, function() {
			switch (category) {
			case "restaurant": 
				showErrorMessage('Cannot load favorite restaurants.');
				break;
			case "place":
				showErrorMessage('Cannot load favorite places.');
				break;
			case "event":
				showErrorMessage('Cannot load favorite events.');
				break;
			case "new":
				showErrorMessage('Cannot load favorite news.');
				break;
			}
		});
	}

	/**
	 * API #4 Load recommended items API end point: [GET]
	 * /recommendation/recommendation?user_id=1111
	 */
	function loadRecommendedItems() {
		activeBtn('recommend-btn');

		var searchbar = $('search-bar');
		var itemList = $('item-list');
		hideElement(searchbar);
		showElement(itemList);
		// The request parameters
		var url = './recommendation';
		var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng + '&city=' + city + '&category=' + category;

		var req = JSON.stringify({});

		// display loading message
		switch (category) {
		case "restaurant": 
			showLoadingMessage('Loading recommended restaurants...');
			break;
		case "place":
			showLoadingMessage('Loading recommended places...');
			break;
		case "event":
			showLoadingMessage('Loading recommended events...');
			break;
		case "new":
			showLoadingMessage('Loading recommended news...');
			break;
		}

		// make AJAX call
		ajax(
				'GET',
				url + '?' + params,
				req,
				// successful callback
				function(res) {
					var items = JSON.parse(res);
					if (!items || items.length === 0) {
						switch (category) {
						case "restaurant": 
							showWarningMessage('No recommended restaurant. Make sure you have favorites.');
							break;
						case "place":
							showWarningMessage('No recommended place. Make sure you have favorites.');
							break;
						case "event":
							showWarningMessage('No recommended event. Make sure you have favorites.');
							break;
						case "new":
							showWarningMessage('No recommended news. Make sure you have favorites.');
							break;
						}
					} else {
						listItems(items);
					}
				},
				// failed callback
				function() {
					switch (category) {
					case "restaurant": 
						showErrorMessage('Cannot load recommended restaurants.');
						break;
					case "place":
						showErrorMessage('Cannot load recommended places.');
						break;
					case "event":
						showErrorMessage('Cannot load recommended events.');
						break;
					case "new":
						showErrorMessage('Cannot load recommended news.');
						break;
					}
				});
	}

	/**
	 * API #5 Toggle favorite (or visited) items
	 * 
	 * @param item_id -
	 *            The item business id
	 * 
	 * API end point: [POST]/[DELETE] /recommendation/history request json data: {
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
				favIcon.className = favorite ? 'fa fa-heart fa-stack-1x' : 'fa fa-heart-o fa-stack-1x';
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
			switch (category) {
			case "restaurant": 
				addRestaurant(itemList, items[i]);
				break;
			case "place":
				addPlace(itemList, items[i]);
				break;
			case "event":
				addItem(itemList, items[i]);
				break;
			case "new":
				addNews(itemList, items[i]);
				break;
			}
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
				src : item.image_url,
				className: 'eventImage'
			}));
		} else {
			li.appendChild($('img', {
				src : 'scripts/goer.jpg',
				className: 'eventImage'
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

		// description
		if (item.description) {
			var description = $('p', {
				className : 'item-description'
			});
			var text = "";
			if (item.description.length < 150 ) {
				text = item.description;
			} else {
				text = item.description.substring(0,150) + "...";
			}
			description.innerHTML = 'Info: ' + text;
			section.appendChild(description);
		}
		
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

		// section
		var section1 = $('div', {});
		// favorite link
		var favLink = $('p', {className : 'fav-link'});

		favLink.onclick = function() {
			changeFavoriteItem(item_id);
		};

		var hoverSpan0 = $('span', {className: 'tooltiptext', id: 'itemFav'});
		var textnode0 = document.createTextNode("Mark/unmark the event as favorite");  
		hoverSpan0.appendChild(textnode0);
		var favIcon = $('span', {className: 'fa-stack fa-1x'});
		favIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		favIcon.appendChild($('i', {
			id: 'fav-icon-' + item_id,
			className: item.favorite ? 'fa fa-heart fa-stack-1x' : 'fa fa-heart-o fa-stack-1x'
		}));
		favLink.appendChild(favIcon);
		favIcon.appendChild(hoverSpan0);
		section1.appendChild(favLink);

		var shareTwitter = $('p', {className: 'share-link'});
		var twitterLink = document.createElement('a');
		var hoverSpan1 = $('span', {className: 'tooltiptext', id: 'twitterFav'});
		var textnode1 = document.createTextNode("Tweet on Twitter");  
		hoverSpan1.appendChild(textnode1);
		var content = "Check out " + item.name.replace(/&/g, '%26') + " on @TicketMaster " + item.url;
		twitterLink.setAttribute('href', "https://twitter.com/intent/tweet?text=" + content);
		var twitterIcon = $('span', {className: 'fa-stack fa-1x'});
		twitterIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		twitterIcon.appendChild($('i', {className: 'fa fa-twitter fa-stack-1x'}));
		twitterLink.appendChild(twitterIcon);
		shareTwitter.appendChild(twitterLink);
		twitterIcon.appendChild(hoverSpan1);
		section1.appendChild(shareTwitter);
		
		li.appendChild(section1);
		
		var section2 = $('div', {});
		
		var shareGoogle = $('p', {className: 'share-link'});
		shareGoogle.onclick = function () {
			shareToGoogle(item);
		};
		var googleIcon = $('span', {className: 'fa-stack fa-1x'});
		googleIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		googleIcon.appendChild($('i', {className: 'fa fa-google-plus fa-stack-1x'}));
		shareGoogle.appendChild(googleIcon);
		var hoverSpan2 = $('span', {className: 'tooltiptext'});
		var textnode2 = document.createTextNode("Share on Google+");  
		hoverSpan2.appendChild(textnode2);
		googleIcon.appendChild(hoverSpan2);
		section2.appendChild(shareGoogle);
		
		var sharePinterest = $('p', {className: 'share-link'});
		sharePinterest.onclick = function () {
			shareToPinterest(item);
		};
		var pinterestIcon = $('span', {className: 'fa-stack fa-1x'});
		pinterestIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		pinterestIcon.appendChild($('i', {className: 'fa fa-pinterest-p fa-stack-1x'}));
		sharePinterest.appendChild(pinterestIcon);
		var hoverSpan3 = $('span', {className: 'tooltiptext', id: 'pinterestFav'});
		var textnode3 = document.createTextNode("Pin on Pinterest");  
		hoverSpan3.appendChild(textnode3);
		pinterestIcon.appendChild(hoverSpan3);
		section2.appendChild(sharePinterest);
		
		li.appendChild(section2);
		
		var section3 = $('div', {});
		
		var shareFB = $('p', {className: 'share-link'});
		shareFB.onclick = function () {
			shareToFB(item);
		};
		var FBIcon = $('span', {className: 'fa-stack fa-1x'});
		FBIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		FBIcon.appendChild($('i', {className: 'fa fa-facebook fa-stack-1x'}));
		var hoverSpan4 = $('span', {className: 'tooltiptext', id: 'fbFav'});
		var textnode4 = document.createTextNode("Share on Facebook");  
		hoverSpan4.appendChild(textnode4);
		shareFB.appendChild(FBIcon);
		FBIcon.appendChild(hoverSpan4);
		section3.appendChild(shareFB);
		
		var shareWB = $('p', {className: 'share-link'});
		var WBIcon = $('span', {className: 'fa-stack fa-1x'});
		WBIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		WBIcon.appendChild($('i', {className: 'fa fa-weibo fa-stack-1x'}));
		shareWB.appendChild(WBIcon);
		shareWB.addEventListener('click', shareToWB.bind(item));
		var hoverSpan5 = $('span', {className: 'tooltiptext', id: 'wbFav'});
		var textnode5 = document.createTextNode("Share on Weibo");  
		hoverSpan5.appendChild(textnode5);
		WBIcon.appendChild(hoverSpan5);
		section3.appendChild(shareWB);
		
		
		li.appendChild(section3);
		
		itemList.appendChild(li);
	}

	/**
	 * Add news to the list
	 * 
	 * @param itemList -
	 *            The
	 *            <ul id="item-list">
	 *            tag
	 * @param item -
	 *            The item data (JSON object)
	 */
	function addNews(itemList, item) {
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
				src : item.image_url,
				className: 'newsImage'
			}));
		} else {
			li.appendChild($('img', {
				src : 'scripts/goer.jpg',
				className: 'newsImage'
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

		// description
		var description = $('p', {
			className : 'item-description'
		});
		description.innerHTML = 'Snippet: ' + item.description;
		section.appendChild(description);
		
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
		var address = $('p', {className: 'item-address'});
		address.innerHTML = item.byline.replace(/,|;/g, '<br/>').replace(/and/g, '&<br/>') + '<br/>' + item.date + '<br/>' + item.city;
		li.appendChild(address);

		// section
		var section1 = $('div', {});
		// favorite link
		var favLink = $('p', {className : 'fav-link'});

		favLink.onclick = function() {
			changeFavoriteItem(item_id);
		};

		var hoverSpan0 = $('span', {className: 'tooltiptext', id: 'itemFav'});
		var textnode0 = document.createTextNode("Mark/unmark the news as favorite");  
		hoverSpan0.appendChild(textnode0);
		var favIcon = $('span', {className: 'fa-stack fa-1x'});
		favIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		favIcon.appendChild($('i', {
			id: 'fav-icon-' + item_id,
			className: item.favorite ? 'fa fa-heart fa-stack-1x' : 'fa fa-heart-o fa-stack-1x'
		}));
		favLink.appendChild(favIcon);
		favIcon.appendChild(hoverSpan0);
		section1.appendChild(favLink);

		var shareTwitter = $('p', {className: 'share-link'});
		var twitterLink = document.createElement('a');
		var hoverSpan1 = $('span', {className: 'tooltiptext', id: 'twitterFav'});
		var textnode1 = document.createTextNode("Tweet on Twitter");  
		hoverSpan1.appendChild(textnode1);
		var content = "Check out " + item.name.replace(/&/g, '%26') + " on @NewYorkTimes " + item.url;
		twitterLink.setAttribute('href', "https://twitter.com/intent/tweet?text=" + content);
		var twitterIcon = $('span', {className: 'fa-stack fa-1x'});
		twitterIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		twitterIcon.appendChild($('i', {className: 'fa fa-twitter fa-stack-1x'}));
		twitterLink.appendChild(twitterIcon);
		shareTwitter.appendChild(twitterLink);
		twitterIcon.appendChild(hoverSpan1);
		section1.appendChild(shareTwitter);
		
		li.appendChild(section1);
		
		var section2 = $('div', {});
		
		var shareGoogle = $('p', {className: 'share-link'});
		shareGoogle.onclick = function () {
			shareToGoogle(item);
		};
		var googleIcon = $('span', {className: 'fa-stack fa-1x'});
		googleIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		googleIcon.appendChild($('i', {className: 'fa fa-google-plus fa-stack-1x'}));
		shareGoogle.appendChild(googleIcon);
		var hoverSpan2 = $('span', {className: 'tooltiptext'});
		var textnode2 = document.createTextNode("Share on Google+");  
		hoverSpan2.appendChild(textnode2);
		googleIcon.appendChild(hoverSpan2);
		section2.appendChild(shareGoogle);
		
		var sharePinterest = $('p', {className: 'share-link'});
		sharePinterest.onclick = function () {
			shareToPinterest(item);
		};
		var pinterestIcon = $('span', {className: 'fa-stack fa-1x'});
		pinterestIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		pinterestIcon.appendChild($('i', {className: 'fa fa-pinterest-p fa-stack-1x'}));
		sharePinterest.appendChild(pinterestIcon);
		var hoverSpan3 = $('span', {className: 'tooltiptext', id: 'pinterestFav'});
		var textnode3 = document.createTextNode("Pin on Pinterest");  
		hoverSpan3.appendChild(textnode3);
		pinterestIcon.appendChild(hoverSpan3);
		section2.appendChild(sharePinterest);
		
		li.appendChild(section2);
		
		var section3 = $('div', {});
		
		var shareFB = $('p', {className: 'share-link'});
		shareFB.onclick = function () {
			shareToFB(item);
		};
		var FBIcon = $('span', {className: 'fa-stack fa-1x'});
		FBIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		FBIcon.appendChild($('i', {className: 'fa fa-facebook fa-stack-1x'}));
		var hoverSpan4 = $('span', {className: 'tooltiptext', id: 'fbFav'});
		var textnode4 = document.createTextNode("Share on Facebook");  
		hoverSpan4.appendChild(textnode4);
		shareFB.appendChild(FBIcon);
		FBIcon.appendChild(hoverSpan4);
		section3.appendChild(shareFB);
		
		var shareWB = $('p', {className: 'share-link'});
		var WBIcon = $('span', {className: 'fa-stack fa-1x'});
		WBIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		WBIcon.appendChild($('i', {className: 'fa fa-weibo fa-stack-1x'}));
		shareWB.appendChild(WBIcon);
		shareWB.addEventListener('click', shareToWB.bind(item));
		var hoverSpan5 = $('span', {className: 'tooltiptext', id: 'wbFav'});
		var textnode5 = document.createTextNode("Share on Weibo");  
		hoverSpan5.appendChild(textnode5);
		WBIcon.appendChild(hoverSpan5);
		section3.appendChild(shareWB);
		
		
		li.appendChild(section3);
		
		itemList.appendChild(li);
	}

	/**
	 * Add restaurant to the list
	 * 
	 * @param restaurantList - The <ul id="restaurant-list"> tag
	 * @param restaurant - The restaurant data (JSON object)
	 */
	function addRestaurant(restaurantList, restaurant) {
		var business_id = restaurant.item_id;

		// create the <li> tag and specify the id and class attributes
		var li = $('li', {
			id: 'item-' + business_id,
			className: 'item'
		});

		// set the data attribute
		li.dataset.item_id = business_id;
		li.dataset.favorite = restaurant.favorite;

		// restaurant image
		li.appendChild($('img', {src: restaurant.image_url, className: 'restaurantImage'}));

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
		for (var i = 0; i < restaurant.rating; i++) {
			var star = $('i', {className: 'fa fa-star'});
			stars.appendChild(star);
		}

		if (('' + restaurant.rating).match(/\.5$/)) {
			stars.appendChild($('i', {className: 'fa fa-star-half-o'}));
		}

		section.appendChild(stars);

		li.appendChild(section);

		// address
		var address = $('p', {className: 'item-address'});

		address.innerHTML = restaurant.address.replace(/,/g, '<br/>');
		li.appendChild(address);

		// section
		var section1 = $('div', {});
		// favorite link
		var favLink = $('p', {className: 'fav-link'});

		favLink.onclick = function () {
			changeFavoriteItem(business_id);
		};
		var hoverSpan0 = $('span', {className: 'tooltiptext', id: 'restaurantFav'});
		var textnode0 = document.createTextNode("Mark/unmark the restaurant as favorite");  
		hoverSpan0.appendChild(textnode0);
		var favIcon = $('span', {className: 'fa-stack fa-1x'});
		favIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		favIcon.appendChild($('i', {
			id: 'fav-icon-' + business_id,
			className: restaurant.favorite ? 'fa fa-heart fa-stack-1x' : 'fa fa-heart-o fa-stack-1x'
		}));
		favIcon.appendChild(hoverSpan0);
		favLink.appendChild(favIcon);
		section1.appendChild(favLink);

		var shareTwitter = $('p', {className: 'share-link'});
		var twitterLink = document.createElement('a');
		var hoverSpan1 = $('span', {className: 'tooltiptext', id: 'twitterFav'});
		var textnode1 = document.createTextNode("Tweet on Twitter");  
		hoverSpan1.appendChild(textnode1);
		var content = "Check out " + restaurant.name.replace(/&/g, '%26') + " on @Yelp " + restaurant.url;
		twitterLink.setAttribute('href', "https://twitter.com/intent/tweet?text=" + content);
		var twitterIcon = $('span', {className: 'fa-stack fa-1x'});
		twitterIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		twitterIcon.appendChild($('i', {className: 'fa fa-twitter fa-stack-1x'}));
		twitterLink.appendChild(twitterIcon);
		shareTwitter.appendChild(twitterLink);
		twitterIcon.appendChild(hoverSpan1);
		section1.appendChild(shareTwitter);
		
		li.appendChild(section1);

		var section2 = $('div', {});
		
		var shareGoogle = $('p', {className: 'share-link'});
		shareGoogle.onclick = function () {
			shareToGoogle(restaurant);
		};
		var googleIcon = $('span', {className: 'fa-stack fa-1x'});
		googleIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		googleIcon.appendChild($('i', {className: 'fa fa-google-plus fa-stack-1x'}));
		shareGoogle.appendChild(googleIcon);
		var hoverSpan2 = $('span', {className: 'tooltiptext'});
		var textnode2 = document.createTextNode("Share on Google+");  
		hoverSpan2.appendChild(textnode2);
		googleIcon.appendChild(hoverSpan2);
		section2.appendChild(shareGoogle);
		
		var sharePinterest = $('p', {className: 'share-link'});
		sharePinterest.onclick = function () {
			shareToPinterest(restaurant);
		};
		var pinterestIcon = $('span', {className: 'fa-stack fa-1x'});
		pinterestIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		pinterestIcon.appendChild($('i', {className: 'fa fa-pinterest-p fa-stack-1x'}));
		sharePinterest.appendChild(pinterestIcon);
		var hoverSpan3 = $('span', {className: 'tooltiptext', id: 'pinterestFav'});
		var textnode3 = document.createTextNode("Pin on Pinterest");  
		hoverSpan3.appendChild(textnode3);
		pinterestIcon.appendChild(hoverSpan3);
		section2.appendChild(sharePinterest);
		
		li.appendChild(section2);
		
		var section3 = $('div', {});
		
		var shareFB = $('p', {className: 'share-link'});
		shareFB.onclick = function () {
			shareToFB(restaurant);
		};
		var FBIcon = $('span', {className: 'fa-stack fa-1x'});
		FBIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		FBIcon.appendChild($('i', {className: 'fa fa-facebook fa-stack-1x'}));
		var hoverSpan4 = $('span', {className: 'tooltiptext', id: 'fbFav'});
		var textnode4 = document.createTextNode("Share on Facebook");  
		hoverSpan4.appendChild(textnode4);
		shareFB.appendChild(FBIcon);
		FBIcon.appendChild(hoverSpan4);
		section3.appendChild(shareFB);
		
		var shareWB = $('p', {className: 'share-link'});
		var WBIcon = $('span', {className: 'fa-stack fa-1x'});
		WBIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		WBIcon.appendChild($('i', {className: 'fa fa-weibo fa-stack-1x'}));
		shareWB.appendChild(WBIcon);
		shareWB.addEventListener('click', shareToWB.bind(restaurant));
		var hoverSpan5 = $('span', {className: 'tooltiptext', id: 'wbFav'});
		var textnode5 = document.createTextNode("Share on Weibo");  
		hoverSpan5.appendChild(textnode5);
		WBIcon.appendChild(hoverSpan5);
		section3.appendChild(shareWB);
		
		li.appendChild(section3);
		
		restaurantList.appendChild(li);
	}
	
	/**
	 * Add place to the list
	 * 
	 * @param placeList - The <ul id="item-list"> tag
	 * @param place - The place data (JSON object)
	 */
	function addPlace(placeList, place) {
		var place_id = place.item_id;

		// create the <li> tag and specify the id and class attributes
		var li = $('li', {
			id: 'item-' + place_id,
			className: 'item'
		});

		// set the data attribute
		li.dataset.item_id = place_id;
		li.dataset.favorite = place.favorite;

		// restaurant image
		li.appendChild($('img', {src: place.image_url, className: 'placeImage'}));

		// section
		var section = $('div', {});

		// title
		var title = $('a', {href: place.url, target: '_blank', className: 'item-name'});
		title.innerHTML = place.name;
		section.appendChild(title);

		// category
		var category = $('p', {className: 'item-category'});
		var categoryArray = place.categories.join(', ').split(';');
		category.innerHTML = 'Category: ' + categoryArray[1];
		section.appendChild(category);

		// open, close and description
		var open = $('p', {
			className : 'item-open'
		});
		var close = $('p', {
			className : 'item-close'
		});
		var description = $('p', {
			className : 'item-description'
		});
		if (place.description) {
			var token = place.description.split(',');
			if (token[0] === "Open") {
				open.innerHTML = token[0];
				section.appendChild(open);
			} else {
				close.innerHTML = token[0];
				section.appendChild(close);
			}
			description.innerHTML = token[1];
			section.appendChild(description);
		}
		
		// stars
		var stars = $('div', {className: 'stars'});
		for (var i = 0; i < place.rating; i++) {
			var star = $('i', {className: 'fa fa-star'});
			stars.appendChild(star);
		}

		if (('' + place.rating).match(/\.5$/)) {
			stars.appendChild($('i', {className: 'fa fa-star-half-o'}));
		}

		section.appendChild(stars);

		li.appendChild(section);

		// address
		var address = $('p', {className: 'item-address'});

		address.innerHTML = place.address.replace(/,/g, '<br/>');
		li.appendChild(address);

		// section
		var section1 = $('div', {});
		// favorite link
		var favLink = $('p', {className: 'fav-link'});

		favLink.onclick = function () {
			changeFavoriteItem(place_id);
		};
		var hoverSpan0 = $('span', {className: 'tooltiptext', id: 'restaurantFav'});
		var textnode0 = document.createTextNode("Mark/unmark the place as favorite");  
		hoverSpan0.appendChild(textnode0);
		var favIcon = $('span', {className: 'fa-stack fa-1x'});
		favIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		favIcon.appendChild($('i', {
			id: 'fav-icon-' + place_id,
			className: place.favorite ? 'fa fa-heart fa-stack-1x' : 'fa fa-heart-o fa-stack-1x'
		}));
		favIcon.appendChild(hoverSpan0);
		favLink.appendChild(favIcon);
		section1.appendChild(favLink);

		var shareTwitter = $('p', {className: 'share-link'});
		var twitterLink = document.createElement('a');
		var hoverSpan1 = $('span', {className: 'tooltiptext', id: 'twitterFav'});
		var textnode1 = document.createTextNode("Tweet on Twitter");  
		hoverSpan1.appendChild(textnode1);
		var content = "Check out " + place.name.replace(/&/g, '%26') + " on @Here " + place.url;
		twitterLink.setAttribute('href', "https://twitter.com/intent/tweet?text=" + content);
		var twitterIcon = $('span', {className: 'fa-stack fa-1x'});
		twitterIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		twitterIcon.appendChild($('i', {className: 'fa fa-twitter fa-stack-1x'}));
		twitterLink.appendChild(twitterIcon);
		shareTwitter.appendChild(twitterLink);
		twitterIcon.appendChild(hoverSpan1);
		section1.appendChild(shareTwitter);
		
		li.appendChild(section1);

		var section2 = $('div', {});
		
		var shareGoogle = $('p', {className: 'share-link'});
		shareGoogle.onclick = function () {
			shareToGoogle(place);
		};
		var googleIcon = $('span', {className: 'fa-stack fa-1x'});
		googleIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		googleIcon.appendChild($('i', {className: 'fa fa-google-plus fa-stack-1x'}));
		shareGoogle.appendChild(googleIcon);
		var hoverSpan2 = $('span', {className: 'tooltiptext'});
		var textnode2 = document.createTextNode("Share on Google+");  
		hoverSpan2.appendChild(textnode2);
		googleIcon.appendChild(hoverSpan2);
		section2.appendChild(shareGoogle);
		
		var sharePinterest = $('p', {className: 'share-link'});
		sharePinterest.onclick = function () {
			shareToPinterest(place);
		};
		var pinterestIcon = $('span', {className: 'fa-stack fa-1x'});
		pinterestIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		pinterestIcon.appendChild($('i', {className: 'fa fa-pinterest-p fa-stack-1x'}));
		sharePinterest.appendChild(pinterestIcon);
		var hoverSpan3 = $('span', {className: 'tooltiptext', id: 'pinterestFav'});
		var textnode3 = document.createTextNode("Pin on Pinterest");  
		hoverSpan3.appendChild(textnode3);
		pinterestIcon.appendChild(hoverSpan3);
		section2.appendChild(sharePinterest);
		
		li.appendChild(section2);
		
		var section3 = $('div', {});
		
		var shareFB = $('p', {className: 'share-link'});
		shareFB.onclick = function () {
			shareToFB(place);
		};
		var FBIcon = $('span', {className: 'fa-stack fa-1x'});
		FBIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		FBIcon.appendChild($('i', {className: 'fa fa-facebook fa-stack-1x'}));
		var hoverSpan4 = $('span', {className: 'tooltiptext', id: 'fbFav'});
		var textnode4 = document.createTextNode("Share on Facebook");  
		hoverSpan4.appendChild(textnode4);
		shareFB.appendChild(FBIcon);
		FBIcon.appendChild(hoverSpan4);
		section3.appendChild(shareFB);
		
		var shareWB = $('p', {className: 'share-link'});
		var WBIcon = $('span', {className: 'fa-stack fa-1x'});
		WBIcon.appendChild($('i', {className: 'fa fa-circle-thin fa-stack-2x'}));
		WBIcon.appendChild($('i', {className: 'fa fa-weibo fa-stack-1x'}));
		shareWB.appendChild(WBIcon);
		shareWB.addEventListener('click', shareToWB.bind(place));
		var hoverSpan5 = $('span', {className: 'tooltiptext', id: 'wbFav'});
		var textnode5 = document.createTextNode("Share on Weibo");  
		hoverSpan5.appendChild(textnode5);
		WBIcon.appendChild(hoverSpan5);
		section3.appendChild(shareWB);
		
		li.appendChild(section3);
		
		placeList.appendChild(li);
	}
	
	// -------------------------------------
	// share to social functions
	// -------------------------------------

	/**
	 * Google API
	 */
	function shareToGoogle(object) {
		var url = object.url;
		window.open('https://plus.google.com/share?url=' + url + '&hl=en', '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
		return false;
	}
	
	/**
	 * Facebook API
	 */
	window.fbAsyncInit = function() {
		FB.init({
			appId            : '1519469044768396',
			autoLogAppEvents : true,
			xfbml            : true,
			version          : 'v2.11'
		});
	};

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "https://connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	function shareToFB(object) {
		if (category === 'event') {
			var obj = {
					method:'share',
					href: object.url,
					quote: 'Check out ' + object.name + ' on @TicketMaster ' + object.url,
			};
		} else if (category === 'restaurant') {
			var obj = {
					method:'share',
					href: object.image_url,
					quote: 'Check out ' + object.name + ' on @Yelp ' + object.url,
			};
		} else if (category === 'new') {
			var obj = {
					method:'share',
					href: object.image_url,
					quote: 'Check out ' + object.name + ' on @NewYorkTimes ' + object.url,
			};
		} else {
			var obj = {
					method:'share',
					href: object.image_url,
					quote: 'Check out ' + object.name + ' on @Here ' + object.url,
			};
		}
		function responseFB(response) {
			if (response&&!response.error_message) {
				alert('Posted Successfully');
			} else {
				alert("Post failed");
			}
		}
		FB.ui(obj, responseFB);
	}

	/**
	 * Twitter API
	 */
	window.twttr = (function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0],
		t = window.twttr || {};
		if (d.getElementById(id)) return;
		js = d.createElement(s);
		js.id = id;
		js.src = "https://platform.twitter.com/widgets.js";
		fjs.parentNode.insertBefore(js, fjs);

		t._e = [];
		t.ready = function(f) {
			t._e.push(f);
		};
		return t;
	}(document, "script", "twitter-wjs"));

	function tweetIntentToAnalytics (intentEvent) {
		if (!intentEvent) return;
		var label = "tweet";
		pageTracker._trackEvent(
				'twitter_web_intents',
				intentEvent.type,
				label
		);
	}
	
	/**
	 * Pinterest API
	 */
    function shareToPinterest(object) {
    	if (category === 'event') {
    		var content = 'Check out ' + object.name.replace(/&/g, '%26') + ' on @TicketMaster ' + object.url;
    	} else if (category === 'restaurant') {
    		var content = 'Check out ' + object.name.replace(/&/g, '%26') + ' on @Yelp ' + object.url;
    	} else if (category === 'new') {
    		var content = 'Check out ' + object.name.replace(/&/g, '%26') + ' on @NewYorkTimes ' + object.url;
    	} else {
    		var content = 'Check out ' + object.name.replace(/&/g, '%26') + ' on @Here ' + object.url;
    	}
    	var href = 'http://pinterest.com/pin/create/button/?url=' + object.url + '&media=' + object.image_url + '&description=' + content;
    	window.open(href, 'pinterestwindow','left=20,top=20,width=600,height=700,toolbar=0,resizable=1');
    	return false;
    }
    
	/**
	 * Weibo API
	 */
	function shareToWB() {
		var appkey = '2809942181';
		if (category === 'event') {
			var title  = 'Check out ' + this.name.replace(/&/g, '%26') + ' on @TicketMaster ' + this.url;
		} else if (category === 'restaurant') {
			var title  = 'Check out ' + this.name.replace(/&/g, '%26') + ' on @Yelp ' + this.url;
		} else if (category === 'new') {
			var title  = 'Check out ' + this.name.replace(/&/g, '%26') + ' on @NewYorkTimes ' + this.url;
		} else {
			var title  = 'Check out ' + this.name.replace(/&/g, '%26') + ' on @Here ' + this.url;
		}
		var url    = document.location.href + '?utm_source=sinaWeibo&utm_medium=sharingBtn&utm_campaign=blog';
		var style  = '&searchPic=false&style=simple';
		var pic = style + '&pic=' + this.image_url;
		window.open('http://service.weibo.com/share/share.php?appkey='+appkey+'&title='+encodeURIComponent(title)+'&url='+encodeURIComponent(url)+pic,'_blank','toolbar=0,status=0,resizable=1,scrollbars=yes,status=1,width=440,height=430,left='+(screen.width-440)/2+',top='+(screen.height-430)/2);
	}
	
	init();

})();

//END
