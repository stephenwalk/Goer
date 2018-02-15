package external;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.scribe.builder.ServiceBuilder;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;

import entity.Item;
import entity.Item.ItemBuilder;

public class YelpAPI implements ExternalAPI {
	private static final String API_HOST = "api.yelp.com";
	private static final String DEFAULT_TERM = "dinner";
	private static final int SEARCH_LIMIT = 20;
	private static final String SEARCH_PATH = "/v2/search";
	private static final String CONSUMER_KEY = "iQUaXx2moB0qppfScbgU7w";
	private static final String CONSUMER_SECRET = "A4JwFUlf9cNWcyqwCN-lx8bJX58";
	private static final String TOKEN = "LfNoJbgYX0B5bydn4RMGo5hviK2RgB5x";
	private static final String TOKEN_SECRET = "WNdPzYFGPEwB2utTiFe7VGd3poE";

	OAuthService service;
	Token accessToken;

	/**
	 * Setup the Yelp API OAuth credentials.
	 */
	public YelpAPI() {
		this.service = new ServiceBuilder().provider(TwoStepOAuth.class)
				.apiKey(CONSUMER_KEY).apiSecret(CONSUMER_SECRET).build();
		this.accessToken = new Token(TOKEN, TOKEN_SECRET);
	}

	/**
	 * Creates and sends a request to the Search API by term and location.
	 */
	public String searchForBusinessesByLocation(double lat, double lon, String term) {
		OAuthRequest request = new OAuthRequest(Verb.GET, "http://" + API_HOST
				+ SEARCH_PATH);
		if (term == null || term.length() == 0) {
			request.addQuerystringParameter("term", DEFAULT_TERM);
		} else {
			request.addQuerystringParameter("term", term.toLowerCase());
		}
		request.addQuerystringParameter("ll", lat + "," + lon);
		request.addQuerystringParameter("limit", String.valueOf(SEARCH_LIMIT));
		System.out.println(request);
		return sendRequestAndGetResponse(request);
	}

	/**
	 * Sends an {@link OAuthRequest} and returns the {@link Response} body.
	 */
	private String sendRequestAndGetResponse(OAuthRequest request) {
		System.out.println("Querying " + request.getCompleteUrl() + " ...");
		this.service.signRequest(this.accessToken, request);
		Response response = request.send();
		return response.getBody();
	}

	/**
	 * Queries the Search API based on the command line arguments and takes the
	 * first result to query the Business API.
	 */
	private static void queryAPI(YelpAPI yelpApi, double lat, double lon) {
		String searchResponseJSON = yelpApi.searchForBusinessesByLocation(lat,
				lon, DEFAULT_TERM);
		JSONObject response = null;
		try {
			response = new JSONObject(searchResponseJSON);
			JSONArray businesses = (JSONArray) response.get("businesses");
			for (int i = 0; i < businesses.length(); i++) {
				JSONObject business = (JSONObject) businesses.get(i);
				System.out.println(business);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Main entry for sample Yelp API requests.
	 */
	public static void main(String[] args) {
		YelpAPI yelpApi = new YelpAPI();
		queryAPI(yelpApi, 37.38, -122.08);
	}

	@Override
	public List<Item> search(double lat, double lon, String city, String term) {
		try {
			JSONObject response = new JSONObject(searchForBusinessesByLocation(lat, lon, term));
			JSONArray array = (JSONArray) response.get("businesses");
			return getItemList(array);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private List<Item> getItemList(JSONArray array) throws JSONException {
		List<Item> restaurantList = new ArrayList<>();
		for (int i = 0; i < array.length(); i++) {
			ItemBuilder builder = new ItemBuilder();
			JSONObject object = array.getJSONObject(i);
			JSONObject location = (JSONObject) object.get("location");
			JSONObject coordinate = (JSONObject) location.get("coordinate");
			builder.setItemId(getStringFieldOrNull(object, "id"));
			builder.setName(getStringFieldOrNull(object, "name"));
			builder.setCity(getStringFieldOrNull(location, "city"));
			builder.setState(getStringFieldOrNull(location, "state_code"));
			builder.setRating(getNumericFieldOrNull(object, "rating"));
			builder.setAddress(jsonArrayToString((JSONArray) location.get("display_address")));
			builder.setLatitude(getNumericFieldOrNull(coordinate, "latitude"));
			builder.setLongitude(getNumericFieldOrNull(coordinate, "longitude"));
			JSONArray jsonArray = (JSONArray) object.get("categories");
			Set<String> set = new HashSet<>();
			for (int j = 0; j < jsonArray.length(); j++) {
				JSONArray subArray = jsonArray.getJSONArray(j);
				for (int k = 0; k < subArray.length(); k++) {
					set.add(parseString(subArray.getString(k)));
				}
			}
			builder.setCategories(set);
			builder.setImageUrl(getStringFieldOrNull(object, "image_url"));
			builder.setUrl(getStringFieldOrNull(object, "url"));
			Item item = builder.build();
			restaurantList.add(item);
		}
		return restaurantList;
	}

	private String getStringFieldOrNull(JSONObject event, String field) throws JSONException {
		return event.isNull(field) ? null : event.getString(field);
	}

	private double getNumericFieldOrNull(JSONObject event, String field) throws JSONException {
		return event.isNull(field) ? 0.0 : event.getDouble(field);
	}

	public static String parseString(String str) {
		return str.replace("\"", "\\\"").replace("/", " or ");
	}

	private static String jsonArrayToString(JSONArray array) {
		StringBuilder sb = new StringBuilder();
		try {
			for (int i = 0; i < array.length(); i++) {
				String obj = (String) array.get(i);
				sb.append(obj);
				if (i != array.length() - 1) {
					sb.append(",");
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return sb.toString();
	}

}
