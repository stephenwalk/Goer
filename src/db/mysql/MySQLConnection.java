package db.mysql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import algorithm.GeoRecommendation;
import algorithm.ItemBasedRecommendation;
import db.DBConnection;
import entity.Item;
import entity.Item.ItemBuilder;
import external.ExternalAPI;
import external.ExternalAPIFactory;

public class MySQLConnection implements DBConnection {

	private static MySQLConnection instance;

	public static DBConnection getInstance() {
		if (instance == null) {
			instance = new MySQLConnection();
		}
		return instance;
	}

	private Connection conn = null;

	private MySQLConnection() {
		try {
			// Forcing the class representing the MySQL driver to load and
			// initialize.
			// The newInstance() call is a work around for some broken Java
			// implementations.
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			conn = DriverManager.getConnection(MySQLDBUtil.URL);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}

	@Override
	public void close() {
		if (conn != null) {
			try {
				conn.close();
			} catch (Exception e) {
				System.out.println(e.getMessage());
			}
		}
	}

	@Override
	public void setFavoriteItems(String userId, List<String> itemIds) {
		if (conn == null) {
			return;
		}
		try {
			String query = "INSERT INTO " + MySQLDBUtil.service + "_history (user_id, item_id) VALUES (?, ?)";
			PreparedStatement statement = conn.prepareStatement(query);
			for (String itemId : itemIds) {
				statement.setString(1, userId);
				statement.setString(2, itemId);
				statement.execute();
			}
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
	}

	@Override
	public void unsetFavoriteItems(String userId, List<String> itemIds) {
		if (conn == null) {
			return;
		}
		try {
			String query = "DELETE FROM " + MySQLDBUtil.service + "_history WHERE user_id = ? and item_id = ?";
			PreparedStatement statement = conn.prepareStatement(query);
			for (String itemId : itemIds) {
				statement.setString(1, userId);
				statement.setString(2, itemId);
				statement.execute();
			}
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
	}

	@Override
	public Set<String> getFavoriteItemIds(String userId) {
		if (conn == null) {
			return null;
		}
		Set<String> favoriteItems = new HashSet<>();
		try {
			String sql = "SELECT item_id from " + MySQLDBUtil.service + "_history WHERE user_id = ?";
			PreparedStatement statement = conn.prepareStatement(sql);
			statement.setString(1, userId);
			ResultSet rs = statement.executeQuery();
			while (rs.next()) {
				String itemId = rs.getString("item_id");
				favoriteItems.add(itemId);
			}
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
		return favoriteItems;
	}

	@Override
	public Set<Item> getFavoriteItems(String userId) {
		if (conn == null) {
			return null;
		}
		Set<String> itemIds = getFavoriteItemIds(userId);
		Set<Item> favoriteItems = new HashSet<>();
		try {

			for (String itemId : itemIds) {
				String sql = "SELECT * from " + MySQLDBUtil.service + "s WHERE item_id = ? ";
				PreparedStatement statement = conn.prepareStatement(sql);
				statement.setString(1, itemId);
				ResultSet rs = statement.executeQuery();
				ItemBuilder builder = new ItemBuilder();

				// Because itemId is unique and given one item id there should
				// have
				// only one result returned.
				if (rs.next()) {
					builder.setItemId(rs.getString("item_id"));
					builder.setName(rs.getString("name"));
					builder.setDate(rs.getString("date"));
					builder.setByline(rs.getString("byline"));
					builder.setCity(rs.getString("city"));
					builder.setState(rs.getString("state"));
					builder.setCountry(rs.getString("country"));
					builder.setZipcode(rs.getString("zipcode"));
					builder.setRating(rs.getDouble("rating"));
					builder.setAddress(rs.getString("address"));
					builder.setLatitude(rs.getDouble("latitude"));
					builder.setLongitude(rs.getDouble("longitude"));
					builder.setDescription(rs.getString("description"));
					builder.setSnippet(rs.getString("snippet"));
					builder.setSnippetUrl(rs.getString("snippet_url"));
					builder.setImageUrl(rs.getString("image_url"));
					builder.setUrl(rs.getString("url"));
					Set<String> categories = getCategories(itemId);
					builder.setCategories(categories);
				}
				favoriteItems.add(builder.build());
			}
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
		return favoriteItems;
	}


	@Override
	public JSONArray recommendItems(String userId, double lat, double lon, String city) {
		JSONArray itemsArray = new JSONArray();
		List<Item> items;
		if (MySQLDBUtil.service.equals("event")) {
			GeoRecommendation recommendation = new GeoRecommendation();
			items = recommendation.recommendItems(userId, MySQLDBUtil.service, lat, lon, city);
		} else {
			ItemBasedRecommendation recommendation = new ItemBasedRecommendation();
			items = recommendation.recommendItems(userId, MySQLDBUtil.service, lat, lon, city);	
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
		try {
			String sql = "SELECT item_id from " + MySQLDBUtil.service + "s WHERE categories LIKE ?";
			PreparedStatement statement = conn.prepareStatement(sql);
			statement.setString(1, "%" + category + "%");
			ResultSet rs = statement.executeQuery();
			while (rs.next()) {
				String itemId = rs.getString("item_id");
				set.add(itemId);
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return set;
	}

	@Override
	public Item getItemById(String itemId) {
		try {
			String sql = "SELECT * from " + MySQLDBUtil.service + "s where item_id = ?";
			PreparedStatement statement = conn.prepareStatement(sql);
			statement.setString(1, itemId);
			ResultSet rs = statement.executeQuery();
			ItemBuilder builder = new ItemBuilder();
			if (rs.next()) {
				builder.setItemId(rs.getString("item_id"));
				builder.setName(rs.getString("name"));
				builder.setDate(rs.getString("date"));
				builder.setByline(rs.getString("byline"));
				builder.setCity(rs.getString("city"));
				builder.setState(rs.getString("state"));
				builder.setCountry(rs.getString("country"));
				builder.setZipcode(rs.getString("zipcode"));
				builder.setRating(rs.getDouble("rating"));
				builder.setAddress(rs.getString("address"));
				builder.setLatitude(rs.getDouble("latitude"));
				builder.setLongitude(rs.getDouble("longitude"));
				builder.setDescription(rs.getString("description"));
				builder.setSnippet(rs.getString("snippet"));
				builder.setSnippetUrl(rs.getString("snippet_url"));
				builder.setImageUrl(rs.getString("image_url"));
				builder.setUrl(rs.getString("url"));
				Set<String> categories = getCategories(itemId);
				builder.setCategories(categories);
				//JSONObject obj = builder.build().toJSONObject();
				//obj.put("favorite", isVisited);
				return builder.build();
			}
		} catch (Exception e) { /* report an error */
			System.out.println(e.getMessage());
		}
		return null;
	}

	@Override
	public Set<String> getCategories(String itemId) {
		if (conn == null) {
			return null;
		}
		Set<String> categories = new HashSet<>();
		try {
			String sql = "SELECT categories from " + MySQLDBUtil.service + "s WHERE item_id = ? ";
			PreparedStatement statement = conn.prepareStatement(sql);
			statement.setString(1, itemId);
			ResultSet rs = statement.executeQuery();
			if (rs.next()) {
				String[] tokens = rs.getString("categories").split(",");
				for (String token : tokens) {
					// ' Japanese ' -> 'Japanese'
					categories.add(token.trim());
				}
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return categories;
	}

	@Override
	public List<Item> searchItems(String userId, double lat, double lon, String city, String term) {
		// Connect to external API
		ExternalAPI api = ExternalAPIFactory.getExternalAPI(MySQLDBUtil.service);
		List<Item> items = api.search(lat, lon, city, term);
		for (Item item : items) {
			// Save the item into db.
			saveItem(item);
		}
		return items;
	}

	@Override
	public void saveItem(Item item) {
		if (conn == null) {
			return;
		}
		try {
			String sql = "INSERT IGNORE INTO " + MySQLDBUtil.service + "s VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
			PreparedStatement statement = conn.prepareStatement(sql);
			statement.setString(1, item.getItemId());
			statement.setString(2, item.getName());
			statement.setString(3, item.getDate());
			statement.setString(4, item.getByline());
			statement.setString(5, String.join(",", item.getCategories()));
			statement.setString(6, item.getCity());
			statement.setString(7, item.getState());
			statement.setString(8, item.getCountry());
			statement.setString(9, item.getZipcode());
			statement.setString(10, item.getAddress());
			statement.setDouble(11, item.getRating());
			statement.setDouble(12, item.getLatitude());
			statement.setDouble(13, item.getLongitude());
			statement.setString(14, item.getDescription());
			statement.setString(15, item.getSnippet());
			statement.setString(16, item.getSnippetUrl());
			statement.setString(17, item.getImageUrl());
			statement.setString(18, item.getUrl());
			statement.execute();
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
	}

	@Override
	public String getFullName(String userId) {
		if (conn == null) {
			return null;
		}
		String name = "";
		try {
			String sql = "SELECT first_name, last_name from users WHERE user_id = ?";
			PreparedStatement statement = conn.prepareStatement(sql);
			statement.setString(1, userId);
			ResultSet rs = statement.executeQuery();
			if (rs.next()) {
				name += String.join(" ", rs.getString("first_name"), rs.getString("last_name"));
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return name;
	}

	@Override
	public boolean verifyLogin(String userId, String password) {
		if (conn == null) {
			return false;
		}
		try {
			String sql = "SELECT user_id from users WHERE user_id = ? and password = ?";
			PreparedStatement statement = conn.prepareStatement(sql);
			statement.setString(1, userId);
			statement.setString(2, password);
			ResultSet rs = statement.executeQuery();
			if (rs.next()) {
				return true;
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return false;
	}

	@Override
	public boolean exist(String userId) {
		if (conn == null) {
			return false;
		}
		try {
			String sql = "SELECT user_id from users WHERE user_id = ?";
			PreparedStatement statement = conn.prepareStatement(sql);
			statement.setString(1, userId);
			ResultSet rs = statement.executeQuery();
			if (rs.next()) {
				return true;
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return false;
	}

	@Override
	public void insertUser(String userId, String password, String firstName, String lastName) {
		if (conn == null) {
			return;
		}
		try {
			String query = "INSERT INTO users (user_id, password, first_name, last_name) VALUES (?, ?, ?, ?)";
			PreparedStatement statement = conn.prepareStatement(query);
			statement.setString(1, userId);
			statement.setString(2, password);
			statement.setString(3, firstName);
			statement.setString(4, lastName);
			statement.execute();
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
	}

}
