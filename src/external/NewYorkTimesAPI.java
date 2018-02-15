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

public class NewYorkTimesAPI implements ExternalAPI {
	private static final String API_HOST = "api.nytimes.com";
	private static final String SEARCH_PATH = "/svc/search/v2/articlesearch.json";
	private static final String API_KEY = "3f8e80e974784d84a2ed3a5f435593c9";
	private static final String IMAGE_HOST = "https://www.nytimes.com/";

	@Override
	public List<Item> search(double lat, double lon, String city, String term) {
		// create a base url, based on API_HOST and SEARCH_PATH
		String url = "http://" + API_HOST + SEARCH_PATH;
		String url1 = "http://" + API_HOST + SEARCH_PATH;
		// Encode term in url since it may contain special characters
		String encodeCity = urlEncodeHelper(city);
		try {
			if (term == null) {
				url += "?" + "fq=glocations:(\"" + encodeCity + "\")&api-key=" + API_KEY;
				url1 += "?" + "fq=glocations:(\"" + encodeCity + "\")&page=1&api-key=" + API_KEY;
			} else {
				term = urlEncodeHelper(term);
				url += "?" + "fq=glocations:(\"" + encodeCity + "\")%20AND%20" + term + "&api-key=" + API_KEY;
				url1 += "?" + "fq=glocations:(\"" + encodeCity + "\")%20AND%20" + term + "&page=1&api-key=" + API_KEY;
			}
			// Open a HTTP connection between Java application and nytimes based on url
			HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();

			// Set request method to GET
			connection.setRequestMethod("GET");

			// Send request to nytimes and get response, response code
			// could be returned directly
			// response body is saved in InputStream of connection.
			int responseCode = connection.getResponseCode();
			System.out.println("\nSending 'GET' request to URL : " + url);
			System.out.println("Response Code : " + responseCode);

			List<Item> res = getResults(connection, city);
			Thread.currentThread();
			Thread.sleep(1000);   
			if (res.isEmpty()) {
				return res;
			}
			connection = (HttpURLConnection) new URL(url1).openConnection();
			connection.setRequestMethod("GET");
			System.out.println("\nSending 'GET' request to URL : " + url1);
			System.out.println("Response Code : " + connection.getResponseCode());
			res.addAll(getResults(connection, city));
			return res;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private List<Item> getResults(HttpURLConnection connection, String city) {
		try {
			// Now read response body to get events data
			BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String inputLine;
			StringBuilder response = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			JSONObject responseJson = new JSONObject(response.toString());
			if (!responseJson.isNull("response")) {
				JSONObject results = responseJson.getJSONObject("response");
				JSONArray docs = (JSONArray) results.get("docs");
				return getNewsList(docs, city);
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
	private List<Item> getNewsList(JSONArray docs, String city) throws JSONException {
		List<Item> newsList = new ArrayList<>();

		for (int i = 0; i < docs.length(); i++) {
			JSONObject news = docs.getJSONObject(i);
			ItemBuilder builder = new ItemBuilder();
			builder.setItemId(getStringFieldOrNull(news, "_id"));
			builder.setName(getTitle(news));
			builder.setDate(getStringFieldOrNull(news, "pub_date").substring(0, 10));
			builder.setByline(getByline(news));
			builder.setCity(city);
			builder.setDescription(getDescription(news));
			builder.setCategories(getCategories(news));
			builder.setImageUrl(getImageUrl(news));
			builder.setUrl(getStringFieldOrNull(news, "web_url"));

			// Uses this builder pattern so can freely add fields.
			Item item = builder.build();
			newsList.add(item);
		}
		return newsList;
	}

	private String getImageUrl(JSONObject event) throws JSONException {
		// Get from "multimedia" field
		if (!event.isNull("multimedia")) {
			JSONArray imagesArray = event.getJSONArray("multimedia");
			if (imagesArray.length() >= 2) {
				return IMAGE_HOST + getStringFieldOrNull(imagesArray.getJSONObject(1), "url");
			} else if (imagesArray.length() >= 1) {
				return IMAGE_HOST + getStringFieldOrNull(imagesArray.getJSONObject(0), "url");
			}
		}
		return null;
	}

	private String getDescription(JSONObject news) throws JSONException {
		if (!news.isNull("snippet")) {
			return news.getString("snippet");
		}
		return null;
	}

	private Set<String> getCategories(JSONObject news) throws JSONException {
		// Get from "new_desk"
		Set<String> res = new HashSet<>();
		if (!news.isNull("new_desk")) {
			res.add(news.getString("new_desk"));
		} else if (!news.isNull("type_of_material")) {
			res.add(news.getString("type_of_material"));
		}
		return res;
	}

	private String getTitle(JSONObject news) throws JSONException {
		return news.getJSONObject("headline").getString("main");
	}

	private String getByline(JSONObject news) throws JSONException {
		if (!news.isNull("byline")) {
			JSONObject obj = news.getJSONObject("byline");
			if (!obj.isNull("original")){
				return obj.getString("original");	
			}
		}
		return "";
	}

	private String getStringFieldOrNull(JSONObject event, String field) throws JSONException {
		return event.isNull(field) ? null : event.getString(field);
	}

	/**
	 * Main entry for sample GitHub Jobs API requests.
	 */
	public static void main(String[] args) {
		NewYorkTimesAPI nytimesApi = new NewYorkTimesAPI();
		// Los angeles, usc
		nytimesApi.search(0, 0, "Los angeles", "usc");
	}

	public List<Item> searchByCategory(String city, String category) {
		// create a base url, based on API_HOST and SEARCH_PATH
		String url = "http://" + API_HOST + SEARCH_PATH;
		// Encode term in url since it may contain special characters
		String encodeCity = urlEncodeHelper(city);
		try {
			url += "?" + "fq=news_desk:(\"" + category+"\")%20AND%20glocations:(\"" + encodeCity + "\")" + "&api-key=" + API_KEY;
			// Open a HTTP connection between Java application and nytimes based on url
			HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
			connection.setRequestMethod("GET");

			// Send request to TicketMaster and get response, response code
			// could be returned directly
			// response body is saved in InputStream of connection.
			int responseCode = connection.getResponseCode();
			System.out.println("\nSending 'GET' request to URL : " + url);
			System.out.println("Response Code : " + responseCode);
			if (responseCode == 429) {
				return new ArrayList<>();
			}
			List<Item> res = getResults(connection, city);
			return res;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
