package db.mongodb;

import static com.mongodb.client.model.Filters.eq;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.UpdateOptions;

import algorithm.GeoRecommendation;
import algorithm.ItemBasedRecommendation;
import db.DBConnection;
import entity.Item;
import entity.Item.ItemBuilder;
import external.ExternalAPI;
import external.ExternalAPIFactory;

import static com.mongodb.client.model.Filters.regex;

public class MongoDBConnection implements DBConnection {

	private static MongoDBConnection instance;

	public static DBConnection getInstance() {
		if (instance == null) {
			instance = new MongoDBConnection();
		}
		return instance;
	}

	private MongoClient mongoClient;
	private MongoDatabase db;

	private MongoDBConnection() {
		// Connects to local mongodb server.
		mongoClient = new MongoClient();
		db = mongoClient.getDatabase(MongoDBUtil.DB_NAME);
	}

	@Override
	public void close() {
		if (mongoClient != null) {
			mongoClient.close();
		}
	}

	@Override
	public void setFavoriteItems(String userId, List<String> itemIds) {
		db.getCollection("users").updateOne(new Document("user_id", userId),
				new Document("$push", new Document("favorite", new Document("$each", itemIds))));
	}

	@Override
	public void unsetFavoriteItems(String userId, List<String> itemIds) {
		db.getCollection("users").updateOne(new Document("user_id", userId),
				new Document("$pullAll", new Document("favorite", itemIds)));
	}

	@Override
	public Set<String> getFavoriteItemIds(String userId) {
		Set<String> favoriteItems = new HashSet<String>();
		// db.users.find({user_id:1111})
		FindIterable<Document> iterable = db.getCollection("users").find(eq("user_id", userId));
		if (iterable.first().containsKey("favorite")) {
			@SuppressWarnings("unchecked")
			List<String> list = (List<String>) iterable.first().get("favorite");
			favoriteItems.addAll(list);
		}
		return favoriteItems;
	}

	@Override
	public Set<Item> getFavoriteItems(String userId) {
		Set<String> itemIds = getFavoriteItemIds(userId);
		Set<Item> favoriteItems = new HashSet<>();
		for (String itemId : itemIds) {
			FindIterable<Document> iterable = db.getCollection("items").find(eq("item_id", itemId));
			Document doc = iterable.first();
			ItemBuilder builder = new ItemBuilder();
			builder.setItemId(doc.getString("item_id"));
			builder.setName(doc.getString("name"));
			builder.setCity(doc.getString("city"));
			builder.setState(doc.getString("state"));
			builder.setCountry(doc.getString("country"));
			builder.setZipcode(doc.getString("zipcode"));
			builder.setRating(doc.getDouble("rating"));
			builder.setAddress(doc.getString("address"));
			builder.setLatitude(doc.getDouble("latitude"));
			builder.setLongitude(doc.getDouble("longitude"));
			builder.setDescription(doc.getString("description"));
			builder.setSnippet(doc.getString("snippet"));
			builder.setSnippetUrl(doc.getString("snippet_url"));
			builder.setImageUrl(doc.getString("image_url"));
			builder.setUrl(doc.getString("url"));
			builder.setCategories(this.getCategories(doc.getString("item_id")));
			favoriteItems.add(builder.build());
		}
		return favoriteItems;
	}

	@Override
	public JSONArray recommendItems(String userId, double lat, double lon, String city) {
		JSONArray itemsArray = new JSONArray();
		List<Item> items;
		if (MongoDBUtil.service.equals("event")) {
			GeoRecommendation recommendation = new GeoRecommendation();
			items = recommendation.recommendItems(userId, MongoDBUtil.service, lat, lon, city);
		} else {
			ItemBasedRecommendation recommendation = new ItemBasedRecommendation();
			items = recommendation.recommendItems(userId, MongoDBUtil.service, lat, lon, city);	
		}
		try {
			for (Item item : items) {
				JSONObject obj = item.toJSONObject();
				obj.put("favorite", false);
				itemsArray.put(obj);
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return itemsArray;
	}

	@Override
	public Set<String> getItemIds(String category) {
		Set<String> set = new HashSet<>();
		// similar to LIKE %category% in MySQL
		FindIterable<Document> iterable = db.getCollection("restaurants").find(
				regex("categories", category));
		iterable.forEach(new Block<Document>() {
			@Override
			public void apply(final Document document) {
				set.add(document.getString("business_id"));
			}
		});
		return set;
	}

	@Override
	public Item getItemById(String itemId) {
		FindIterable<Document> iterable = db.getCollection("restaurants").find(
				eq("business_id", itemId));
		Document doc = iterable.first();
		ItemBuilder builder = new ItemBuilder();
		builder.setItemId(doc.getString("item_id"));
		builder.setName(doc.getString("name"));
		builder.setCity(doc.getString("city"));
		builder.setState(doc.getString("state"));
		builder.setCountry(doc.getString("country"));
		builder.setZipcode(doc.getString("zipcode"));
		builder.setRating(doc.getDouble("rating"));
		builder.setAddress(doc.getString("address"));
		builder.setLatitude(doc.getDouble("latitude"));
		builder.setLongitude(doc.getDouble("longitude"));
		builder.setDescription(doc.getString("description"));
		builder.setSnippet(doc.getString("snippet"));
		builder.setSnippetUrl(doc.getString("snippet_url"));
		builder.setImageUrl(doc.getString("image_url"));
		builder.setUrl(doc.getString("url"));
		builder.setCategories(this.getCategories(doc.getString("item_id")));
		return builder.build();
	}

	@Override
	public Set<String> getCategories(String itemId) {
		Set<String> categories = new HashSet<>();
		FindIterable<Document> iterable = db.getCollection("items").find(eq("item_id", itemId));

		if (iterable.first().containsKey("categories")) {
			@SuppressWarnings("unchecked")
			List<String> list = (List<String>) iterable.first().get("categories");
			categories.addAll(list);
		}
		return categories;
	}

	@Override
	public List<Item> searchItems(String userId, double lat, double lon, String city, String term) {
		// Connect to external API
		ExternalAPI api = ExternalAPIFactory.getExternalAPI();
		List<Item> items = api.search(lat, lon, city, term);
		for (Item item : items) {
			// Save the item into db.
			saveItem(item);
		}
		return items;

	}

	@Override
	public void saveItem(Item item) {
		// Question: why using upsert instead of insert directly?
		// Answer: http://stackoverflow.com/questions/17319307/how-to-upsert-with-mongodb-java-driver
		UpdateOptions options = new UpdateOptions().upsert(true);
		db.getCollection("items").updateOne(new Document().append("item_id", item.getItemId()),
				new Document("$set",
						new Document().append("item_id", item.getItemId()).append("name", item.getName())
						.append("city", item.getCity()).append("state", item.getState())
						.append("country", item.getCountry()).append("zip_code", item.getZipcode())
						.append("rating", item.getRating()).append("address", item.getAddress())
						.append("latitude", item.getLatitude()).append("longitude", item.getLongitude())
						.append("description", item.getDescription()).append("snippet", item.getSnippet())
						.append("snippet_url", item.getSnippetUrl()).append("image_url", item.getImageUrl())
						.append("url", item.getUrl()).append("categories", item.getCategories())),
				options);

	}

	@Override
	public String getFullName(String userId) {
		FindIterable<Document> iterable = db.getCollection("users").find(new Document("user_id", userId));
		Document document = iterable.first();
		String firstName = document.getString("first_name");
		String lastName = document.getString("last_name");
		return firstName + " " + lastName;
	}

	@Override
	public boolean verifyLogin(String userId, String password) {
		FindIterable<Document> iterable = db.getCollection("users").find(new Document("user_id", userId));
		Document document = iterable.first();
		return document.getString("password").equals(password);
	}

	@Override
	public boolean exist(String userId) {
		FindIterable<Document> iterable = db.getCollection("users").find(new Document("user_id", userId));
		return iterable == null? false : true;
	}

	@Override
	public void insertUser(String userId, String password, String firstName, String lastName) {
		db.getCollection("users")
		.insertOne(new Document().append("first_name", firstName).append("last_name", lastName)
				.append("password", password).append("user_id", userId));
		// make sure user_id is unique.
		IndexOptions indexOptions = new IndexOptions().unique(true);

		// use 1 for ascending index , -1 for descending index
		// Different to MySQL, users table in MongoDB also has history info.
		// createIndex let search by "user_id"
		db.getCollection("users").createIndex(new Document("user_id", 1), indexOptions);
	}
}