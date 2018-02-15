package external;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import entity.Item;
import entity.Item.ItemBuilder;

public class HereAPI implements ExternalAPI {
	private static final String API_HOST = "places.cit.api.here.com";
	private static final String SEARCH_PATH = "/places/v1/discover";
	private static final String APP_ID = "GYHhpl6oEhIoA2VKHokR";
	private static final String APP_CODE = "Y_tFYWL0ZML-Sk1BKr0WUA";
	private static final String cat = "going-out,sights-museums,transport,accommodation,shopping,leisure-outdoor,administrative-areas-buildings,natural-geographical,petrol-station,atm-bank-exchange,toilet-rest-area,hospital-health-care-facility";

	@Override
	public List<Item> search(double lat, double lon, String city, String term) {
		// create a base url, based on API_HOST and SEARCH_PATH
		String url = "http://" + API_HOST + SEARCH_PATH;
		// Encode term in url since it may contain special characters
		try {
			if (term == null) {
				url += "/explore?" + "at=" + lat + "," + lon + "&cat=" + cat + "&app_id=" + APP_ID + "&app_code=" + APP_CODE;
			} else {
				term = urlEncodeHelper(term);
				url += "/search?" + "at=" + lat + "," + lon + "&q=" + term + "&app_id=" + APP_ID + "&app_code=" + APP_CODE;
			}
			// Open a HTTP connection between Java application and nytimes based on url
			HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();

			// Set request method to GET
			connection.setRequestMethod("GET");
			connection.setRequestProperty("Accept", "application/json");
			// Send request to nytimes and get response, response code
			// could be returned directly
			// response body is saved in InputStream of connection.
			int responseCode = connection.getResponseCode();
			System.out.println("\nSending 'GET' request to URL : " + url);
			System.out.println("Response Code : " + responseCode);
			BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String inputLine;
			StringBuilder response = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			JSONObject responseJson = new JSONObject(response.toString());

			if (!responseJson.isNull("results")) {
				JSONObject results = responseJson.getJSONObject("results");
				JSONArray items = (JSONArray) results.get("items");
				return getItemList(items);
			} else {
				return new ArrayList<>();
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private String urlEncodeHelper(String term) {
		try {
			term = java.net.URLEncoder.encode(term, "UTF-8");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return term;
	}

	/**
	 * Helper methods
	 */
	// Convert JSONArray to a list of item objects.
	private List<Item> getItemList(JSONArray items) throws JSONException {
		List<Item> itemList = new ArrayList<>();

		for (int i = 0; i < items.length(); i++) {
			JSONObject item = items.getJSONObject(i);
			ItemBuilder builder = new ItemBuilder();
			builder.setItemId(getStringFieldOrNull(item, "id"));
			builder.setName(getStringFieldOrNull(item, "title"));
			builder.setDescription(getDescription(item));
			builder.setCategories(getCategories(item));
			builder.setImageUrl(getStringFieldOrNull(item, "icon"));
			builder.setUrl(getUrl(item));
			builder.setRating(getNumericFieldOrNull(item, "averageRating"));
			builder.setAddress(getStringFieldOrNull(item, "vicinity").replaceAll("<br/>", ", "));
			// Uses this builder pattern so can freely add fields.
			itemList.add(builder.build());
		}
		return itemList;
	}

	private String getUrl(JSONObject event) throws JSONException {
		try {
			if (!event.isNull("href")) {
				String url = event.getString("href");
				HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
				connection.setRequestMethod("GET");
				connection.setRequestProperty("Accept", "application/json");
				BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				String inputLine;
				StringBuilder response = new StringBuilder();
				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				}
				in.close();
				JSONObject responseJson = new JSONObject(response.toString());
				if (!responseJson.isNull("view")) {
					return responseJson.getString("view");
				} else {
					return url;
				}
			} 
		} catch (Exception e) {
			e.printStackTrace();
		}	
		return null;
	}

	private String getDescription(JSONObject event) throws JSONException {
		if (!event.isNull("openingHours")) {
			JSONObject openingHours  = event.getJSONObject("openingHours");
			String res = openingHours.getBoolean("isOpen") ? "Open, " : "Closed, ";
			res += openingHours.getString("label") + ": " + openingHours.getString("text");
			return res;
		} 
		return null;
	}

	private Set<String> getCategories(JSONObject event) throws JSONException {
		Set<String> categories = new HashSet<>();
		JSONObject category = event.getJSONObject("category");
		String s = category.getString("id") + ";" + category.getString("title");
		categories.add(s);
		return categories;
	}

	private String getStringFieldOrNull(JSONObject event, String field) throws JSONException {
		return event.isNull(field) ? null : event.getString(field);
	}

	private double getNumericFieldOrNull(JSONObject event, String field) throws JSONException {
		return event.isNull(field) ? 0.0 : event.getDouble(field);
	}

	/**
	 * Main entry for sample GitHub Jobs API requests.
	 */
	public static void main(String[] args) {
		HereAPI hereApi = new HereAPI();
		// Los angeles, usc
		hereApi.search(34.0093, -118.2584, null, null);
	}

	public List<Item> searchByCategory(String category, double lat, double lon) {
		// create a base url, based on API_HOST and SEARCH_PATH
		String url = "http://" + API_HOST + SEARCH_PATH;
		// Encode term in url since it may contain special characters
		try {
			url += "/explore?" + "at=" + lat + "," + lon + "&cat=" + category + "&app_id=" + APP_ID + "&app_code=" + APP_CODE;
			// Open a HTTP connection between Java application and nytimes based on url
			HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
			connection.setRequestMethod("GET");
			connection.setRequestProperty("Accept", "application/json");
			// Send request to TicketMaster and get response, response code
			// could be returned directly
			// response body is saved in InputStream of connection.
			int responseCode = connection.getResponseCode();
			System.out.println("\nSending 'GET' request to URL : " + url);
			System.out.println("Response Code : " + responseCode);

			BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String inputLine;
			StringBuilder response = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			JSONObject responseJson = new JSONObject(response.toString());

			if (!responseJson.isNull("results")) {
				JSONObject results = responseJson.getJSONObject("results");
				JSONArray items = (JSONArray) results.get("items");
				return getItemList(items);
			} else {
				return new ArrayList<>();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
