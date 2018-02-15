package db;

import java.util.List;
import java.util.Set;

import org.json.JSONArray;

import entity.Item;

public interface DBConnection {
	/**
	 * Close the connection.
	 */
	public void close();

	/**
	 * Insert the favorite items for a user.
	 * 
	 * @param userId
	 * @param itemIds
	 */
	public void setFavoriteItems(String userId, List<String> itemIds);

	/**
	 * Delete the favorite items for a user.
	 * 
	 * @param userId
	 * @param itemIds
	 */
	public void unsetFavoriteItems(String userId, List<String> itemIds);

	/**
	 * Get the favorite item ids for a user.
	 * 
	 * @param userId
	 * @return itemIds
	 */
	public Set<String> getFavoriteItemIds(String userId);

	/**
	 * Get the favorite items for a user.
	 * 
	 * @param userId
	 * @return set of items
	 */
	public Set<Item> getFavoriteItems(String userId);

	/**
	 * Recommend items based on userId and geolocation
	 * @param userId
	 * @param latitude, longitude, city
	 * @return array of items
	 */
	public JSONArray recommendItems(String userId,  double lat, double lon, String city);

	/**
	 * Gets item ids based on category
	 * @param category
	 * @return itemIds
	 */
	public Set<String> getItemIds(String category);

	/**
	 * Get the item json by id.
	 * @param itemId
	 * @param isVisited, set the visited field in json.
	 * @return item
	 */
	public Item getItemById(String itemId);

	/**
	 * Gets categories based on item id
	 * 
	 * @param itemId
	 * @return categories
	 */
	public Set<String> getCategories(String itemId);

	/**
	 * Search items near a geolocation and a term (optional).
	 * 
	 * @param userId
	 * @param latitude, longitude, city
	 * @param term
	 *            (Nullable)
	 * @return list of items
	 */
	public List<Item> searchItems(String userId, double lat, double lon, String city, String term);

	/**
	 * Save item into db.
	 * 
	 * @param item
	 */
	public void saveItem(Item item);

	/**
	 * Get full name of a user.
	 * 
	 * @param userId
	 * @return full name of the user
	 */
	public String getFullName(String userId);

	/**
	 * Return whether the credential is correct.
	 * 
	 * @param userId
	 * @param password
	 * @return boolean
	 */
	public boolean verifyLogin(String userId, String password);

	/**
	 * Return whether a user already registered.
	 * 
	 * @param userId
	 * @return boolean
	 */
	public boolean exist(String userId);

	/**
	 * Insert a new user into db.
	 * 
	 * @param userId
	 * @param password
	 * @param firstName
	 * @param lastName
	 */
	public void insertUser(String userId, String password, String firstName, String lastName);
}
